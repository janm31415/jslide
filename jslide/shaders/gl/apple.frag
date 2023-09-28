float apple(vec2 p) 
{      
    float A = length(p-vec2(-.078,.02))-.52;
    float B = length(p-vec2(.118,.045))-.552;
    float sides = max(A, B);   
    float C = length(p-vec2(-.181,.108))-.245;
    float D = length(p-vec2(.178,.108))-.245;
    float top = min(C, D); 
    float E = length(p-vec2(-.153,-.29))-.115;
    float F = length(p-vec2(.176,-.3))-.107;
    float bottom = min(E, F); 
    float d = mix(min(top, bottom),sides, smoothstep(.05, -.05, p.y-.188) * smoothstep(-.05,.01, p.y+.382));   
    float G = length(p-vec2(.01, -.608))-.247;
    float h = clamp( 0.5+0.5*(-G-d)/(-.03), 0., 1. );
    d =  mix( -G, d, h ) - (-.03) * h * (1.0 - h);    
    float H = length(p-vec2(.487, .06))-.222;
    d = max(d, -H);   
    float I = length(p-vec2(0,.417))-.113;
    float J = length(p-vec2(0,.17))-.163;
    d = min(d, max(-I, J));   
    float K = length(p-vec2(.207, .365))-.222;
    float L = length(p-vec2(-.02, .567))-.222;
    d = min(d, max(K, L));  
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float k = 1.0 - step(apple(uv), 0.0);
    fragColor = vec4(k, k, k, 1.0);
}