#pragma once

#include <stdint.h>
#include <string>
#include <vector>
#include "jtk/vec.h"
#include "ft2build.h"
#include FT_FREETYPE_H

namespace RenderDoos
{
class render_engine;
}

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


typedef struct text_vert_t {
  float x;
  float y;
  float s;
  float t;
  float r;
  float g;
  float b;
} text_vert_t;

// Structure to hold cache glyph information
typedef struct char_info_t {
  float ax; // advance.x
  float ay; // advance.y
  
  float bw; // bitmap.width
  float bh; // bitmap.height
  
  float bl; // bitmap left
  float bt; // bitmap top
  
  float tx; // x offset of glyph in texture coordinates
  float ty; // y offset of glyph in texture coordinates
} char_info_t;

class font_material
{
public:
  font_material();
  virtual ~font_material();
  
  void compile(RenderDoos::render_engine* engine);
  void bind(RenderDoos::render_engine* engine);
  void destroy(RenderDoos::render_engine* engine);
  
  void render_text(RenderDoos::render_engine* engine, const char* text, float x, float y, float sx, float sy, uint32_t clr);
  void render_text(RenderDoos::render_engine* engine, const char* text, float x, float y, float sx, float sy, const jtk::vec3<float>& clr);
  void render_text(RenderDoos::render_engine* engine, const char* text, float x, float y, float sx, float sy, const std::vector<jtk::vec3<float>>& clrs);  
  void get_render_size(float& width, float& height, const char* text, float sx, float sy);
  
private:
  
  void _init_font(RenderDoos::render_engine* engine);
  
private:
  int32_t vs_handle, fs_handle;
  int32_t shader_program_handle;
  int32_t width_handle, height_handle;
  int32_t geometry_id;
  
  int32_t atlas_texture_id;
  
  int32_t atlas_width;
  int32_t atlas_height;
  char_info_t char_info[128];
  
  FT_Library _ft;
  FT_Face _face;
};


class shadertoy_material
{
public:
  struct properties
  {
    float time;
    float global_time;
    float time_delta;
    int frame;
  };
  
  shadertoy_material();
  virtual ~shadertoy_material();
  
  void set_script(const std::string& script);
  void set_shadertoy_properties(const properties& props);
  
  void compile(RenderDoos::render_engine* engine);
  void bind(uint32_t res_w, uint32_t res_h, RenderDoos::render_engine* engine);
  void destroy(RenderDoos::render_engine* engine);
  void draw(uint32_t framebuffer_id, uint32_t res_w, uint32_t res_h, RenderDoos::render_engine* engine);
  
private:
  int32_t vs_handle, fs_handle;
  int32_t shader_program_handle;
  std::string _script;
  properties _props;
  int32_t res_handle, time_handle, global_time_handle, time_delta_handle, frame_handle;
  uint32_t geometry_id;
};
