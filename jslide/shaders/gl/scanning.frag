// Based on shaders:
// Template - 3D 			https://www.shadertoy.com/view/ldfSWs
// Xor - Triangle Grid, 	https://www.shadertoy.com/view/4tSGWz

#define pi 3.14159265358979
#define size 0.5
#define reciproce_sqrt3 0.57735026918962576450914878050196
#define lineThickness 0.01

float planeDistance = 0.2;
float offset;

//------------------------------------------------------------------------
// Camera
//
// Move the camera. In this case it's using time and the mouse position
// to orbitate the camera around the origin of the world (0,0,0), where
// the yellow sphere is.
//------------------------------------------------------------------------
void doCamera( out vec3 camPos, out vec3 camTar, in float time, in vec2 mouse )
{
    //float an = 0.0*iTime + se.x;
	//camPos = vec3(0.0, 2.0, 5.0);
    camPos = vec3(3.5*sin(mouse.x*10.0), 1.0, 5.0*cos(mouse.x*10.0));
    
    camTar = vec3(0.0,0.0,0.0);
}


//------------------------------------------------------------------------
// Background 
//
// The background color. In this case it's just a black color.
//------------------------------------------------------------------------
vec3 doBackground( void )
{
    return vec3( 0.0, 0.0, 0.1);
}


float sdPlane( vec3 p, vec4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}


float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

//------------------------------------------------------------------------
// Modelling 
//
// Defines the shapes (a sphere in this case) through a distance field, in
// this case it's a sphere of radius 1.
//------------------------------------------------------------------------
float doModel( vec3 p )
{
    
    return  min(udRoundBox(p -vec3(1.05,-0.5, 0.4), vec3(0.05, 0.4, 0.5), 0.1),
			min(udRoundBox(p -vec3(-1.05,-0.5, 0.4), vec3(0.05, 0.4, 0.5), 0.1),                
        	min(udRoundBox(p, vec3(0.8, 0.3, 0.1), 0.1),
        	min(udRoundBox(p -vec3(0.0,-0.5, 0.6), vec3(0.8, 0.1, 0.3), 0.1), 
            min(sdPlane(p, vec4(0.0, 1.0, 0.0, 1.0)), sdPlane(p, vec4(0.0, 0.0, 1.0, 2.0)))))));
}

float r(float n)
{
 	return fract(abs(sin(n*55.753)*367.34));   
}

float r(vec2 n)
{
    return r(dot(n,vec2(2.46,-1.21)));
}

vec3 smallTrianglesColor(vec3 pos)
{
    float a = (radians(60.0));
    float zoom = 0.5;
	vec2 c = (pos.xy + vec2(0.0, pos.z)) * vec2(sin(a),1.0);//scaled coordinates
    c = ((c+vec2(c.y,0.0)*cos(a))/zoom) + vec2(floor((c.x-c.y*cos(a))/zoom*4.0)/4.0,0.0);//Add rotations
    float type = (r(floor(c*4.0))*0.2+r(floor(c*2.0))*0.3+r(floor(c))*0.5);//Randomize type
    type += 0.2 * sin(iTime*5.0*type);
    
    float l = min(min((1.0 - (2.0 * abs(fract((c.x-c.y)*4.0) - 0.5))),
        	      (1.0 - (2.0 * abs(fract(c.y * 4.0) - 0.5)))),
                  (1.0 - (2.0 * abs(fract(c.x * 4.0) - 0.5))));
    l = smoothstep(0.06, 0.04, l);
	
	return mix(type, l, 0.5) * vec3(0.2,0.5,1);
} 

vec3 largeTrianglesColor(vec3 pos)
{
    float a = (radians(60.0));
    float zoom = 2.0;
	vec2 c = (pos.xy + vec2(0.0, pos.z)) * vec2(sin(a),1.0);//scaled coordinates
    c = ((c+vec2(c.y,0.0)*cos(a))/zoom) + vec2(floor((c.x-c.y*cos(a))/zoom*4.0)/4.0,0.0);//Add rotations
    
    float l = min(min((1.0 - (2.0 * abs(fract((c.x-c.y)*4.0) - 0.5))),
        	      (1.0 - (2.0 * abs(fract(c.y * 4.0) - 0.5)))),
                  (1.0 - (2.0 * abs(fract(c.x * 4.0) - 0.5))));
    l = smoothstep(0.03, 0.02, l);
	
	return mix(0.01, l, 0.5) * vec3(0.2,0.5,1);
}
   
