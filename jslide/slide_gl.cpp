#include "slide_gl.h"
#include "sizing.h"
#include "defines.h"

#include "jtk/file_utils.h"

#include <fstream>

namespace
  {

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom, float sz)
    {
    float text_width = 0;
    float text_height = 0;
    get_text_sizes(text_width, text_height, &state->font_gl_state, expr, sz);    

    float offset = 0.f;
    if (!expr.words.empty())
      {
      switch (expr.words.front().second.e_alignment)
        {
        case alignment::T_LEFT: break;
        case alignment::T_RIGHT: offset = (right-left) - text_width; break;
        case alignment::T_CENTER: offset = (right-left-text_width)*0.5; break;
        }
      }

    for (const auto& word : expr.words)
      {
      render_text(&state->font_gl_state, word.first.c_str(), offset + left, top - text_height, sz * get_font_ratio(), sz, word.second.color);
      float tw, th;
      get_render_size(tw, th, &state->font_gl_state, word.first.c_str(), sz * get_font_ratio(), sz);
      left += tw;
      }
    }

  void _draw_title(slide_t* state, const Title& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(expr.size);    
    _draw_text(state, expr.text, left, right, top, bottom, sz);
    }

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(NORMAL_TEXT_SIZE);
    _draw_text(state, expr, left, right, top, bottom, sz);
    }

  void _draw_line(slide_t* state, const Line& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(NORMAL_TEXT_SIZE);
    Text t;
    t.words.emplace_back("_", expr.attrib);
    float text_width = 0;
    float text_height = 0;
    get_text_sizes(text_width, text_height, &state->font_gl_state, t, sz);
    int nr_of_chars = (int)std::floor((right-left) / text_width);
    std::string line;
    line.reserve(nr_of_chars);
    for (int i = 0; i < nr_of_chars; ++i)
      line.push_back('_');
    t.words.front().first = line;
    _draw_text(state, t, left, right, top, bottom, sz);
    }

  void _draw_expression(slide_t* state, const Expression& expr, float left, float right, float top, float bottom)
    {
    if (std::holds_alternative<Title>(expr))
      _draw_title(state, std::get<Title>(expr), left, right, top, bottom);
    if (std::holds_alternative<Text>(expr))
      _draw_text(state, std::get<Text>(expr), left, right, top, bottom);
    if (std::holds_alternative<Line>(expr))
      _draw_line(state, std::get<Line>(expr), left, right, top, bottom);
    }

  void _draw_block(slide_t* state, const Block& b)
    {
    _draw_expression(state, b.expr, b.left, b.right, b.top, b.bottom);
    }

  bool _draw_shader(slide_t* state, const shader_parameters& params)
    {
    if (state->shader_gl_state.shader_program.is_linked())
      {
      state->shader_fbo.bind(10);      
      draw_shader_data(&state->shader_gl_state, params);
      state->shader_fbo.release();
      return true;
      }
    return false;
    }
  }

void init_slide_data(slide_t* state, uint32_t width, uint32_t height)
  {
  init_font(&state->font_gl_state, width, height);  

  state->width = width;
  state->height = height;

  state->shader_width = 800;
  state->shader_height = 450;

  init_blit_data(&state->blit_gl_state, 0.f, 0.f, width, height, width, height);

  state->fbo.create(width, height);  
  state->fbo.release();

  state->shader_fbo.create(state->shader_width, state->shader_height);
  state->shader_fbo.release();
  }

void destroy_slide_data(slide_t* state)
  {
  destroy_font(&state->font_gl_state);
  destroy_blit_data(&state->blit_gl_state);
  if (state->shader_gl_state.shader_program.is_linked())
    destroy_shader_data(&state->shader_gl_state);
  state->fbo.release();
  state->shader_fbo.release();
  }

void draw_slide_data(slide_t* state, const Slide& s, const shader_parameters& params)
  {
  bool background_shader = _draw_shader(state, params);
  state->fbo.bind(10);
  glViewport(0, 0, state->width, state->height);
  glClearColor(0.f, 0.f, 0.f, 1.f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

  if (background_shader)
    {
    draw_blit_data(&state->blit_gl_state, state->shader_fbo.get_texture(), state->width, state->height);
    }

  for (const auto& b : s.blocks)
    {
    _draw_block(state, b);
    }

  state->fbo.release();
  }

void init_slide_shader(slide_t* state, const std::string& script)
  {
  if (state->shader_gl_state.shader_program.is_linked())
    destroy_shader_data(&state->shader_gl_state);
  if (!script.empty())
    {
    if (jtk::file_exists(script))
      {
      std::ifstream f(script);
      if (f.is_open())
        {
        std::string scr((std::istreambuf_iterator<char>(f)), std::istreambuf_iterator<char>());
        f.close();
        init_shader_data(&state->shader_gl_state, scr, state->shader_width, state->shader_height);
        }
      }
    else
      init_shader_data(&state->shader_gl_state, script, state->shader_width, state->shader_height);
    }
  }