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

uniform int font_atlas_width;
uniform int font_atlas_height;

layout(r8ui, binding = 7) readonly uniform uimage2D font_texture;

void main() {
    int x = int(frag_tex_coord.x * float(font_atlas_width));
    int y = int(frag_tex_coord.y * float(font_atlas_height));
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
uniform float iFade;

out vec4 FragColor;
)");
  }

std::string get_shadertoy_material_fragment_shader_footer()
  {
  return std::string(R"(
void main() 
  {
  mainImage(FragColor, gl_FragCoord.xy);
  FragColor *= iFade;
  }
)");
  }

std::string get_transfer_material_vertex_shader()
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

std::string get_transfer_material_fragment_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  uniform vec2      iTransferResolution;
  uniform sampler2D iTransferChannel0;
  uniform float     iTransferTime;
  uniform float     iTransferMaxTime;
  uniform int       iTransferMethod;
  out vec4 FragColor;
  

  void main()
  {
  if (iTransferMethod == 3) // zoom
    {
    float x = clamp(iTransferTime / iTransferMaxTime, 0, 1);
    float frac = sqrt(abs(x-0.5f))/sqrt(0.5);
    vec2 pos = gl_FragCoord.xy/iTransferResolution;
    FragColor = texture(iTransferChannel0, (2.0*pos-1.0)*frac*0.5+0.5);
    }
  else if (iTransferMethod == 2) // split
    {
    float x = clamp(iTransferTime / iTransferMaxTime, 0, 1);
    float frac = (abs(x-0.5f))/(0.5);
    vec2 pos = gl_FragCoord.xy/iTransferResolution;
    if (pos.x < 0.5)
      {
      if (pos.x < frac*0.5)
        FragColor = texture(iTransferChannel0, pos+vec2((1-frac)*0.5,0));
      else
        FragColor = vec4(0,0,0,1);
      }
    else
      {
      if (pos.x > 1.0-frac*0.5)
        FragColor = texture(iTransferChannel0, pos- vec2((1-frac)*0.5,0));
      else
        FragColor = vec4(0,0,0,1);
      }    
    }
  else if (iTransferMethod == 1) // dia
    {
    float x = clamp(iTransferTime / iTransferMaxTime, 0, 1);
    float frac = 1.0-(abs(x-0.5f))/(0.5);
    vec2 pos = gl_FragCoord.xy/iTransferResolution + vec2(frac,0);
    if (pos.x > 1)
      FragColor = vec4(0,0,0,1);
    else
      FragColor = texture(iTransferChannel0, pos);
    }
  else // fade
    {
    float x = clamp(iTransferTime / iTransferMaxTime, 0, 1);
    float frac = sqrt(abs(x-0.5f))/sqrt(0.5);
    vec2 pos = gl_FragCoord.xy/iTransferResolution;
    FragColor = texture(iTransferChannel0, pos)*frac;
    }
  }
  )");
  }

std::string get_mouse_material_vertex_shader()
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

std::string get_mouse_material_fragment_shader()
  {
  return std::string(R"(#version 330 core
  precision mediump float;
  precision mediump int;
  uniform vec2      iMouse;
  uniform vec2      iMouseResolution;
  uniform int       iMousePixelsize;
  uniform int       iMouseType;
  out vec4 FragColor;
  
vec4 mouseSprite(int lx, int ly, vec4 bg, vec4 c0, vec4 c1) {
  // line 0
  // 11__ ____ __
  if (ly == 0) {
    if (lx == 0) return c1;
    if (lx == 1) return c1;
  }
  // line 1
  // 101_ ____ __
  if (ly == 1) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c1;
  }
  // line 2
  // 1001 ____ __
  if (ly == 2) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c1;
  }
  // line 3
  // 1000 1___ __
  if (ly == 3) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c1;
  }
  // line 4
  // 1000 01__ __
  if (ly == 4) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c0;
    if (lx == 5) return c1;
  }
  // line 5
  // 1000 001_ __
  if (ly == 5) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c0;
    if (lx == 5) return c0;
    if (lx == 6) return c1;
  }
  // line 6
  // 1000 0001 __
  if (ly == 6) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c0;
    if (lx == 5) return c0;
    if (lx == 6) return c0;
    if (lx == 7) return c1;
  }
  // line 7
  // 1000 0000 1_
  if (ly == 7) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c0;
    if (lx == 5) return c0;
    if (lx == 6) return c0;
    if (lx == 7) return c0;
    if (lx == 8) return c1;
  }
  // line 8
  // 1000 0111 11
  if (ly == 8) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c0;
    if (lx == 4) return c0;
    if (lx == 5) return c1;
    if (lx == 6) return c1;
    if (lx == 7) return c1;
    if (lx == 8) return c1;
    if (lx == 9) return c1;
  }
  // line 9
  // 1001 001_ __
  if (ly == 9) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c0;
    if (lx == 3) return c1;
    if (lx == 4) return c0;
    if (lx == 5) return c0;
    if (lx == 6) return c1;
  }
  // line 10
  // 101_ 1001 __
  if (ly == 10) {
    if (lx == 0) return c1;
    if (lx == 1) return c0;
    if (lx == 2) return c1;
    if (lx == 4) return c1;
    if (lx == 5) return c0;
    if (lx == 6) return c0;
    if (lx == 7) return c1;
  }
  // line 11
  // 11__ 1001 __
  if (ly == 11) {
    if (lx == 0) return c1;
    if (lx == 1) return c1;
    if (lx == 4) return c1;
    if (lx == 5) return c0;
    if (lx == 6) return c0;
    if (lx == 7) return c1;
  }
  // line 12
  // 1___ 1001 __
  if (ly == 12) {
    if (lx == 0) return c1;
    if (lx == 5) return c1;
    if (lx == 6) return c0;
    if (lx == 7) return c0;
    if (lx == 8) return c1;
  }
  // line 13
  // ____ _100 1_
  if (ly == 13) {
    if (lx == 5) return c1;
    if (lx == 6) return c0;
    if (lx == 7) return c0;
    if (lx == 8) return c1;
  }
  // line 14
  // ____ __11 1_
  if (ly == 14) {
    if (lx == 6) return c1;
    if (lx == 7) return c1;
    if (lx == 8) return c1;
  }
  return bg;
}

