#pragma once

#include "tokenizer.h"
#include "image_helper.h"
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
  T_XML
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
  T_ZOOM
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