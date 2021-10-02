#include "colors.h"


std::map<std::string, jtk::vec3<float>> get_color_map()
  {
  std::map<std::string, jtk::vec3<float>> m;

  m[".black"] = jtk::vec3<float>(0, 0, 0);
  m[".blue"] = jtk::vec3<float>(0, 0, 1);
  m[".cyan"] = jtk::vec3<float>(0, 1, 1);
  m[".gray"] = jtk::vec3<float>(0.5, 0.5, 0.5);
  m[".green"] = jtk::vec3<float>(0, 1, 0);
  m[".orange"] = jtk::vec3<float>(1, 0.5f, 0);
  m[".purple"] = jtk::vec3<float>(1, 0, 1);
  m[".red"] = jtk::vec3<float>(1, 0, 0);  
  m[".white"] = jtk::vec3<float>(1, 1, 1);
  m[".yellow"] = jtk::vec3<float>(1, 1, 0);

  return m;
  }

code_block_colors dracula_colors()
  {
  code_block_colors c;
  c.text = 0xfff2f8f8;
  c.comment = 0xffa47262;
  c.string = 0xff8cfaf1;
  c.keyword = 0xffc679ff;
  c.keyword_2 = 0xfff993bd;
  return c;
  }

code_block_colors solarized_colors()
  {
  code_block_colors c;
  c.text = 0xff625b47;
  c.comment = 0xff058a72;
  c.string = 0xff1237bd;
  c.keyword = 0xffc77621;
  c.keyword_2 = 0xff6f1bc6;
  return c;
  }

code_block_colors solarized_dark_colors()
  {
  code_block_colors c;
  c.text = 0xff909081;
  c.comment = 0xff058a72;
  c.string = 0xff1237bd;
  c.keyword = 0xffc77621;
  c.keyword_2 = 0xff6f1bc6;
  return c;
  }

code_block_colors tomorrow_night_colors()
  {
  code_block_colors c;
  c.text = 0xffc6c8c5;
  c.comment = 0xff969896;
  c.string = 0xff5f93de;
  c.keyword = 0xffbb94b2;
  c.keyword_2 = 0xffb7be8a;
  return c;
  }

code_block_colors tomorrow_colors()
  {
  code_block_colors c;
  c.text = 0xff4c4d4d;
  c.comment = 0xff8c908e;
  c.string = 0xff1f87f5;
  c.keyword = 0xffa85989;
  c.keyword_2 = 0xffae7142;
  return c;
  }

code_block_colors gruvbox_colors()
  {
  code_block_colors c;
  c.text = 0xffb2dbeb;
  c.comment = 0xff748392;
  c.string = 0xff26bbb8;
  c.keyword = 0xff3449fb;
  c.keyword_2 = 0xff7cc08e;
  return c;
  }

code_block_colors gruvbox_light_colors()
  {
  code_block_colors c;
  c.text = 0xff36383c;
  c.comment = 0xff748392;
  c.string = 0xff0e7479;
  c.keyword = 0xff06009d;
  c.keyword_2 = 0xff587b42;
  return c;
  }

code_block_colors acme_colors()
  {
  code_block_colors c;
  c.text = 0xff000000;
  c.comment = 0xff036206;
  c.string = 0xff1104ae;
  c.keyword = 0xffff0000;
  c.keyword_2 = 0xffff8080;
  return c;
  }

code_block_colors dark_colors()
  {
  code_block_colors c;
  c.text = 0xffc0c0c0;
  c.comment = 0xff64c385;
  c.string = 0xff6464db;
  c.keyword = 0xffff8080;
  c.keyword_2 = 0xffffc0c0;
  return c;
  }

code_block_colors matrix_colors()
  {
  code_block_colors c;
  c.text = 0xff5bed08;
  c.comment = 0xff006f00;
  c.string = 0xff00de89;
  c.keyword = 0xff63ac00;
  c.keyword_2 = 0xff90ff46;
  return c;
  }

code_block_colors light_colors()
  {
  code_block_colors c;
  c.text = 0xff5e5146;
  c.comment = 0xff87bda0;
  c.string = 0xff7168c4;
  c.keyword = 0xff6784d2;
  c.keyword_2 = 0xffb494ba;
  return c;
  }