#include "parser.h"
#include <algorithm>
#include <stdexcept>
#include <sstream>
#include "defines.h"

namespace
  {
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

  Text make_text(tokens& tokes)
    {
    Text t;
    while (!tokes.empty() && tokes.back().type != token::T_NEWLINE)
      {
      t.value.append(tokes.back().value);
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
        b.bottom = b.top + BASE_SIZE + (7-std::get<Title>(b.expr).size)* SIZE_FACTOR;
        top = b.bottom;
        break;
      }
      default:
      {
      b.expr = make_text(tokes);
      b.bottom = b.top + BASE_SIZE;
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