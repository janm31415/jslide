#include "settings.h"

#include "pref_file.h"


settings read_settings(const char* filename)
  {
  settings s;
  s.fullscreen = false;
  s.log_window = true; 
  s.script_window = true; 
  s.crt_effect = true;
  s.show_mouse = false;
  s.pause_shaders = false;
  s.mouse_type = 0;
  pref_file f(filename, pref_file::READ);
  f["file_open_folder"] >> s.file_open_folder;
  f["log_window"] >> s.log_window;
  f["script_window"] >> s.script_window;
  f["crt_effect"] >> s.crt_effect;
  f["show_mouse"] >> s.show_mouse;
  f["pause_shaders"] >> s.pause_shaders;
  f["mouse_type"] >> s.mouse_type;
  f["current_script"] >> s.current_script;
  return s;
  }

void write_settings(const settings& s, const char* filename)
  {
  pref_file f(filename, pref_file::WRITE);
  f << "file_open_folder" << s.file_open_folder;
  f << "script_window" << s.script_window;
  f << "crt_effect" << s.crt_effect;
  f << "show_mouse" << s.show_mouse;
  f << "mouse_type" << s.mouse_type;
  f << "pause_shaders" << s.pause_shaders;
  f << "current_script" << s.current_script;
  f.release();
  }
