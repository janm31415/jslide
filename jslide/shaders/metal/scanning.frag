// Based on shaders:
// Template - 3D 			https://www.shadertoy.com/view/ldfSWs
// Xor - Triangle Grid, 	https://www.shadertoy.com/view/4tSGWz

#define pi 3.14159265358979
#define size 0.5
#define reciproce_sqrt3 0.57735026918962576450914878050196
#define lineThickness 0.01

constant float planeDistance = 0.2;

float radians(float deg) {
  return deg*3.1415926535897/180.0;
}



//------------------------------------------------------------------------
// Camera
//
// Move the camera. In this case it's using time and the mouse position
// to orbitate the camera around the origin of the world (0,0,0), where
// the yellow sphere is.
//------------------------------------------------------------------------
void doCamera( thread float3& camPos, thread float3& camTar, float time, float2 mouse )
{
    //float an = 0.0*iTime + se.x;
	//camPos = float3(0.0, 2.0, 5.0);
    camPos = float3(3.5*sin(mouse.x*10.0), 1.0, 5.0*cos(mouse.x*10.0));
    
    camTar = float3(0.0,0.0,0.0);
}


//------------------------------------------------------------------------
// Background 
//
// The background color. In this case it's just a black color.
//------------------------------------------------------------------------
float3 doBackground( void )
{
    return float3( 0.0, 0.0, 0.1);
}


float sdPlane( float3 p, float4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}


