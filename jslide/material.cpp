#include "material.h"
#include "shaders.h"

#include "RenderDoos/render_engine.h"
#include "RenderDoos/types.h"

#include <cassert>

blit_material::blit_material() {
  vs_handle = -1;
  fs_handle = -1;
  shader_program_handle = -1;
  iViewResolution = -1;
  iBlitResolution = -1;
  iBlitOffset = -1;
  iChannel0 = -1;
  iCrt = -1;
  iFlip = -1;
  iRotation = -1;
}

blit_material::~blit_material() {
}

void blit_material::compile(RenderDoos::render_engine* engine) {
  if (engine->get_renderer_type() == RenderDoos::renderer_type::METAL)
  {
    vs_handle = engine->add_shader(nullptr, SHADER_VERTEX, "blit_vertex_shader");
    fs_handle = engine->add_shader(nullptr, SHADER_FRAGMENT, "blit_fragment_shader");
  }
  else if (engine->get_renderer_type() == RenderDoos::renderer_type::OPENGL)
  {
    vs_handle = engine->add_shader(get_blit_vertex_shader().c_str(), SHADER_VERTEX, nullptr);
    fs_handle = engine->add_shader(get_blit_fragment_shader().c_str(), SHADER_FRAGMENT, nullptr);
  }
  shader_program_handle = engine->add_program(vs_handle, fs_handle);
  iViewResolution = engine->add_uniform("iViewResolution", RenderDoos::uniform_type::vec2, 1);
  iBlitResolution = engine->add_uniform("iBlitResolution", RenderDoos::uniform_type::vec2, 1);
  iBlitOffset = engine->add_uniform("iBlitOffset", RenderDoos::uniform_type::vec2, 1);
  iChannel0 = engine->add_uniform("iChannel0", RenderDoos::uniform_type::sampler, 1);
  iCrt = engine->add_uniform("iCrt", RenderDoos::uniform_type::integer, 1);
  iFlip = engine->add_uniform("iFlip", RenderDoos::uniform_type::integer, 1);
  iRotation = engine->add_uniform("iRotation", RenderDoos::uniform_type::integer, 1);
  geometry_id = engine->add_geometry(VERTEX_STANDARD);
  RenderDoos::vertex_standard* vp;
  uint32_t* ip;

  engine->geometry_begin(geometry_id, 4, 6, (float**)&vp, (void**)&ip);
  // make a quad for drawing the texture

  vp->x = -1.f;
  vp->y = -1.f;
  vp->z = 0.f;
  vp->nx = 0.f;
  vp->ny = 0.f;
  vp->nz = 1.f;
  vp->u = 0.f;
  vp->v = 0.f;
  ++vp;
  vp->x = 1.f;
  vp->y = -1.f;
  vp->z = 0.f;
  vp->nx = 0.f;
  vp->ny = 0.f;
  vp->nz = 1.f;
  vp->u = 1.f;
  vp->v = 0.f;
  ++vp;
  vp->x = 1.f;
  vp->y = 1.f;
  vp->z = 0.f;
  vp->nx = 0.f;
  vp->ny = 0.f;
  vp->nz = 1.f;
  vp->u = 1.f;
  vp->v = 1.f;
  ++vp;
  vp->x = -1.f;
  vp->y = 1.f;
  vp->z = 0.f;
  vp->nx = 0.f;
  vp->ny = 0.f;
  vp->nz = 1.f;
  vp->u = 0.f;
  vp->v = 1.f;

  ip[0] = 0;
  ip[1] = 1;
  ip[2] = 2;
  ip[3] = 0;
  ip[4] = 2;
  ip[5] = 3;

  engine->geometry_end(geometry_id);
}

void blit_material::bind(RenderDoos::render_engine* engine,
    int32_t texture_handle,
    const jtk::vec2<float>& viewResolution,
    const jtk::vec2<float>& blitResolution,
    const jtk::vec2<float>& blitOffset,
    int crt,
    int flip,
    int rotation
  ) {
    engine->bind_program(shader_program_handle);
    engine->set_uniform(iViewResolution, (void*)(&viewResolution.x));
    engine->bind_uniform(shader_program_handle, iViewResolution);
    engine->set_uniform(iBlitResolution, (void*)(&blitResolution.x));
    engine->bind_uniform(shader_program_handle, iBlitResolution);
    engine->set_uniform(iBlitOffset, (void*)(&blitOffset.x));
    engine->bind_uniform(shader_program_handle, iBlitOffset);
    int channel = 0;
    engine->set_uniform(iChannel0, (void*)(&channel));
    engine->bind_uniform(shader_program_handle, iChannel0);
    engine->set_uniform(iCrt, (void*)(&crt));
    engine->bind_uniform(shader_program_handle, iCrt);
    engine->set_uniform(iFlip, (void*)(&flip));
    engine->bind_uniform(shader_program_handle, iFlip);
    engine->set_uniform(iRotation, (void*)(&rotation));
    engine->bind_uniform(shader_program_handle, iRotation);
    const RenderDoos::texture* tex = engine->get_texture(texture_handle);
    assert(tex != nullptr);
    int32_t texture_flags = TEX_WRAP_CLAMP_TO_EDGE | TEX_FILTER_NEAREST;
    engine->bind_texture_to_channel(texture_handle, channel, texture_flags);
}

void blit_material::destroy(RenderDoos::render_engine* engine) {
  engine->remove_shader(vs_handle);
  engine->remove_shader(fs_handle);
  engine->remove_program(shader_program_handle);
  engine->remove_uniform(iViewResolution);  
  engine->remove_uniform(iBlitResolution);
  engine->remove_uniform(iBlitOffset);
  engine->remove_uniform(iChannel0);
  engine->remove_uniform(iCrt);
  engine->remove_uniform(iFlip);
  engine->remove_uniform(iRotation);
  engine->remove_geometry(geometry_id);
}

void blit_material::draw(RenderDoos::render_engine* engine)
  {
  engine->geometry_draw(geometry_id);
  }
