#include "shaders.h"

std::string get_font_material_vertex_shader()
  {
  return std::string(R"(#version 330 core
layout (location = 0) in vec2 pos;
layout (location = 1) in vec2 uv;
layout (location = 2) in vec3 color;

out vec2 frag_tex_coord;
out vec3 text_color;

void main() {
    frag_tex_coord = uv;
    //frag_tex_coord.y = 1-frag_tex_coord.y;
    text_color = color;
    gl_Position = vec4(pos, 0, 1);
}
)");
  }

std::string get_font_material_fragment_shader()
  {
  return std::string(R"(#version 430 core
in vec2 frag_tex_coord;
in vec3 text_color;

out vec4 outColor;

uniform int width;
uniform int height;

layout(r8ui, binding = 0) readonly uniform uimage2D font_texture;

void main() {
    int x = int(frag_tex_coord.x * float(width));
    int y = int(frag_tex_coord.y * float(height));
    uint a = imageLoad(font_texture, ivec2(x, y)).r;
    outColor = vec4(1, 1, 1, float(a)/255.0)*vec4(text_color, 1);
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
  uniform int       iCrt;  
  uniform int       iFlip;
  uniform int       iRotation;

  out vec4 FragColor;
  
  vec2 CRTCurveUV( vec2 uv )
  {
      uv = uv * 2.0 - 1.0;
      vec2 offset = abs( uv.yx ) / vec2( 6.0, 4.0 );
      uv = uv + uv * offset * offset;
      uv = uv * 0.5 + 0.5;
      return uv;
  }

  void DrawVignette( inout vec3 color, vec2 uv )
  {    
      float vignette = uv.x * uv.y * ( 1.0 - uv.x ) * ( 1.0 - uv.y );
      vignette = clamp( pow( 16.0 * vignette, 0.3 ), 0.0, 1.0 );
      color *= vignette;
  }

  void main()
  {
  vec2 pos = (gl_FragCoord.xy - iBlitOffset)/iBlitResolution;
  if (iRotation == 90)
    {
    float tmp = pos.x;
    pos.x = 1-pos.y;
    pos.y = tmp;
    }
  else if (iRotation == 180)
    {
    pos.x = 1 - pos.x;
    pos.y = 1 - pos.y;
    }
  else if (iRotation == 270)
    {
    float tmp = pos.x;
    pos.x = pos.y;
    pos.y = 1-tmp;
    }
  if (pos.x < 0 || pos.y < 0 || pos.x > 1 || pos.y > 1)
    discard;
  if (iFlip > 0)
    pos.y = 1 - pos.y;
  if (iCrt > 0)
    {
    vec2 crtpos = CRTCurveUV( pos ); 
    vec4 clr = vec4( 0.0, 0.0, 0.0, 1.0);
    if (crtpos.x >= 0.0 && crtpos.x <= 1.0 && crtpos.y >= 0.0 && crtpos.y <= 1.0)
      clr = texture(iChannel0, crtpos);
    DrawVignette( clr.xyz, crtpos );
    FragColor = clr;
    }
  else
    FragColor = texture(iChannel0, pos);
  }
  )");
  }

std::string get_shadertoy_material_vertex_shader()
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

std::string get_shadertoy_material_fragment_shader_header()
  {
  return std::string(R"(#version 330 core
precision mediump float;
precision mediump int;
uniform vec3 iResolution;
uniform float iTime;
uniform float iGlobalTime;
uniform int iFrame;
uniform float iTimeDelta;

out vec4 FragColor;
)");
  }

std::string get_shadertoy_material_fragment_shader_footer()
  {
  return std::string(R"(
void main() 
  {
  mainImage(FragColor, gl_FragCoord.xy);
  }
)");
  }

std::string get_transfer_vertex_shader()
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

std::string get_transfer_fragment_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  uniform vec2      iResolution;
  uniform sampler2D iChannel0;
  uniform float     iTime;
  uniform float     iMaxTime;
  uniform int       iMethod;
  out vec4 FragColor;
  

  void main()
  {
  if (iMethod == 3) // zoom
    {
    float x = clamp(iTime / iMaxTime, 0, 1);    
    float frac = sqrt(abs(x-0.5f))/sqrt(0.5);
    vec2 pos = gl_FragCoord.xy/iResolution;
    FragColor = texture(iChannel0, (2.0*pos-1.0)*frac*0.5+0.5);
    }
  else if (iMethod == 2) // split
    {
    float x = clamp(iTime / iMaxTime, 0, 1);
    float frac = (abs(x-0.5f))/(0.5);
    vec2 pos = gl_FragCoord.xy/iResolution;
    if (pos.x < 0.5)
      {
      if (pos.x < frac*0.5)
        FragColor = texture(iChannel0, pos+vec2((1-frac)*0.5,0));  
      else
        FragColor = vec4(0,0,0,1);
      }
    else
      {
      if (pos.x > 1.0-frac*0.5)
        FragColor = texture(iChannel0, pos- vec2((1-frac)*0.5,0));  
      else
        FragColor = vec4(0,0,0,1);
      }    
    }
  else if (iMethod == 1) // dia
    {
    float x = clamp(iTime / iMaxTime, 0, 1);    
    float frac = 1.0-(abs(x-0.5f))/(0.5);
    vec2 pos = gl_FragCoord.xy/iResolution + vec2(frac,0);
    if (pos.x > 1)
      FragColor = vec4(0,0,0,1);
    else
      FragColor = texture(iChannel0, pos);
    }
  else // fade
    {
    float x = clamp(iTime / iMaxTime, 0, 1);    
    float frac = sqrt(abs(x-0.5f))/sqrt(0.5);
    vec2 pos = gl_FragCoord.xy/iResolution;
    FragColor = texture(iChannel0, pos)*frac;
    }
  }
  )");
  }
