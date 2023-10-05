#include "view.h"
#include <iostream>

#if defined(RENDERDOOS_METAL)
#define NS_PRIVATE_IMPLEMENTATION
#define CA_PRIVATE_IMPLEMENTATION
#define MTL_PRIVATE_IMPLEMENTATION

#include "metal/Metal.hpp"
#include "../SDL-metal/SDL_metal.h"
#include "SDL_metal.h"
#else
#include <windows.h>
#include "glew/GL/glew.h"
#endif

#include "imgui.h"
#include "imgui_impl_sdl2.h"
#if defined(RENDERDOOS_METAL)
#include "imgui_impl_metal.h"
#else
#include "imgui_impl_opengl3.h"
#endif
#include "imgui_stdlib.h"
#include "imguifilesystem.h"

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
#include "image_helper.h"

#include "stb/stb_image_write.h"
#include "jpg2pdf.h"

#include "RenderDoos/types.h"

#include <thread>

#define V_W 960
#define V_H 540
#define V_X 50
#define V_Y 50

view::view(int argc, char** argv) : _w(1600), _h(900), _quit(false),
_viewport_w(V_W), _viewport_h(V_H),
_viewport_pos_x(V_X), _viewport_pos_y(V_Y), _line_nr(1), _col_nr(1), _slide_id(0), _previous_slide_id(0), _dummy_image_handle(-1), _slide_state(nullptr)
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
#if defined(RENDERDOOS_METAL)
  SDL_SetHint(SDL_HINT_RENDER_DRIVER, "metal");
  
  _window = SDL_CreateWindow("jTop",
                             SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                             _w, _h, SDL_WINDOW_RESIZABLE | SDL_WINDOW_SHOWN);
  
  _metalView = SDL_Metal_CreateView(_window);
  void* layer = SDL_Metal_GetLayer(_metalView);
  MTL::Device* metalDevice = MTL::CreateSystemDefaultDevice();
  assign_device(layer, metalDevice);
  if (!_window)
    throw std::runtime_error("SDL can't create a window");
  
  
  _engine.init(metalDevice, nullptr, RenderDoos::renderer_type::METAL);
  
  IMGUI_CHECKVERSION();
  ImGui::CreateContext();
  ImGuiIO& io = ImGui::GetIO();
  (void)io;
  
  ImGui_ImplMetal_Init(metalDevice);
  ImGui_ImplSDL2_InitForMetal(_window);
  
  // Setup Style
  ImGui::StyleColorsDark();
  
#else
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
  
  _window = SDL_CreateWindow("jslide",
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
  
  SDL_GL_MakeCurrent(_window, gl_context);
  
  _engine.init(nullptr, nullptr, RenderDoos::renderer_type::OPENGL);
  
  IMGUI_CHECKVERSION();
  ImGui::CreateContext();
  ImGuiIO& io = ImGui::GetIO();
  (void)io;
  
  // Setup Platform/Renderer bindings
  ImGui_ImplSDL2_InitForOpenGL(_window, gl_context);
  const char* glsl_version = "#version 130";
  ImGui_ImplOpenGL3_Init(glsl_version);
  
  
  // Setup Style
  ImGui::StyleColorsDark();
#endif
  
  ImGui::GetStyle().Colors[ImGuiCol_TitleBg] = ImGui::GetStyle().Colors[ImGuiCol_TitleBgActive];
  
  
  _blit_material.compile(&_engine);
  _shadertoy_material.compile(&_engine);
  _font_material.compile(&_engine);
  _transfer_material.compile(&_engine);
  _mouse_material.compile(&_engine);
  
  _slide_state = new slide_t();
  _slide_state->blit_state = &_blit_material;
  _slide_state->shader_state = &_shadertoy_material;
  _slide_state->font_state = &_font_material;
  init_slide_data(_slide_state, &_engine, _max_w, _max_h);
  
  _transfer_framebuffer_id = _engine.add_frame_buffer(_max_w, _max_h, false);
  
  _make_dummy_image();
  
  _settings = read_settings("jslide.cfg");
  
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
  SDL_ShowCursor(1);
  write_settings(_settings, "jslide.cfg");
  destroy_presentation(_presentation);
#if defined(RENDERDOOS_METAL)
  ImGui_ImplMetal_Shutdown();
#else
  ImGui_ImplOpenGL3_Shutdown();
#endif
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();
  destroy_slide_data(_slide_state, &_engine);
  _engine.remove_texture(_dummy_image_handle);
  _blit_material.destroy(&_engine);
  _shadertoy_material.destroy(&_engine);
  _font_material.destroy(&_engine);
  _transfer_material.destroy(&_engine);
  _mouse_material.destroy(&_engine);
  _engine.remove_frame_buffer(_transfer_framebuffer_id);
  _engine.destroy();
  
  SDL_DestroyWindow(_window);
}

