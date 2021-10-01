#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <utility>
#include <vector>
#include "font_gl.h"
#include "shaders.h"

#include <ft2build.h>
#include FT_FREETYPE_H

#define MAX_WIDTH 2048 // Maximum texture width on pi

void create_font_program(font_t* state)
  {
  using namespace jtk;
  std::string font_vertex_shader = get_font_vertex_shader();
  std::string font_fragment_shader = get_font_fragment_shader();

  state->program.add_shader_from_source(shader::shader_type::Vertex, font_vertex_shader);
  state->program.add_shader_from_source(shader::shader_type::Fragment, font_fragment_shader);
  state->program.link();


  // Get coord attribute location
  state->coord_location = state->program.attribute_location("coord");
  // Get color attribute location
  state->color_location = state->program.attribute_location("color");

  // Enable blend
  //glEnable(GL_BLEND);
  //glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

  state->program.release();
  }

void create_font_buffers(font_t* state)
  {
  using namespace jtk;
  state->vao.create();
  state->vao.bind();

  state->vbo = buffer_object(GL_ARRAY_BUFFER);
  state->vbo.create();
  state->vbo.bind();
  state->vbo.set_usage_pattern(GL_STREAM_DRAW);

  state->vao.release();
  state->vbo.release();
  }

// Create font atlas texture
void create_font_atlas(font_t* state)
  {
  // Get atlas dimensions
  FT_GlyphSlot g = state->face->glyph;
  int w = 0; // full texture width
  int h = 0; // full texture height
  int row_w = 0; // current row width
  int row_h = 0; // current row height

  int i;
  for (i = 32; i < 128; i++) {
    if (FT_Load_Char(state->face, i, FT_LOAD_RENDER)) {
      printf("Loading Character %d failed\n", i);
      exit(EXIT_FAILURE);
      }

    // If the width will be over max texture width
    // Go to next row
    if (row_w + g->bitmap.width + 1 >= MAX_WIDTH) {
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

  state->atlas_width = w;
  state->atlas_height = h;

  state->tex.bind_to_channel(0);
  state->tex.create_empty(w, h, 1, jtk::texture::pixel_type::byte);
  state->tex.set_filter_mode(GL_NEAREST);  

  // Fill texture with glyph bitmaps and cache placements
  char_info_t* char_info = state->char_info;
  int offset_x = 0;
  int offset_y = 0;
  row_h = 0;

  for (i = 32; i < 128; i++) {
    if (FT_Load_Char(state->face, i, FT_LOAD_RENDER)) {
      printf("Loading Character %d failed\n", i);
      exit(EXIT_FAILURE);
      }

    // Set correct row
    if (offset_x + g->bitmap.width + 1 >= MAX_WIDTH) {
      offset_y += row_h;
      row_h = 0;
      offset_x = 0;
      }
    
    unsigned char* alpha = g->bitmap.buffer;
    for (int k = 0; k < g->bitmap.width*g->bitmap.rows; ++k)
      {
      if (*alpha < 255)
        *alpha = 0;
      ++alpha;
      }
    
    state->tex.load_from_pixels((GLubyte*)g->bitmap.buffer, offset_x, offset_y, g->bitmap.width, g->bitmap.rows, 1, jtk::texture::pixel_type::byte);

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
  state->tex.release();
  }

inline text_vert_t make_text_vert(GLfloat x, GLfloat y, GLfloat s, GLfloat t, GLfloat r, GLfloat g, GLfloat b)
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

void get_render_size(float& width, float& height, font_t* state, const char* text, float sx, float sy)
  {
  char_info_t* c = state->char_info;

  float x = 0.f;
  float y = 0.f;

  width = 0.f;
  height = 0.f;

  const char* p;
  for (p = text; *p; p++) {
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
    /*
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2, c[*p].tx, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2 - h, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    */
    }
  }

// Render single string
// Assumes arrays and program already steup
void render_text(font_t* state, const char* text, float x, float y, float sx, float sy, const jtk::vec3<float>& color)
  {
  state->program.bind();
  jtk::gl_check_error("state->program.bind();");
  state->vao.bind();
  jtk::gl_check_error("state->vao.bind();");
  state->vbo.bind();
  jtk::gl_check_error("state->vbo.bind();");
  state->program.set_attribute_buffer(state->coord_location, GL_FLOAT, 0, 4, 7*sizeof(GLfloat));
  jtk::gl_check_error("state->program.set_attribute_buffer");
  state->program.set_attribute_buffer(state->color_location, GL_FLOAT, 4 * sizeof(GLfloat), 3, 7 * sizeof(GLfloat));
  jtk::gl_check_error("state->program.set_attribute_buffer");
  state->tex.bind_to_channel(0);
  state->program.set_uniform_value("tex", 0);  
  state->program.enable_attribute_array(state->coord_location);
  state->program.enable_attribute_array(state->color_location);

  // Blend is required to show cleared color when the frag shader draws transparent pixels
  glEnable(GL_BLEND);
  glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

  //sx = 2.f / state->screen_width;
  //sy = 2.f / state->screen_height;

  std::vector<text_vert_t> verts(6 * strlen(text));

  int n = 0;

  char_info_t* c = state->char_info;

  const char* p;
  for (p = text; *p; p++) {
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

    verts[n++] = (text_vert_t)make_text_vert(x2, -y2, c[*p].tx, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2 - h, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty + c[*p].bh / state->atlas_height, color[0], color[1], color[2]);
    }

  state->vbo.allocate(NULL, n * sizeof(text_vert_t));
  state->vbo.allocate(verts.data(), n * sizeof(text_vert_t));

  // Draw text
  glDrawArrays(GL_TRIANGLES, 0, n);
  jtk::gl_check_error("glDrawArrays");
  state->program.release();
  state->vao.release();
  state->vbo.release();
  }

// Add text coordinates to be rendered later
// This allows multiple strings to be rendered with a single buffer and draw
int add_text_coords(font_t* state, char* text, text_vert_t* verts, float* color, float x, float y, float sx, float sy)
  {
  int n = 0;

  char_info_t* c = state->char_info;

  float r = color[0];
  float g = color[1];
  float b = color[2];

  char* p;
  for (p = text; *p; p++) {
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

    verts[n++] = (text_vert_t)make_text_vert(x2, -y2, c[*p].tx, c[*p].ty, r, g, b);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, r, g, b);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, r, g, b);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty, r, g, b);
    verts[n++] = (text_vert_t)make_text_vert(x2, -y2 - h, c[*p].tx, c[*p].ty + c[*p].bh / state->atlas_height, r, g, b);
    verts[n++] = (text_vert_t)make_text_vert(x2 + w, -y2 - h, c[*p].tx + c[*p].bw / state->atlas_width, c[*p].ty + c[*p].bh / state->atlas_height, r, g, b);
    }

  return n;
  }


