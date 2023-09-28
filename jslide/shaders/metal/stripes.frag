void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
float2 p = (-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;

float2 q = float2( atan2(p.y,p.x), length(p) );
float f = smoothstep( -0.1, 0.1, sin(q.x*10.0 + iTime) );
float3 col = mix( float3(0.42,0.55,1.0), float3(0.6,0.7,1.0), f );


// vigneting
col *= 1.0 - 0.2*length(p);

fragColor = float4( col, 1.0 );
}