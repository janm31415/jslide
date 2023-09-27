void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec3 col = vec3(0.0);
    float scanlineIntesnsity = 0.125;
    float scanlineCount = 800.0;
    float scanlineYDelta = sin(iTime / 200.0);
    
	float scanline = sin((uv.y - scanlineYDelta) * scanlineCount) * scanlineIntesnsity;

	col -= scanline;
	fragColor = vec4(col,1.0);
}