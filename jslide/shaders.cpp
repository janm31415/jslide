#include "shaders.h"


std::string get_blit_vertex_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  layout (location = 0) in vec3 vPosition;
  layout (location = 1) in vec2 vUV;
  
  void main()
  {
  gl_Position = vec4(vPosition, 1.0f);
  }
  )");
  }

std::string get_blit_fragment_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  uniform vec2      iBlitResolution;
  uniform vec2      iBlitOffset;
  uniform sampler2D iChannel0;
  
  out vec4 FragColor;
  
  void main()
  {
  vec2 pos = (gl_FragCoord.xy - iBlitOffset)/iBlitResolution;
  FragColor = texture(iChannel0, pos);
  }
  )");
  }
