#include "nester.h"
#include "sizing.h"
#include "defines.h"

#include <variant>


namespace
  {
  void _nest_text(Text& expr, font_material* state, float& left, float& right, float& top, float& bottom, float sz)
    {
    float text_width = 0;
    float text_height = 0;
    get_text_sizes(text_width, text_height, state, expr, sz);
    bottom = top - text_height*1.2f;
    }

  void _nest_title(Title& expr, font_material* state, float& left, float& right, float& top, float& bottom)
    {
    float sz = get_size(expr.size);
    _nest_text(expr.text, state, left, right, top, bottom, sz);
    }

  void _nest_text(Text& expr, font_material* state, float& left, float& right, float& top, float& bottom)
    {
    float sz = get_size(expr.words.empty() ? NORMAL_TEXT_SIZE : get_textsize(expr.words.front().second));
    _nest_text(expr, state, left, right, top, bottom, sz);
    }

  void _nest_line(Line& expr, font_material* state, float& left, float& right, float& top, float& bottom)
    {
    float sz = get_size(get_textsize(expr.attrib));
    Text t;
    t.words.emplace_back("d", expr.attrib);
    _nest_text(t, state, left, right, top, bottom, sz);
    }

  void _nest_image(Image& expr, float& left, float& right, float& top, float& bottom)
    {
    bottom = top - expr.h*2.f;
    }

  void _nest_block(Block& b, font_material* state, float& left, float& right, float& top, float& bottom)
    {
    b.left = left;
    b.right = right;
    b.top = top;
    b.bottom = bottom;
    if (std::holds_alternative<Title>(b.expr))
      _nest_title(std::get<Title>(b.expr), state, b.left, b.right, b.top, b.bottom);
    if (std::holds_alternative<Text>(b.expr))
      _nest_text(std::get<Text>(b.expr), state, b.left, b.right, b.top, b.bottom); 
    if (std::holds_alternative<Line>(b.expr))
      _nest_line(std::get<Line>(b.expr), state, b.left, b.right, b.top, b.bottom);
    if (std::holds_alternative<Image>(b.expr))
      _nest_image(std::get<Image>(b.expr), b.left, b.right, b.top, b.bottom);
    top = b.bottom;
    }

  void _nest_slide(Slide& s, font_material* state, float margin)
    {
    float left = -1.f + margin;
    float right = 1.f - margin;
    float top = 1.f - margin;
    float bottom = -1.f + margin;
    for (auto& b : s.blocks)
      _nest_block(b, state, left, right, top, bottom);
    }

  }



void nest_blocks(Presentation& p, font_material* state, float margin)
  {
  for (auto& s : p.slides)
    _nest_slide(s, state, margin);
  }