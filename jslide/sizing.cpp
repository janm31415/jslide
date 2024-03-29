#include "sizing.h"


void get_text_sizes(float& text_width, float& text_height, font_material* state, const Text& expr, float sz)
  {
  text_width = 0;
  text_height = 0;
  for (const auto& word : expr.words)
    {
    float tw, th;
    state->get_render_size(tw, th, word.first.c_str(), sz * get_font_ratio(), sz);
    text_width += tw;
    text_height = std::max<float>(text_height, th);
    if (th == 0.f)
      {
      state->get_render_size(tw, th, "a", sz * get_font_ratio(), sz);
      text_height = std::max<float>(text_height, th);
      }
    }
  if (expr.words.empty())
    {
    float tw, th;
    state->get_render_size(tw, th, "a", sz * get_font_ratio(), sz);
    text_height = th;
    }
  }
