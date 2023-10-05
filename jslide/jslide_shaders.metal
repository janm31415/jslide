#include <metal_stdlib>
using namespace metal;

struct BlitVertexIn {
  packed_float3 position;
  packed_float3 normal;
  packed_float2 textureCoordinates;
};

struct BlitVertexOut {
  float4 position [[position]];
  float2 texcoord;
};

struct BlitMaterialUniforms {
  float2 iViewResolution;
  float2 iBlitResolution;
  float2 iBlitOffset;
  int iChannel0;
  int iCrt;
  int iFlip;
  int iRotation;
};

vertex BlitVertexOut blit_vertex_shader(const device BlitVertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant BlitMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  BlitVertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  return out;
}

float2 CRTCurveUV( float2 uv )
{
  uv = uv * 2.0 - 1.0;
  float2 offset = abs( uv.yx ) / float2( 6.0, 4.0 );
  uv = uv + uv * offset * offset;
  uv = uv * 0.5 + 0.5;
  return uv;
}

float3 DrawVignette( float3 color, float2 uv )
{
  float vignette = uv.x * uv.y * ( 1.0 - uv.x ) * ( 1.0 - uv.y );
  vignette = clamp( pow( 16.0 * vignette, 0.3 ), 0.0, 1.0 );
  return color * vignette;
}

fragment float4 blit_fragment_shader(const BlitVertexOut vertexIn [[stage_in]], texture2d<float> texture [[texture(0)]], sampler sampler2d [[sampler(0)]], constant BlitMaterialUniforms& input [[buffer(10)]]) {
  float2 pos = (vertexIn.texcoord.xy*input.iViewResolution - input.iBlitOffset)/input.iBlitResolution;
  if (input.iRotation == 90)
  {
    float tmp = pos.x;
    pos.x = 1-pos.y;
    pos.y = tmp;
  }
  else if (input.iRotation == 180)
  {
    pos.x = 1 - pos.x;
    pos.y = 1 - pos.y;
  }
  else if (input.iRotation == 270)
  {
    float tmp = pos.x;
    pos.x = pos.y;
    pos.y = 1-tmp;
  }
  if (pos.x < 0 || pos.y < 0 || pos.x > 1 || pos.y > 1)
    discard_fragment();
  if (input.iFlip > 0)
    pos.y = 1 - pos.y;
  if (input.iCrt > 0)
  {
    float2 crtpos = CRTCurveUV( pos );
    float4 clr = float4( 0.0, 0.0, 0.0, 1.0);
    if (crtpos.x >= 0.0 && crtpos.x <= 1.0 && crtpos.y >= 0.0 && crtpos.y <= 1.0)
      clr = texture.sample(sampler2d, crtpos);
    return float4(DrawVignette( clr.xyz, crtpos), 1);
  }
  return texture.sample(sampler2d, pos);
}


struct FontVertexIn {
  packed_float2 position;
  packed_float2 textureCoordinates;
  packed_float3 color;
};

struct FontMaterialUniforms {
  int font_atlas_width;
  int font_atlas_height;
};

struct FontVertexOut {
  float4 position [[position]];
  float2 texcoord;
  float3 color;
};

vertex FontVertexOut font_material_vertex_shader(const device FontVertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant FontMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 0, 1);
  FontVertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  out.color = vertices[vertexId].color;
  return out;
}

fragment float4 font_material_fragment_shader(const FontVertexOut vertexIn [[stage_in]], texture2d<uint, access::read> texture [[texture(7)]], constant FontMaterialUniforms& input [[buffer(10)]]) {
  //if (vertexIn.texcoord.x < 0 || vertexIn.texcoord.y < 0 || vertexIn.texcoord.x > 1 || vertexIn.texcoord.y > 1)
  //  return float4(0,0,0,0);
  int x = int(vertexIn.texcoord.x * float(input.font_atlas_width));
  int y = int(vertexIn.texcoord.y * float(input.font_atlas_height));
  float a = texture.read(uint2(x,y)).r/255.0;
  return float4(1, 1, 1, a)*float4(vertexIn.color, 1);
  //return float4(1,0,1,1);
}

struct ShadertoyMaterialUniforms {
  float3 iResolution;
  float iTime;
  float iGlobalTime;
  float iTimeDelta;
  int iFrame;
  float iFade;
};

vertex BlitVertexOut jslide_shadertoy_material_vertex_shader(const device BlitVertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant ShadertoyMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  BlitVertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  return out;
}


struct TransferMaterialUniforms {
  float2 iTransferResolution;
  float iTransferChannel0;
  float iTransferTime;
  float iTransferMaxTime;
  int iTransferMethod;
};

vertex BlitVertexOut transfer_material_vertex_shader(const device BlitVertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant TransferMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  BlitVertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  return out;
}

