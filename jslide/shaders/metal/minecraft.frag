// Minecraft Blocks. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MdlGz4
//
// port of javascript minecraft: http://jsfiddle.net/uzMPU/
// original code by Markus Persson: https://twitter.com/notch/status/275331530040160256

float hash( float n ) {
    return fract(sin(n)*43758.5453);
}

// port of minecraft

bool getMaterialColor( int i, float2 coord, thread float3& color ) {
	// 16x16 tex
	float2 uv = floor( coord );

    float n = uv.x + uv.y*347.0 + 4321.0 * float(i);
	float h = hash(n);
		
    float br = 1. - h * (96./255.
						);
	color = float3( 150./255., 108./255.,  74./255.); // 0x966C4A;
	
	if (i == 4) {
		color = float3( 127./255., 127./255., 127./255.); // 0x7F7F7F;
	}
	
	float xm1 = fmod((uv.x * uv.x * 3. + uv.x * 81.) / 4., 4.);
	
	if (i == 1) {
		if( uv.y < (xm1 + 18.)) {
			color = float3( 106./255., 170./255.,  64./255.); // 0x6AAA40;
		} else if (uv.y < (xm1 + 19.)) {
			br = br * (2. / 3.);
		}
	}
	
	if (i == 7) {
		color = float3( 103./255., 82./255.,  49./255.); // 0x675231;
		if (uv.x > 0. && uv.x < 15.
			&& ((uv.y > 0. && uv.y < 15.) || (uv.y > 32. && uv.y < 47.))) {
			color = float3( 188./255., 152./255.,  98./255.); // 0xBC9862;
			float xd = (uv.x - 7.);
			float yd = (fmod(uv.y, 16.) - 7.);
			if (xd < 0.)
				xd = 1. - xd;
			if (yd < 0.)
				yd = 1. - yd;
			if (yd > xd)
				xd = yd;
			
			br = 1. - (h * (32./255.) + fmod(xd, 4.) * (32./255.));
		} else if ( h < 0.5 ) {
			br = br * (1.5 - fmod(uv.x, 2.));
		}
	}
	
	if (i == 5) {
		color = float3( 181./255.,  58./255.,  21./255.); // 0xB53A15;
		if ( fmod(uv.x + (floor(uv.y / 4.) * 5.), 8.) == 0. || fmod( uv.y, 4.) == 0.) {
			color = float3( 188./255., 175./255., 165./255.); // 0xBCAFA5;
		}
	}
	if (i == 9) {
		color = float3(  64./255.,  64./255., 255./255.); // 0x4040ff;
	}
	
	float brr = br;
	if (uv.y >= 32.)
		brr /= 2.;
	
	if (i == 8) {
		color = float3(  80./255., 217./255.,  55./255.); // 0x50D937;
		if ( h < 0.5) {
			return false;
		}
	}
	
	color *= brr;
	
	return true;
}

int getMap( float3 pos ) {	
	float3 posf = floor( (pos - float3(32.))  );
    
	float n = posf.x + posf.y*517.0 + 1313.0*posf.z;
    float h = hash(n);
	
	if( h > sqrt( sqrt( dot( posf.yz, posf.yz )*0.16 ) ) - 0.8  ) {
        return 0;
	}	
	
	return int( hash( n * 465.233 ) * 16. );
}

float3 renderMinecraft( float2 uv, float iTime, float3 iResolution) {
    float xRot = sin( iTime*0.5 ) * 0.4 + (3.1415 / 2.);
    float yRot = cos( iTime*0.5 ) * 0.4;
    float yCos = cos(yRot);
    float ySin = sin(yRot);
    float xCos = cos(xRot);
    float xSin = sin(xRot);

	float3 opos = float3( 32.5 + iTime * 6.4, 32.5, 32.5 );
	
	float gggxd = (uv.x - 0.5) * (iResolution.x / iResolution.y );
	float ggyd = (1.-uv.y - 0.5);
	float ggzd = 1.;
	
	float gggzd = ggzd * yCos + ggyd * ySin;
	
	float3 _posd = float3( gggxd * xCos + gggzd * xSin,
					   ggyd * yCos - ggzd * ySin,
					   gggzd * xCos - gggxd * xSin );
	
	float3 col = float3( 0. );
	float br = 1.;
	float3 bdist = float3( 255. - 100., 255. -   0., 255. -  50.  );
	float ddist = 0.;
	
	float closest = 32.;
	
	for ( int d = 0; d < 3; d++) {
		float dimLength = _posd[d];
		
		float ll = abs( 1. / dimLength );
		float3 posd = _posd * ll;;
		
		float initial = fract( opos[d] );
		if (dimLength > 0.) initial = 1. - initial;
		
		float dist = ll * initial;
		
		float3 pos = opos + posd * initial;
		
		if (dimLength < 0.) {
			pos[d] -= 1.;
		}
		
		for (int i=0; i<30; i++) {
			if( dist > closest )continue;
			
			//int tex = getMap( fmod( pos, 64. ) );
			int tex = getMap( pos );
			
			if (tex > 0) {
				float2 texcoord;
				texcoord.x = fmod(((pos.x + pos.z) * 16.), 16.);
				texcoord.y = fmod((pos.y * 16.), 16.) + 16.;
				if (d == 1) {
					texcoord.x = fmod(pos.x * 16., 16.);
					texcoord.y = fmod(pos.z * 16., 16.);
					if (posd.y < 0.)
						texcoord.y += 32.;
				}
				
				if ( getMaterialColor( tex, texcoord, col ) ) {
					ddist = 1. - (dist / 32.);
					br = bdist[d];
					closest = dist;
				}
			}
			pos += posd;
			dist += ll;
		}
	}
	
	return col * ddist * (br/255.);
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
	float2 uv = fragCoord.xy / iResolution.xy;
	
	fragColor = float4( renderMinecraft( uv, iTime, iResolution) ,1.0);
}