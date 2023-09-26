#include "material.h"
#include "shaders.h"

#include "RenderDoos/render_context.h"
#include "RenderDoos/render_engine.h"
#include "RenderDoos/types.h"

#include <cassert>

#define MAX_WIDTH 2048 // Maximum texture width on pi

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
    jtk::vec2<float> blitOffs(blitOffset.x, viewResolution.y-blitResolution.y-blitOffset.y);
    engine->set_uniform(iBlitOffset, (void*)(&blitOffs.x));
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




font_material::font_material()
  {
  vs_handle = -1;
  fs_handle = -1;
  shader_program_handle = -1;
  width_handle = -1;
  height_handle = -1;
  geometry_id = -1;
  atlas_texture_id = -1;
  }

font_material::~font_material()
  {
  FT_Done_Face(_face);
  FT_Done_FreeType(_ft);
  }

void font_material::_init_font(RenderDoos::render_engine* engine)
  {
  if (FT_Init_FreeType(&_ft)) {
    printf("Error initializing FreeType library\n");
    exit(EXIT_FAILURE);
    }

  if (FT_New_Face(_ft, "data/Karla-Regular.ttf", 0, &_face)) {
    printf("Error loading font face\n");
    exit(EXIT_FAILURE);
    }

  // Set pixel size
  FT_Set_Pixel_Sizes(_face, 0, 48);

  // Get atlas dimensions
  FT_GlyphSlot g = _face->glyph;
  int w = 0; // full texture width
  int h = 0; // full texture height
  int row_w = 0; // current row width
  int row_h = 0; // current row height

  int i;
  for (i = 32; i < 128; ++i)
    {
    if (FT_Load_Char(_face, i, FT_LOAD_RENDER))
      {
      printf("Loading Character %d failed\n", i);
      exit(EXIT_FAILURE);
      }

    // If the width will be over max texture width
    // Go to next row
    if (row_w + g->bitmap.width + 1 >= MAX_WIDTH)
      {
      w = std::max(w, row_w);
      h += row_h;
      row_w = 0;
      row_h = 0;
      }
    row_w += g->bitmap.width + 1;
    row_h = std::max<unsigned int>(row_h, g->bitmap.rows);
    }

  // final texture dimensions
  w = std::max(row_w, w);
  h += row_h;

  atlas_width = w;
  atlas_height = h;

  uint8_t* raw_bitmap = new uint8_t[w * h];

  // Fill texture with glyph bitmaps and cache placements
  int offset_x = 0;
  int offset_y = 0;
  row_h = 0;

  for (i = 32; i < 128; ++i)
    {
    if (FT_Load_Char(_face, i, FT_LOAD_RENDER))
      {
      printf("Loading Character %d failed\n", i);
      exit(EXIT_FAILURE);
      }

    // Set correct row
    if (offset_x + g->bitmap.width + 1 >= MAX_WIDTH)
      {
      offset_y += row_h;
      row_h = 0;
      offset_x = 0;
      }

    // fill raw bitmap with glyph
    for (unsigned int y = 0; y < g->bitmap.rows; ++y)
      {
      const unsigned char* p_bitmap = g->bitmap.buffer + y * g->bitmap.width;
      uint8_t* p_tex = raw_bitmap + (y + offset_y)*w + offset_x;
      for (unsigned int x = 0; x < g->bitmap.width; ++x)
        {
        *p_tex++ = *p_bitmap++;
        }
      }

    // Cache values
    char_info[i].ax = g->advance.x >> 6;
    char_info[i].ay = g->advance.y >> 6;
    char_info[i].bw = g->bitmap.width;
    char_info[i].bh = g->bitmap.rows;
    char_info[i].bl = g->bitmap_left;
    char_info[i].bt = g->bitmap_top;
    char_info[i].tx = offset_x / (float)w;
    char_info[i].ty = offset_y / (float)h;

    // Update current position
    row_h = std::max<unsigned int>(row_h, g->bitmap.rows);
    offset_x += g->bitmap.width + 1;
    }

  atlas_texture_id = engine->add_texture(w, h, RenderDoos::texture_format_r8ui, (const uint8_t*)raw_bitmap, TEX_USAGE_READ | TEX_USAGE_RENDER_TARGET);
  delete[] raw_bitmap;
  }

void font_material::compile(RenderDoos::render_engine* engine)
  {
  if (engine->get_renderer_type() == RenderDoos::renderer_type::METAL)
    {
    vs_handle = engine->add_shader(nullptr, SHADER_VERTEX, "font_material_vertex_shader");
    fs_handle = engine->add_shader(nullptr, SHADER_FRAGMENT, "font_material_fragment_shader");
    }
  else if (engine->get_renderer_type() == RenderDoos::renderer_type::OPENGL)
    {
    vs_handle = engine->add_shader(get_font_material_vertex_shader().c_str(), SHADER_VERTEX, nullptr);
    fs_handle = engine->add_shader(get_font_material_fragment_shader().c_str(), SHADER_FRAGMENT, nullptr);
    }
  shader_program_handle = engine->add_program(vs_handle, fs_handle);
  width_handle = engine->add_uniform("width", RenderDoos::uniform_type::integer, 1);
  height_handle = engine->add_uniform("height", RenderDoos::uniform_type::integer, 1);
  _init_font(engine);
  }

