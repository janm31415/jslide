void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
    float time = iTime*1.0;
    float2 uv = (fragCoord.xy / iResolution.xy-0.5)*8.0;
    float2 uv0=uv;
    float i0=.8;
    float i1=.8;
    float i2=.75;
    float i4=0.;
    for(int s=0;s<7;s++)
    {
        float2 r;
        r=float2(cos(uv.y*i0-i4-time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=float2(-r.y,r.x)*0.3;
        uv.xy+=r;
        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
    }
    float b=sin(uv.x-time)*0.5+0.5;
    float r=sin(uv.y+time)*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
    fragColor = float4(r,g,b,1.);
}