void view::_resize() {
  _viewport_w = V_W;
  _viewport_h = V_H;
  _viewport_pos_x = V_X;
  _viewport_pos_y = V_Y;
  
  int pos_x = _viewport_pos_x;
  int pos_y = _viewport_pos_y;
  _w = _windowed_w;
  _h = _windowed_h;
  
  if (_settings.fullscreen)
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
}

void view::_make_dummy_image() {
  image im = dummy_image();
  _dummy_image_handle = _engine.add_texture(im.w, im.h, RenderDoos::texture_format_rgba8, im.im);
}

bool view::_ctrl_pressed()
{
#if defined(__APPLE__)
  if (_keyb.is_down(SDLK_LGUI) || _keyb.is_down(SDLK_RGUI))
    return true;
#endif
  return (_keyb.is_down(SDLK_LCTRL) || _keyb.is_down(SDLK_RCTRL));
}

bool view::_shift_pressed()
{
  return (_keyb.is_down(SDLK_LSHIFT) || _keyb.is_down(SDLK_RSHIFT));
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
          _w = event.window.data1;
          _h = event.window.data2;
          if (_w != _max_w && _h != _max_h)
          {
            _windowed_w = _w;
            _windowed_h = _h;
          }
          _resize();
        }
        break;
      }
      case SDL_MOUSEMOTION:
      {
        _md.prev_mouse_x = _md.mouse_x;
        _md.prev_mouse_y = _md.mouse_y;
        _md.mouse_x = float(event.motion.x);
        _md.mouse_y = float(event.motion.y);
        //if (_settings.fullscreen)
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
          if (_settings.fullscreen || !ImGui::GetIO().WantCaptureMouse)
          {
            _next_slide(true);
          }
        }
        else if (event.button.button == 3)
        {
          _md.right_dragging = false;
          if (_settings.fullscreen || !ImGui::GetIO().WantCaptureMouse)
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
          case SDLK_HOME:
          {
            if (!_settings.fullscreen && ImGui::GetIO().WantCaptureKeyboard)
              break;
            _first_slide();
            break;
          }
          case SDLK_END:
          {
            if (!_settings.fullscreen && ImGui::GetIO().WantCaptureKeyboard)
              break;
            _last_slide();
            break;
          }
          case SDLK_LEFT:
          {
            if (!_settings.fullscreen && ImGui::GetIO().WantCaptureKeyboard)
              break;
            _previous_slide();
            break;
          }
          case SDLK_RIGHT:
          {
            if (!_settings.fullscreen && ImGui::GetIO().WantCaptureKeyboard)
              break;
            _next_slide(true);
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
        }
        break;
      }
      case SDL_KEYUP:
      {
        switch (event.key.keysym.sym)
        {
          case SDLK_ESCAPE:
          {
            SDL_ShowCursor(1);
            _set_fullscreen(false);
            break;
          }
          case SDLK_F5:
          {
            if (!_shift_pressed())
            {
              _first_slide();
            }
            _set_fullscreen(true);
            SDL_ShowCursor(0);
            break;
          }
          case SDLK_F4:
          {
            _settings.crt_effect = !_settings.crt_effect;
            break;
          }
          case SDLK_m:
          {
            _settings.show_mouse = !_settings.show_mouse;
            break;
          }
          case SDLK_0:
          {
            _settings.mouse_type = 0;
            break;
          }
          case SDLK_1:
          {
            _settings.mouse_type = 1;
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
    title << "jslide (" << _current_filename << ")";
    SDL_SetWindowTitle(_window, title.str().c_str());
    _build();
  }
  else
  {
    _current_filename = std::string();
    _script = std::string();
    SDL_SetWindowTitle(_window, "jslide");
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
    title << "jslide (" << _current_filename << ")";
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
#if defined(RENDERDOOS_OPENGL)
  ImGui_ImplOpenGL3_NewFrame();
#endif
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
  static bool save_pdf = false;
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
          _build();
          SDL_SetWindowTitle(_window, "jslide");
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
        if (ImGui::MenuItem("Export to PDF"))
        {
          save_pdf = true;
        }
        if (ImGui::MenuItem("Build", "CTRL+b"))
        {
          _build();
        }
        if (ImGui::MenuItem("Exit"))
        {
          _quit = true;
        }
        ImGui::EndMenu();
      }
      if (ImGui::BeginMenu("Slideshow"))
      {
        if (ImGui::MenuItem("From begin", "F5", &_settings.fullscreen))
        {
          _first_slide();
          _set_fullscreen(_settings.fullscreen);
        }
        if (ImGui::MenuItem("From current", "shift+F5", &_settings.fullscreen))
        {
          _set_fullscreen(_settings.fullscreen);
        }
        ImGui::EndMenu();
      }
      if (ImGui::BeginMenu("Window"))
      {
        ImGui::MenuItem("CRT display", "F4", &_settings.crt_effect);
        ImGui::MenuItem("Log window", NULL, &_settings.log_window);
        ImGui::MenuItem("Script window", NULL, &_settings.script_window);
        ImGui::MenuItem("Show mouse", "m", &_settings.show_mouse);
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
    _load(std::string(std::string(openScriptChosenPath)));
  }
  
  static ImGuiFs::Dialog save_script_dlg(false, true, true);
  const char* saveScriptChosenPath = save_script_dlg.saveFileDialog(save_script, _settings.file_open_folder.c_str(), 0, ".txt", "Save script");
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
      title << "jslide (" << _current_filename << ")";
      SDL_SetWindowTitle(_window, title.str().c_str());
      Logging::Info() << "Saved " << _current_filename << "\n";
    }
    else
      Logging::Error() << "Could not save as " << std::string(saveScriptChosenPath) << "\n";
  }
  
  static ImGuiFs::Dialog save_pdf_dlg(false, true, true);
  const char* savePDFChosenPath = save_pdf_dlg.saveFileDialog(save_pdf, _settings.file_open_folder.c_str(), 0, ".pdf", "Export to PDF");
  save_pdf = false;
  if (strlen(savePDFChosenPath) > 0)
  {
    std::string filename(savePDFChosenPath);
    _write_to_pdf_filename = filename;
  }
  
  if (_settings.log_window)
    _log_window();
  
  if (_settings.script_window)
    _script_window();
  ImGui::Render();
