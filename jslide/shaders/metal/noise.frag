// Noise from "GLSL Noise Algorithms", by patriciogonzalezvivo on GitHub
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
float4 mod289(float4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
float4 perm(float4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(float3 p, float scale){
    p *= scale; // Tweak for allowing scale of noise
    float3 a = floor(p);
    float3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    float4 b = a.xxyy + float4(0.0, 1.0, 0.0, 1.0);
    float4 k1 = perm(b.xyxy);
    float4 k2 = perm(k1.xyxy + b.zzww);

    float4 c = k2 + a.zzzz;
    float4 k3 = perm(c);
    float4 k4 = perm(c + 1.0);

    float4 o1 = fract(k3 * (1.0 / 41.0));
    float4 o2 = fract(k4 * (1.0 / 41.0));

    float4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    float2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    float slice = iTime; // slice of 3d noise

    // Normalized pixel coordinates (from 0 to 1)
    float2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    //float3 col = 0.5 + 0.5*cos(iTime+uv.xyx+float3(0,2,4));
    
    float n = noise(float3(uv.x, uv.y, slice), 100.0); // noise
    
    // Output to screen
    fragColor = float4(float3(n),1.0); // color
}