// The MIT License
// Copyright ﾩ 2014 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/

// Compute fake soft shadows for sphere objects. You can see this in action here: 
//
// https://www.shadertoy.com/view/lsSSWV
//
// and
//
// https://www.shadertoy.com/view/XdjXWK
//
//
// Related info: https://iquilezles.org/articles/spherefunctions
//
// Other Soft Shadow functions:
//
// Sphere:    https://www.shadertoy.com/view/4d2XWV
// Ellipsoid: https://www.shadertoy.com/view/llsSzn
// Box:       https://www.shadertoy.com/view/WslGz4
// Capsule:   https://www.shadertoy.com/view/MlGczG


//-------------------------------------------------------------------------------------------
// sphere related functions
//-------------------------------------------------------------------------------------------

float sphIntersect( float3 ro, float3 rd, float4 sph )
{
	float3 oc = ro - sph.xyz;
	float b = dot( oc, rd );
	float c = dot( oc, oc ) - sph.w*sph.w;
	float h = b*b - c;
	if( h<0.0 ) return -1.0;
	return -b - sqrt( h );
}


float sphSoftShadow( float3 ro, float3 rd, float4 sph, float k )
{
    float3 oc = ro - sph.xyz;
    float b = dot( oc, rd );
    float c = dot( oc, oc ) - sph.w*sph.w;
    float h = b*b - c;
    
#if 0
    // physically plausible shadow
    float d = sqrt( max(0.0,sph.w*sph.w-h)) - sph.w;
    float t = -b - sqrt( max(h,0.0) );
    return (t<0.0) ? 1.0 : smoothstep(0.0, 1.0, 2.5*k*d/t );
#else
    // cheap but not plausible alternative
    return (b>0.0) ? step(-0.0001,c) : smoothstep( 0.0, 1.0, h*k/b );
#endif    
}    
            
float sphOcclusion( float3 pos, float3 nor, float4 sph )
{
    float3  r = sph.xyz - pos;
    float l = length(r);
    return dot(nor,r)*(sph.w*sph.w)/(l*l*l);
}

float3 sphNormal( float3 pos, float4 sph )
{
    return normalize(pos-sph.xyz);
}

//=====================================================

float iPlane( float3 ro, float3 rd )
{
    return (-1.0 - ro.y)/rd.y;
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
	float2 p = (2.0*fragCoord.xy-iResolution.xy) / iResolution.y;
    
	float3 ro = float3(0.0, 0.0, 4.0 );
	float3 rd = normalize( float3(p,-2.0) );
	
    // sphere animation
    float4 sph = float4( cos( iTime + float3(2.0,1.0,1.0) + 0.0 )*float3(1.5,0.0,1.0), 1.0 );
    
    float3 lig = normalize( float3(0.6,0.3,0.4) );
    float3 col = float3(0.0);

    float tmin = 1e10;
    float3 nor;
    float occ = 1.0;
    
    float t1 = iPlane( ro, rd );
    if( t1>0.0 )
    {
        tmin = t1;
        float3 pos = ro + t1*rd;
        nor = float3(0.0,1.0,0.0);
        occ = 1.0-sphOcclusion( pos, nor, sph );
    }
#if 1
    float t2 = sphIntersect( ro, rd, sph );
    if( t2>0.0 && t2<tmin )
    {
        tmin = t2;
        float3 pos = ro + t2*rd;
        nor = sphNormal( pos, sph );
        occ = 0.5 + 0.5*nor.y;
	}
#endif 
    if( tmin<1000.0 )
    {
        float3 pos = ro + tmin*rd;
        
		col = float3(1.0);
        col *= clamp( dot(nor,lig), 0.0, 1.0 );
        col *= sphSoftShadow( pos, lig, sph, 2.0 );
        col += 0.05*occ;
	    col *= exp( -0.05*tmin );
    }

    col = sqrt(col);
    fragColor = float4( col, 1.0 );
}