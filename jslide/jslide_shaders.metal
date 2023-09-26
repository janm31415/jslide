 #include <metal_stdlib>
using namespace metal;

struct VertexIn {
  packed_float3 position;
  packed_float3 normal;
  packed_float2 textureCoordinates;
};

struct VertexOut {
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

vertex VertexOut blit_vertex_shader(const device VertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant BlitMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  VertexOut out;
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

fragment float4 blit_fragment_shader(const VertexOut vertexIn [[stage_in]], texture2d<float> texture [[texture(0)]], sampler sampler2d [[sampler(0)]], constant BlitMaterialUniforms& input [[buffer(10)]]) {
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
  int width;
  int height;
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

fragment float4 font_material_fragment_shader(const FontVertexOut vertexIn [[stage_in]], texture2d<uint> texture [[texture(7)]], constant FontMaterialUniforms& input [[buffer(10)]]) {
  int x = int(vertexIn.texcoord.x * float(input.width));
  int y = int(vertexIn.texcoord.y * float(input.height));
  float a = texture.read(uint2(x,y)).r/255.0;
  return float4(1, 1, 1, a)*float4(vertexIn.color, 1);
}

struct ShadertoyMaterialUniforms {
  float3 iResolution;
  float iTime;
  float iGlobalTime;
  float iTimeDelta;
  int iFrame;
};

vertex VertexOut jslide_shadertoy_material_vertex_shader(const device VertexIn *vertices [[buffer(0)]], uint vertexId [[vertex_id]], constant ShadertoyMaterialUniforms& input [[buffer(10)]]) {
  float4 pos(vertices[vertexId].position, 1);
  VertexOut out;
  out.position = pos;
  out.texcoord = vertices[vertexId].textureCoordinates;
  return out;
}
