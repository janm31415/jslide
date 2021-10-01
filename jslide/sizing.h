#pragma once

#include "font_gl.h"
#include "parser.h"

inline float get_font_ratio()
  {
  return 0.66f;// 3.f/4.f;
  }

inline float get_size(int size)
  {
  const float factor = 0.6f;
  if (size < 1)
    size = 1;
  if (size > 8)
    size = 8;
  switch (size)
    {
    case 1: return 0.02f;
    case 2: return 0.02f * factor;
    case 3: return 0.02f * factor * factor;
    case 4: return 0.02f * factor * factor * factor;
    case 5: return 0.02f * factor * factor * factor * factor;
    case 6: return 0.02f * factor * factor * factor * factor * factor;
    case 7: return 0.02f * factor * factor * factor * factor * factor * factor;
    case 8: return 0.02f * factor * factor * factor * factor * factor * factor * factor;
    }
  return 0.002f;
  }

void get_text_sizes(float& text_width, float& text_height, font_t* state, const Text& expr, float sz);