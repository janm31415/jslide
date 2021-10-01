#pragma once

#include "font_gl.h"
#include "parser.h"

inline float get_font_ratio()
  {
  return 0.66f;// 3.f/4.f;
  }

inline float get_size(int size)
  {
  if (size > 6)
    size = 6;
  if (size < 1)
    size = 1;
  float sz = (7 - size) * 0.002f;
  return sz;
  }

void get_text_sizes(float& text_width, float& text_height, font_t* state, const Text& expr, float sz);