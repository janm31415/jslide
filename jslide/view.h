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
#include "slide_gl.h"
#include "transfer_gl.h"

#include "parser.h"

struct ImGuiInputTextCallbackData;

struct transfer_slides_data
  {
  uint32_t slide_id_1, slide_id_2;
  float time = 0.f;
  float total_transfer_time = 0.5f;
  bool active = false;
  transfer_animation e_transfer_animation = transfer_animation::T_FADE;
  };

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
    void _save();
    void _load(const std::string& filename);
    bool _ctrl_pressed();
    bool _shift_pressed();
    void _build();
    void _prepare_current_slide();
    void _next_slide(bool with_cool_transfer);
    void _previous_slide();
    void _first_slide();
    void _last_slide();
    void _set_fullscreen(bool on);
    void _do_mouse();
    void _write_to_pdf(const std::string& filename);

  private:
    SDL_Window* _window;    
    uint32_t _w, _h, _viewport_w, _viewport_h, _viewport_pos_x, _viewport_pos_y, _max_w, _max_h, _windowed_w, _windowed_h;
    bool _quit;
    settings _settings;    
    blit_t* _blit_gl_state;
    slide_t* _slide_gl_state;
    transfer_t* _transfer_gl_state;
    mouse_data _md;    
    std::string _script;    
    int _line_nr, _col_nr;
    std::string _current_filename;
    keyboard_handler _keyb;
    Presentation _presentation;
    uint32_t _slide_id, _previous_slide_id;
    shader_parameters _sp;    
    transfer_slides_data _transfer_slides;
  };
