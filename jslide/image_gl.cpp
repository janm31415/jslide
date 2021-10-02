#include "image_gl.h"

void init_image_data(image_t* state, const image& im, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h)
  {
  state->tex.create_empty(im.w, im.h, im.nr_of_channels, jtk::texture::pixel_type::byte);
  state->tex.load_from_pixels((GLubyte*)im.im, im.w, im.h, im.nr_of_channels, jtk::texture::pixel_type::byte);

  init_blit_data(&state->blit_gl_state, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  }

void destroy_image_data(image_t* state)
  {
  state->tex.release();
  destroy_blit_data(&state->blit_gl_state);
  }

void draw_image_data(image_t* state)
  {
  draw_blit_data(&state->blit_gl_state, &state->tex, state->blit_gl_state.view_w, state->blit_gl_state.view_h, false);
  }