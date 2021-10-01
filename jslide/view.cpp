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

#include "tokenizer.h"
#include "parser.h"
#include "nester.h"

#include <thread>

#define V_W 960
#define V_H 540
#define V_X 50
#define V_Y 50

view::view(int argc, char** argv) : _w(1600), _h(900), _quit(false),
_blit_gl_state(nullptr), _slide_gl_state(nullptr), _viewport_w(V_W), _viewport_h(V_H),
_viewport_pos_x(V_X), _viewport_pos_y(V_Y), _line_nr(1), _col_nr(1), _slide_id(0), _previous_slide_id(0)
  {
  SDL_DisplayMode dm;
  _windowed_w = _w;
  _windowed_h = _h;
  if (SDL_GetDesktopDisplayMode(0, &dm) == 0)
    {
    _max_w = dm.w;
    _max_h = dm.h;
    }
  else
    {
    _max_w = _w;
    _max_h = _h;
    }

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

  if (argc > 1)
    {
    _load(std::string(argv[1]));
    }
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
  _w = _windowed_w;
  _h = _windowed_h;

  if (fullscreen)
    {
    pos_x = 0;
    pos_y = 0;
    _viewport_w = _max_w;
    _viewport_h = _max_h;
    _viewport_pos_x = 0;
    _viewport_pos_y = 0;
    _w = _max_w;
    _h = _max_h;
    }

  _blit_gl_state = new blit_t();
  init_blit_data(_blit_gl_state, _viewport_pos_x, _viewport_pos_y, _viewport_w, _viewport_h, _w, _h);
  }

void view::_setup_gl_objects()
  {
  _slide_gl_state = new slide_t();
  init_slide_data(_slide_gl_state, _max_w, _max_h);
  }

void view::_destroy_gl_objects()
  {
  _destroy_blit_gl_objects();
  if (_slide_gl_state)
    {
    destroy_slide_data(_slide_gl_state);
    delete _slide_gl_state;
    _slide_gl_state = nullptr;
    }
  }

bool view::_ctrl_pressed()
  {
#if defined(__APPLE__)
  if (_keyb.is_down(SDLK_LGUI) || _keyb.is_down(SDLK_RGUI))
    return true;
#endif
  return (_keyb.is_down(SDLK_LCTRL) || _keyb.is_down(SDLK_RCTRL));
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
    _keyb.handle_event(event);
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
        if (!ImGui::GetIO().WantCaptureMouse)
          {
          _next_slide();
          }
        }
      else if (event.button.button == 3)
        {
        _md.right_dragging = false;
        if (!ImGui::GetIO().WantCaptureMouse)
          {
          _previous_slide();
          }
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
        case SDLK_b:
        {
        if (_ctrl_pressed())
          _build();
        break;
        }
        case SDLK_s:
        {
        if (_ctrl_pressed())
          _save();
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
        _set_fullscreen(false);
        break;
        }
        case SDLK_F5:
        {
        _set_fullscreen(true);
        break;
        }
        }
      break;
      }
      }
    }
  }

void view::_load(const std::string& filename)
  {
  std::ifstream t(filename);
  if (t.is_open())
    {
    _current_filename = filename;
    std::string str((std::istreambuf_iterator<char>(t)), std::istreambuf_iterator<char>());
    _script = str;
    t.close();
    _slide_id = 0;
    _previous_slide_id = 0;
    Logging::Info() << "Loaded " << _current_filename << "\n";
    std::stringstream title;
    title << "JSlide (" << _current_filename << ")";
    SDL_SetWindowTitle(_window, title.str().c_str());
    _build();
    }
  else
    {
    _current_filename = std::string();
    _script = std::string();
    SDL_SetWindowTitle(_window, "JSlide");
    }
  _prepare_current_slide();
  }

