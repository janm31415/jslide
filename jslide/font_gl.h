#pragma once

#include "utils_gl.h"

#include <ft2build.h>
#include FT_FREETYPE_H

typedef struct text_vert_t {
    GLfloat x;
    GLfloat y;
    GLfloat s;
    GLfloat t;
    GLfloat r;
    GLfloat g;
    GLfloat b;      
} text_vert_t;

// Structure to hold cache glyph information
typedef struct char_info_t {
    float ax; // advance.x
    float ay; // advance.y

    float bw; // bitmap.width
    float bh; // bitmap.height

    float bl; // bitmap left
    float bt; // bitmap top

    float tx; // x offset of glyph in texture coordinates
    float ty; // y offset of glyph in texture coordinates
} char_info_t;

typedef struct font_t
{
    FT_Library ft;
    FT_Face face;

    jtk::shader_program program;

    // Program locations
    GLint coord_location;
    GLint color_location;
        
    jtk::texture tex;

    jtk::vertex_array_object vao;
    jtk::buffer_object vbo;

    int screen_width;
    int screen_height;
    
    // Font atlas
    char_info_t char_info[128];
    int atlas_width;
    int atlas_height;
} font_t;

void create_font_program(font_t *state);
void create_font_buffers(font_t *state);
void create_font_atlas(font_t *state);
void init_font(font_t *state, int screen_width, int screen_height);
int add_text_coords(font_t *state, char *text, text_vert_t* verts, float *color, float x, float y, float sx, float sy);
void render_text(font_t* state, const char* text, float x, float y, float sx, float sy);

void destroy_font(font_t* state);