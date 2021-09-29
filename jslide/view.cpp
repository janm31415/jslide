#include "view.h"
#include <iostream>
#include <SDL_syswm.h>

#include "imgui.h"
#include "imgui_impl_sdl.h"
#include "imgui_impl_opengl3.h"
#include "imgui_stdlib.h"
#include "imguifilesystem.h"

#include <glew/GL/glew.h>

#include <stdexcept>
#include <chrono>
#include <string>
#include <fstream>
#include <streambuf>
#include <ctime>
#include <iomanip>
#include <cmath>

#include "logging.h"

#define V_W 800
#define V_H 450
#define V_X 50
#define V_Y 50


extern "C"
  {
#include "trackball.h"
  }

view::view() : _w(1600), _h(900), _quit(false), 
_blit_gl_state(nullptr), _viewport_w(V_W), _viewport_h(V_H),
_viewport_pos_x(V_X), _viewport_pos_y(V_Y), _line_nr(1), _col_nr(1)
  {
  // Setup window
  SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
  SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24);
  SDL_GL_SetAttribute(SDL_GL_RED_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE, 5);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);

  //SDL_GL_SetAttribute(SDL_GL_CONTEXT_FLAGS, SDL_GL_CONTEXT_DEBUG_FLAG);

  _window = SDL_CreateWindow("JSlide",
    SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
    _w, _h,
    SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE | SDL_WINDOW_SHOWN);
  if (!_window)
    throw std::runtime_error("SDL can't create a window");

  SDL_GLContext gl_context = SDL_GL_CreateContext(_window);
  SDL_GL_SetSwapInterval(1); // Enable vsync


  glewExperimental = true;
  GLenum err = glewInit();
  if (GLEW_OK != err)
    throw std::runtime_error("GLEW initialization failed");
  glGetError(); // hack https://stackoverflow.com/questions/36326333/openglglfw-glgenvertexarrays-returns-gl-invalid-operation

  IMGUI_CHECKVERSION();
  ImGui::CreateContext();

  // Setup Platform/Renderer bindings
  ImGui_ImplSDL2_InitForOpenGL(_window, gl_context);
  ImGui_ImplOpenGL3_Init();

  // Setup Style
  ImGui::StyleColorsDark();
  ImGui::GetStyle().Colors[ImGuiCol_TitleBg] = ImGui::GetStyle().Colors[ImGuiCol_TitleBgActive];

  SDL_GL_MakeCurrent(_window, gl_context);


  _settings = read_settings("jslide.cfg");

  _setup_gl_objects();
  _setup_blit_gl_objects(_settings.fullscreen);

  _md.left_dragging = false;
  _md.right_dragging = false;
  _md.right_button_down = false;
  _md.left_button_down = false;
  _md.wheel_down = false;
  _md.wheel_mouse_pressed = false;
  _md.mouse_x = 0.f;
  _md.mouse_y = 0.f;
  _md.prev_mouse_x = 0.f;
  _md.prev_mouse_y = 0.f;
  _md.wheel_rotation = 0.f;
  _md.ctrl_pressed = false;

  _prepare_render();
  }


view::~view()
  {
  write_settings(_settings, "jslide.cfg");
  _destroy_gl_objects();
  ImGui_ImplOpenGL3_Shutdown();
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();
  SDL_DestroyWindow(_window);
  }

void view::_setup_blit_gl_objects(bool fullscreen)
  {
  using namespace jtk;
  _viewport_w = V_W;
  _viewport_h = V_H;
  _viewport_pos_x = V_X;
  _viewport_pos_y = V_Y;

  int pos_x = _viewport_pos_x;
  int pos_y = _viewport_pos_y;
  int w = _viewport_w;
  int h = _viewport_h;

  if (fullscreen)
    {
    pos_x = 0;
    pos_y = 0;
    _viewport_w = _w;
    _viewport_h = _h;
    _viewport_pos_x = 0;
    _viewport_pos_y = 0;
    w = _w;
    h = _h;
    }

  _blit_gl_state = new blit_t();
  init_blit_data(_blit_gl_state, _viewport_pos_x, _viewport_pos_y, _viewport_w, _viewport_h, _w, _h);
  }

void view::_setup_gl_objects()
  {
  }

void view::_destroy_gl_objects()
  {
  _destroy_blit_gl_objects();  
  }


void view::_destroy_blit_gl_objects()
  {
  destroy_blit_data(_blit_gl_state);
  delete _blit_gl_state;
  _blit_gl_state = nullptr;
  }

