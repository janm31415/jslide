#pragma once
#include <glew/GL/glew.h>
#include <SDL.h>
#include <SDL_opengl.h>
#include <string>
#include <chrono>
#include <array>
#include <memory>

#include "keyboard.h"

#include "settings.h"
#include "mouse_data.h"
#include "blit_gl.h"

struct ImGuiInputTextCallbackData;

class view
  {
  public:
    view(int argc, char** argv);
    ~view(); 

    void loop();
    int script_window_callback(ImGuiInputTextCallbackData* data);

  private:
    void _poll_for_events();
    void _imgui_ui();
    void _setup_blit_gl_objects(bool fullscreen);
    void _setup_gl_objects();
    void _log_window();
    void _script_window();
    void _destroy_gl_objects();
    void _destroy_blit_gl_objects();
    void _prepare_render();
    void _save();
    void _load(const std::string& filename);
    bool _ctrl_pressed();

  private:
    SDL_Window* _window;    
    uint32_t _w, _h, _viewport_w, _viewport_h, _viewport_pos_x, _viewport_pos_y, _max_w, _max_h, _windowed_w, _windowed_h;
    bool _quit;
    settings _settings;    
    blit_t* _blit_gl_state;
    mouse_data _md;    
    std::string _script;    
    int _line_nr, _col_nr;
    std::string _current_filename;
    keyboard_handler _keyb;
  };
