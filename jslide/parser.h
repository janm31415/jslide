#pragma once

#include "tokenizer.h"
#include "image_helper.h"
#include "video_reader.h"
#include "colors.h"

#include "jtk/vec.h"

#include <variant>
#include <string>

enum class alignment
  {
  T_LEFT,
  T_CENTER,
  T_RIGHT
  };

enum class language
  {
  T_ASM,
  T_BASIC,
  T_BATCH,
  T_C,
  T_CPP,
  T_CS,
  T_CMAKE,
  T_FORTRAN,
  T_HTML,
  T_JAVA,
  T_JSON,
  T_JS,
  T_LISP,
  T_LUA,
  T_METAL,
  T_OBJECTIVE_C,
  T_PASCAL,
  T_PYTHON,
  T_RUBY,
  T_RUST,
  T_SCHEME,
  T_SWIFT,
  T_XML,
  T_MATH
  };

enum class textsize
  {
  T_NORMAL,
  T_SMALL,
  T_LARGE,
  T_TINY,
  T_HUGE
  };

enum class transfer_animation
  {
  T_NONE,
  T_FADE,
  T_DIA,
  T_SPLIT,
  T_ZOOM,
  T_ITERATE
  };

enum class movie_speed
  {
  T_SPEED_NORMAL,
  T_SPEED_TIMES_TWO,
  T_SPEED_TIMES_FOUR,
  T_SPEED_TIMES_EIGHT,
  T_SPEED_TIMES_HALF,
  T_SPEED_THIRTY
  };
  
  
enum class movie_loop
  {
  T_NOREPEAT,
  T_REPEAT
  };

enum class image_orientation
  {
  T_ORIENTATION_NORMAL,
  T_ORIENTATION_90DEG,
  T_ORIENTATION_180DEG,
  T_ORIENTATION_270DEG
  };
  
enum class shader_visibility
  {
  T_SHADER_VISIBILITY_FULL,
  T_SHADER_VISIBILITY_HALF,
  T_SHADER_VISIBILITY_QUARTER,
  T_SHADER_VISIBILITY_EIGHTH
  };

std::string language_to_extension(language l);

void throw_parse_error(int line_nr, int col_nr, const std::string& message);

struct ActiveAttributes
  {
  alignment e_alignment = alignment::T_CENTER;
  language e_language = language::T_CPP;
  code_block_colors code_color_scheme;
  jtk::vec3<float> color = jtk::vec3<float>(1, 1, 1);
  textsize e_textsize = textsize::T_NORMAL;
  transfer_animation e_transfer_animation = transfer_animation::T_FADE;
  movie_speed e_movie_speed = movie_speed::T_SPEED_NORMAL;
  movie_loop e_movie_loop = movie_loop::T_NOREPEAT;
  image_orientation e_image_orientation = image_orientation::T_ORIENTATION_NORMAL;
  shader_visibility e_shader_visibility = shader_visibility::T_SHADER_VISIBILITY_FULL;
  };

int get_textsize(const ActiveAttributes& attrib);

struct Text
  {
  std::vector<std::pair<std::string, ActiveAttributes>> words;
  int mask = 0;
  };

struct Title
  {
  Text text;
  int size;
  };

struct Line
  {
  ActiveAttributes attrib;
  };

struct Image
  {
  std::string path;
  float w,h;
  int link_to_image = -1;
  image im;
  VideoReaderState video;
  ActiveAttributes attrib;
  };

typedef std::variant<Text, Title, Line, Image> Expression;

class Block
  {
  public:
    float top, bottom, left, right;
    Expression expr;    
  };

class Slide
  {
  public:
    std::string shader;
    std::vector<Block> blocks;
    bool reset_shaders = true;
    ActiveAttributes attrib;
  };

class Presentation
  {
  public:
    std::vector<Slide> slides;
  };

Presentation make_presentation(tokens& tokes);

void destroy_presentation(Presentation& p);
