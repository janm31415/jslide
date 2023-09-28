#define SIZE        iResolution.xy
#define CENTER      (0.5 * SIZE)
#define WIDTH		    iResolution.x
#define HEIGHT	    iResolution.y
#define MAJOR		    max(WIDTH, HEIGHT)
#define MINOR		    min(WIDTH, HEIGHT)
#define TIME		    iTime


const float root2   = 1.41421356237;
const float phi     = 1.61803398875;
const float e       = 2.71828182846;
const float	pi      = 3.14159265359;
const float tau     = 2.0 * pi;

// -------------------------------------------------------------------------------------------------------------------

#define vec1    float

vec1 sstep(float e0, float e1, vec1 x) { return smoothstep(e0, e1, x); }
vec2 sstep(float e0, float e1, vec2 x) { return smoothstep(e0, e1, x); }
vec3 sstep(float e0, float e1, vec3 x) { return smoothstep(e0, e1, x); }
vec4 sstep(float e0, float e1, vec4 x) { return smoothstep(e0, e1, x); }

vec1 isstep(vec1 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
vec2 isstep(vec2 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
vec3 isstep(vec3 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }
vec4 isstep(vec4 x) { return 0.5 - sin(asin(1.0-2.0*x)/3.0); }

vec3 spectrum(float x) { return smoothstep(-1.0, 1.0, cos(x + vec3(0.0, 0.3333 * tau, 0.6667 * tau))); }

void mainImage( out vec4 fragColor, in vec2 uv )
{
	uv = (uv - CENTER) / (0.5 * MAJOR);
  
  float a = atan(uv.x, uv.y);
  float b = abs(2.0 * fract(24.0 * a / tau + 0.5 * TIME) - 1.0);
  float d = 0.5 + 0.5 * cos(18.0 * tau * length(uv) + a - 3.0 * TIME);
  vec3 c = spectrum(a + 0.05 * TIME);
  vec3 col = c * max(b, d);
	fragColor = vec4(col,1.0);
}