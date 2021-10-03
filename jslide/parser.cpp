#include "parser.h"
#include <algorithm>
#include <stdexcept>
#include <sstream>

#include "colors.h"
#include "defines.h"

void throw_parse_error(int line_nr, int col_nr, const std::string& message)
  {
  if (line_nr <= 0)
    throw std::runtime_error("parse error: " + message);
  std::stringstream str;
  str << line_nr << "(" << col_nr << ")";
  throw std::runtime_error("parse error: " + str.str() + ": " + message);
  }

int get_textsize(const ActiveAttributes& attrib)
  {
  switch (attrib.e_textsize)
    {
    case textsize::T_NORMAL: return 5;
    case textsize::T_SMALL: return 6;
    case textsize::T_LARGE: return 4;
    case textsize::T_VERYSMALL: return 7;
    case textsize::T_VERYLARGE: return 3;
    }
  return 5;
  }

std::string language_to_extension(language l)
  {
  switch (l)
    {
    case language::T_ASM : return "asm";
    case language::T_BASIC : return "bas";
    case language::T_BATCH : return "bat";
    case language::T_C : return "c";
    case language::T_CPP : return "cpp";
    case language::T_CS : return "cs";
    case language::T_CMAKE : return "cmake";
    case language::T_FORTRAN : return "f";
    case language::T_HTML : return "html";
    case language::T_JAVA : return "java";
    case language::T_JSON : return "json";
    case language::T_JS : return "js";
    case language::T_LISP : return "lisp";
    case language::T_LUA : return "lua";
    case language::T_METAL: return "metal";
    case language::T_OBJECTIVE_C : return "m";
    case language::T_PASCAL : return "pas";
    case language::T_PYTHON : return "py";
    case language::T_RUBY : return "rb";
    case language::T_RUST : return "rs";
    case language::T_SCHEME : return "scm";
    case language::T_SWIFT : return "swift";
    case language::T_XML: return "xml";
    }
  return "";
  }

namespace
  {
  bool inside_code_block = false;
  bool first_line_in_code_block = false;

  ActiveAttributes current_attributes;

  token popped_token(token::T_NEWLINE, "\\n", -1, -1);

  std::map<std::string, textsize> get_textsize_map()
    {
    std::map<std::string, textsize> m;
    m[".normal"] = textsize::T_NORMAL;
    m[".small"] = textsize::T_SMALL;
    m[".large"] = textsize::T_LARGE;
    m[".verysmall"] = textsize::T_VERYSMALL;
    m[".verylarge"] = textsize::T_VERYLARGE;
    return m;
    }

  std::map<std::string, language> get_language_map()
    {
    std::map<std::string, language> m;
    m[".asm"] = language::T_ASM;
    m[".basic"] = language::T_BASIC;
    m[".batch"] = language::T_BATCH;
    m[".c"] = language::T_C;
    m[".cpp"] = language::T_CPP;
    m[".csharp"] = language::T_CS;
    m[".cmake"] = language::T_CMAKE;
    m[".fortran"] = language::T_FORTRAN;
    m[".html"] = language::T_HTML;
    m[".java"] = language::T_JAVA;
    m[".json"] = language::T_JSON;
    m[".javascript"] = language::T_JS;
    m[".lisp"] = language::T_LISP;
    m[".lua"] = language::T_LUA;
    m[".metal"] = language::T_METAL;
    m[".objectivec"] = language::T_OBJECTIVE_C;
    m[".pascal"] = language::T_PASCAL;
    m[".python"] = language::T_PYTHON;
    m[".ruby"] = language::T_RUBY;
    m[".rust"] = language::T_RUST;
    m[".scheme"] = language::T_SCHEME;
    m[".swift"] = language::T_SWIFT;
    m[".xml"] = language::T_XML;
    return m;
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
    static auto code_block_color_map = get_code_block_color_map();
    static auto language_map = get_language_map();
    static auto textsize_map = get_textsize_map();
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
      auto it2 = code_block_color_map.find(t.value);
      if (it2 != code_block_color_map.end())
        {
        current_attributes.code_color_scheme = it2->second;
        continue;
        }
      auto it3 = language_map.find(t.value);
      if (it3 != language_map.end())
        {
        current_attributes.e_language = it3->second;
        continue;
        }
      auto it4 = textsize_map.find(t.value);
      if (it4 != textsize_map.end())
        {
        current_attributes.e_textsize = it4->second;
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
    if (inside_code_block)
      {
      t.mask |= TEXT_MASK_CODEBLOCK;
      if (first_line_in_code_block)
        {
        t.mask |= TEXT_MASK_BEGINOFCODEBLOCK;
        first_line_in_code_block = false;
        }
      }
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

  void parse_image_dims(float& w, float& h, const std::string& dim)
    {
    std::stringstream str;
    str << dim;
    str >> w >> h;
    }

  Image make_image(tokens& tokes)
    {
    Image im;
    im.attrib = current_attributes;
    require(tokes, "![");
    auto t = take(tokes);
    parse_image_dims(im.w, im.h, t.value);
    if (im.w < 0.f || im.h < 0.f || im.w > 1000.f || im.h > 1000.f)
      throw_parse_error(t.line_nr, t.col_nr, "Invalid width and/or height. Expected to be in interval [0,1].");
    require(tokes, "]");
    require(tokes, "(");
    t = take(tokes);
    im.path = t.value;
    require(tokes, ")");
    im.im = read_image(im.path);
    return im;
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
      case token::T_IMAGE_DIM_BEGIN:
      {
      b.expr = make_image(tokes);
      break;
      }
      case token::T_CODE_BLOCK_BEGIN:
      {
      inside_code_block = true;
      first_line_in_code_block = true;
      require(tokes, "`");
      break;
      }
      case token::T_CODE_BLOCK_END:
      {
      inside_code_block = false;
      require(tokes, "`");
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
    inside_code_block = false;
    first_line_in_code_block = false;
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

  Slide make_ending_slide()
    {
    Slide s;
    Block b;
    Text t;
    t.words.emplace_back("end of slideshow", ActiveAttributes());
    Title tt;
    tt.size = 7;
    tt.text = t;
    b.expr = tt;
    s.blocks.push_back(b);
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
  pres.slides.push_back(make_ending_slide());
  return pres;
  }