void view::_poll_for_events()
  {
  SDL_Event event;
  while (SDL_PollEvent(&event))
    {
    ImGui_ImplSDL2_ProcessEvent(&event);
    switch (event.type)
      {
      case SDL_QUIT:
      {
      _quit = true;
      break;
      }
      case SDL_WINDOWEVENT:
      {
      if (event.window.event == SDL_WINDOWEVENT_RESIZED)
        {
        _destroy_gl_objects();
        _w = event.window.data1;
        _h = event.window.data2;
        glViewport(0, 0, _w, _h);
        _setup_gl_objects();
        _setup_blit_gl_objects(_settings.fullscreen);
        }
      break;
      }
      case SDL_MOUSEMOTION:
      {
      _md.prev_mouse_x = _md.mouse_x;
      _md.prev_mouse_y = _md.mouse_y;
      _md.mouse_x = float(event.motion.x);
      _md.mouse_y = float(event.motion.y);
      if (_settings.fullscreen)
        {
        float width_ratio = (float)_viewport_w / (float)_w;
        float height_ratio = (float)_viewport_h / (float)_h;

        _md.mouse_x *= width_ratio;
        _md.mouse_y *= height_ratio;
        }
      break;
      }
      case SDL_MOUSEBUTTONDOWN:
      {
      if (event.button.button == 2)
        {
        _md.wheel_mouse_pressed = true;
        _md.wheel_down = true;
        }
      else if (event.button.button == 1)
        {
        _md.left_dragging = true;
        _md.left_button_down = true;
        }
      else if (event.button.button == 3)
        {
        _md.right_dragging = true;
        _md.right_button_down = true;
        }
      break;
      }
      case SDL_MOUSEBUTTONUP:
      {
      if (event.button.button == 2)
        _md.wheel_mouse_pressed = false;
      else if (event.button.button == 1)
        {
        _md.left_dragging = false;
        }
      else if (event.button.button == 3)
        {
        _md.right_dragging = false;
        }
      break;
      }
      case SDL_MOUSEWHEEL:
      {
      _md.wheel_rotation += event.wheel.y;
      break;
      }
      case SDL_KEYDOWN:
      {
      switch (event.key.keysym.sym)
        {
        case SDLK_LCTRL:
        case SDLK_RCTRL:
        {
        _md.ctrl_pressed = true;
        break;
        }
        case SDLK_LEFT:
        {
        if (ImGui::GetIO().WantCaptureKeyboard)
          break;
        
        break;
        }
        case SDLK_RIGHT:
        {
        if (ImGui::GetIO().WantCaptureKeyboard)
          break;       
        break;
        }
        break;
        }
      }
      case SDL_KEYUP:
      {
      switch (event.key.keysym.sym)
        {
        case SDLK_ESCAPE:
        {
        _quit = true;
        break;
        }
        case SDLK_LCTRL:
        case SDLK_RCTRL:
        {
        _md.ctrl_pressed = false;
        break;
        }
        }
      break;
      }
      }
    }
  }