void view::_save()
  {
  if (!_current_filename.empty())
    {
    std::ofstream t(_current_filename);
    t << _script;
    t.close();
    Logging::Info() << "Saved as " << _current_filename << "\n";
    std::stringstream title;
    title << "JSlide (" << _current_filename << ")";
    SDL_SetWindowTitle(_window, title.str().c_str());
    }
  else
    {
    Logging::Warning() << "Could not save unnamed file\n";
    Logging::Warning() << "Please select 'Save as' in the top menu\n";
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
  if (ImGui::Begin("jslide", &open, window_flags))
    {
    if (!open)
      _quit = true;
    if (ImGui::BeginMenuBar())
      {
      if (ImGui::BeginMenu("File"))
        {
        if (ImGui::MenuItem("New"))
          {
          _current_filename = std::string();
          _script = std::string();
          SDL_SetWindowTitle(_window, "JSlide");
          }
        if (ImGui::MenuItem("Load"))
          {
          open_script = true;
          }
        if (ImGui::MenuItem("Save", "CTRL+s"))
          {
          if (_current_filename.empty())
            save_script = true;
          else
            {
            _save();
            }
          }
        if (ImGui::MenuItem("Save as"))
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
          _set_fullscreen(_settings.fullscreen);
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
  const char* openScriptChosenPath = open_script_dlg.chooseFileDialog(open_script, _settings.file_open_folder.c_str(), ".md", "Open script", ImVec2(-1, -1), ImVec2(50, 50));
  open_script = false;
  if (strlen(openScriptChosenPath) > 0)
    {
    _settings.file_open_folder = open_script_dlg.getLastDirectory();
    _load(std::string(std::string(openScriptChosenPath)));
    }

  static ImGuiFs::Dialog save_script_dlg(false, true, true);
  const char* saveScriptChosenPath = save_script_dlg.saveFileDialog(save_script, _settings.file_open_folder.c_str(), 0, ".md", "Save script");
  save_script = false;
  if (strlen(saveScriptChosenPath) > 0)
    {
    _settings.file_open_folder = save_script_dlg.getLastDirectory();
    std::ofstream t(saveScriptChosenPath);
    if (t.is_open())
      {
      t << _script;
      t.close();
      _current_filename = std::string(saveScriptChosenPath);
      std::stringstream title;
      title << "JSlide (" << _current_filename << ")";
      SDL_SetWindowTitle(_window, title.str().c_str());
      Logging::Info() << "Saved " << _current_filename << "\n";
      }
    else
      Logging::Error() << "Could not save as " << std::string(saveScriptChosenPath) << "\n";
    }

  if (_settings.log_window)
    _log_window();

  if (_settings.script_window)
    _script_window();
  ImGui::Render();
  }

void view::_set_fullscreen(bool on)
  {
  _settings.fullscreen = on;
  //SDL_SetWindowFullscreen(_window, _settings.fullscreen);
  if (_settings.fullscreen)
    SDL_SetWindowSize(_window, _max_w, _max_h);
  else
    SDL_SetWindowSize(_window, _windowed_w, _windowed_h);
  SDL_SetWindowPosition(_window, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED);
  _destroy_blit_gl_objects();
  _setup_blit_gl_objects(_settings.fullscreen);
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
      _col_nr = 1;
      }
    else
      ++_col_nr;
    }
  return 0;
  }

void view::_build()
  {
  try
    {
    tokens tokes = tokenize(_script);
    //for (const auto& t : tokes)
    //  {
    //  Logging::Info() << "t: " << t.type << "  -  " << t.value << "  -  " << t.line_nr << ":" << t.col_nr << "\n";
    //  }
    _presentation = make_presentation(tokes);
    nest_blocks(_presentation, &_slide_gl_state->font_gl_state);
    }
  catch (std::runtime_error& e)
    {
    Logging::Error() << e.what() << "\n";
    }
  _prepare_current_slide();
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
  ImGui::InputTextMultiline("Scripting", &_script, ImVec2(-1.f, (float)(_h - 2 * V_Y - ImGui::GetTextLineHeight() * 6)), flags, &_script_window_callback, this);
  if (ImGui::Button("Build"))
    {
    _build();
    }
  ImGui::SameLine();
  if (ImGui::Button("<<"))
    {
    _previous_slide();
    }
  ImGui::SameLine();
  if (ImGui::Button(">>"))
    {
    _next_slide();
    }
  ImGui::Text("Ln %d\tCol %d", _line_nr, _col_nr);
  ImGui::End();
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

void view::_next_slide()
  {
  _previous_slide_id = _slide_id;
  if ((_slide_id + 1) < _presentation.slides.size())
    ++_slide_id;
  _prepare_current_slide();
  }

void view::_previous_slide()
  {
  _previous_slide_id = _slide_id;
  if (_slide_id > 0)
    --_slide_id;
  _prepare_current_slide();
  }

void view::_prepare_current_slide()
  {
  if (_presentation.slides.empty())
    return;
  if (_slide_id >= _presentation.slides.size())
    _slide_id = 0;

  bool should_compute_shader = _presentation.slides[_slide_id].reset_shaders;
  if (!should_compute_shader)
    {
    if (_previous_slide_id != (_slide_id-1) && _previous_slide_id < _presentation.slides.size())
      {
      if (_presentation.slides[_previous_slide_id].reset_shaders)
        should_compute_shader = true;
      }
    }
  if (should_compute_shader)
    {
    try
      {
      init_slide_shader(_slide_gl_state, _presentation.slides[_slide_id].shader);
      _sp.frame = 0;
      _sp.time = 0.f;
      }
    catch (std::runtime_error& e)
      {
      Logging::Error() << e.what() << "\n";
      }
    }
  }

void view::_do_mouse()
  {
  }

void view::loop()
  {
  _sp.frame = 0;
  _sp.time = 0.f;
  auto last_tic = std::chrono::high_resolution_clock::now();
  while (!_quit)
    {
    auto tic = std::chrono::high_resolution_clock::now();
    _sp.time_delta = (float)(std::chrono::duration_cast<std::chrono::microseconds>(tic - last_tic).count()) / 1000000.f;
    last_tic = tic;

    _poll_for_events();
    _do_mouse();

    glViewport(0, 0, _w, _h);
    glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    if (!_presentation.slides.empty())
      {
      draw_slide_data(_slide_gl_state, _presentation.slides[_slide_id], _sp);
      }
    draw_blit_data(_blit_gl_state, _slide_gl_state->fbo.get_texture(), _w, _h);

    if (!_settings.fullscreen)
      {
      _imgui_ui();
      ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
      }

    std::this_thread::sleep_for(std::chrono::duration<double, std::milli>(16.0));
    SDL_GL_SwapWindow(_window);

    ++_sp.frame;
    _sp.time += _sp.time_delta;
    }
  }
