#pragma once

#include <string>

struct image
  {
  unsigned char* im;
  int w, h, nr_of_channels;

  image();
  ~image();
  image(const image& other);
  image& operator = (const image& other);
  void swap(image& other);
  };

image dummy_image();

bool read_image(image& im, const std::string& filename);
