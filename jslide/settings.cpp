#include "settings.h"

#include "pref_file.h"


settings read_settings(const char* filename)
  {
  settings s;
  s.fullscreen = false;
  s.log_window = true; 
  s.script_window = true; 
  s.crt_effect = true;
  pref_file f(filename, pref_file::READ);
  f["file_open_folder"] >> s.file_open_folder;
  f["log_window"] >> s.log_window;
  f["script_window"] >> s.script_window;
  f["crt_effect"] >> s.crt_effect;
  return s;
  }

void write_settings(const settings& s, const char* filename)
  {
  pref_file f(filename, pref_file::WRITE);
  f << "file_open_folder" << s.file_open_folder;
  f << "script_window" << s.script_window;
  f << "crt_effect" << s.crt_effect;
  f.release();
  }
