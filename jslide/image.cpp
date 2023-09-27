#include "image.h"
#include <thread>
#include <chrono>
#include "RenderDoos/render_context.h"
#include "RenderDoos/render_engine.h"
#include "RenderDoos/types.h"
#include "video_reader.h"

void init_image_data(image_t* state, RenderDoos::render_engine* engine, const image& im, int32_t blit_x, int32_t blit_y, int32_t blit_w, int32_t blit_h, int32_t view_w, int32_t view_h)
{
  state->tex_handle = engine->add_texture(im.w, im.h, RenderDoos::texture_format_rgba8, im.im);
  state->blit_x = blit_x;
  state->blit_y = blit_y;
  state->blit_w = blit_w;
  state->blit_h = blit_h;
  state->view_w = view_w;
  state->view_h = view_h;
}

void init_video_data(image_t* state, RenderDoos::render_engine* engine, VideoReaderState& vstate, int32_t blit_x, int32_t blit_y, int32_t blit_w, int32_t blit_h, int32_t view_w, int32_t view_h)
{
  video_reader_seek_frame(&vstate, 0);
  state->video_state = vstate;
  state->video_frame_data = new uint8_t[vstate.width * vstate.height * 4];
  state->tex_handle = engine->add_texture(vstate.width, vstate.height, RenderDoos::texture_format_rgba8, (const uint8_t*)nullptr);
  state->blit_x = blit_x;
  state->blit_y = blit_y;
  state->blit_w = blit_w;
  state->blit_h = blit_h;
  state->view_w = view_w;
  state->view_h = view_h;
}

void destroy_image_data(image_t* state, RenderDoos::render_engine* engine)
{
  engine->remove_texture(state->tex_handle);
  delete[] state->video_frame_data;
}

void draw_image_data(image_t* state, uint32_t framebuffer_id, RenderDoos::render_engine* engine, image_orientation orientation)
{
  int rotation = 0;
  switch (orientation)
  {
    case image_orientation::T_ORIENTATION_90DEG: rotation = 90; break;
    case image_orientation::T_ORIENTATION_180DEG: rotation = 180; break;
    case image_orientation::T_ORIENTATION_270DEG: rotation = 270; break;
    default: break;
  }
  RenderDoos::renderpass_descriptor descr;
  descr.clear_color = 0xff808080;
  descr.clear_flags = CLEAR_DEPTH;
  descr.w = state->view_w;
  descr.h = state->view_h;
  descr.frame_buffer_handle = framebuffer_id;
  descr.frame_buffer_channel = 10;
  engine->renderpass_begin(descr);
  
  jtk::vec2<float> viewResolution(state->view_w, state->view_h);
  jtk::vec2<float> blitResolution(state->blit_w, state->blit_h);
  jtk::vec2<float> blitOffset(state->blit_x,state->blit_y);
  state->blit_state->bind(engine,
                         state->tex_handle,
                         viewResolution,
                         blitResolution,
                         blitOffset,
                         0,0,rotation);
  state->blit_state->draw(engine);
  engine->renderpass_end();
}

void draw_video_data(image_t* state, uint32_t framebuffer_id, RenderDoos::render_engine* engine, const shadertoy_material::properties& params, movie_speed speed, image_orientation orientation)
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
      default: break;
    }
    
    engine->update_texture(state->tex_handle, state->video_frame_data);
    
    RenderDoos::renderpass_descriptor descr;
    descr.clear_color = 0xff808080;
    descr.clear_flags = CLEAR_DEPTH;
    descr.w = state->view_w;
    descr.h = state->view_h;
    descr.frame_buffer_handle = framebuffer_id;
    descr.frame_buffer_channel = 10;
    engine->renderpass_begin(descr);
    
    jtk::vec2<float> viewResolution(state->view_w, state->view_h);
    jtk::vec2<float> blitResolution(state->blit_w, state->blit_h);
    jtk::vec2<float> blitOffset(state->blit_x,state->blit_y);
    
#if defined(RENDERDOOS_METAL)
    int flip = 1;
#else
    int flip = 0;
#endif
    
    state->blit_state->bind(engine,
                           state->tex_handle,
                           viewResolution,
                           blitResolution,
                           blitOffset,
                           0,flip,rotation);
    state->blit_state->draw(engine);
    engine->renderpass_end();
    
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
