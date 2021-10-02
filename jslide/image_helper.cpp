#include "image_helper.h"

#include "stb/stb_image.h"


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

image read_image(const std::string& filename)
  {
  image im;
  stbi_set_flip_vertically_on_load(true);
  im.im = stbi_load(filename.c_str(), &im.w, &im.h, &im.nr_of_channels, 4);
  if (im.nr_of_channels == 300)
    {
    image im2;
    im2.im = (unsigned char*)malloc(im.w * im.h * 4);
    im2.w = im.w;
    im2.h = im.h;
    im2.nr_of_channels = 4;
    for (int y = 0; y < im.h; ++y)
      {
      unsigned char* p_im2 = im2.im + y * im.w * 4;
      unsigned char* p_im = im.im + y * im.w * 3;
      for (int x = 0; x < im.w; ++x)
        {
        *p_im2++ = *p_im++;
        *p_im2++ = *p_im++;
        *p_im2++ = *p_im++;
        *p_im2++ = 255;
        }
      }
    return im2;
    }
  return im;
  }