vec3 gridColor(vec3 pos)
{
    float plane5 = abs(sdPlane(pos, vec4(1.0, 0.0, 0.0, 0)));
    float plane6 = abs(sdPlane(pos, vec4(0.0, 1.0, 0.0, 0)));
    float plane7 = abs(sdPlane(pos, vec4(0.0, 0.0, 1.0, 0)));

    float   nearest = abs(mod(plane5, planeDistance) - 0.5 * planeDistance);
    nearest = min(nearest, abs(mod(plane6, planeDistance) - 0.5 * planeDistance));
    nearest = min(nearest, abs(mod(plane7, planeDistance) - 0.5 * planeDistance));

    return mix(vec3(0.3, 0.3, 0.5), vec3(0.2), smoothstep(0.0, lineThickness, nearest));
}

 
//---------------------------------------------------------------
// Material 
//
// Defines the material (colors, shading, pattern, texturing) of the model
// at every point based on its position and normal. In this case, it simply
// returns a constant yellow color.
//------------------------------------------------------------------------
vec3 doMaterial( in vec3 pos, in vec3 nor )
{
	float d = length(pos.xz - vec2(0.0, 2.0) + 0.5*cos(2.0*pos.xz + vec2(3.0, 1.0) * iTime)) +  pos.y + 0.2 * cos(pos.y - iTime);
    float border = 12.0 * mod(iTime * 0.2, 1.0);
 
    //vec3 c = gridColor(pos);
    vec3 c1 = largeTrianglesColor(pos);
    vec3 c = smallTrianglesColor(pos);
    c *= smoothstep(border - 1.0, border - 2.5, d);
    c += c1;
    c = mix(c, vec3(0.01), smoothstep(border - 4.0, border - 10.0, d));
    c = mix(c, vec3(0.01), smoothstep(border - 1.0, border, d));
    c = mix(c, vec3(0.01), smoothstep(9.0, 12.0, border));
    
    return c;
} 
//------------------------------------------------------------------------
// Lighting 
//------------------------------------------------------------------------
float calcSoftshadow( in vec3 ro, in vec3 rd );

vec3 doLighting( in vec3 pos, in vec3 nor, in vec3 rd, in float dis, in vec3 mal )
{
    vec3 lin = vec3(0.0);

    // key light
    //-----------------------------
    vec3  lig = normalize(vec3(1.0,0.7,0.9));
    float dif = max(dot(nor,lig),0.0);
    float sha = 0.0; if( dif>0.01 ) sha=calcSoftshadow( pos+0.01*nor, lig );
    lin += dif*vec3(4.00,4.00,4.00)*sha;

    // ambient light
    //-----------------------------
    lin += vec3(0.50,0.50,0.50);

    
    // surface-light interacion
    //-----------------------------
    vec3 col = mal*lin;

    
    // fog    
    //-----------------------------
	col *= exp(-0.01*dis*dis);

    return col;
}

float calcIntersection( in vec3 ro, in vec3 rd )
{
	const float maxd = 20.0;           // max trace distance
	const float precis = 0.001;        // precission of the intersection
    float h = precis*2.0;
    float t = 0.0;
	float res = -1.0;
    for( int i=0; i<90; i++ )          // max number of raymarching iterations is 90
    {
        if( h<precis||t>maxd ) break;
	    h = doModel( ro+rd*t );
        t += h;
    }

    if( t<maxd ) res = t;
    return res;
}

vec3 calcNormal( in vec3 pos )
{
    const float eps = 0.002;             // precision of the normal computation

    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);

	return normalize( v1*doModel( pos + v1*eps ) + 
					  v2*doModel( pos + v2*eps ) + 
					  v3*doModel( pos + v3*eps ) + 
					  v4*doModel( pos + v4*eps ) );
}

float calcSoftshadow( in vec3 ro, in vec3 rd )
{
    float res = 1.0;
    float t = 0.0005;                 // selfintersection avoidance distance
	float h = 1.0;
    for( int i=0; i<40; i++ )         // 40 is the max numnber of raymarching steps
    {
        h = doModel(ro + rd*t);
        res = min( res, 64.0*h/t );   // 64 is the hardness of the shadows
		t += clamp( h, 0.02, 2.0 );   // limit the max and min stepping distances
    }
    return clamp(res,0.0,1.0);
}

mat3 calcLookAtMatrix( in vec3 ro, in vec3 ta, in float roll )
{
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(roll),cos(roll),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    return mat3( uu, vv, ww );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //planeDistance = sin(iTime);
    offset = 2.0 * sqrt(2.0) / sqrt(24.0);
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    vec2 m = vec2(0., 0.);

    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    
    // camera movement
    vec3 ro, ta;
    doCamera( ro, ta, iTime, m );

    // camera matrix
    mat3 camMat = calcLookAtMatrix( ro, ta, 0.0 );  // 0.0 is the camera roll
    
	// create view ray
	vec3 rd = normalize( camMat * vec3(p.xy,2.0) ); // 2.0 is the lens length

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------

	vec3 col = doBackground();

	// raymarch
    float t = calcIntersection( ro, rd );
    if( t>-0.5 )
    {
        // geometry
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal(pos);

        // materials
        vec3 mal = doMaterial( pos, nor );

        col = doLighting( pos, nor, rd, t, mal );
	}

	//-----------------------------------------------------
	// postprocessing
    //-----------------------------------------------------
    // gamma
	col = pow( clamp(col,0.0,1.0), vec3(0.5) );
	   
    fragColor = vec4( col, 1.0 );
}