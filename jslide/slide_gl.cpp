#include "slide_gl.h"

namespace
  {


  void _draw_expression(slide_t* state, const Expression& expr, int left, int right, int top, int bottom)
    {
    //if (std::holds_alternative<)
    }

  void _draw_block(slide_t* state, const Block& b)
    {
    int top = (int)(b.top * state->height);
    int bottom = (int)(b.bottom * state->height);
    int left = (int)(b.left * state->width);
    int right = (int)(b.right * state->width);
    _draw_expression(state, b.expr, left, right, top, bottom);
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
  glClearColor(1.f, 1.f, 1.f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  for (const auto& b : s.blocks)
    {
    _draw_block(state, b);
    }

  state->fbo.release();
  }