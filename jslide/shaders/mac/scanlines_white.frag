void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
	float2 uv = fragCoord.xy / iResolution.xy;
    float3 col = float3(1.0);
    float scanlineIntesnsity = 0.125;
    float scanlineCount = 800.0;
    float scanlineYDelta = sin(iTime / 200.0);
    
	float scanline = sin((uv.y - scanlineYDelta) * scanlineCount) * scanlineIntesnsity;

	col -= scanline;
	fragColor = float4(col,1.0);
}