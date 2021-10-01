#pragma once

#include "tokenizer.h"

#include "jtk/vec.h"

#include <variant>

enum class alignment
  {
  T_LEFT,
  T_CENTER,
  T_RIGHT
  };

struct ActiveAttributes
  {
  alignment e_alignment = alignment::T_CENTER;
  jtk::vec3<float> color = jtk::vec3<float>(1,1,1);
  };

class Text
  {
  public:
    std::vector<std::pair<std::string, ActiveAttributes>> words;    
  };

class Title
  {
  public:
    Text text;
    int size;
  };

struct Line
  {
  ActiveAttributes attrib;
  };

typedef std::variant<Text, Title, Line> Expression;

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
  };

class Presentation
  {
  public:
    std::vector<Slide> slides;
  };

Presentation make_presentation(tokens& tokes);