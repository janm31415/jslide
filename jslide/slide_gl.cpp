#include "slide_gl.h"
#include "sizing.h"
#include "defines.h"
#include "syntax_highlight.h"

#include "jtk/file_utils.h"

#include <fstream>
#include <algorithm>

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
    while (it != it_end && *it != ' ' && *it != ',' && *it != '(' && *it != '{' && *it != ')' && *it != '}' && *it != '[' && *it != ']' && *it != '\n' && *it != '\t' && *it != '\r')
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

  void _draw_code(slide_t* state, const std::string& text, const ActiveAttributes& attrib, float text_width, float text_height, float left, float right, float top, float bottom, float sz)
    {
    if (attrib.code_color_scheme.text == 0) // no color scheme
      {
      render_text(&state->font_gl_state, text.c_str(), left, top - text_height, sz * get_font_ratio(), sz, attrib.color);
      }
    else
      {
      std::vector<jtk::vec3<float>> colors;
      _compute_colors_par_character(colors, text, attrib);
      render_text(&state->font_gl_state, text.c_str(), left, top - text_height, sz * get_font_ratio(), sz, colors);
      }
    }

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
        _draw_code(state, expr.words.front().first, expr.words.front().second, text_width, text_height, left, right, top, bottom, sz);
      }
    else
      {
      for (const auto& word : expr.words)
        {
        render_text(&state->font_gl_state, word.first.c_str(), offset + left, top - text_height, sz * get_font_ratio(), sz, word.second.color);
        float tw, th;
        get_render_size(tw, th, &state->font_gl_state, word.first.c_str(), sz * get_font_ratio(), sz);
        left += tw;
        }
      }
    }

  void _draw_title(slide_t* state, const Title& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(expr.size);
    _draw_text(state, expr.text, left, right, top, bottom, sz);
    }

  void _draw_text(slide_t* state, const Text& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(expr.words.empty() ? NORMAL_TEXT_SIZE : get_textsize(expr.words.front().second));
    _draw_text(state, expr, left, right, top, bottom, sz);
    }

  void _draw_line(slide_t* state, const Line& expr, float left, float right, float top, float bottom)
    {
    float sz = get_size(get_textsize(expr.attrib));
    Text t;
    t.words.emplace_back("_", expr.attrib);
    float text_width = 0;
    float text_height = 0;
    get_text_sizes(text_width, text_height, &state->font_gl_state, t, sz);
    int nr_of_chars = (int)std::floor((right - left) / text_width);
    std::string line;
    line.reserve(nr_of_chars);
    for (int i = 0; i < nr_of_chars; ++i)
      line.push_back('_');
    t.words.front().first = line;
    _draw_text(state, t, left, right, top, bottom, sz);
    }

  void _draw_image(slide_t* state, const Image& im)
    {
    if (im.link_to_image < 0)
      return;
    if (im.link_to_image >= state->image_gl_states.size())
      return;
    draw_image_data(state->image_gl_states[im.link_to_image]);
    }

  void _draw_expression(slide_t* state, const Expression& expr, float left, float right, float top, float bottom)
    {
    if (std::holds_alternative<Title>(expr))
      _draw_title(state, std::get<Title>(expr), left, right, top, bottom);
    if (std::holds_alternative<Text>(expr))
      _draw_text(state, std::get<Text>(expr), left, right, top, bottom);
    if (std::holds_alternative<Line>(expr))
      _draw_line(state, std::get<Line>(expr), left, right, top, bottom);
    if (std::holds_alternative<Image>(expr))
      _draw_image(state, std::get<Image>(expr));
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
  clear_images(state);
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

void clear_images(slide_t* state)
  {
  for (auto& im : state->image_gl_states)
    {
    destroy_image_data(im);
    delete im;
    }
  state->image_gl_states.clear();
  }

void add_image(slide_t* state, Block& b)
  {
  if (!std::holds_alternative<Image>(b.expr))
    return;
  Image& im = std::get<Image>(b.expr);
  int id = state->image_gl_states.size();
  if (id >= 9)
    return;
  state->image_gl_states.push_back(new image_t());
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
  init_image_data(state->image_gl_states.back(), im.im, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  im.link_to_image = id;
  }