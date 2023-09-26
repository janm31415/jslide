#pragma once

#include <stdint.h>
#include "jtk/vec.h"

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



class blit_material
{
public:
  blit_material();
  ~blit_material();
  void compile(RenderDoos::render_engine* engine);
  void bind(RenderDoos::render_engine* engine,
    int32_t texture_handle,
    const jtk::vec2<float>& viewResolution,
    const jtk::vec2<float>& blitResolution,
    const jtk::vec2<float>& blitOffset,
    int32_t crt,
    int32_t flip,
    int32_t rotation
  );
  void destroy(RenderDoos::render_engine* engine);
  void draw(RenderDoos::render_engine* engine);
  
private:
  int32_t vs_handle, fs_handle;
  int32_t shader_program_handle;
  int32_t iViewResolution;
  int32_t iBlitResolution;
  int32_t iBlitOffset;
  int32_t iChannel0;
  int32_t iCrt;
  int32_t iFlip;
  int32_t iRotation;
  uint32_t geometry_id;
};
