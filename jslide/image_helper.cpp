#include "image_helper.h"

//#include "jtk/jtk/file_utils.h"
#include "stb/stb_image.h"

jtk::image<uint32_t> read_image(const std::string& filename)
  {
  int w, h, nr_of_channels;
  unsigned char* im = stbi_load(filename.c_str(), &w, &h, &nr_of_channels, 4);
  if (!im || nr_of_channels != 4)
    return jtk::image<uint32_t>();
  jtk::image<uint32_t> out(w, h);
  const unsigned char* p_im = im;
  for (uint32_t y = 0; y < (uint32_t)h; ++y)
    {
    unsigned char* p_out = (unsigned char*)(out.data() + y * out.stride());
    for (uint32_t x = 0; x < (uint32_t)w; ++x)
      {
      *p_out++ = *p_im++;
      *p_out++ = *p_im++;
      *p_out++ = *p_im++;
      *p_out++ = *p_im++;
      }
    }
  stbi_image_free(im);
  return out;
  }

jtk::image<uint8_t> read_image_gray(const std::string& filename)
  {
  int w, h, nr_of_channels;
  unsigned char* im = stbi_load(filename.c_str(), &w, &h, &nr_of_channels, 1);
  if (!im)
    return jtk::image<uint8_t>();
  jtk::image<uint8_t> out(w, h);
  const unsigned char* p_im = im;
  for (uint32_t y = 0; y < (uint32_t)h; ++y)
    {
    unsigned char* p_out = (unsigned char*)(out.data() + y * out.stride());
    for (uint32_t x = 0; x < (uint32_t)w; ++x)
      {
      *p_out++ = *p_im++;     
      }
    }
  stbi_image_free(im);
  return out;
  }