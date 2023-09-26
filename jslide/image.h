#pragma once

#include "material.h"
#include "image_helper.h"
#include "video_reader.h"
#include "parser.h"

namespace RenderDoos
{
class render_engine;
}

typedef struct image_t {
  uint32_t tex_handle;
  blit_material* blit_state;
  uint8_t* video_frame_data = nullptr;
  VideoReaderState video_state;
  int32_t blit_x, blit_y, blit_w, blit_h, view_w, view_h;
  } image_t;

void init_image_data(image_t* state, RenderDoos::render_engine* engine, const image& im, int32_t blit_x, int32_t blit_y, int32_t blit_w, int32_t blit_h, int32_t view_w, int32_t view_h);
void init_video_data(image_t* state, RenderDoos::render_engine* engine, const VideoReaderState& vstate, int32_t blit_x, int32_t blit_y, int32_t blit_w, int32_t blit_h, int32_t view_w, int32_t view_h);

void destroy_image_data(image_t* state, RenderDoos::render_engine* engine);

void draw_image_data(image_t* state, uint32_t framebuffer_id, RenderDoos::render_engine* engine, image_orientation orientation);
void draw_video_data(image_t* state, uint32_t framebuffer_id, RenderDoos::render_engine* engine, const shadertoy_material::properties& params, movie_speed speed, image_orientation orientation);
