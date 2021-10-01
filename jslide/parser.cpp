#include "parser.h"
#include <algorithm>
#include <stdexcept>
#include <sstream>

#include "colors.h"

namespace
  {
  ActiveAttributes current_attributes;

  token popped_token(token::T_NEWLINE, "\\n", -1, -1);


  void throw_parse_error(int line_nr, int col_nr, const std::string& message)
    {
    if (line_nr <= 0)
      throw std::runtime_error("parse error: " + message);
    std::stringstream str;
    str << line_nr << "("<<col_nr << ")";
    throw std::runtime_error("parse error: " + str.str() + ": " + message);
    }

  void advance(tokens& tokes)
    {
    popped_token = tokes.back();
    tokes.pop_back();
    }

  token take(tokens& tokens)
    {
    if (tokens.empty())
      {
      throw_parse_error(-1, -1, "unexpected end");
      }
    token t = tokens.back();
    advance(tokens);
    return t;
    }

  token::e_type current_type(const tokens& tokens)
    {
    if (tokens.empty())
      {
      throw_parse_error(-1, -1, "unexpected end");
      }
    return tokens.back().type;
    }

  void require(tokens& tokens, std::string required)
    {
    if (tokens.empty())
      {
      throw_parse_error(-1, -1, "unexpected end: missing " + required);
      }
    auto t = take(tokens);
    if (t.value != required)
      {
      throw_parse_error(t.line_nr, t.col_nr, "required: " + required + ", found: " + t.value);
      }
    }

  void read_attributes(tokens& tokes)
    {
    static auto color_map = get_color_map();
    bool attributes_lines = popped_token.type == token::T_NEWLINE || popped_token.type == token::T_NEWSLIDE || popped_token.type == token::T_ADDTOSLIDE;
    require(tokes, "{:");
    while (current_type(tokes) != token::T_ATTRIBUTE_END)
      {
      auto t = take(tokes);
      if (t.type != token::T_TEXT)
        throw_parse_error(t.line_nr, t.col_nr, "I expect an attribute");
      auto it = color_map.find(t.value);
      if (it != color_map.end())
        {
        current_attributes.color = it->second;
        continue;
        }
      if (t.value == std::string(".left"))
        {
        current_attributes.e_alignment = alignment::T_LEFT;
        continue;
        }
      if (t.value == std::string(".center"))
        {
        current_attributes.e_alignment = alignment::T_CENTER;
        continue;
        }
      if (t.value == std::string(".right"))
        {
        current_attributes.e_alignment = alignment::T_RIGHT;
        continue;
        }
      std::stringstream str;
      str << "Unknown attribute: " << t.value;
      throw_parse_error(t.line_nr, t.col_nr, str.str());
      }
    require(tokes, "}");    
    if (attributes_lines)
      {
      if (!tokes.empty() && current_type(tokes) == token::T_NEWLINE)
        advance(tokes);
      }
    }

  bool check_attributes(tokens& tokes)
    {
    if (!tokes.empty() && current_type(tokes) == token::T_ATTRIBUTE_BEGIN)
      {
      read_attributes(tokes);
      return true;
      }
    return false;
    }

  std::string read_shader(tokens& tokes)
    {    
    require(tokes, "!\"");
    auto t = take(tokes);
    std::string shader = t.value;
    require(tokes, "\"");
    return shader;
    }

  std::string check_shader(tokens& tokes)
    {
    if (!tokes.empty() && current_type(tokes) == token::T_SHADER_BEGIN)
      {
      return read_shader(tokes);      
      }
    return std::string();
    }

  Text make_text(tokens& tokes)
    {
    Text t;    
    while (!tokes.empty() && tokes.back().type != token::T_NEWLINE)
      {
      if (check_attributes(tokes))
        continue;
      std::pair<std::string, ActiveAttributes> word;
      word.first = tokes.back().value;
      word.second = current_attributes;
      t.words.push_back(word);
      advance(tokes);
      }
    if (!tokes.empty())
      advance(tokes); // pop the newline
    return t;
    }

  Title make_title(tokens& tokes)
    {
    Title t;
    t.size = 0;
    while (!tokes.empty() && tokes.back().type == token::T_HASH)
      {
      ++t.size;
      advance(tokes);
      }
    t.text = make_text(tokes);
    return t;
    }

  Line make_line(tokens& tokes)
    {
    Line l;
    l.attrib = current_attributes;
    require(tokes, "----");
    if (!tokes.empty())
      require(tokes, "\\n"); // pop the newline
    return l;
    }

  Block make_block(tokens& tokes)
    {
    Block b;
    if (tokes.empty())
      {
      throw_parse_error(-1, -1, "empty block");
      }
    switch (current_type(tokes))
      {
      case token::T_HASH:
      {
        b.expr = make_title(tokes);        
        break;
      }      
      case token::T_LINE:
      {
        b.expr = make_line(tokes);
        break;
      }
      default:
      {
      b.expr = make_text(tokes);      
      break;
      }
      }
    return b;
    }
  
  Slide make_slide(tokens& tokes, const Slide& prev_slide)
    {
    Slide s = prev_slide;
    if (!s.blocks.empty())
      s.reset_shaders = false;
    if (tokes.empty())
      {
      throw_parse_error(-1, -1, "empty slide");
      }
    while (!tokes.empty())
      {
      if (tokes.back().type == token::T_NEWSLIDE || tokes.back().type == token::T_ADDTOSLIDE)
        {
        advance(tokes);
        break;
        }     
      if (check_attributes(tokes))
        continue;
      std::string shader = check_shader(tokes);
      if (!shader.empty())
        {
        s.shader.swap(shader);
        continue;
        }
      s.blocks.push_back(make_block(tokes));
      }
    return s;
    }

  } // namespace

Presentation make_presentation(tokens& tokes)
  {
  popped_token = token(token::T_NEWSLIDE, "@", -1, -1);
  current_attributes = ActiveAttributes();
  std::reverse(tokes.begin(), tokes.end());
  Presentation pres;
  while (!tokes.empty())
    {
    if (popped_token.type == token::T_ADDTOSLIDE)
      pres.slides.push_back(make_slide(tokes, pres.slides.back()));
    else
      pres.slides.push_back(make_slide(tokes, Slide()));
    }
  return pres;
  }