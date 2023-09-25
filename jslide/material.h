#pragma once

#include <stdint.h>

namespace RenderDoos
  {
  class render_engine;
  }

class font_material
  {
  public:
    font_material() {}
    ~font_material() {}
  };

inline void get_render_size(float& width, float& height, class font_material
  * state, const char* text, float sx, float sy) { width = 100; height = 10;};