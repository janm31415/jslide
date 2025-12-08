// Created by genis sole - 2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.

// A remastered version of this can be found here: https://www.shadertoy.com/view/MtyGWK 
// Adds a better traversal, stronger lighting, softer shadows and AO.

constant float PI = 3.1416;

float2 hash2( float2 p )
{
    // procedural white noise	
	return fract(sin(float2(dot(p,float2(127.1,311.7)),
                          dot(p,float2(269.5,183.3))))*43758.5453);
}

// From https://iquilezles.org/articles/voronoilines
float3 voronoi( float2 x, float iTime)
{
    float2 n = floor(x);
    float2 f = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	float2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        float2 g = float2(float(i),float(j));
		float2 o = hash2( n + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iTime + 6.2831*o );
        #endif
        float2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        float2 g = mg + float2(float(i),float(j));
		float2 o = hash2( n + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iTime + 6.2831*o );
        #endif	
        float2 r = g + o - f;

        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }

    return float3( md, mr );
}


// Modified version of the above iq's voronoi borders. 
// Returns the distance to the border in a given direction.
float3 voronoi( float2 x, float2 dir)
{
    float2 n = floor(x);
    float2 f = fract(x);

    //----------------------------------
    // first pass: regular voronoi
    //----------------------------------
	float2 mg, mr;

    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        float2 g = float2(float(i),float(j));
		float2 o = hash2( n + g );
        float2 r = g + o - f;
        float d = dot(r,r);

        if( d<md )
        {
            md = d;
            mr = r;
            mg = g;
        }
    }

    //----------------------------------
    // second pass: distance to borders
    //----------------------------------
    md = 1e5;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        float2 g = mg + float2(float(i),float(j));
		float2 o = hash2( n + g );
		float2 r = g + o - f;

    
 		if( dot(r-mr,r-mr) > 1e-5 ) {
            float2 l = r-mr;
            
            if (dot(dir, l) > 1e-5) {
            	md = min(md, dot(0.5*(mr+r), l)/dot(dir, l));
            }
        }
        
    }
    
    return float3( md, n+mg);
}

bool IRayAABox(float3 ro, float3 rd, float3 invrd, float3 bmin, float3 bmax, 
               thread float3& p0, thread float3& p1) 
{
    float3 t0 = (bmin - ro) * invrd;
    float3 t1 = (bmax - ro) * invrd;

    float3 tmin = min(t0, t1);
    float3 tmax = max(t0, t1);
    
    float fmin = max(max(tmin.x, tmin.y), tmin.z);
    float fmax = min(min(tmax.x, tmax.y), tmax.z);
    
    p0 = ro + rd*fmin;
    p1 = ro + rd*fmax;
 
    return fmax >= fmin;   
}

float3 AABoxNormal(float3 bmin, float3 bmax, float3 p) 
{
    float3 n1 = -(1.0 - smoothstep(0.0, 0.03, p - bmin));
    float3 n2 = (1.0 -  smoothstep(0.0, 0.03, bmax - p));
    
    return normalize(n1 + n2);
}

constant float3 background = float3(0.04);
constant float3 scmin = -float3(1.77, 1.0, 1.77);
constant float3 scmax = float3(1.77, 1.5, 1.77);

