#pragma once
#include <glew/GL/glew.h>
#include <SDL.h>
#include <SDL_opengl.h>
#include <string>
#include <chrono>
#include <array>
#include <memory>

#include "jtk/render.h"

#include "settings.h"
#include "mouse_data.h"
#include "blit_gl.h"

struct ImGuiInputTextCallbackData;

struct view3d_data
  {
  float projection_matrix[16];
  float camera_position[16], camera_position_inv[16], object_system[16];
  float center[4];
  float zoom_factor;
  int w, h;
  float _near, _far;
  jtk::render_data rd;
  jtk::frame_buffer fb;
  uint32_t ob_id;
  };

class view
  {
  public:
    view();
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
    
  private:
    SDL_Window* _window;    
    uint32_t _w, _h, _viewport_w, _viewport_h, _viewport_pos_x, _viewport_pos_y;
    bool _quit;
    settings _settings;    
    blit_t* _blit_gl_state;
    mouse_data _md;    
    std::string _script;    
  };
