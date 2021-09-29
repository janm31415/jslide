#pragma once

#include "../jtk/jtk/image.h"

jtk::image<uint32_t> read_image(const std::string& filename);

jtk::image<uint8_t> read_image_gray(const std::string& filename);