#if defined(RENDERDOOS_OPENGL)
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
#endif
}

void view::_set_fullscreen(bool on)
{
  ImGui::SetWindowFocus(nullptr); // hack: if not for this line, the script text would disappear if the script window had the focus
  _settings.fullscreen = on;
  //SDL_SetWindowFullscreen(_window, _settings.fullscreen);
  if (_settings.fullscreen)
  {
    SDL_SetWindowFullscreen(_window, SDL_WINDOW_FULLSCREEN_DESKTOP);
  }
  else
  {
    SDL_SetWindowFullscreen(_window, 0);
    SDL_SetWindowSize(_window, _windowed_w, _windowed_h);
  }
  SDL_SetWindowPosition(_window, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED);
  _resize();
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
    destroy_presentation(_presentation);
    _presentation = make_presentation(tokes);
    nest_blocks(_presentation, _slide_state->font_state);
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
    _next_slide(true);
  }
  ImGui::SameLine();
  ImGui::Checkbox("CRT", &_settings.crt_effect);
  ImGui::SameLine();
  ImGui::Checkbox("Mouse", &_settings.show_mouse);
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

namespace
{
int _get_random_transfer_method(int slide_id)
{
  return ((int)slide_id % ((int)transfer_animation::T_ITERATE-1));
}

float get_total_time(transfer_animation anim, int slide_id)
{
  transfer_animation anim2 = anim;
  if (anim == transfer_animation::T_ITERATE)
    anim2 = (transfer_animation)(_get_random_transfer_method(slide_id)+1);
  switch (anim2)
  {
    case transfer_animation::T_NONE: return 0.f;
    case transfer_animation::T_SPLIT: return 1.f;
    case transfer_animation::T_FADE: return 0.5f;
    case transfer_animation::T_DIA: return 0.5f;
    case transfer_animation::T_ZOOM: return 0.5f;
    case transfer_animation::T_ITERATE: return 0.5f;
  }
  return 0.5f;
}
}

