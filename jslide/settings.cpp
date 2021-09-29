#include "settings.h"

#include "pref_file.h"


settings read_settings(const char* filename)
  {
  settings s;
  s.fullscreen = false;
  s.log_window = true; 
  s.script_window = true;
  s.controls = true;
  s.working_folder = "";
  s.scandata_folder = "";
  s.depth_calibration_name = "";
  s.color_calibration_name = "";
  s.color_image_name = "";
  s.depth_image_name = "";
  s.confidence_image_name = "";
  s.camera_pose_name = "";
  pref_file f(filename, pref_file::READ);
  f["file_open_folder"] >> s.file_open_folder;
  f["log_window"] >> s.log_window;
  f["script_window"] >> s.script_window;
  f["controls"] >> s.controls;
  f["fullscreen"] >> s.fullscreen;
  f["working_folder"] >> s.working_folder;
  f["scandata_folder"] >> s.scandata_folder;
  f["depth_calibration_name"] >> s.depth_calibration_name;
  f["color_calibration_name"] >> s.color_calibration_name;
  f["color_image_name"] >> s.color_image_name;
  f["depth_image_name"] >> s.depth_image_name;
  f["confidence_image_name"] >> s.confidence_image_name;
  f["camera_pose_name"] >> s.camera_pose_name;
  return s;
  }

void write_settings(const settings& s, const char* filename)
  {
  pref_file f(filename, pref_file::WRITE);
  f << "file_open_folder" << s.file_open_folder;
  f << "script_window" << s.script_window;
  f << "controls" << s.controls;
  f << "fullscreen" << s.fullscreen;
  f << "working_folder" << s.working_folder;
  f << "scandata_folder" << s.scandata_folder;
  f << "depth_calibration_name" << s.depth_calibration_name;
  f << "color_calibration_name" << s.color_calibration_name;
  f << "color_image_name" << s.color_image_name;
  f << "depth_image_name" << s.depth_image_name;
  f << "confidence_image_name" << s.confidence_image_name;
  f << "camera_pose_name" << s.camera_pose_name;
  f.release();
  }
