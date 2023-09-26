#include "image_helper.h"

#include "stb/stb_image.h"

#include <string.h>


image::image() : im(nullptr), w(0), h(0), nr_of_channels(0)
  {
  }

image::~image()
  {
  stbi_image_free(im);
  im = nullptr;
  w = 0;
  h = 0;
  nr_of_channels = 0;
  }

image::image(const image& other) : w(other.w), h(other.h), nr_of_channels(other.nr_of_channels)
  {
  im = (unsigned char*)malloc(w * h * nr_of_channels);
  memcpy(im, other.im, w * h * nr_of_channels);
  }

image& image::operator = (const image& other)
  {
  image temp(other);
  swap(temp);
  return *this;
  }

void image::swap(image& other)
  {
  std::swap(w, other.w);
  std::swap(h, other.h);
  std::swap(nr_of_channels, other.nr_of_channels);
  std::swap(im, other.im);
  }

image dummy_image()
  {
  image im;
  im.w = 256;
  im.h = 256;
  im.im = (unsigned char*)malloc(im.w*im.h*4);
  im.nr_of_channels = 4;
  unsigned char* p_im = im.im;
  for (int y = 0; y < im.h; ++y)
    {
    for (int x = 0; x < im.w; ++x)
      {
      if (((x/16)&1) == ((y/16)&1))
        {
        *p_im++ = 255;
        *p_im++ = 255;
        *p_im++ = 255;
        *p_im++ = 255;
        }
      else
        {
        *p_im++ = 255;
        *p_im++ = 0;
        *p_im++ = 0;
        *p_im++ = 0;
        }
      }
    }
  return im;
  }

bool read_image(image& im, const std::string& filename)
  {
  stbi_set_flip_vertically_on_load(true);
  im.im = stbi_load(filename.c_str(), &im.w, &im.h, &im.nr_of_channels, 4);
  im.nr_of_channels = 4;
  if (im.im == nullptr)
    {
    im = dummy_image();
    return false;
    }
  return true;
  }
