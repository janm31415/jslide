#pragma once

#include "blit_gl.h"
#include "utils_gl.h"
#include "image_helper.h"
#include "video_reader.h"
#include "shader_gl.h"

typedef struct image_t {

  jtk::texture tex;
  blit_t blit_gl_state;
  uint8_t* video_frame_data = nullptr;
  VideoReaderState video_state;
  } image_t;

void init_image_data(image_t* state, const image& im, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h);
void init_video_data(image_t* state, const VideoReaderState& vstate, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h);

void destroy_image_data(image_t* state);
void draw_image_data(image_t* state);
void draw_video_data(image_t* state, const shader_parameters& params);
