#include "image_gl.h"
#include <thread>
#include <chrono>

void init_image_data(image_t* state, const image& im, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h)
  {
  state->tex.create_empty(im.w, im.h, im.nr_of_channels, jtk::texture::pixel_type::byte);
  state->tex.load_from_pixels((GLubyte*)im.im, im.w, im.h, im.nr_of_channels, jtk::texture::pixel_type::byte);

  init_blit_data(&state->blit_gl_state, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  }

void init_video_data(image_t* state, const VideoReaderState& vstate, int32_t blit_x, int32_t blit_y, uint32_t blit_w, uint32_t blit_h, uint32_t view_w, uint32_t view_h)
  {
  state->video_state = vstate;
  state->video_frame_data = new uint8_t[vstate.width * vstate.height * 4];
  state->tex.create_empty(vstate.width, vstate.height, 4, jtk::texture::pixel_type::byte);
  init_blit_data(&state->blit_gl_state, blit_x, blit_y, blit_w, blit_h, view_w, view_h);
  }

void destroy_image_data(image_t* state)
  {
  state->tex.release();
  destroy_blit_data(&state->blit_gl_state);
  delete[] state->video_frame_data;
  }

void draw_image_data(image_t* state, image_orientation orientation)
  {
  int rotation = 0;
  switch (orientation)
    {
    case image_orientation::T_ORIENTATION_90DEG: rotation = 90; break;
    case image_orientation::T_ORIENTATION_180DEG: rotation = 180; break;
    case image_orientation::T_ORIENTATION_270DEG: rotation = 270; break;
    }
  draw_blit_data(&state->blit_gl_state, &state->tex, state->blit_gl_state.view_w, state->blit_gl_state.view_h, false, false, rotation);
  }

void draw_video_data(image_t* state, const shader_parameters& params, movie_speed speed, image_orientation orientation)
  {  
  int64_t pts;
  if (video_reader_read_frame(&state->video_state, state->video_frame_data, &pts))
    {
    int rotation = 0;
    switch (orientation)
      {
      case image_orientation::T_ORIENTATION_90DEG: rotation = 90; break;
      case image_orientation::T_ORIENTATION_180DEG: rotation = 180; break;
      case image_orientation::T_ORIENTATION_270DEG: rotation = 270; break;
      }
    state->tex.load_from_pixels(state->video_frame_data, state->video_state.width, state->video_state.height, 4, jtk::texture::pixel_type::byte);
    draw_blit_data(&state->blit_gl_state, &state->tex, state->blit_gl_state.view_w, state->blit_gl_state.view_h, false, true, rotation);
    double time_for_one_frame = (double)(state->video_state.time_base.num) / (double)(state->video_state.time_base.den);
    switch (speed)
      {
      default: break;
      case movie_speed::T_SPEED_TIMES_TWO: time_for_one_frame *= 0.5; break;
      case movie_speed::T_SPEED_TIMES_FOUR: time_for_one_frame *= 0.25; break;
      case movie_speed::T_SPEED_TIMES_EIGHT: time_for_one_frame *= 0.125; break;
      }
    if (time_for_one_frame > params.time_delta)
      {
      double wait_time = time_for_one_frame - params.time_delta;      
      if (wait_time < 1) // don't want to wait longer than 1 second. If we have to wait that long, something is wrong.
        {
        std::this_thread::sleep_for(std::chrono::duration<double, std::milli>(wait_time * 1000.0));
        }
      }
    }
  }