void view::_next_slide(bool with_cool_transfer)
{
  if (_presentation.slides.empty())
    return;
  if (_transfer_slides.active) // still in a previous active transfer
  {
    float half_time = _transfer_slides.total_transfer_time * 0.5f;
    if (_transfer_slides.time < half_time)
      _prepare_current_slide();
  }
  _previous_slide_id = _slide_id;
  if ((_slide_id + 1) < _presentation.slides.size())
    ++_slide_id;
  if (with_cool_transfer && _presentation.slides[_slide_id].reset_shaders)
  {
    _transfer_slides.total_transfer_time = get_total_time(_presentation.slides[_previous_slide_id].attrib.e_transfer_animation, _slide_id);
    _transfer_slides.active = true;
    _transfer_slides.time = 0.f;
    _transfer_slides.slide_id_1 = _previous_slide_id;
    _transfer_slides.slide_id_2 = _slide_id;
    _transfer_slides.e_transfer_animation = _presentation.slides[_previous_slide_id].attrib.e_transfer_animation;
    if (_transfer_slides.slide_id_1 == _transfer_slides.slide_id_2)
      _transfer_slides.active = false;
  }
  else
    _prepare_current_slide();
  
  /*
   if (_presentation.slides.empty())
   return;
   if ((_slide_id + 1) < _presentation.slides.size())
   ++_slide_id;
   _prepare_current_slide();
   */
}

void view::_previous_slide()
{
  if (_presentation.slides.empty())
    return;
  _transfer_slides.active = false;
  _previous_slide_id = _slide_id;
  if (_slide_id > 0)
    --_slide_id;
  _prepare_current_slide();
}

void view::_first_slide()
{
  if (_presentation.slides.empty())
    return;
  _transfer_slides.active = false;
  _previous_slide_id = _slide_id;
  _slide_id = 0;
  _prepare_current_slide();
}

void view::_last_slide()
{
  if (_presentation.slides.empty())
    return;
  _transfer_slides.active = false;
  _previous_slide_id = _slide_id;
  _slide_id = _presentation.slides.empty() ? 0 : (uint32_t)_presentation.slides.size() - 1;
  _prepare_current_slide();
}

void view::_prepare_current_slide()
{
  if (_presentation.slides.empty())
    return;
  if (_slide_id >= _presentation.slides.size())
    _slide_id = 0;
  clear_images(_slide_state, &_engine);
  bool should_compute_shader = _presentation.slides[_slide_id].reset_shaders;
  if (!should_compute_shader)
  {
    if (_previous_slide_id != (_slide_id - 1) && _previous_slide_id < _presentation.slides.size())
    {
      if (_presentation.slides[_previous_slide_id].reset_shaders)
        should_compute_shader = true;
    }
  }
  if (should_compute_shader)
  {
    try
    {
      init_slide_shader(_slide_state, &_engine, _presentation.slides[_slide_id].shader);
      _sp.frame = 0;
      _sp.time = 0.f;
    }
    catch (std::runtime_error& e)
    {
      Logging::Error() << e.what() << "\n";
    }
  }
  for (auto& b : _presentation.slides[_slide_id].blocks)
  {
    if (std::holds_alternative<Image>(b.expr))
    {
      add_image(_slide_state, &_engine, b);
    }
  }
}