// From https://iquilezles.org/articles/palettes
float3 pal( float t, float3 a, float3 b, float3 c, float3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float3 color(float2 p) {
    return pal(3.434+(hash2(p).x*0.02), 
               float3(0.5,0.5,0.5),float3(0.5,0.5,0.5),float3(1.0,0.7,0.4),float3(0.0,0.15,0.20)  );
}

float disp(float2 p, float iTime) {
    return scmin.y + 0.1 + hash2(p).x * 0.5 + hash2(trunc(float2(hash2(p).x, 0.0)*iTime)).x*2.0;
}

float4 map(float2 p, float2 dir, float iTime) {
    float3 v = voronoi(p*2.0, dir)*0.5;
    return float4(v, disp(v.yz, iTime));
}

float ShadowFactor(float3 ro, float3 rd, float iTime) {
	float3 p0 = float3(0.0);
    float3 p1 = float3(0.0);
    
    IRayAABox(ro, rd, 1.0/rd, scmin, scmax, p0, p1);
    p0 = ro + rd*0.02;
    
    float2 dir = normalize(rd.xz);
    float sf = rd.y / length(rd.xz);

    float m = -1e5;
    
    const int max_steps = 32;
    for (int i = max_steps; i > 0; --i) {
        if (p0.y < m) break;
        
        if (dot((p1 - p0), rd) < 0.0) return 1.0;
  
        float4 v = map(p0.xz, dir, iTime);
        
        m = v.w;
        if (p0.y < m) return 0.0;
        
        p0 += rd*(length(float2(v.x, v.x*sf)) + 0.02);
    }
    
    p0 += rd * (m - p0.y)/rd.y;
    if (dot((p1 - p0), rd) < 0.0) return 1.0;   
    
    return 0.0;
}

float3 Shade( float3 p,  float3 n,  float3 ld,  float2 c, float iTime) {
    float3 col = color(c);
	return (col * 0.15 + col * max(0.0, dot(n,ld)) * ShadowFactor(p, ld, iTime) * 0.85) * 3.5;
}

float3 Render(float3 ro, float3 rd, float3 ld, float iTime) {
    float3 p0 = float3(0.0);
    float3 p1 = float3(0.0);
    
    if (!IRayAABox(ro, rd, 1.0/rd, scmin, scmax, p0, p1)) return background;
    
    float2 dir = normalize(rd.xz);
    float sf = rd.y / length(rd.xz);
    
    float2 lvp = float2(0);
    float2 vp = p0.xz;
    
    float m = -1e5;
    
    float3 n = float3(0.0);
    
    const int max_steps = 32;
    for (int i = max_steps; i > 0; --i) {
        if (p0.y < m) {
            n = float3(0.0, 1.0, 0.0);
            break;
        }
        
        if (dot((p1 - p0), rd) < 0.0) return background;
  
        float4 v = map(p0.xz, dir, iTime);
		
        lvp = vp;
        vp = v.yz;
        
        m = v.w;
        if (p0.y < m) break;
        
        p0 += rd*(length(float2(v.x, v.x*sf)) + 0.02);
    }
    
    
    
    if (n.y != 0.0) {
    	p0 += rd * (-p0.y + m)/rd.y;
        if (dot((p1 - p0), rd) < 0.0) return background;
    }
    
    n = normalize(mix(float3(normalize(lvp - vp), 0.0).xzy, n, 
                  smoothstep(0.00, 0.03, voronoi(p0.xz*2.0, iTime).x*0.5)));
    
    if ((p0.x == lvp.x) && (p0.y == lvp.y)) {
    	n = AABoxNormal(scmin, scmax, p0); 
    }
    
    return Shade(p0, n, ld, vp, iTime);
}

void CameraOrbitRay(float2 fragCoord, float n, float3 c, float d, 
                    thread float3& ro, thread float3& rd, thread float3x3& t, float3 iResolution) 
{
    float a = 1.0/max(iResolution.x, iResolution.y);
    rd = normalize(float3((fragCoord - iResolution.xy*0.5)*a, n));
 
    ro = float3(0.0, 0.0, -d);
    
    float ff = 0.2;
    float2 m = PI*ff + float2(((float2(0.5) + 0.1) / iResolution.xy) * (PI*2.0));
    m.y = -m.y;
    m.y = sin(m.y*0.5)*0.6 + 0.6;
        
    float3x3 rotX = float3x3(1.0, 0.0, 0.0, 0.0, cos(m.y), sin(m.y), 0.0, -sin(m.y), cos(m.y));
    float3x3 rotY = float3x3(cos(m.x), 0.0, -sin(m.x), 0.0, 1.0, 0.0, sin(m.x), 0.0, cos(m.x));
    
    t = rotY * rotX;
    
    ro = t * ro;
    ro = c + ro;

    rd = t * rd;
    
    rd = normalize(rd);
}

float3 LightDir(float3x3 t) 
{
    float3 l = normalize(float3(1.0, 1.0, -1.0));
    return t * l;
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
    float3 ro = float3(0.0);
    float3 rd = float3(0.0);
    float3x3 t = float3x3(1.0);
    
    CameraOrbitRay(fragCoord, 1.0, float3(0.0), 10.0, ro, rd, t, iResolution);
	  fragColor = float4(pow(Render(ro, rd, LightDir(t), iTime), float3(0.5454)), 1.0);
}