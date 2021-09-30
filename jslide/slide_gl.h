#pragma once

#include "font_gl.h"
#include "utils_gl.h"

#include "parser.h"

typedef struct slide_t {

  font_t font_gl_state;
  jtk::frame_buffer_object fbo;
  
  uint32_t width, height;
  } slide_t;

void init_slide_data(slide_t* state, uint32_t width, uint32_t height);

void destroy_slide_data(slide_t* state);
void draw_slide_data(slide_t* state, const Slide& s);