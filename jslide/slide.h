#pragma once

#include "material.h"
#include "image.h"

#include "parser.h"

#include <vector>

namespace RenderDoos
{
class render_engine;
}

typedef struct slide_t {
  font_material* font_state;
  shadertoy_material* shader_state;
  blit_material* blit_state;

  uint32_t framebuffer_id;
  
  uint32_t width, height;
  uint32_t shader_width, shader_height;
  uint32_t shader_framebuffer_id;

  std::vector<image_t*> image_states;
  } slide_t;

void init_slide_data(slide_t* state, RenderDoos::render_engine* engine, uint32_t width, uint32_t height);
void init_slide_shader(slide_t* state, RenderDoos::render_engine* engine, const std::string& script);
void destroy_slide_data(slide_t* state, RenderDoos::render_engine* engine);
void draw_slide_data(slide_t* state, RenderDoos::render_engine* engine, const Slide& s, const shadertoy_material::properties& params);

void clear_images(slide_t* state, RenderDoos::render_engine* engine);

void add_image(slide_t* state, RenderDoos::render_engine* engine, Block& b);
