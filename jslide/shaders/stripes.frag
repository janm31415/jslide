void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
vec2 p = (-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;

vec2 q = vec2( atan(p.y,p.x), length(p) );
float f = smoothstep( -0.1, 0.1, sin(q.x*10.0 + iTime) );
vec3 col = mix( vec3(0.42,0.55,1.0), vec3(0.6,0.7,1.0), f );


// vigneting
col *= 1.0 - 0.2*length(p);

fragColor = vec4( col, 1.0 );
}