mat2 rotate2d(float angle)
{
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
}

float rect (vec2 uv, vec2 pos, float blurVal, vec2 size)
{
	float value = smoothstep(pos.x - size.x/2., (pos.x - size.x/2.) + blurVal, uv.x) 
        		- smoothstep(pos.x + size.x/2., (pos.x + size.x/2.) + blurVal,uv.x);
    
    return value *= smoothstep(pos.y, pos.y + blurVal, uv.y) 
        		  - smoothstep(pos.y + size.y, (pos.y+size.y) + blurVal, uv.y);
}

float circle(vec2 uv,float radius, vec2 pos)
{
     
    float d = distance(pos,uv);
    float value = step(radius,d);
    
    return value; 
}

  void main()
  {
  if (iMouseType == 1)
  {
    vec2 uv = (gl_FragCoord.xy-iMouse)/iMouseResolution.xy;
    uv.y = -uv.y;
	  float ratio = float(iMouseResolution.x) / float(iMouseResolution.y);
    float xoffset = 0.2;
   	vec2 bladePos = vec2((0.495-xoffset)*ratio,.48);
    vec2 handlePos = vec2((0.499-xoffset)*ratio,.34);
    vec2 shinePos = vec2((0.494-xoffset)*ratio,.48);
    vec2 circlePos = vec2((0.499-xoffset)*ratio,.44);
    vec2 hiltPos = vec2((0.5-xoffset)*ratio,.48);
    vec2 bottomPos = vec2((0.5-xoffset)*ratio,.34);
    
    uv.x *= ratio;
    
    uv-=bladePos;
    uv*= rotate2d(4);
    uv+=bladePos;
    
    vec3 blade = vec3(rect(uv, bladePos, 0.02, vec2(.029, 0.7)));
    vec3 handle = vec3(rect(uv, handlePos, 0.0, vec2(.029, 0.15)));
    vec3 shine = vec3(rect(uv, shinePos, 0.02, vec2(.01, 0.7)));
    float button = circle(uv, 0.01, circlePos);
    vec3 hilt = vec3(rect(uv, hiltPos, 0.0, vec2(.05, .015)));
    vec3 bottom = vec3(rect(uv, bottomPos, 0.0, vec2(.05, .015)));
    
    vec3 col = mix(vec3(.0), vec3(0., 0., 1.), blade);
    col = mix(col, vec3(1., 1., 1.), shine);
    col += mix(col, vec3(.3), handle);
    col += mix(col, vec3(.0), button);
    col = mix(col, vec3(.2), hilt);
    col = mix(col, vec3(.2), bottom);
    
    // Output to screen
    if (col.x == 0)
      discard;
    FragColor = vec4(col,1.0);
    return;
  }
  int localmousex = int(round((gl_FragCoord.x-iMouse.x)/iMousePixelsize));
  int localmousey = int(round((-(gl_FragCoord.y-iMouse.y))/iMousePixelsize));
  vec4 bg = vec4(0,0,0,0);
  vec4 c0 = vec4(1,1,1,1);
  vec4 c1 = vec4(0,0,0,1);
  vec4 clr = mouseSprite(localmousex, localmousey, bg, c0, c1);
  if (clr.w == 0)
    discard;
  FragColor = clr;
  }
  )");
  }