void view::_imgui_ui()
  {
  // Start the Dear ImGui frame
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplSDL2_NewFrame(_window);
  ImGui::NewFrame();

  ImGuiWindowFlags window_flags = 0;
  window_flags |= ImGuiWindowFlags_NoTitleBar;
  window_flags |= ImGuiWindowFlags_NoMove;
  window_flags |= ImGuiWindowFlags_NoCollapse;
  window_flags |= ImGuiWindowFlags_MenuBar;
  window_flags |= ImGuiWindowFlags_NoBackground;
  window_flags |= ImGuiWindowFlags_NoResize;
  window_flags |= ImGuiWindowFlags_NoScrollbar;

  ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiCond_Always);
  ImGui::SetNextWindowSize(ImVec2((float)_w, 10), ImGuiCond_Always);
  bool open = true;
  static bool open_script = false;
  static bool save_script = false;
  if (ImGui::Begin("Pief", &open, window_flags))
    {
    if (!open)
      _quit = true;
    if (ImGui::BeginMenuBar())
      {
      if (ImGui::BeginMenu("File"))
        {
        if (ImGui::MenuItem("Load"))
          {
          open_script = true;
          }
        if (ImGui::MenuItem("Save"))
          {
          save_script = true;
          }
        if (ImGui::MenuItem("Exit"))
          {
          _quit = true;
          }
        ImGui::EndMenu();
        }
      if (ImGui::BeginMenu("Window"))
        {
        if (ImGui::MenuItem("Fullscreen", NULL, &_settings.fullscreen))
          {
          _destroy_blit_gl_objects();
          _setup_blit_gl_objects(_settings.fullscreen);
          }
        ImGui::MenuItem("Log window", NULL, &_settings.log_window);
        ImGui::MenuItem("Script window", NULL, &_settings.script_window);
        ImGui::EndMenu();
        }
      ImGui::EndMenuBar();
      }
    ImGui::End();
    }

  static ImGuiFs::Dialog open_script_dlg(false, true, true);
  const char* openScriptChosenPath = open_script_dlg.chooseFileDialog(open_script, _settings.file_open_folder.c_str(), ".txt", "Open script", ImVec2(-1, -1), ImVec2(50, 50));
  open_script = false;
  if (strlen(openScriptChosenPath) > 0)
    {
    _settings.file_open_folder = open_script_dlg.getLastDirectory();

    _prepare_render();
    }

  static ImGuiFs::Dialog save_script_dlg(false, true, true);
  const char* saveScriptChosenPath = save_script_dlg.saveFileDialog(save_script, _settings.file_open_folder.c_str(), 0, ".txt", "Save script");
  save_script = false;
  if (strlen(saveScriptChosenPath) > 0)
    {
    _settings.file_open_folder = save_script_dlg.getLastDirectory();
    }

  if (_settings.log_window)
    _log_window();

  if (_settings.script_window)
    _script_window();
  ImGui::Render();
  }

namespace
  {
  int _script_window_callback(ImGuiInputTextCallbackData* data)
    {
    return ((view*)data->UserData)->script_window_callback(data);
    }
  }

int view::script_window_callback(ImGuiInputTextCallbackData* data)
  { 
  int cur = data->CursorPos;
  _line_nr = 1;
  _col_nr = 1;
  for (int i = 0; i < cur; ++i)
    {
    if (data->Buf[i] == '\n')
      {
      ++_line_nr;
      _col_nr=1;
      }
    else
      ++_col_nr;
    }
  /*
  if (cur >= _script.size())
    cur = (int)_script.size() - 1;
  int line_nr = 1;
  int col_nr = 1;
  for (int i = 0; i < cur; ++i)
    {
    if (_script[i] == '\n')
      {
      ++line_nr;
      col_nr = 1;
      }
    else
      ++col_nr;
    }
  _line_nr = line_nr;
  _col_nr = col_nr;
  */
  return 0;
  }

void view::_script_window()
  {
  ImGui::SetNextWindowSize(ImVec2((float)(_w - V_W - 3 * V_X), (float)(_h - 2 * V_Y)), ImGuiCond_Always);
  ImGui::SetNextWindowPos(ImVec2((float)(V_X * 2 + V_W), (float)(V_Y)), ImGuiCond_Always);

  if (!ImGui::Begin("Script window", &_settings.script_window))
    {
    ImGui::End();
    return;
    }
  ImGuiInputTextFlags flags = ImGuiInputTextFlags_CallbackAlways;  
  ImGui::InputTextMultiline("Scripting", &_script, ImVec2(-1.f, (float)(_h - 2 * V_Y - ImGui::GetTextLineHeight()*6)), flags, &_script_window_callback, this);
  if (ImGui::Button("Present"))
    {    
    }
  ImGui::SameLine();
  if (ImGui::Button("<<"))
    {
    }
  ImGui::SameLine();
  if (ImGui::Button(">>"))
    {
    }
  ImGui::Text("Ln %d\tCol %d", _line_nr, _col_nr);
  ImGui::End();
  }

void view::_prepare_render()
  {
  }

void view::_log_window()
  {
  static AppLog log;

  auto log_messages = Logging::GetInstance().pop_messages();

  if (!log_messages.empty())
    log.AddLog("%s", log_messages.c_str());

  ImGui::SetNextWindowSize(ImVec2((float)V_W, (float)(_h - 3 * V_Y - V_H)), ImGuiCond_Always);
  ImGui::SetNextWindowPos(ImVec2((float)V_X, (float)(2 * V_Y + V_H)), ImGuiCond_Always);

  log.Draw("Log window", &_settings.log_window);
  }

void view::loop()
  {
  while (!_quit)
    {
    _poll_for_events();

    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);   

    //draw_blit_data(_blit_gl_state, &_image_gl_state->tex, _w, _h);

    _imgui_ui();

    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());


    SDL_GL_SwapWindow(_window);

    glGetError(); //hack
    }
  }