void font_material::bind(RenderDoos::render_engine* engine)
  {
  engine->set_blending_enabled(true);
  engine->set_blending_function(RenderDoos::blending_type::src_alpha, RenderDoos::blending_type::one_minus_src_alpha);
  engine->set_blending_equation(RenderDoos::blending_equation_type::add);

  engine->bind_program(shader_program_handle);

  engine->set_uniform(width_handle, (void*)&atlas_width);
  engine->set_uniform(height_handle, (void*)&atlas_height);
  
  engine->bind_texture_to_channel(atlas_texture_id, 0, TEX_FILTER_NEAREST | TEX_WRAP_REPEAT);

  engine->bind_uniform(shader_program_handle, width_handle);
  engine->bind_uniform(shader_program_handle, height_handle);
  }

void font_material::destroy(RenderDoos::render_engine* engine)
  {
  engine->remove_shader(vs_handle);
  engine->remove_shader(fs_handle);
  engine->remove_program(shader_program_handle);
  engine->remove_uniform(width_handle);
  engine->remove_uniform(height_handle);
  engine->remove_geometry(geometry_id);
  }

namespace
  {
  text_vert_t make_text_vert(float x, float y, float s, float t, float r, float g, float b)
    {
    text_vert_t out;
    out.x = x;
    out.y = y;
    out.s = s;
    out.t = t;
    out.r = r;
    out.g = g;
    out.b = b;
    return out;
    }
  }

void font_material::render_text(RenderDoos::render_engine* engine, const char* text, float x, float y, float sx, float sy, uint32_t clr)
  {
  if (geometry_id >= 0)
    engine->remove_geometry(geometry_id);

  const float x_orig = x;

  std::vector<text_vert_t> verts(6 * strlen(text));
  int n = 0;

  char_info_t* c = char_info;

  float red = (clr & 255)/255.f;
  float green = ((clr>>8) & 255) / 255.f;
  float blue = ((clr>>16) & 255) / 255.f;

  const char* p;
  for (p = text; *p; ++p)
    {
    if (*p == 10)
      {
      y -= c['@'].bh * sy;
      x = x_orig;
      continue;
      }

    float x2 = x + c[*p].bl * sx;
    float y2 = -y - c[*p].bt * sy;
    float w = c[*p].bw * sx;
    float h = c[*p].bh * sy;

    // Advance cursor to start of next char
    x += c[*p].ax * sx;
    y += c[*p].ay * sy;

    // Skip 0 pixel glyphs
    if (!w || !h)
      continue;

    verts[n++] = (text_vert_t)make_text_vert(x2, -y2, c[*p].tx, c[*p].ty, red, green, blue);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / atlas_width, c[*p].ty, red, green, blue);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / atlas_height, red, green, blue);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / atlas_width, c[*p].ty, red, green, blue);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / atlas_height, red, green, blue);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2 - h, c[*p].tx + c[*p].bw / atlas_width, c[*p].ty + c[*p].bh / atlas_height, red, green, blue);
    }

  geometry_id = engine->add_geometry(VERTEX_2_2_3);

  text_vert_t* vp;
  uint32_t* ip;

  engine->geometry_begin(geometry_id, verts.size(), verts.size()*6, (float**)&vp, (void**)&ip);
  memcpy(vp, verts.data(), sizeof(float)*7*verts.size());
  for (uint32_t i = 0; i < verts.size(); ++i)
    {
    *ip++ = i * 6;
    *ip++ = i * 6 + 1;
    *ip++ = i * 6 + 2;
    *ip++ = i * 6 + 3;
    *ip++ = i * 6 + 4;
    *ip++ = i * 6 + 5;
    }
  engine->geometry_end(geometry_id);
  engine->geometry_draw(geometry_id);
  }

void font_material::get_render_size(float& width, float& height, const char* text, float sx, float sy)
  {
  char_info_t* c = char_info;
  float x = 0.f;
  float y = 0.f;

  width = 0.f;
  height = 0.f;
  
  const char* p;
  for (p = text; *p; ++p)
    {
    if (*p == 10)
      {
      y -= c['@'].bh * sy;
      x = 0.f;
      continue;
      }

    float x2 = x + c[*p].bl * sx;
    float y2 = -y - c[*p].bt * sy;
    float w = c[*p].bw * sx;
    float h = c[*p].bh * sy;

    // Advance cursor to start of next char
    x += c[*p].ax * sx;
    y += c[*p].ay * sy;

    // Skip 0 pixel glyphs
    if (!w || !h)
      continue;

    width = std::max<float>(width, std::abs(x2));
    width = std::max<float>(width, std::abs(x2 + w));
    height = std::max<float>(height, std::abs(y2));
    height = std::max<float>(height, std::abs(y2 + h));
    }
  }
