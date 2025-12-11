#include "slide.h"
#include "sizing.h"
#include "defines.h"
#include "syntax_highlight.h"

#include "jtk/file_utils.h"

#include <fstream>
#include <algorithm>
#include <cassert>

#include "RenderDoos/render_context.h"
#include "RenderDoos/render_engine.h"
#include "RenderDoos/types.h"

namespace
{
enum class text_type
{
  tt_normal,
  tt_comment,
  tt_string
};

syntax_highlighter g_sh;
text_type g_tt = text_type::tt_normal;

bool _is_next_word(std::string::const_iterator it, std::string::const_iterator it_end, const std::string& word)
{
  if (word.empty())
    return false;
  if (*it == word[0])
  {
    ++it;
    int i = 1;
    while (i < word.length() && (it != it_end) && (*it == word[i]))
    {
      ++it; ++i;
    }
    return (i == word.length());
  }
  return false;
}

std::string read_next_word(std::string::const_iterator it, std::string::const_iterator it_end)
{
  std::string out;
  while (it != it_end && *it != ' ' && *it != ',' && *it != '(' && *it != '{' && *it != ')' && *it != '}' && *it != '[' && *it != ']' && *it != '\n' && *it != '\t' && *it != '\r' && *it != '<' && *it != '>' && *it != '&' && *it != '*')
  {
    out.push_back(*it);
    ++it;
  }
  return out;
}

std::vector<std::pair<int64_t, text_type>> get_text_type(const std::string& ln, const comment_data& cd)
{
  std::vector<std::pair<int64_t, text_type>> out;
  out.emplace_back((int64_t)0, (text_type)g_tt);
  text_type current_status = g_tt;
  auto it = ln.begin();
  auto prev_it = it;
  auto prevprev_it = prev_it;
  auto it_end = ln.end();
  bool inside_single_line_comment = false;
  bool inside_single_line_string = false;
  bool inside_quotes = false;
  int64_t col = 0;
  for (; it != it_end; ++it, ++col)
  {
    if (inside_single_line_comment)
      break;
    if (current_status == text_type::tt_normal)
    {
      if (!inside_single_line_string && !inside_quotes && _is_next_word(it, it_end, cd.multiline_begin))
      {
        out.emplace_back((int64_t)col, text_type::tt_comment);
        current_status = text_type::tt_comment;
        it += cd.multiline_begin.length() - 1;
        col += cd.multiline_begin.length() - 1;
      }
      else if (!inside_single_line_string && !inside_quotes && _is_next_word(it, it_end, cd.multistring_begin))
      {
        out.emplace_back((int64_t)col, text_type::tt_string);
        current_status = text_type::tt_string;
        it += cd.multistring_begin.length() - 1;
        col += cd.multistring_begin.length() - 1;
      }
      else if (!inside_single_line_string && !inside_quotes && _is_next_word(it, it_end, cd.single_line))
      {
        inside_single_line_comment = true;
        out.emplace_back((int64_t)col, text_type::tt_comment);
      }
      else if (!inside_quotes && *it == '"' && (*prev_it != '\\' || *prevprev_it == '\\'))
      {
        inside_single_line_string = !inside_single_line_string;
        if (inside_single_line_string)
          out.emplace_back((int64_t)col, text_type::tt_string);
        else
          out.emplace_back((int64_t)col + 1, text_type::tt_normal);
      }
      else if (cd.uses_quotes_for_chars && !inside_single_line_string && *it ==L'\'' && (*prev_it != '\\' || *prevprev_it == '\\'))
      {
        inside_quotes = !inside_quotes;
        if (inside_quotes)
          out.emplace_back((int64_t)col, text_type::tt_string);
        else
          out.emplace_back((int64_t)col + 1, text_type::tt_normal);
      }
    }
    else if (current_status == text_type::tt_comment)
    {
      if (_is_next_word(it, it_end, cd.multiline_end))
      {
        current_status = text_type::tt_normal;
        it += cd.multiline_end.length() - 1;
        col += cd.multiline_end.length() - 1;
        out.emplace_back((int64_t)col + 1, text_type::tt_normal);
      }
    }
    else if (current_status == text_type::tt_string)
    {
      if (_is_next_word(it, it_end, cd.multistring_end))
      {
        current_status = text_type::tt_normal;
        it += cd.multistring_end.length() - 1;
        col += cd.multistring_end.length() - 1;
        out.emplace_back((int64_t)col + 1, text_type::tt_normal);
      }
    }
    prevprev_it = prev_it;
    prev_it = it;
  }
  
  std::reverse(out.begin(), out.end());
  out.erase(std::unique(out.begin(), out.end(), [](const std::pair<int64_t, text_type>& left, const std::pair<int64_t, text_type>& right)
                        {
    return left.first == right.first;
  })
            , out.end());
  
  g_tt = current_status;
  return out;
}

jtk::vec3<float> convert_color(uint32_t clr)
{
  uint32_t r = clr & 255;
  uint32_t g = (clr >> 8) & 255;
  uint32_t b = (clr >> 16) & 255;
  return jtk::vec3<float>((float)r/255.f, (float)g/255.f, (float)b/255.f);
}

void _compute_colors_par_character(std::vector<jtk::vec3<float>>& colors, const std::string& text, const ActiveAttributes& attrib)
{
  const auto& cd = g_sh.get_syntax_highlighter(language_to_extension(attrib.e_language));
  const auto& kd = g_sh.get_keywords(language_to_extension(attrib.e_language));
  colors.resize(text.length(), attrib.color);
  auto tt = get_text_type(text, cd);
  
  auto current_tt = tt.back();
  assert(current_tt.first == 0);
  tt.pop_back();
  
  int next_word_read_length_remaining = 0;
  bool keyword_type_1 = false;
  bool keyword_type_2 = false;
  for (size_t i = 0; i < text.length(); ++i)
  {
    if (next_word_read_length_remaining > 0)
      --next_word_read_length_remaining;
    
    while (!tt.empty() && tt.back().first <= i)
    {
      current_tt = tt.back();
      tt.pop_back();
    }
    
    if (!(kd.keywords_1.empty() && kd.keywords_2.empty()) && current_tt.second == text_type::tt_normal && next_word_read_length_remaining == 0)
    {
      keyword_type_1 = false;
      keyword_type_2 = false;
      std::string next_word = read_next_word(text.begin()+i, text.end());
      next_word_read_length_remaining = next_word.length();
      auto it = std::lower_bound(kd.keywords_1.begin(), kd.keywords_1.end(), next_word);
      if (it != kd.keywords_1.end() && *it == next_word)
        keyword_type_1 = true;
      else
      {
        it = std::lower_bound(kd.keywords_2.begin(), kd.keywords_2.end(), next_word);
        if (it != kd.keywords_2.end() && *it == next_word)
          keyword_type_2 = true;
      }
    }
    
    switch (current_tt.second)
    {
      case text_type::tt_normal:
      {
        if (keyword_type_1)
          colors[i] = convert_color(attrib.code_color_scheme.keyword);
        else if (keyword_type_2)
          colors[i] = convert_color(attrib.code_color_scheme.keyword_2);
        else
          colors[i] = convert_color(attrib.code_color_scheme.text);
        break;
      }
      case text_type::tt_comment:
      {
        colors[i] = convert_color(attrib.code_color_scheme.comment);
        break;
      }
      case text_type::tt_string:
      {
        colors[i] = convert_color(attrib.code_color_scheme.string);
        break;
      }
    }
  }
}

void _draw_code(slide_t* state, RenderDoos::render_engine* engine, const std::string& text, const ActiveAttributes& attrib, float text_width, float text_height, float left, float right, float top, float bottom, float sz)
{
  if (attrib.code_color_scheme.text == 0) // no color scheme
  {
    state->font_state->prepare_text(engine, text.c_str(), left, top - text_height, sz * get_font_ratio(), sz, attrib.color);
  }
  else
  {
    std::vector<jtk::vec3<float>> colors;
    _compute_colors_par_character(colors, text, attrib);
    state->font_state->prepare_text(engine, text.c_str(), left, top - text_height, sz * get_font_ratio(), sz, colors);
  }
}

void _draw_text(slide_t* state, RenderDoos::render_engine* engine, const Text& expr, float left, float right, float top, float bottom, float sz)
{
  float text_width = 0;
  float text_height = 0;
  get_text_sizes(text_width, text_height, state->font_state, expr, sz);
  
  float offset = 0.f;
  if (!expr.words.empty())
  {
    switch (expr.words.front().second.e_alignment)
    {
      case alignment::T_LEFT: break;
      case alignment::T_RIGHT: offset = (right - left) - text_width; break;
      case alignment::T_CENTER: offset = (right - left - text_width) * 0.5; break;
    }
  }
  if (expr.mask & TEXT_MASK_CODEBLOCK)
  {
    offset = 0.f;
    if (expr.mask & TEXT_MASK_BEGINOFCODEBLOCK)
      g_tt = text_type::tt_normal;
    if (!expr.words.empty())
      _draw_code(state, engine, expr.words.front().first, expr.words.front().second, text_width, text_height, left, right, top, bottom, sz);
  }
  else
  {
    for (const auto& word : expr.words)
    {
      state->font_state->prepare_text(engine, word.first.c_str(), offset + left, top - text_height, sz * get_font_ratio(), sz, word.second.color);
      float tw, th;
      state->font_state->get_render_size(tw, th, word.first.c_str(), sz * get_font_ratio(), sz);
      left += tw;
    }
  }
}

void _draw_title(slide_t* state, RenderDoos::render_engine* engine, const Title& expr, float left, float right, float top, float bottom)
{
  float sz = get_size(expr.size);
  _draw_text(state, engine, expr.text, left, right, top, bottom, sz);
}

void _draw_text(slide_t* state, RenderDoos::render_engine* engine, const Text& expr, float left, float right, float top, float bottom)
{
  float sz = get_size(expr.words.empty() ? NORMAL_TEXT_SIZE : get_textsize(expr.words.front().second));
  _draw_text(state, engine, expr, left, right, top, bottom, sz);
}

void _draw_line(slide_t* state, RenderDoos::render_engine* engine, const Line& expr, float left, float right, float top, float bottom)
{
  float sz = get_size(get_textsize(expr.attrib));
  Text t;
  t.words.emplace_back("_", expr.attrib);
  float text_width = 0;
  float text_height = 0;
  get_text_sizes(text_width, text_height, state->font_state, t, sz);
  int nr_of_chars = (int)std::floor((right - left) / text_width);
  std::string line;
  line.reserve(nr_of_chars);
  for (int i = 0; i < nr_of_chars; ++i)
    line.push_back('_');
  t.words.front().first = line;
  _draw_text(state, engine, t, left, right, top, bottom, sz);
}

void _draw_image(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const Image& im, const shadertoy_material::properties& params)
{
  if (im.link_to_image < 0)
    return;
  if (im.link_to_image >= state->image_states.size())
    return;
  if (im.video.width > 0 && im.video.height > 0)
    draw_video_data(state->image_states[im.link_to_image], framebuffer_id, engine, params, im.attrib.e_movie_speed, im.attrib.e_movie_loop, im.attrib.e_image_orientation, im.attrib.e_movie_frametime);
  else
    draw_image_data(state->image_states[im.link_to_image], framebuffer_id, engine, im.attrib.e_image_orientation);
}

void _draw_expression(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const Expression& expr, float left, float right, float top, float bottom, const shadertoy_material::properties& params)
{
  //RenderDoos::renderpass_descriptor descr;
  //descr.clear_color = 0xff808080;
//
  //descr.clear_flags = CLEAR_DEPTH;
  //descr.w = state->width;
  //descr.h = state->height;
  //descr.frame_buffer_handle = framebuffer_id;
  //descr.frame_buffer_channel = 10;
  //state->font_state->clear_text(engine);
  /*
  if (std::holds_alternative<Title>(expr))
  {
  if (!std::get<Title>(expr).text.words.empty())
    {
    _draw_title(state, engine, std::get<Title>(expr), left, right, top, bottom);
    }
  }
  if (std::holds_alternative<Text>(expr))
    {
    if (!std::get<Text>(expr).words.empty())
      {
      _draw_text(state, engine, std::get<Text>(expr), left, right, top, bottom);
      }
    }
  if (std::holds_alternative<Line>(expr))
    {
    _draw_line(state, engine, std::get<Line>(expr), left, right, top, bottom);
    }
  */
  if (std::holds_alternative<Image>(expr))
    _draw_image(state, engine, framebuffer_id, std::get<Image>(expr), params);
}

void _prepare_expression(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const Expression& expr, float left, float right, float top, float bottom, const shadertoy_material::properties& params)
{
  if (std::holds_alternative<Title>(expr))
  {
  if (!std::get<Title>(expr).text.words.empty())
    {
    _draw_title(state, engine, std::get<Title>(expr), left, right, top, bottom);
    }
  }
  if (std::holds_alternative<Text>(expr))
    {
    if (!std::get<Text>(expr).words.empty())
      {
      _draw_text(state, engine, std::get<Text>(expr), left, right, top, bottom);
      }
    }
  if (std::holds_alternative<Line>(expr))
    {
    _draw_line(state, engine, std::get<Line>(expr), left, right, top, bottom);
    }
}

void _draw_block(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const Block& b, const shadertoy_material::properties& params)
{
  _draw_expression(state, engine, framebuffer_id, b.expr, b.left, b.right, b.top, b.bottom, params);
}

void _prepare_block(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const Block& b, const shadertoy_material::properties& params)
{
  _prepare_expression(state, engine, framebuffer_id, b.expr, b.left, b.right, b.top, b.bottom, params);
}

bool _draw_shader(slide_t* state, RenderDoos::render_engine* engine, uint32_t framebuffer_id, const shadertoy_material::properties& params)
{
  if (!state->shader_state->is_compiled())
    return false;
  state->shader_state->set_shadertoy_properties(params);
  state->shader_state->draw(state->shader_width, state->shader_height, framebuffer_id, engine);
  return true;
}
}

