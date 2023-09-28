float curve(float t) {
    return t*t;
    //return -t*(t-1.5)*2.;
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    float2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    float ang = 3.14159265359 * 5. / 6.;    
    float2 n = float2(cos(ang), sin(ang));
    float scale = 1.;
    float it = mix(-1., 4., sin(iTime)*.5+.5);
    //float it = 4.*iMouse.x / iResolution.x;
    for (float i=0.; i<it; i++) {
        scale *= 3.;
        uv *= 3.;    
        uv.x = abs(uv.x);
        uv.x -= 1.;
        uv = uv - n*max(0., dot(n, uv - float2(-.5,0)))*2.;
    }
    //ang = mix(ang + ang * 1. / 5., ang, curve(fract(it)));
    //n = float2(cos(ang), sin(ang));
    scale *= 3.;
    uv *= 3.;    
    uv.x = abs(uv.x);
    uv.x -= 1.;
    //uv = uv - n*max(0., dot(n, uv - float2(-.5,0)))*2.;
    uv = uv - n*max(0., dot(n, uv - float2(mix(-1.,-.5,curve(fract(it))),0)))*2.;
    
    float dist = length(uv - float2(clamp(uv.x,-1.,.5), 0.));
    float3 col = float3(0);
    //col.xy = uv;
    //col.z += smoothstep(0.1, 0., length(uv - float2(clamp(uv.x,-.5,.5),0.)));
    col.x = smoothstep(1./iResolution.y, 0., dist/scale);
    //col.y = smoothstep(0.1, 0., length(uv - float2(0.,clamp(uv.y,-.25,.5))));
    // Output to screen
    fragColor = float4(col,1.0);
}