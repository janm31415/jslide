float polygonDistance(float2 p, float radius, float angleOffset, int sideCount) {
	float a = atan2(p.x, p.y)+ angleOffset;
	float b = 6.28319 / float(sideCount);
	return cos(floor(.5 + a / b) * b - a) * length(p) - radius;
}

// from https://www.shadertoy.com/view/4djSRW
float hash11(float p) // assumes p in ~0-1 range
{
	float3 p3  = fract(float3(p) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

#define HASHSCALE3 float3(.1031, .1030, .0973)
float2 hash21(float p) // assumes p in larger integer range
{
	float3 p3 = fract(float3(p) * HASHSCALE3);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract(float2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
	float2 uv = float2(0.5) - (fragCoord.xy / iResolution.xy);
    uv.x *= iResolution.x / iResolution.y;
    
    float accum = 0.;
    for(int i = 0; i < 83; i++) {
        float fi = float(i);
        float thisYOffset = fmod(hash11(fi * 0.017) * (iTime + 19.) * 0.2, 4.0) - 2.0;
        float2 center = (hash21(fi) * 2. - 1.) * float2(1.1, 1.0) - float2(0.0, thisYOffset);
        float radius = 0.5;
        float2 offset = uv - center;
        float twistFactor = (hash11(fi * 0.0347) * 2. - 1.) * 1.9;
        float rotation = 0.1 + iTime * 0.2 + sin(iTime * 0.1) * 0.9 + (length(offset) / radius) * twistFactor;
        accum += pow(smoothstep(radius, 0.0, polygonDistance(uv - center, 0.1 + hash11(fi * 2.3) * 0.2, rotation, 5) + 0.1), 3.0);
    }
    
    float3 subColor = float3(0.4, 0.8, 0.2); //float3(0.4, 0.2, 0.8);
    float3 addColor = float3(0.3, 0.2, 0.1);//float3(0.3, 0.1, 0.2);
    
	fragColor = float4(float3(1.0) - accum * subColor + addColor, 1.0);
}
