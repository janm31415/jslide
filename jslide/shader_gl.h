#pragma once

#include "utils_gl.h"


typedef struct shader_t {

  uint32_t width, height;

  jtk::shader_program shader_program;
  jtk::vertex_array_object shader_vao;
  jtk::buffer_object shader_vbo, shader_ebo;
  } shader_t;

struct shader_parameters
  {
  float time;
  int frame;
  float time_delta;
  };

void init_shader_data(shader_t* state, const std::string& shader_script, uint32_t width, uint32_t height);
void destroy_shader_data(shader_t* state);
void draw_shader_data(shader_t* state, const shader_parameters& params);
