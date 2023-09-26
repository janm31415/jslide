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

fragment float4 blit_fragment_shader(const VertexOut vertexIn [[stage_in]], texture2d<float> texture [[texture(0)]], sampler sampler2d [[sampler(0)]], constant BlitMaterialUniforms& input [[buffer(10)]]) {
  return texture.sample(sampler2d, vertexIn.texcoord);
}
