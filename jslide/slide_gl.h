#pragma once

#include "font_gl.h"
#include "utils_gl.h"
#include "shader_gl.h"
#include "blit_gl.h"
#include "image_gl.h"

#include "parser.h"

#include <vector>

typedef struct slide_t {
  font_t font_gl_state;
  shader_t shader_gl_state;
  blit_t blit_gl_state;

  jtk::frame_buffer_object fbo;
  
  uint32_t width, height;
  uint32_t shader_width, shader_height;
  jtk::frame_buffer_object shader_fbo;  

  std::vector<image_t*> image_gl_states;
  } slide_t;

void init_slide_data(slide_t* state, uint32_t width, uint32_t height);
void init_slide_shader(slide_t* state, const std::string& script);
void destroy_slide_data(slide_t* state);
void draw_slide_data(slide_t* state, const Slide& s, const shader_parameters& params);

void clear_images(slide_t* state);

void add_image(slide_t* state, Block& b);