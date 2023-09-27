// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// David Hoskins.
// https://www.shadertoy.com/view/Md2GDy

float gTime;


vec3 Fractal(vec2 uv)
{
	vec2 p = gTime * ((iResolution.xy-uv)/iResolution.y) - gTime * 0.5 + 0.363 - (smoothstep(0.05, 1.5, gTime)*vec2(.5, .365));
	vec2 z = p;
	float g = 4., f = 4.0;
	for( int i = 0; i < 90; i++ ) 
	{
		float w = float(i)*22.4231+iTime*2.0;
		vec2 z1 = vec2(2.*cos(w),2.*sin(w));		   
		z = vec2( z.x*z.x-z.y*z.y, 2.0 *z.x*z.y ) + p;
		g = min( g, dot(z-z1,z-z1));
		f = min( f, dot(z,z) );
	}
	g =  min(pow(max(1.0-g, 0.0), .15), 1.0);
	// Eye colours...
	vec3 col = mix(vec3(g), vec3(.3, .5, .1), smoothstep(.89, .91, g));
	col = mix(col, vec3(.0), smoothstep(.98, .99, g));
	float c = abs(log(abs(f))/25.0);
	col = mix(col, vec3(f*.03, c*.4, c ), 1.0-g);
	return clamp(col, 0.0, 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    gTime = pow(abs((.57+cos(iTime*.2)*.55)), 3.0);

    float expand = smoothstep(1.2, 1.6, gTime)*32.0+.5;
	// Anti-aliasing...
	vec3 col = vec3(0.0);
	for (float y = 0.; y < 2.; y++)
	{
		for (float x = 0.; x < 2.; x++)
		{
			col += Fractal(fragCoord.xy + vec2(x, y) * expand);
		}
	}
	
	fragColor = vec4(sqrt(col/4.0), 1.0);
}