namespace
{
struct my_context
{
  std::vector<uint8_t> buffer;
};

void my_stbi_write_func(void* context, void* data, int size)
{
  my_context* p_ctxt = (my_context*)context;
  uint8_t* p_data = (uint8_t*)data;
  for (int i = 0; i < size; ++i)
    p_ctxt->buffer.push_back(*p_data++);
}
}

void view::_write_to_pdf(const std::string& filename)
{
  if (_presentation.slides.empty())
    return;
  std::string title("jslide (https://github.com/janm31415/jslide)");
  std::string author("Jan Maes");
  std::string keywords("jslide (https://github.com/janm31415/jslide)");
  std::string subject("jslide (https://github.com/janm31415/jslide)");
  std::string creator("Jan Maes");
  double pageWidth = 8.27, pageHeight = 11.69, pageMargins = 0;
  bool cropWidth = false, cropHeight = false;
  PageOrientation pageOrientation = Landscape;
  ScaleMethod scale = ScaleFit;
  PJPEG2PDF pdfId = Jpeg2PDF_BeginDocument(pageWidth, pageHeight, pageMargins); // Letter is 8.5x11 inch
  uint32_t _slide_id_save = _slide_id;
  std::vector<uint8_t> image_buffer(_slide_state->width * _slide_state->height * 4);
  my_context ctxt;
  ctxt.buffer.reserve(image_buffer.size());
  stbi_flip_vertically_on_write(true);
  for (_slide_id = 0; _slide_id < _presentation.slides.size(); ++_slide_id)
  {
    _prepare_current_slide();
    
    RenderDoos::render_drawables drawables;
#if defined(RENDERDOOS_METAL)
    void* layer = SDL_Metal_GetLayer(_metalView);
    auto drawable = next_drawable(layer);
    drawables.metal_drawable = (void*)drawable.drawable;
    drawables.metal_screen_texture = (void*)drawable.texture;
#endif
    
    prepare_slide_data(_slide_state, &_engine, _presentation.slides[_slide_id], _sp);
    _engine.frame_begin(drawables);
    draw_slide_data(_slide_state, &_engine, _presentation.slides[_slide_id], _sp);
    _engine.frame_end(true);
    _engine.get_data_from_texture(_engine.get_frame_buffer(_slide_state->framebuffer_id)->texture_handle, image_buffer.data(), _slide_state->width * _slide_state->height * 4);
#if defined(RENDERDOOS_METAL)
    {
      // flip image and also flip red and blue bytes
      std::vector<uint8_t> image_buffer_copy(image_buffer);
      for (uint32_t y = 0; y < _slide_state->height; ++y)
      {
        uint32_t* p_write_row = ((uint32_t*)image_buffer.data()) + y*_slide_state->width;
        const uint32_t* p_read_row = ((uint32_t*)image_buffer_copy.data()) + (_slide_state->height - y - 1)*_slide_state->width;
        for (uint32_t x = 0; x < _slide_state->width; ++x)
        {
          uint32_t clr = *p_read_row++;
          uint32_t blue = (clr >> 16) & 0xff;
          uint32_t red = clr & 0xff;
          clr = (clr & 0xff00ffff) | (red << 16);
          clr = (clr & 0xffffff00) | (blue);
          *p_write_row++ = clr;
        }
      }
    }
#endif
    
    ctxt.buffer.clear();
    stbi_write_jpg_to_func(&my_stbi_write_func, (void*)&ctxt, _slide_state->width, _slide_state->height, 4, image_buffer.data(), 100);
    Jpeg2PDF_AddJpeg(pdfId, _slide_state->width, _slide_state->height, (uint32_t)ctxt.buffer.size(), ctxt.buffer.data(), true, pageOrientation, 300.0, 300.0, scale, cropHeight, cropWidth);
  }
  char timestamp[40] = { 0 };
  uint32_t pdfSize = Jpeg2PDF_EndDocument(pdfId, timestamp, title.c_str(), author.c_str(), keywords.c_str(), subject.c_str(), creator.c_str());
  std::vector<uint8_t> pdfBuf(pdfSize);
  Jpeg2PDF_GetFinalDocumentAndCleanup(pdfId, pdfBuf.data(), &pdfSize);
  FILE* fp = fopen(filename.c_str(), "wb");
  fwrite(pdfBuf.data(), sizeof(uint8_t), pdfSize, fp);
  fclose(fp);
  Logging::Info() << "Exported slides to " << filename << "\n";
  _slide_id = _slide_id_save;
  _prepare_current_slide();
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
    /*
     glViewport(0, 0, _w, _h);
     glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
     glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
     
     jtk::texture* blit_texture = _slide_gl_state->fbo.get_texture();
     
     if (!_presentation.slides.empty())
     {
     if (_transfer_slides.active)
     {
     float half_time = _transfer_slides.total_transfer_time * 0.5f;
     if ((_transfer_slides.time < half_time && _transfer_slides.time+_sp.time_delta>= half_time) || half_time == 0.f)
     {
     _prepare_current_slide();
     }
     _transfer_slides.time += _sp.time_delta;
     if (_transfer_slides.time < half_time)
     draw_slide_data(_slide_gl_state, _presentation.slides[_transfer_slides.slide_id_1], _sp);
     else
     draw_slide_data(_slide_gl_state, _presentation.slides[_transfer_slides.slide_id_2], _sp);
     
     draw_transfer_data(_transfer_gl_state, _slide_gl_state->fbo.get_texture(), _transfer_slides.time, _transfer_slides.total_transfer_time, _transfer_slides.e_transfer_animation);
     blit_texture = _transfer_gl_state->fbo.get_texture();
     if (_transfer_slides.time >= _transfer_slides.total_transfer_time)
     _transfer_slides.active = false;
     }
     else
     draw_slide_data(_slide_gl_state, _presentation.slides[_slide_id], _sp);
     }
     draw_blit_data(_blit_gl_state, blit_texture, _w, _h, _settings.crt_effect);
     */
    
    RenderDoos::render_drawables drawables;
#if defined(RENDERDOOS_METAL)
    void* layer = SDL_Metal_GetLayer(_metalView);
    auto drawable = next_drawable(layer);
    drawables.metal_drawable = (void*)drawable.drawable;
    drawables.metal_screen_texture = (void*)drawable.texture;
#endif
    
    
    _engine.frame_begin(drawables);
    
    uint32_t target_framebuffer_id = _slide_state->framebuffer_id;
    if (!_presentation.slides.empty())
    {
      if (_transfer_slides.active)
      {
        float half_time = _transfer_slides.total_transfer_time * 0.5f;
        if ((_transfer_slides.time < half_time && _transfer_slides.time + _sp.time_delta >= half_time) || half_time == 0.f)
        {
          _prepare_current_slide();
        }
        _transfer_slides.time += _sp.time_delta;
        if (_transfer_slides.time < half_time)
        {
          prepare_slide_data(_slide_state, &_engine, _presentation.slides[_transfer_slides.slide_id_1], _sp);
          draw_slide_data(_slide_state, &_engine, _presentation.slides[_transfer_slides.slide_id_1], _sp);
        }
        else
        {
          prepare_slide_data(_slide_state, &_engine, _presentation.slides[_transfer_slides.slide_id_2], _sp);
          draw_slide_data(_slide_state, &_engine, _presentation.slides[_transfer_slides.slide_id_2], _sp);
        }
        transfer_material::properties props;
        props.time = _transfer_slides.time;
        props.max_time = _transfer_slides.total_transfer_time;
        if (_transfer_slides.e_transfer_animation == transfer_animation::T_ITERATE)
        {
          props.method = _get_random_transfer_method(_slide_id);
        }
        else
        {
          props.method = (int)_transfer_slides.e_transfer_animation;
        }
        _transfer_material.set_transfer_properties(props);
        _transfer_material.draw(_max_w, _max_h, _engine.get_frame_buffer(_slide_state->framebuffer_id)->texture_handle, _transfer_framebuffer_id, &_engine);
        //draw_transfer_data(_transfer_gl_state, _slide_gl_state->fbo.get_texture(), _transfer_slides.time, _transfer_slides.total_transfer_time, _transfer_slides.e_transfer_animation);
        //blit_texture = _transfer_gl_state->fbo.get_texture();
        target_framebuffer_id = _transfer_framebuffer_id;
        if (_transfer_slides.time >= _transfer_slides.total_transfer_time)
          _transfer_slides.active = false;
      }
      else
      {
        prepare_slide_data(_slide_state, &_engine, _presentation.slides[_slide_id], _sp);
        draw_slide_data(_slide_state, &_engine, _presentation.slides[_slide_id], _sp);
      }
      
    }
    
    if (_settings.show_mouse)
    {
      RenderDoos::renderpass_descriptor descr_mouse;
      descr_mouse.clear_flags = 0;
      descr_mouse.w = _viewport_w;
      descr_mouse.h = _viewport_h;
      descr_mouse.frame_buffer_handle = target_framebuffer_id;
      descr_mouse.frame_buffer_channel = 10;
      _engine.renderpass_begin(descr_mouse);
      if (_engine.get_renderer_type() == RenderDoos::renderer_type::METAL)
        _mouse_material.bind(_md.mouse_x, _md.mouse_y, 800, 450, 8, _settings.mouse_type, &_engine);
      else
        _mouse_material.bind(_md.mouse_x, _viewport_h-_md.mouse_y, 800, 450, 8, _settings.mouse_type, &_engine);
      _mouse_material.draw(&_engine);
      _engine.renderpass_end();
    }
    
    RenderDoos::renderpass_descriptor descr;
    descr.clear_color = 0xff202020;
    descr.clear_flags = CLEAR_COLOR | CLEAR_DEPTH;
    descr.w = _w;
    descr.h = _h;
    _engine.renderpass_begin(descr);
    
    jtk::vec2<float> viewResolution(_w, _h);
    jtk::vec2<float> blitResolution(_viewport_w, _viewport_h);
    jtk::vec2<float> blitOffset(_viewport_pos_x, _viewport_pos_y);
#if defined(RENDERDOOS_METAL)
    int flip = 1;
#else
    int flip = 0;
#endif
    _blit_material.bind(&_engine,
                        _engine.get_frame_buffer(target_framebuffer_id)->texture_handle,
                        viewResolution,
                        blitResolution,
                        blitOffset,
                        _settings.crt_effect ? 1 : 0, flip, 0);
    _blit_material.draw(&_engine);
    _engine.renderpass_end();
    
    if (!_settings.fullscreen)
    {
#if defined(RENDERDOOS_METAL)
      MTL::CommandBuffer* p_command_buffer = (MTL::CommandBuffer*)_engine.get_command_buffer();
      if (p_command_buffer)
      {
        MTL::RenderPassDescriptor* p_descriptor = MTL::RenderPassDescriptor::alloc()->init();
        p_descriptor->colorAttachments()->object(0)->setTexture(drawable.texture);
        p_descriptor->colorAttachments()->object(0)->setLoadAction(MTL::LoadActionLoad);
        p_descriptor->colorAttachments()->object(0)->setStoreAction(MTL::StoreActionStore);
        MTL::RenderCommandEncoder* p_render_command_encoder = p_command_buffer->renderCommandEncoder(p_descriptor);
        ImGui_ImplMetal_NewFrame(p_descriptor);
        _imgui_ui();
        ImGui_ImplMetal_RenderDrawData(ImGui::GetDrawData(), p_command_buffer, p_render_command_encoder);
        p_descriptor->release();
        p_render_command_encoder->endEncoding();
      }
#else
      _imgui_ui();
#endif
    }
    _engine.frame_end(true);
    
    std::this_thread::sleep_for(std::chrono::duration<double, std::milli>(1.0));
#if defined(RENDERDOOS_OPENGL)
    SDL_GL_SwapWindow(_window);
#endif
    
    if (!_write_to_pdf_filename.empty())
    {
      _write_to_pdf(_write_to_pdf_filename);
      _write_to_pdf_filename.clear();
    }
    
    ++_sp.frame;
    _sp.time += _sp.time_delta;
  }
}
