#pragma once

#include <map>
#include <string>

#include "jtk/vec.h"


std::map<std::string, jtk::vec3<float>> get_color_map();

struct code_block_colors
  {
  uint32_t text = 0xfff2f8f8;
  uint32_t comment = 0xffa47262;
  uint32_t string = 0xff8cfaf1;
  uint32_t keyword = 0xffc679ff;
  uint32_t keyword_2 = 0xfff993bd;
  };

code_block_colors dracula_colors();
code_block_colors solarized_colors();
code_block_colors solarized_dark_colors();
code_block_colors tomorrow_night_colors();
code_block_colors tomorrow_colors();
code_block_colors gruvbox_colors();
code_block_colors gruvbox_light_colors();
code_block_colors acme_colors();
code_block_colors dark_colors();
code_block_colors matrix_colors();
code_block_colors light_colors();