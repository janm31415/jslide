#pragma once

#include "tokenizer.h"

#include <variant>

enum alignment
  {
  T_LEFT,
  T_CENTER,
  T_RIGHT
  };

class Text
  {
  public:
    alignment e_alignment;
    std::string value;
  };

class Title
  {
  public:
    Text text;
    int size;
  };

typedef std::variant<Text, Title> Expression;

class Block
  {
  public:
    float top, bottom, left, right;
    Expression expr;
  };

class Slide
  {
  public:
    std::vector<Block> blocks;
  };

class Presentation
  {
  public:
    std::vector<Slide> slides;
  };

Presentation make_presentation(tokens& tokes);