// "iPhone 11" by Martijn Steinrucken aka BigWings/CountFrolic - 2019
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/

#define S(a,b,t) smoothstep(a,b,t)
#define MAX_STEPS 300
#define MIN_DIST .5
#define MAX_DIST 2400.
#define SURF_DIST .1

//#define SOLO_MODE

#define BLUE float3(0.6352941176470588, 0.7529411764705882, 0.8549019607843137)
#define SILVER float3(0.9019607843137255, 0.8666666666666667, 0.8823529411764706)
#define GOLD float3(0.8784313725490196, 0.8, 0.6941176470588235)
#define BLACK float3(0.36470588235294116, 0.3607843137254902, 0.34509803921568627)
#define RED float3(0.7607843137254902, 0.10196078431372549, 0.15294117647058825)
#define WHITE float3(1.)

float mod(float x, float y)
{
  return x - y*floor(x/y);
}
    
float2x2 Rot(float a) {
    float s = sin(a), c=cos(a);
    return float2x2(c,-s,s,c);
}

float sabs(float x,float k) {
    float a = (.5/k)*x*x+k*.5;
    float b = abs(x);
    return b<k ? a : b;
}
float2 sabs(float2 x,float k) { return float2(sabs(x.x, k), sabs(x.y,k)); }
float3 sabs(float3 x,float k) { return float3(sabs(x.x, k), sabs(x.y,k), sabs(x.z,k)); }
float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0., 1. );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float sdApple(float2 p) {    
    float d;
    
    float A = length(p-float2(-.078,.02))-.52;
    float B = length(p-float2(.118,.045))-.552;
    float sides = max(A, B);
    
    float C = length(p-float2(-.181,.108))-.245;
    float D = length(p-float2(.178,.108))-.245;
    float top = min(C, D);
    
    float E = length(p-float2(-.153,-.29))-.115;
    float F = length(p-float2(.176,-.3))-.107;
    float bottom = min(E, F);
    
    d = mix(
        min(top, bottom),
        sides,
        S(.05, -.05, p.y-.188)*S(-.05,.01, p.y+.382)
    );
    
    float G = length(p-float2(.01, -.608))-.247;
    d = smin(d, -G, -.03);
    float H = length(p-float2(.487, .06))-.222;
    d = max(d, -H);
    
    float I = length(p-float2(0,.417))-.113;
    float J = length(p-float2(0,.17))-.163;
    d = min(d, max(-I, J));
    
    float K = length(p-float2(.207, .365))-.222;
    float L = length(p-float2(-.02, .567))-.222;
    d = min(d, max(K, L));
    
    return d;
}
float sdBox( float3 p, float3 b ){
    float3 d = abs(p) - b;
    return min(max(max(d.x,d.y), d.z),0.0) + length(max(d,0.0));
}
float sdBox2D( float2 p, float2 b ){
    float2 d = abs(p) - b;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
float sdCyl(float3 p, float h, float r, float b) {
	float d = length(p.xy)-r+b;
    return length(max(float2(d, abs(p.z)-h), 0.))-b;
}

float sdCameras(float3 p) {
	// cameras
    float r2 = 14.7;
	float2 size = float2(26.2, 29.2);
    
    float d = sdBox2D(p.xy, size-r2)-r2;
    
    d = max(d, p.z);	// cut back
    
    float3 h = float3(size.x, size.y, r2)-r2;
    float3 q = p - clamp( p, -h, h );			// IQs elongation
    float t = length(float2(length(q.xy)-r2, q.z+1.))-1.; // torus
    d = max(d, -t);	// cut bevel
    d = smin(d, -(p.z+1.), -.5); // cut front
    
    d = max(d, -sdCyl(p-float3(11.6,0,-3.8), 1.5, 5.6, 2.));	// flash
    d = max(d, -sdCyl(p-float3(11.6,14.5,-3.), 1.5, 2.8, 1.));	// mike

    // lenses
    float3 lp = float3(p.x+11.5, abs(p.y)-14.6, p.z);
    d = min(d, sdCyl(lp, 1.5, 12., .4)); // ring
    d = min(d, sdCyl(lp, 1.8, 10., .3)); // lens cap
    
    d = max(d, (8.-length(lp*float3(1,1,4)+float3(0,0,7)))/4.); // hole
    d = min(d, (length(lp*float3(1,1,2))-4.)/2.);
    
    return d;
}

float4 TransformPos(float3 p, float iTime) {
	float id = 0.;
    #ifndef SOLO_MODE
    float3 s = sign(p);
    float3 size = float3(400, 400, 800);
    
    float t = mod(iTime, 200.)*.5;
    
    p.z -= t*400.;
    
    id = floor(p.z/size.z);
    p.z = mod(p.z, size.z)-size.z*.5;
    
    p.xy = p.xy*Rot(t*.3+id);			// rotate wheel
    s = sign(p);
    float flip = s.x==s.y?1.:-1.;
    p.xy = abs(p.xy)-size.xy*.5;	// 4-fold 
    p.x *= flip;
    
    p.xy = p.xy*Rot(3.1415*.25*flip);		// point to center
    p.xz = p.xz*Rot(t+id);				// spin on axis
    
    #endif
    return float4(p,id);
}

float GetDist(float3 p, float iTime) {
    p = TransformPos(p, iTime).xyz;
    
    float3 size = float3(75.7, 150.9, 8.3);
    float r1 = 24.3;
    
	float front = sdBox2D(p.xy, size.xy-r1)-r1;
    float side = sdBox2D(p.yz, float2(144, 8.1)-8.)-8.;
    float top = sdBox2D(p.xz, float2(71.4, 8.1)-8.)-8.;
   
    float d = sdBox(p, size-size.z)-size.z;
    d = smin(d, front, -4.);
    
    // front cam and speaker
    d = smin(d, 1.-sdBox(p-float3(0,137.8,size.z), float3(7.95,0, .0)), -.5);
    
    float3 h = size-r1;
    float3 q = p-clamp(p, -h, h);
    float groove = length(q.xy*1.35)-r1-1.;
    d += S(.5,-.5,groove)*.4;
    
    // buttons
    side = step(0., p.x);
    
    float lb = sdBox2D(p.zy-float2(0, 65.1), float2(0,16))-3.;
    lb = S(.3, -1., lb)-S(-.5, -2., lb)*1.5;
    
    float rb = sdBox2D(p.zy-float2(0, 104.1), float2(.5,6))-2.;
    rb = S(.3, -1., rb);
    d += rb * side;
    rb = sdBox2D(p.zy-float2(1, 104.1), float2(0,6))-2.;
    rb = S(.3, -1., rb);
    d -= rb * side;
    
    float2 bp = float2(p.z, abs(p.y-65.1));
    
    rb = sdBox2D(bp-float2(0, 13), float2(0,9))-3.;
    rb = S(.3, -1., rb)-S(-.5, -2., rb)*1.5;
    
    d += mix(lb, rb, side);
    
    // bottom
    float3 pb = float3(abs(p.x), p.y+size.y, p.z); 
    float bb = sdBox(pb, float3(8, 4, 0))-2.;
    bb = min(bb, sdCyl((pb-float3(15, 0, .6)).zxy, 1., 1.76, .5));
    
    pb.x = mod(pb.x-2.35, 4.7)-2.35;
    float mh = sdCyl(pb.zxy, 4., 1.47, .2);
    mh = max(mh, abs(abs(p.x)-35.4)-13.2);
    bb = min(bb, mh);
    
    d = smin(d, -bb, -1.);
    
    // cameras
    d = min(d, sdCameras(p-float3(-39.6, 111.4, -size.z)));
    
    return d*.7;
}

float AO( float3 p, float3 n, float maxDist, float falloff, float iTime ) {
	float ao = 0.0;
	const int nbIte = 6;
    for( int i=0; i<nbIte; i++ )
    {
        float l = fract(sin((float(i))*maxDist));
        float3 rd = n*l;
        
        ao += (l - max(GetDist( p + rd, iTime ),0.)) / maxDist * falloff;
    }
	
    return clamp( 1.-ao/float(nbIte), 0., 1.);
}

float3 RayMarch(float3 ro, float3 rd, float iTime) {
	float dO=MIN_DIST;
    float dS;
    float matId=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	float3 p = ro + rd*dO;
        dS = GetDist(p, iTime);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return float3(dO, abs(dS), matId);
}

float3 GetNormal(float3 p, float iTime) {
	float d = GetDist(p, iTime);
    float2 e = float2(1e-2, 0);
    
    float3 n = d - float3(
        GetDist(p-e.xyy, iTime),
        GetDist(p-e.yxy, iTime),
        GetDist(p-e.yyx, iTime));
    
    return normalize(n);
}

float3 R(float2 uv, float3 p, float3 l, float z) {
    float3 f = normalize(l-p),
        r = normalize(cross(float3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}
/*
float3 Pixelize(sampler2D sampler, float2 uv, float2 resolution) {
   // resolution *= .1;
    uv *= resolution;
    
    float2 c = fwidth(uv)*100.;
    
    float2 gv = fract(uv)-.5; 
    float2 id = floor(uv);
    
    float rbPixel = length(gv);
    float gPixel = length(abs(gv)-.5);
    
    float checker = mod(id.x+id.y, 2.);
    float3 colorMask = float3(checker, 0., 1.-checker);
    
    float rgbShift = smoothstep(.4, .2, gPixel);
    colorMask = mix(colorMask, float3(0,1,0), rgbShift);
    
    id += rgbShift*.5*sign(gv);
    float3 col = texture(sampler, id/resolution).rgb;
    
	float pixelMask = smoothstep(.5, .2, rbPixel) + smoothstep(.3, .2, gPixel);
    
    float fade = clamp(dot(c,c)/1e4, 0., 1.);
    col *= mix(pixelMask*colorMask*2., float3(1.), fade);
    //col = float3(fade);
    
    return col;
}*/

void SetBaseCol(float id, thread float3& baseCol) {
     if(id==0.)
    	baseCol = BLACK;
    else if(id==1.)
        baseCol = SILVER;
    else if(id==2.)
        baseCol = GOLD;
    else if(id==3.)
        baseCol = RED;
    else
        baseCol = BLUE;
}

float3 Material(float3 p, float3 n, float3 rd, thread float3& baseCol, float iTime) {    
    float ao = AO(p, n, .5, .5, iTime);
    
    float3 s = sign(p);
    float4 P = TransformPos(p, iTime);
    
    p = P.xyz;
    
    float id = mod(P.w, 5.);
    SetBaseCol(id, baseCol);
      
    float3 col;
    
    float3 r = reflect(rd, n);
    float f = 1.+dot(n, rd);
    float fresnel = pow(max(f, 0.), 2.);
    
    float3 blurRef = float3(0.2, 0.3, 0.4);
    float3 sharpRef = float3(0.4, 0.5, 0.6);    
    float w = .2;
    
    float side = step(0., -p.z);	// which side 0=front 1=back
    float bandDist = sdBox2D(p.xy, float2(51.3, 126.6))-18.7;
    float band = S(-w, w, bandDist);
    
    if(side<.5) {	// screen side
        float screenDist = sdBox2D(p.xy, float2(51.3, 126.6)-1.)-15.;
        screenDist = smin(screenDist, 10.-sdBox2D(p.xy-float2(0,139.5), float2(30, 10.5)-10.), -3.);
        float screen = S(w, -w, screenDist)*(1.-side);
        
        float2 uv = p.xy/float2(-150*2, 300) +.5;
        float3 scrCol = float3(0.1,0.1,0.1);
              col = scrCol*screen;
        col += .002*(1.-screen);
        float2 lp = p.xy-float2(-14.6, 137.8);
        float d = length(lp)-2.6;
        if(d<0.) {
            float z = 1.-rd.y;
            z = 0.;
            
            float3 ref = float3(.3, .2, .8)*S(.3, -.3, d+1.)*d*d*.5;
            ref *= ref;
            ref *= pow(1.-f, 12.)*.25;
            
            col = ref;
        }
        
        col += sharpRef*.05;
        
    } else {			// back side
        float logo = S(.01, -.01, sdApple(p.xy*.04));
    	
        col = baseCol*baseCol*ao;
        col += mix(blurRef, sharpRef, logo)*.5;
        
        // camera area 
        float2 cp = p.xy-float2(-39.6, 111.4);
        float2 lp = float2(cp.x+11.5, abs(cp.y)-14.6);
        float d = length(lp);
        
        if(d<10.) {
            col = float3(col.r*0.1);
            float3 ref = sharpRef*float3(.3, .2, .8)*2.;
            col += ref*ref*sqrt(f)*S(4., 3., d);
            ref = float3(0.1,0.1,0.1);
            //col *= ao;
            col += ref*rd.y;   
        } else if(d<12.) {
            band = 1.;
        }
        
        // flash
        float2 fp = cp-float2(11.5,0);
        d = length(fp);
        if(d<4.5) {
            float fd = length(fp+rd.xy);
            float sep = 2.;
            float w1d = length(fp-float2(0, sep));
            float w2d = length(fp+float2(0, sep));
            float freq = 15.;
            float waves = (sin(w1d*freq)+sin(w2d*freq))*S(.0, -.5, fd-4.3); 
            float3 flashCol = mix(float3(1., .5, .2), float3(.8), fd*.3);
           	flashCol += S(3., 1., length(fp-float2(0.,sep)))*.2;
            flashCol += waves*.05;
            col = mix(col, flashCol, S(.3, -.0, d-4.2));
            col *= S(1., -1., d-4.5);
        }
        
        // mike
        fp = cp-float2(11.5,14.5);
        float fd = length(fp);
        if(fd<2.2) {
            float m = S(2.2, 2., fd);
            fp *= 10.;
            m *= max(0., sin(fp.x+fp.y))+max(0., sin(fp.x-fp.y));
        	float distFade = min(1., fwidth(length(p))*3.);
            col = mix(float3(m), float3(.5), distFade);
            //col = float3(distFade);
        }
    }
    
    float gaps = S(w, -w, abs(abs(p.y)-120.)-1.4);
    gaps *= S(71.7, 72.1, abs(p.x));
    float3 bandCol = pow(blurRef, float3(.4))*baseCol;
    bandCol *= 1.-gaps*.3;
    
    float shadow = clamp(74.2-abs(p.x), 0., 1.);
    shadow *= clamp(4.-abs(p.z), 0., 1.); 
    float s1 = shadow;
    shadow *= clamp(115.-abs(p.y), 0., 1.);
    shadow += S(-149., -146., p.y)*s1*S(52., 50., length(p.xy+float2(0,150)));
    bandCol -= shadow;
    
    col = mix(col, bandCol, band);
    
    return col;
}



void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    float3 baseCol = BLACK;
    float2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	float2 M = (float2(0.0)-.5*iResolution.xy)/iResolution.xy;
    float t = iTime;
    
    float2 p = uv;
    float zoom = mix(1., 15., (sin(iTime)*.5+.5)*0.);
    
    #ifdef SOLO_MODE
    float3 ro = float3(0,0,300);
    /*if(uv.x>0.) {
    	uv.x -= .5;
    } else {
    	uv.x += .3;
        uv *= .4;
    }*/
    #else
    float3 ro = float3(0,0,600);
    #endif
    
    ro.xz = ro.xz*Rot(-M.x*6.2831-3.1415);
    //ro.yx = -ro.yx*Rot(M.y*3.1415);
    ro.y -= M.y*800.;
    float3 lookat = float3(0, ro.y*.3, 0);
    //lookat = float3(-39.6, 300, 10);
    //lookat = float3(-59.6*0., 136.4, 10);
    //lookat = float3(0, -140,0);
    
    float3 rd = R(uv, ro, lookat, zoom);
	float3 bg = WHITE;
    #ifdef SOLO_MODE
    float f = .01/dot(uv,uv);
    //bg *= 0.;
    #endif
    
    float3 col = bg;
    
    float3 info = RayMarch(ro, rd,iTime);
    
    if(info.y<SURF_DIST) {
        float3 p = ro + rd*info.x;
        float3 n = GetNormal(p,iTime);
        col = Material(p, n, rd,baseCol,iTime);
    }
    
    float fade = min(1., info.x/2400.);
    col = mix(col, bg, fade*fade*fade);
    col = sqrt(col);
    fragColor = float4(col,1.0);
}