void init_slide_data(slide_t* state, RenderDoos::render_engine* engine, uint32_t width, uint32_t height)
{
  state->width = width;
  state->height = height;
  
  state->shader_width = 800*2;
  state->shader_height = 450*2;
  
  state->framebuffer_id = engine->add_frame_buffer(width, height, false);
  state->shader_framebuffer_id = engine->add_frame_buffer(state->shader_width, state->shader_height, false);
}

void destroy_slide_data(slide_t* state, RenderDoos::render_engine* engine)
{
  clear_images(state, engine);
  engine->remove_frame_buffer(state->framebuffer_id);
  engine->remove_frame_buffer(state->shader_framebuffer_id);
}

void prepare_slide_data(slide_t* state, RenderDoos::render_engine* engine, const Slide& s, const shadertoy_material::properties& params)
{
  state->font_state->clear_text(engine);

  for (const auto& b : s.blocks)
  {
    _prepare_block(state, engine, state->framebuffer_id, b, params);
  }
  
  
}

void draw_slide_data(slide_t* state, RenderDoos::render_engine* engine, const Slide& s, const shadertoy_material::properties& params)
{
  //state->font_state->clear_text(engine);
  shadertoy_material::properties st_props(params);
  switch (s.attrib.e_shader_visibility)
    {
      case shader_visibility::T_SHADER_VISIBILITY_FULL:
        st_props.fade = 1.f;
        break;
      case shader_visibility::T_SHADER_VISIBILITY_HALF:
        st_props.fade = 0.5f;
        break;
      case shader_visibility::T_SHADER_VISIBILITY_QUARTER:
        st_props.fade = 0.25f;
        break;
      case shader_visibility::T_SHADER_VISIBILITY_EIGHTH:
        st_props.fade = 0.125f;
        break;
    }
  bool background_shader = _draw_shader(state, engine, state->shader_framebuffer_id, st_props);
  RenderDoos::renderpass_descriptor descr;
  descr.clear_color = 0xff000000;
  descr.clear_flags = CLEAR_COLOR | CLEAR_DEPTH;
  descr.w = state->width;
  descr.h = state->height;
  descr.frame_buffer_handle = state->framebuffer_id;
  descr.frame_buffer_channel = 10;
  engine->renderpass_begin(descr);
  
  if (background_shader)
    {
    jtk::vec2<float> viewResolution(state->width, state->height);
    jtk::vec2<float> blitResolution(state->width, state->height);
    jtk::vec2<float> blitOffset(0, 0);
    state->blit_state->bind(engine,
      engine->get_frame_buffer(state->shader_framebuffer_id)->texture_handle,
      viewResolution,
      blitResolution,
      blitOffset,
      0, 0, 0);
    state->blit_state->draw(engine);
    }
  
  engine->renderpass_end();

  for (const auto& b : s.blocks)
  {
    _draw_block(state, engine, state->framebuffer_id, b, params);
  }
  
  descr.clear_flags = CLEAR_DEPTH;
  descr.w = state->width;
  descr.h = state->height;
  descr.frame_buffer_handle = state->framebuffer_id;
  descr.frame_buffer_channel = 10;
  engine->renderpass_begin(descr);
  state->font_state->bind(engine);
  state->font_state->draw_text(engine);
  engine->renderpass_end();
}

