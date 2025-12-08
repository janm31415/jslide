#pragma once

#include <string>

struct settings
  {
  std::string file_open_folder;
  bool log_window;
  bool script_window;
  bool fullscreen; 
  bool crt_effect;
  bool show_mouse;
  int mouse_type;
  std::string current_script;
  };

settings read_settings(const char* filename);

void write_settings(const settings& s, const char* filename);
