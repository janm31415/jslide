#pragma once

#include "tokenizer.h"
#include "image_helper.h"

#include "jtk/vec.h"

#include <variant>
#include <string>

enum class alignment
  {
  T_LEFT,
  T_CENTER,
  T_RIGHT
  };

void throw_parse_error(int line_nr, int col_nr, const std::string& message);

struct ActiveAttributes
  {
  alignment e_alignment = alignment::T_CENTER;
  jtk::vec3<float> color = jtk::vec3<float>(1, 1, 1);
  };

struct Text
  {
  std::vector<std::pair<std::string, ActiveAttributes>> words;
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
  };

class Presentation
  {
  public:
    std::vector<Slide> slides;
  };

Presentation make_presentation(tokens& tokes);