#include "shaders.h"

std::string get_font_vertex_shader()
  {
  return std::string(R"(#version 330 core
in vec4 coord;
in vec3 color;

out vec2 frag_tex_coord;
out vec3 text_color;

void main() {
    frag_tex_coord = coord.zw;
    text_color = color;
    gl_Position = vec4(coord.xy, 0, 1);
}
)");
  }

std::string get_font_fragment_shader()
  {
  return std::string(R"(#version 330 core
in vec2 frag_tex_coord;
in vec3 text_color;

out vec4 outColor;

uniform sampler2D tex;

void main() {
    outColor = vec4(1, 1, 1, texture(tex, frag_tex_coord).r)*vec4(text_color, 1);
}
)");
  }

std::string get_blit_vertex_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  layout (location = 0) in vec3 vPosition;
  //layout (location = 1) in vec2 vUV;
  
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

std::string get_shader_vertex_shader()
  {
  return std::string(R"(#version 330 core
precision mediump float;
precision mediump int;
layout (location = 0) in vec3 vPosition;
void main() 
  {
  gl_Position = vec4(vPosition, 1.0f);
  }
)");
  }

std::string get_shader_fragment_header()
  {
  return std::string(R"(#version 330 core
precision mediump float;
precision mediump int;
//uniform sampler2D iChannel0;
//uniform sampler2D iChannel1;
//uniform sampler2D iChannel2;
//uniform sampler2D iChannel3;
uniform vec3 iResolution;
uniform float iTime;
uniform float iGlobalTime;
//uniform float iChannelTime[4];
//uniform vec4 iMouse;
//uniform vec4 iDate;
//uniform float iSampleRate;
//uniform vec3 iChannelResolution[4];
//uniform int iFrame;
//uniform float iTimeDelta;
//struct Channel {  vec3 resolution;  float time;};
//uniform Channel iChannel[4];
)");
  }

std::string get_shader_fragment_footer()
  {
  return std::string(R"(
void main() 
  {
  mainImage(gl_FragColor.xyzw, gl_FragCoord.xy);
  }
)");
  }