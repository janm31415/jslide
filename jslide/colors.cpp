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