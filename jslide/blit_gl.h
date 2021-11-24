#pragma once

#include "utils_gl.h"

typedef struct blit_t {

  int32_t blit_x, blit_y;
  uint32_t blit_w, blit_h, view_w, view_h;

  jtk::shader_program blit_program;
  jtk::vertex_array_object blit_vao;
  jtk::buffer_object blit_vbo, blit_ebo;
  } blit_t;

void init_blit_data(blit_t* state, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h);
void destroy_blit_data(blit_t* state);
void draw_blit_data(blit_t* state, jtk::texture* tex, uint32_t vp_w, uint32_t vp_h, bool crt_blit = false, bool flip = false);
