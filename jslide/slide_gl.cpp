#include "slide_gl.h"

namespace
  {

  float get_font_ratio()
    {
    return 3.f/4.f;
    }

  float get_size(int size)
    {
    if (size > 6)
      size = 6;
    if (size < 1)
      size = 1;
    float sz = (7 - size) * 0.002f;
    return sz;
    }

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom, float sz)
    {
    float text_width = 0;
    float text_height = 0;
    for (const auto& word : expr.words)
      {
      float tw, th;
      get_render_size(tw, th, &state->font_gl_state, word.first.c_str(), sz * get_font_ratio(), sz);
      text_width += tw;
      text_height = std::max<float>(text_height, th);
      }
    for (const auto& word : expr.words)
      {
      render_text(&state->font_gl_state, word.first.c_str(), left, top - text_height, sz * get_font_ratio(), sz, word.second.color);
      float tw, th;
      get_render_size(tw, th, &state->font_gl_state, word.first.c_str(), sz * get_font_ratio(), sz);
      left += tw;
      }
    }

  void _draw_title(slide_t* state, const Title& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(expr.size);    
    //float text_width, text_height;
    //get_render_size(text_width, text_height, &state->font_gl_state, expr.text.value.c_str(), sz* get_font_ratio(), sz);
    //render_text(&state->font_gl_state, expr.text.value.c_str(), left, top - text_height, sz* get_font_ratio(), sz, expr.text.attributes.color);
    _draw_text(state, expr.text, left, right, top, bottom, sz);
    }

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(6);
    //float text_width, text_height;
    //get_render_size(text_width, text_height, &state->font_gl_state, expr.value.c_str(), sz * get_font_ratio(), sz);
    //render_text(&state->font_gl_state, expr.value.c_str(), left, top - text_height, sz * get_font_ratio(), sz, expr.attributes.color);
    _draw_text(state, expr, left, right, top, bottom, sz);
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