fragment float4 transfer_material_fragment_shader(const BlitVertexOut vertexIn [[stage_in]], texture2d<float> texture [[texture(0)]], sampler sampler2d [[sampler(0)]], constant TransferMaterialUniforms& input [[buffer(10)]]) {
  
  if (input.iTransferMethod == 3) // zoom
  {
    float x = clamp(input.iTransferTime / input.iTransferMaxTime, 0.0, 1.0);
    float frac = sqrt(abs(x-0.5))/sqrt(0.5);
    float2 pos = vertexIn.position.xy/input.iTransferResolution;
    
    return texture.sample(sampler2d, (2.0*pos-1.0)*frac*0.5+0.5);
  }
  else if (input.iTransferMethod == 2) // split
  {
    float x = clamp(input.iTransferTime / input.iTransferMaxTime, 0.0, 1.0);
    float frac = (abs(x-0.5f))/(0.5);
    float2 pos = vertexIn.position.xy/input.iTransferResolution;
    if (pos.x < 0.5)
    {
      if (pos.x < frac*0.5)
        return texture.sample(sampler2d, pos+float2((1-frac)*0.5,0));
      else
        return float4(0,0,0,1);
    }
    else
    {
      if (pos.x > 1.0-frac*0.5)
        return texture.sample(sampler2d, pos- float2((1-frac)*0.5,0));
      else
        return float4(0,0,0,1);
    }
  }
  else if (input.iTransferMethod == 1) // dia
  {
    float x = clamp(input.iTransferTime / input.iTransferMaxTime, 0.0, 1.0);
    float frac = 1.0-(abs(x-0.5f))/(0.5);
    float2 pos = vertexIn.position.xy/input.iTransferResolution + float2(frac,0);
    if (pos.x > 1)
      return float4(0,0,0,1);
    else
      return texture.sample(sampler2d, pos);
  }
  else // fade
  {
    float x = clamp(input.iTransferTime / input.iTransferMaxTime, 0.0, 1.0);
    float frac = sqrt(abs(x-0.5f))/sqrt(0.5);
    float2 pos = vertexIn.position.xy/input.iTransferResolution;
    return texture.sample(sampler2d, pos)*frac;
  }
}


struct MouseMaterialUniforms {
  float2 iMouse;
  float2 iMouseResolution;
  int iMousePixelsize;
  int iMouseType;
};

vertex BlitVertexOut mouse_material_vertex_shader(const device BlitVertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant MouseMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  BlitVertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  return out;
}

float4 mouseSprite(int lx, int ly, float4 bg, float4 c0, float4 c1) {
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

float2x2 mouse_rotate2d(float angle)
{
  return float2x2(cos(angle),-sin(angle), sin(angle), cos(angle));
}

float mouse_rect (float2 uv, float2 pos, float blurVal, float2 size)
{
  float value = smoothstep(pos.x - size.x/2., (pos.x - size.x/2.) + blurVal, uv.x)
  - smoothstep(pos.x + size.x/2., (pos.x + size.x/2.) + blurVal,uv.x);
  
  return value *= smoothstep(pos.y, pos.y + blurVal, uv.y)
  - smoothstep(pos.y + size.y, (pos.y+size.y) + blurVal, uv.y);
}

float mouse_circle(float2 uv,float radius, float2 pos)
{
  
  float d = distance(pos,uv);
  float value = step(radius,d);
  
  return value;
}

fragment float4 mouse_material_fragment_shader(const BlitVertexOut vertexIn [[stage_in]], constant MouseMaterialUniforms& input [[buffer(10)]]) {
  if (input.iMouseType == 1)
  {
    float2 uv = (vertexIn.position.xy-input.iMouse)/input.iMouseResolution;
    float ratio = input.iMouseResolution.x/input.iMouseResolution.y;
    float xoffset = 0.2;
    float2 bladePos = float2((0.495-xoffset)*ratio,.48);
    float2 handlePos = float2((0.499-xoffset)*ratio,.34);
    float2 shinePos = float2((0.494-xoffset)*ratio,.48);
    float2 circlePos = float2((0.499-xoffset)*ratio,.44);
    float2 hiltPos = float2((0.5-xoffset)*ratio,.48);
    float2 bottomPos = float2((0.5-xoffset)*ratio,.34);
    
    uv.x *= ratio;
    
    uv-=bladePos;
    uv*= mouse_rotate2d(4);
    uv+=bladePos;
    
    float3 blade = float3(mouse_rect(uv, bladePos, 0.02, float2(.029, 0.7)));
    float3 handle = float3(mouse_rect(uv, handlePos, 0.0, float2(.029, 0.15)));
    float3 shine = float3(mouse_rect(uv, shinePos, 0.02, float2(.01, 0.7)));
    float button = mouse_circle(uv, 0.01, circlePos);
    float3 hilt = float3(mouse_rect(uv, hiltPos, 0.0, float2(.05, .015)));
    float3 bottom = float3(mouse_rect(uv, bottomPos, 0.0, float2(.05, .015)));
    
    float3 col = mix(float3(.0), float3(0., 0., 1.), blade);
    col = mix(col, float3(1., 1., 1.), shine);
    col += mix(col, float3(.3), handle);
    col += mix(col, float3(.0), button);
    col = mix(col, float3(.2), hilt);
    col = mix(col, float3(.2), bottom);
    if (col.x == 0)
      discard_fragment();
    // Output to screen
    return float4(col,1.0);
  }
  int localmousex = (int)round((vertexIn.position.x-input.iMouse.x)/input.iMousePixelsize);
  int localmousey = (int)round((vertexIn.position.y-input.iMouse.y)/input.iMousePixelsize);
  float4 bg = float4(0,0,0,0);
  float4 c0 = float4(1,1,1,1);
  float4 c1 = float4(0,0,0,1);
  float4 clr = mouseSprite(localmousex, localmousey, bg, c0, c1);
  if (clr.w == 0)
    discard_fragment();
  return clr;
  
}
