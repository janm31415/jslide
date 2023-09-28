

#define SIZE        iResolution.xy
#define CENTER      (0.5 * SIZE)
#define WIDTH		    iResolution.x
#define HEIGHT	    iResolution.y
#define MAJOR		    max(WIDTH, HEIGHT)
#define MINOR		    min(WIDTH, HEIGHT)
#define TIME		    iTime


constant float root2   = 1.41421356237;
constant float phi     = 1.61803398875;
constant float e       = 2.71828182846;
constant float	pi      = 3.14159265359;
constant float tau     = 2.0 * pi;

// -------------------------------------------------------------------------------------------------------------------

#define float1    float

float1 sstep(float e0, float e1, float1 x) { return smoothstep(e0, e1, x); }
float2 sstep(float e0, float e1, float2 x) { return smoothstep(e0, e1, x); }
float3 sstep(float e0, float e1, float3 x) { return smoothstep(e0, e1, x); }
float4 sstep(float e0, float e1, float4 x) { return smoothstep(e0, e1, x); }

float1 isstep(float1 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
float2 isstep(float2 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
float3 isstep(float3 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
float4 isstep(float4 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }

float3 spectrum(float x) { return smoothstep(-1.0, 1.0, cos(x + float3(0.0, 0.3333 * tau, 0.6667 * tau))); }

void mainImage(thread float4& fragColor, float2 uv, float iTime, float3 iResolution) 
{
	uv = (uv - CENTER) / (0.5 * MAJOR);
  
  float a = atan2(uv.x, uv.y);
  float b = abs(2.0 * fract(24.0 * a / tau + 0.5 * TIME) - 1.0);
  float d = 0.5 + 0.5 * cos(18.0 * tau * length(uv) + a - 3.0 * TIME);
  float3 c = spectrum(a + 0.05 * TIME);
  float3 col = c * max(b, d);
	fragColor = float4(col,1.0);
}