// Setup freetype font
void init_font(font_t* state, int screen_width, int screen_height)
  {
  using namespace jtk;
  // Initialize FreeType library
  if (FT_Init_FreeType(&state->ft)) {
    printf("Error initializing FreeType library\n");
    exit(EXIT_FAILURE);
    }

  state->screen_width = screen_width;
  state->screen_height = screen_height;

  //if (FT_New_Face(state->ft, "data/Karla-Regular.ttf", 0, &state->face)) {
  //if (FT_New_Face(state->ft, "data/MorePerfectDOSVGA.ttf", 0, &state->face)) {
  if (FT_New_Face(state->ft, "data/LessPerfectDOSVGA.ttf", 0, &state->face)) {
    printf("Error loading font face\n");
    exit(EXIT_FAILURE);
    }

  // Set pixel size
  FT_Set_Pixel_Sizes(state->face, 0, 48);

  // Setup OpenGL
  create_font_program(state);
  gl_check_error("create_font_program(state);");
  create_font_buffers(state);
  gl_check_error("create_font_buffers(state);");
  create_font_atlas(state);
  gl_check_error("create_font_atlas(state);");
  }

void destroy_font(font_t* state)
  {
  FT_Done_Face(state->face);
  FT_Done_FreeType(state->ft);
  state->program.remove_all_shaders();
  }
