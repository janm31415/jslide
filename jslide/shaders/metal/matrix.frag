

#define time iTime

#define PI2 6.28318530718
#define PI 3.1416

float vorocloud(float2 p, float iTime){
	float f = 0.0;
    float2 pp = cos(float2(p.x * 14.0, (16.0 * p.y + cos(floor(p.x * 30.0)) + time * PI2)) );
    p = cos(p * 12.1 + pp * 10.0 + 0.5 * cos(pp.x * 10.0));
    
    float2 pts[4];
    
    pts[0] = float2(0.5, 0.6);
    pts[1] = float2(-0.4, 0.4);
    pts[2] = float2(0.2, -0.7);
    pts[3] = float2(-0.3, -0.4);
    
    float d = 5.0;
    
    for(int i = 0; i < 4; i++){
      	pts[i].x += 0.03 * cos(float(i)) + p.x;
      	pts[i].y += 0.03 * sin(float(i)) + p.y;
    	d = min(d, distance(pts[i], pp));
    }
    
    f = 2.0 * pow(1.0 - 0.3 * d, 13.0);
    
    f = min(f, 1.0);
    
	return f;
}

float4 scene(float2 UV, float iTime){
    float x = UV.x;
    float y = UV.y;
    
    float2 p = float2(x, y) - float2(0.5);
    
    float4 col = float4(0.0);
	col.g += 0.02;
    
    float v = vorocloud(p, iTime);
    v = 0.2 * floor(v * 5.0);
    
    col.r += 0.1 * v;
    col.g += 0.6 * v;
    col.b += 0.5 * pow(v, 5.0);
    
    
    v = vorocloud(p * 2.0, iTime);
    v = 0.2 * floor(v * 5.0);
    
    col.r += 0.1 * v;
    col.g += 0.2 * v;
    col.b += 0.01 * pow(v, 5.0);
    
    col.a = 1.0;
    
    return col;
}


void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
	float2 uv = fragCoord.xy / iResolution.xy;
	fragColor = scene(uv, iTime);
}