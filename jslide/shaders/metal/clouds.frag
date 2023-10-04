constant float cloudscale = 1.1;
constant float speed = 0.03;
constant float clouddark = 0.5;
constant float cloudlight = 0.3;
constant float cloudcover = 0.2;
constant float cloudalpha = 8.0;
constant float skytint = 0.5;
constant float3 skycolour1 = float3(0.2, 0.4, 0.6);
constant float3 skycolour2 = float3(0.4, 0.7, 1.0);

constant float2x2 m = float2x2( 1.6,  1.2, -1.2,  1.6 );

float2 hash( float2 p ) {
	p = float2(dot(p,float2(127.1,311.7)), dot(p,float2(269.5,183.3)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( float2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	float2 i = floor(p + (p.x+p.y)*K1);	
    float2 a = p - i + (i.x+i.y)*K2;
    float2 o = (a.x>a.y) ? float2(1.0,0.0) : float2(0.0,1.0); //float2 of = 0.5 + 0.5*float2(sign(a.x-a.y), sign(a.y-a.x));
    float2 b = a - o + K2;
	float2 c = a - 1.0 + 2.0*K2;
    float3 h = max(0.5-float3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	float3 n = h*h*h*h*float3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, float3(70.0));	
}

float fbm(float2 n) {
	float total = 0.0, amplitude = 0.1;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

// -----------------------------------------------

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
  {
    float2 p = fragCoord.xy / iResolution.xy;
	float2 uv = p*float2(iResolution.x/iResolution.y,1.0);    
    float time = iTime * speed;
    float q = fbm(uv * cloudscale * 0.5);
    
    //ridged noise shape
	float r = 0.0;
	uv *= cloudscale;
    uv -= q - time;
    float weight = 0.8;
    for (int i=0; i<8; i++){
		r += abs(weight*noise( uv ));
        uv = m*uv + time;
		weight *= 0.7;
    }
    
    //noise shape
	float f = 0.0;
    uv = p*float2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale;
    uv -= q - time;
    weight = 0.7;
    for (int i=0; i<8; i++){
		f += weight*noise( uv );
        uv = m*uv + time;
		weight *= 0.6;
    }
    
    f *= r + f;
    
    //noise colour
    float c = 0.0;
    time = iTime * speed * 2.0;
    uv = p*float2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale*2.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c += weight*noise( uv );
        uv = m*uv + time;
		weight *= 0.6;
    }
    
    //noise ridge colour
    float c1 = 0.0;
    time = iTime * speed * 3.0;
    uv = p*float2(iResolution.x/iResolution.y,1.0);
	uv *= cloudscale*3.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
		c1 += abs(weight*noise( uv ));
        uv = m*uv + time;
		weight *= 0.6;
    }
	
    c += c1;
    
    float3 skycolour = mix(skycolour2, skycolour1, p.y);
    float3 cloudcolour = float3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
   
    f = cloudcover + cloudalpha*f*r;
    
    float3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
    
	fragColor = float4( result, 1.0 );
}