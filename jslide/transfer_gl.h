#pragma once

#include "utils_gl.h"
#include "parser.h"

typedef struct transfer_t {
  jtk::frame_buffer_object fbo;
  jtk::shader_program program;
  jtk::vertex_array_object vao;
  jtk::buffer_object vbo, ebo;
  uint32_t width, height;
  } transfer_t;


void init_transfer_data(transfer_t* state, uint32_t width, uint32_t height);
void destroy_transfer_data(transfer_t* state);
void draw_transfer_data(transfer_t* state, jtk::texture* tex, float time, float max_time, transfer_animation anim);