#include "slide_gl.h"

namespace
  {
  void _draw_title(slide_t* state, const Title& expr, float left, float right, float top, float bottom)
    {
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    float sz = (7-expr.size)*0.002;
    render_text(&state->font_gl_state, expr.text.value.c_str(), left, 0, sz, sz);
    }

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom)
    {
    }

  void _draw_expression(slide_t* state, const Expression& expr, float left, float right, float top, float bottom)
    {
    if (std::holds_alternative<Title>(expr))
      _draw_title(state, std::get<Title>(expr), left, right, top, bottom);
    if (std::holds_alternative<Text>(expr))
      _draw_text(state, std::get<Text>(expr), left, right, top, bottom);
    }

  void _draw_block(slide_t* state, const Block& b)
    {
    _draw_expression(state, b.expr, b.left, b.right, b.top, b.bottom);
    }
  }

void init_slide_data(slide_t* state, uint32_t width, uint32_t height)
  {
  init_font(&state->font_gl_state, width, height);

  state->width = width;
  state->height = height;

  state->fbo.create(width, height);

  state->fbo.release();
  }

void destroy_slide_data(slide_t* state)
  {
  destroy_font(&state->font_gl_state);
  state->fbo.release();
  }

void draw_slide_data(slide_t* state, const Slide& s)
  {
  state->fbo.bind(10);
  glViewport(0, 0, state->width, state->height);
  glClearColor(0.f, 0.f, 0.f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  for (const auto& b : s.blocks)
    {
    _draw_block(state, b);
    }

  state->fbo.release();
  }