float udRoundBox( float3 p, float3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

//------------------------------------------------------------------------
// Modelling 
//
// Defines the shapes (a sphere in this case) through a distance field, in
// this case it's a sphere of radius 1.
//------------------------------------------------------------------------
float doModel( float3 p )
{
    
    return  min(udRoundBox(p -float3(1.05,-0.5, 0.4), float3(0.05, 0.4, 0.5), 0.1),
			min(udRoundBox(p -float3(-1.05,-0.5, 0.4), float3(0.05, 0.4, 0.5), 0.1),                
        	min(udRoundBox(p, float3(0.8, 0.3, 0.1), 0.1),
        	min(udRoundBox(p -float3(0.0,-0.5, 0.6), float3(0.8, 0.1, 0.3), 0.1), 
            min(sdPlane(p, float4(0.0, 1.0, 0.0, 1.0)), sdPlane(p, float4(0.0, 0.0, 1.0, 2.0)))))));
}

float r(float n)
{
 	return fract(abs(sin(n*55.753)*367.34));   
}

float r(float2 n)
{
    return r(dot(n,float2(2.46,-1.21)));
}

float3 smallTrianglesColor(float3 pos, float iTime)
{
    float a = (radians(60.0));
    float zoom = 0.5;
	float2 c = (pos.xy + float2(0.0, pos.z)) * float2(sin(a),1.0);//scaled coordinates
    c = ((c+float2(c.y,0.0)*cos(a))/zoom) + float2(floor((c.x-c.y*cos(a))/zoom*4.0)/4.0,0.0);//Add rotations
    float type = (r(floor(c*4.0))*0.2+r(floor(c*2.0))*0.3+r(floor(c))*0.5);//Randomize type
    type += 0.2 * sin(iTime*5.0*type);
    
    float l = min(min((1.0 - (2.0 * abs(fract((c.x-c.y)*4.0) - 0.5))),
        	      (1.0 - (2.0 * abs(fract(c.y * 4.0) - 0.5)))),
                  (1.0 - (2.0 * abs(fract(c.x * 4.0) - 0.5))));
    l = smoothstep(0.06, 0.04, l);
	
	return mix(type, l, 0.5) * float3(0.2,0.5,1);
} 

float3 largeTrianglesColor(float3 pos)
{
    float a = (radians(60.0));
    float zoom = 2.0;
	float2 c = (pos.xy + float2(0.0, pos.z)) * float2(sin(a),1.0);//scaled coordinates
    c = ((c+float2(c.y,0.0)*cos(a))/zoom) + float2(floor((c.x-c.y*cos(a))/zoom*4.0)/4.0,0.0);//Add rotations
    
    float l = min(min((1.0 - (2.0 * abs(fract((c.x-c.y)*4.0) - 0.5))),
        	      (1.0 - (2.0 * abs(fract(c.y * 4.0) - 0.5)))),
                  (1.0 - (2.0 * abs(fract(c.x * 4.0) - 0.5))));
    l = smoothstep(0.03, 0.02, l);
	
	return mix(0.01, l, 0.5) * float3(0.2,0.5,1);
}
   
float3 gridColor(float3 pos)
{
    float plane5 = abs(sdPlane(pos, float4(1.0, 0.0, 0.0, 0)));
    float plane6 = abs(sdPlane(pos, float4(0.0, 1.0, 0.0, 0)));
    float plane7 = abs(sdPlane(pos, float4(0.0, 0.0, 1.0, 0)));

    float   nearest = abs(fmod(plane5, planeDistance) - 0.5 * planeDistance);
    nearest = min(nearest, abs(fmod(plane6, planeDistance) - 0.5 * planeDistance));
    nearest = min(nearest, abs(fmod(plane7, planeDistance) - 0.5 * planeDistance));

    return mix(float3(0.3, 0.3, 0.5), float3(0.2), smoothstep(0.0, lineThickness, nearest));
}

 
//---------------------------------------------------------------
// Material 
//
// Defines the material (colors, shading, pattern, texturing) of the model
// at every point based on its position and normal. In this case, it simply
// returns a constant yellow color.
//------------------------------------------------------------------------
float3 doMaterial( float3 pos, float3 nor, float iTime )
{
	float d = length(pos.xz - float2(0.0, 2.0) + 0.5*cos(2.0*pos.xz + float2(3.0, 1.0) * iTime)) +  pos.y + 0.2 * cos(pos.y - iTime);
    float border = 12.0 * fmod(iTime * 0.2, 1.0);
 
    //float3 c = gridColor(pos);
    float3 c1 = largeTrianglesColor(pos);
    float3 c = smallTrianglesColor(pos, iTime);
    c *= smoothstep(border - 1.0, border - 2.5, d);
    c += c1;
    c = mix(c, float3(0.01), smoothstep(border - 4.0, border - 10.0, d));
    c = mix(c, float3(0.01), smoothstep(border - 1.0, border, d));
    c = mix(c, float3(0.01), smoothstep(9.0, 12.0, border));
    
    return c;
} 
//------------------------------------------------------------------------
// Lighting 
//------------------------------------------------------------------------
float calcSoftshadow( float3 ro, float3 rd );

float3 doLighting( float3 pos, float3 nor, float3 rd, float dis, float3 mal )
{
    float3 lin = float3(0.0);

    // key light
    //-----------------------------
    float3  lig = normalize(float3(1.0,0.7,0.9));
    float dif = max(dot(nor,lig),0.0);
    float sha = 0.0; if( dif>0.01 ) sha=calcSoftshadow( pos+0.01*nor, lig );
    lin += dif*float3(4.00,4.00,4.00)*sha;

    // ambient light
    //-----------------------------
    lin += float3(0.50,0.50,0.50);

    
    // surface-light interacion
    //-----------------------------
    float3 col = mal*lin;

    
    // fog    
    //-----------------------------
	col *= exp(-0.01*dis*dis);

    return col;
}

float calcIntersection( float3 ro, float3 rd )
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

float3 calcNormal( float3 pos )
{
    const float eps = 0.002;             // precision of the normal computation

    const float3 v1 = float3( 1.0,-1.0,-1.0);
    const float3 v2 = float3(-1.0,-1.0, 1.0);
    const float3 v3 = float3(-1.0, 1.0,-1.0);
    const float3 v4 = float3( 1.0, 1.0, 1.0);

	return normalize( v1*doModel( pos + v1*eps ) + 
					  v2*doModel( pos + v2*eps ) + 
					  v3*doModel( pos + v3*eps ) + 
					  v4*doModel( pos + v4*eps ) );
}

float calcSoftshadow( float3 ro, float3 rd )
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

float3x3 calcLookAtMatrix( float3 ro, float3 ta, float roll )
{
    float3 ww = normalize( ta - ro );
    float3 uu = normalize( cross(ww,float3(sin(roll),cos(roll),0.0) ) );
    float3 vv = normalize( cross(uu,ww));
    return float3x3( uu, vv, ww );
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    //planeDistance = sin(iTime);
    
    float2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    float2 m = float2(0., 0.);

    //-----------------------------------------------------
    // camera
    //-----------------------------------------------------
    
    // camera movement
    float3 ro, ta;
    doCamera( ro, ta, iTime, m );

    // camera matrix
    float3x3 camMat = calcLookAtMatrix( ro, ta, 0.0 );  // 0.0 is the camera roll
    
	// create view ray
	float3 rd = normalize( camMat * float3(p.xy,2.0) ); // 2.0 is the lens length

    //-----------------------------------------------------
	// render
    //-----------------------------------------------------

	float3 col = doBackground();

	// raymarch
    float t = calcIntersection( ro, rd );
    if( t>-0.5 )
    {
        // geometry
        float3 pos = ro + t*rd;
        float3 nor = calcNormal(pos);

        // materials
        float3 mal = doMaterial( pos, nor, iTime );

        col = doLighting( pos, nor, rd, t, mal );
	}

	//-----------------------------------------------------
	// postprocessing
    //-----------------------------------------------------
    // gamma
	col = pow( clamp(col,0.0,1.0), float3(0.5) );
	   
    fragColor = float4( col, 1.0 );
}