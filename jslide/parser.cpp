#include "parser.h"
#include <algorithm>
#include <stdexcept>
#include <sstream>
#include "defines.h"

#include "colors.h"

namespace
  {
  ActiveAttributes current_attributes;


  void throw_parse_error(int line_nr, int col_nr, const std::string& message)
    {
    if (line_nr <= 0)
      throw std::runtime_error("parse error: " + message);
    std::stringstream str;
    str << line_nr << "("<<col_nr << ")";
    throw std::runtime_error("parse error: " + str.str() + ": " + message);
    }

  token take(tokens& tokens)
    {
    if (tokens.empty())
      {
      throw_parse_error(-1, -1, "unexpected end");
      }
    token t = tokens.back();
    tokens.pop_back();
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
      tokes.pop_back();
      }
    if (!tokes.empty())
      tokes.pop_back(); // pop the newline
    return t;
    }

  Title make_title(tokens& tokes)
    {
    Title t;
    t.size = 0;
    while (!tokes.empty() && tokes.back().type == token::T_HASH)
      {
      ++t.size;
      tokes.pop_back();
      }
    if (t.size > 6)
      t.size = 6;
    t.text = make_text(tokes);
    return t;
    }

  Block make_block(tokens& tokes, float& left, float& right, float& top, float& bottom)
    {
    Block b;
    b.left = left;
    b.right = right;
    b.top = top;
    b.bottom = bottom;
    if (tokes.empty())
      {
      throw_parse_error(-1, -1, "empty block");
      }
    switch (current_type(tokes))
      {
      case token::T_HASH:
      {
        b.expr = make_title(tokes);
        b.bottom = b.top - 2*BASE_SIZE - (7-std::get<Title>(b.expr).size)* SIZE_FACTOR;
        top = b.bottom;
        break;
      }      
      default:
      {
      b.expr = make_text(tokes);
      b.bottom = b.top - 2*BASE_SIZE;
      top = b.bottom;
      break;
      }
      }
    return b;
    }
  
  Slide make_slide(tokens& tokes)
    {
    Slide s;
    if (tokes.empty())
      {
      throw_parse_error(-1, -1, "empty slide");
      }
    float left = -1.f;
    float right = 1.f;
    float top = 1.f;
    float bottom = -1.f;
    while (!tokes.empty())
      {
      if (tokes.back().type == token::T_NEWSLIDE)
        {
        tokes.pop_back();
        break;
        }     
      s.blocks.push_back(make_block(tokes, left, right, top, bottom));
      }
    return s;
    }

  } // namespace

Presentation make_presentation(tokens& tokes)
  {
  std::reverse(tokes.begin(), tokes.end());
  Presentation pres;
  while (!tokes.empty())
    {
    pres.slides.push_back(make_slide(tokes));
    }
  return pres;
  }