void init_slide_shader(slide_t* state, RenderDoos::render_engine* engine, const std::string& script)
{
  state->shader_state->destroy(engine);
  if (!script.empty())
  {
    if (jtk::file_exists(script))
    {
      std::ifstream f(script);
      if (f.is_open())
      {
        std::string scr((std::istreambuf_iterator<char>(f)), std::istreambuf_iterator<char>());
        f.close();
        state->shader_state->set_script(scr);
        state->shader_state->compile(engine);
      }
    }
    else
    {
      state->shader_state->set_script(script);
      state->shader_state->compile(engine);
    }
  }
}

void clear_images(slide_t* state, RenderDoos::render_engine* engine)
{
  for (auto& im : state->image_states)
  {
    destroy_image_data(im, engine);
    delete im;
  }
  state->image_states.clear();
}

void add_image(slide_t* state, RenderDoos::render_engine* engine, Block& b)
{
  if (!std::holds_alternative<Image>(b.expr))
    return;
  Image& im = std::get<Image>(b.expr);
  int id = state->image_states.size();
  if (id >= 9)
    return;
  state->image_states.push_back(new image_t());
  state->image_states.back()->blit_state = state->blit_state;
  int32_t blit_x = 0;
  switch (im.attrib.e_alignment)
  {
    case alignment::T_LEFT: blit_x = 0; break;
    case alignment::T_RIGHT: blit_x = (int32_t)state->width * (1.f - im.w); break;
    case alignment::T_CENTER: blit_x = (int32_t)state->width * (1.f - im.w) * 0.5f; break;
  }
  int32_t blit_y = (-b.top + 1.f) * 0.5f * state->height;
  uint32_t blit_w = state->width * im.w;
  uint32_t blit_h = state->height * im.h;
  uint32_t view_w = state->width;
  uint32_t view_h = state->height;
  if (im.video.width > 0 && im.video.height > 0)
    init_video_data(state->image_states.back(), engine, im.video, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  else
    init_image_data(state->image_states.back(), engine, im.im, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  im.link_to_image = id;
}
