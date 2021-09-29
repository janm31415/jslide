#pragma once

#include <string>

struct settings
  {
  std::string file_open_folder;
  bool log_window;
  bool script_window;
  bool controls;
  bool fullscreen;
  std::string working_folder;
  std::string scandata_folder;
  std::string depth_calibration_name;
  std::string color_calibration_name;
  std::string color_image_name;
  std::string depth_image_name;
  std::string confidence_image_name;
  std::string camera_pose_name;
  };

settings read_settings(const char* filename);

void write_settings(const settings& s, const char* filename);
