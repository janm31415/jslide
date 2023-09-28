// "Danger Noodle" by Martijn Steinrucken aka BigWings/CountFrolic - 2020
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// 
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
//
// Ever since I did a snake scale effect as one of my first ShaderToys
// I have been wanting to do a snake, so here it is.
//
// Watch full screen with sound!

#define MAX_STEPS 200
#define MAX_DIST 60.
#define SURF_DIST .01

#define CAM_MOVE 1.

#define S smoothstep

#define MAT_TONGUE 1.
#define MAT_HEAD 2.
#define MAT_BODY 3.
#define MAT_EYE 4.

// From Dave Hoskins
float2 Hash22(float2 p) {
	float3 p3 = fract(float3(p.xyx) * float3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

float Hash21(float2 p) {
	p = fract(p*float2(123.1031, 324.1030));
    p += dot(p, p+33.33);
    return fract(p.x*p.y);
}

float sabs(float x,float k) {
    float a = (.5/k)*x*x+k*.5;
    float b = abs(x);
    return b<k ? a : b;
}

float2 RaySphere(float3 ro, float3 rd, float4 s) {
	float t = dot(s.xyz-ro, rd);
    float3 p = ro + rd * t;
    
    float y = length(s.xyz-p);
    
    float2 o = float2(MAX_DIST,MAX_DIST);
    
    if(y<s.w) {
    	float x = sqrt(s.w*s.w-y*y);
        o.x = t-x;
        o.y = t+x;
    }
    
    return o;
}

// From IQ
float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0., 1. );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float smax(float a, float b, float k) {
	return smin(a, b, -k);
}

float2x2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return float2x2(c, -s, s, c);
}

float sdGyroid(float3 p, float scale, float thickness, float bias) {
	p *= scale;
    return abs(dot(sin(p), cos(p.zxy))+bias)/scale - thickness;
}

float sdSph(float3 p, float3 pos, float3 squash, float r) {
    squash = 1./squash;
	p = (p-pos)*squash;
    return (length(p)-r)/max(squash.x, max(squash.y, squash.z));
}


float4 Scales(float2 uv, float overlap, float skew, float point, float blur) {
    
    float2 gv = fract(uv*5.)-.5;
    float2 id = floor(uv*5.);
    
    float m = 0.;
    
    gv.y = sabs(gv.y,point);
    
    float w = .5+overlap;
    float2 p1 = (gv+float2(overlap,-gv.x*skew))*float2(1,1.8);
    float a1 = atan2(p1.x-w, p1.y);
    
    float waveAmp = .02;
    float waves = 10.;
    float w1 = sin(a1*waves);
    float s1 = S(w, w*blur, length(p1)+w1*waveAmp);
    s1 +=  w1*.1*s1;
    s1 *= mix(1., .5-gv.x, overlap*2.);
    
    gv.x -= 1.;
    float2 p2 = (gv+float2(overlap,-gv.x*skew))*float2(1,1.8);
    float a2 = atan2(p2.x-w, p2.y);
    float w2 = sin(a2*waves);
    float s2 = S(w, w*blur, length(p2)+w2*waveAmp);
    s2 += w2*.1*s2;
    
    s2 *= mix(1., .5-gv.x, overlap*2.);
    
    if(s1>s2) {
    	m += s1;
        m -= dot(p1,p1);
    } else {
        m += s2;
        m -= dot(p2,p2);
        id.x += 1.;
    }

    return float4(1.-m, 0., id);
}

float4 ScaleTex(float2 uv, float overlap, float skew, float point, float blur) {

    uv *= 2.;
    float4 s1 = Scales(uv, overlap, skew, point, blur);
    float4 s2 = Scales(uv+.1, overlap, skew, point, blur);
    s2.zw -= .5;
    
    return s1.x<s2.x ? s1 : s2;
}


float3 sdBody(float3 p, float iTime) {
    float t = iTime*.3;
    float neckFade = S(3., 10., p.z);
   
    p.x += sin(p.z*.15-t)*neckFade*4.;
    p.y += sin(p.z*.1-t)*neckFade;
    
    float2 st = float2(atan2(p.x, p.y), p.z);
    
    float body = length(p.xy)-(.86+S(2., 15., p.z)*.6-p.z*.01);
    body = max(.8-p.z, body);   
    
    float4 scales = float4(0);
    if(body<.1) {
        float2 uv = float2(-st.y*.25, st.x/6.2832+.5);
        float a = sin(st.x+1.57)*.5+.5;
        float fade = a;
        a = S(.1, .4, a);

        uv.y = 1.-abs(uv.y*2.-1.);
        uv.y *= (uv.y-.2)*.4;
        scales = ScaleTex(uv*1.3, .3*a, .3*a, .01, .8);
        body += scales.x*.02*(fade+.2);
    }
    
    body += S(-.4, -.9, p.y)*.2;	// flatten bottom
    return float3(body, scales.zw);
}

float GetHeadScales(float3 p, float3 eye, float3 mouth, float md, float iTime) {    
    float t = iTime;
  
    float jitter = .5;
    jitter *= S(.1, .3, abs(md));
    jitter *= S(1.2, .5, p.z);
    
    p.z += .5;
    p.z *= .5;
    
    p.yz = p.yz*Rot(.6);
    float y = atan2(p.y, p.x);
    float2 gv = float2(p.z*5., y*3.);

    float2 id = floor(gv);
    
    gv = fract(gv)-.5;
    
    float d=MAX_DIST;
    for(float y=-1.; y<=1.; y++) {
        for(float x=-1.; x<=1.; x++) {
            float2 offs = float2(x, y);

            float2 n = Hash22(id+offs);
            float2 p = offs+sin(n*6.2831)*jitter;
            p -= gv;
            
            float cd = dot(p,p);
            if(cd<d) d = cd;
        }
    }
    
    d += sin(d*20.)*.02;    
    d *= S(.0, .5, length(p.xy)-.1);
    return d*.06;
}

float sdHead(float3 p,float iTime) {    
    p.x = abs(p.x*.9);
    float d = sdSph(p, float3(0,-.05,.154), float3(1,1,1.986),1.14); 
    d = smax(d, length(p-float3(0,7.89,.38))-8.7, .2);
    d = smax(d, length(p-float3(0,-7.71,1.37))-8.7, .15); // top
    
    d = smax(d, 8.85-length(p-float3(9.16,-1.0,-3.51)), .2);	// cheeks
    
    float3 ep = p-float3(.54,.265,-.82);
    float eye = length(ep)-.35;
    float brows = S(.1, .8, p.y-(p.z+.9)*.5);
    brows *= brows*brows;
    brows *= S(.3, -.2, eye);
   	d -= brows*.5;
    d += S(.1, -.2, eye)*.1;
    
    float2 mp = p.yz-float2(3.76+S(-.71, -.14, p.z)*(p.z+.5)*.2, -.71); 
    float mouth = length(mp)-4.24;
    d += S(.03,.0,abs(mouth))*S(.59,.0, p.z)*.03;
    
   	d += GetHeadScales(p, ep, mp.xyy, mouth,iTime);
    
    d = min(d, eye);
    
    float nostril = length(p.zy-float2(-1.9-p.x*p.x, .15))-.05;
    d = smax(d, -nostril,.05);
    return d;
}

float sdTongue(float3 p, float iTime) {
	float t = iTime*3.;
   
    float inOut = S(.7, .8, sin(t*.5));
    
    if(p.z>-2.||inOut==0.) return MAX_DIST;		// early out
    
    float zigzag = (abs(fract(t*2.)-.5)-.25)*4.; // flicker
    float tl = 2.5;	// length
    
    p+=float3(0,0.27,2);
    p.z *= -1.;
    float z = p.z;
    p.yz = p.yz*Rot(z*.4*zigzag);
    p.z -= inOut*tl;
    
    float width = S(0., -1., p.z);
    float fork = 1.-width;
    
    float r = mix(.05, .02, fork);
	
    p.x = sabs(p.x, .05*width*width);
    p.x -= r+.01;
    p.x -= fork*.2*inOut;

    return length(p-float3(0,0,clamp(p.z, -tl, 0.)))-r;
}

float GetDist(float3 P, float iTime) {
    
    float3 p = P;
    p.xz = p.xz*Rot(sin(iTime*.3)*.1*S(1., 0., p.z));
    float d = sdTongue(p, iTime)*.7;
    d = min(d, sdHead(p, iTime));
    d = smin(d, sdBody(P, iTime).x, .13);
    
    return d;
}

float3 GetMat(float3 p,float iTime) {    
    float d = MAX_DIST;
    
    float tongue = sdTongue(p,iTime)*.7;
    float head = sdHead(p,iTime);
    float3 body = sdBody(p,iTime);
    
    float closest = min(tongue, min(head, body.x));
    if(closest == tongue) {
        return float3(MAT_TONGUE, 0, 0);
    } else if(closest==head) {
        p.x = abs(p.x*.9);
        float3 ep = p-float3(.54,.265,-.82);
        float eye = length(ep)-.35;
        if(eye<SURF_DIST)
        	return float3(MAT_EYE, ep.yz);
        else
            return float3(MAT_BODY, 0, 0);
            
    }else if(closest==body.x) {
        return float3(MAT_BODY, body.yz);
    }
}


float RayMarch(float3 ro, float3 rd, float iTime) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	float3 p = ro + rd*dO;
        float dS = GetDist(p, iTime);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return dO;
}

// From Nimitz
float4 GetNormalAndCurvature(float3 p, float eps, float iTime) {
    float2 e = float2(-1., 1.)*eps;   
    float t1 = GetDist(p + e.yxx, iTime), t2 = GetDist(p + e.xxy, iTime);
    float t3 = GetDist(p + e.xyx, iTime), t4 = GetDist(p + e.yyy, iTime);

    float c = .25/e.y*(t1 + t2 + t3 + t4 - 4.0*GetDist(p, iTime));
    float3 n = normalize(e.yxx*t1 + e.xxy*t2 + e.xyx*t3 + e.yyy*t4);
    
    return float4(n, c);
}

float3 GetRayDir(float2 uv, float3 p, float3 l, float z) {
    float3 f = normalize(l-p),
        r = normalize(cross(float3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}


float4 Material(float3 ro, float3 rd, float d, float iTime) {
    float3 p = ro + rd * d;
    float4 n = GetNormalAndCurvature(p, mix(.01, .03, S(8., 20., d)),iTime);

    p.xz = p.xz*Rot(sin(iTime*.3)*.1*S(1., 0., p.z));
    float3 mat = GetMat(p,iTime);
    
    float3 col = float3(n.y*.5+.5);  	// diffuse
	col *= 1.-max(0., .3-n.w);		// curvature shadow
    
    float3 h = normalize(-rd + float3(1,1,1));
    float spe = pow(clamp(dot(h, n.xyz), 0.0, 1.0), 32.0);
	
    float3 ref = reflect(rd, n.xyz);
    float3 r = float3(0,0,0);
    
    if(mat.x==MAT_EYE) {
        float2 sph = RaySphere(
            float3(abs(p.x*.9),p.yz), 
            float3(-abs(rd.x), rd.yz), 
            float4(.3,.265,-.82, .52)
        );

        float3 sp = p+rd*sph.x;
        mat.yz = sp.yz-float2(.265,-.82)+.05;

        float t = iTime*.2;
        float2 p1 = sin(floor(t)*float2(20., 31.));
        float2 p2 = sin(floor(t+1.)*float2(20., 31.));
        p1 = mix(p1, p2, S(.45, .5, fract(t)));
        mat.yz += p1*float2(.01, .03)*1.;
        float a = atan2(mat.y, mat.z);

        float d = abs(mat.z)+mat.y*mat.y;
        col *= float3(1,1,.1);
        col += S(.1, .0, length(mat.yz*float2(1,2))-.1)*.1;
        
        float z = S(.7, 1., rd.z*rd.z)*.05;
        col *= S(.02-z, .03+z, d);
        
        float3 gp = float3(a, mat.yz)*20.;
        float gyroid = (abs(dot(sin(gp), cos(gp.zxy))));
        col *= 1.+gyroid*.1;
        
        col += r*r*r*.3;
        col += pow(spe, 6.);
    } else if(mat.x==MAT_BODY) {
        float x = mat.y;
        float y = mat.z;
        float wave = S(2., 0., abs(y-2.+sin(x*.5)*1.));
        wave *= S(2., 3., p.z);
        
        float t = iTime*.3;
        float neckFade = S(3., 10., p.z);
        p.y += sin(p.z*.1-t)*neckFade;
        
        float3 baseCol = mix(float3(1., 1., .2), float3(.3, .8, .1), S(-.55, -.1, p.y));
        col *= mix(baseCol, float3(.2,.4,.2)*.5, wave);
        col += spe*pow(1.-abs(n.w), 5.)*.3;
        
        r = float3(0.1, 0.1, 0.1);
        col += r*r*.05;
    } else if(mat.x==MAT_TONGUE) {
    	col *= float3(.4, .1, .2);
        col += pow(min(1., spe*5.), 5.);
    }
    
    return float4(col, 1);
}

float3 Render(float2 uv, float2 m, float t) {
    float3 ro = float3(0, 0, -3)*(8.+sin(t*.2)*2.*CAM_MOVE);
    ro.yz = ro.yz*Rot(-m.y*3.14+sin(t*.03)*CAM_MOVE*.2);
    ro.xz = ro.xz*Rot(-m.x*6.2831*2.+sin(t*.05)*CAM_MOVE);
    
    float3 rd = GetRayDir(uv, ro, float3(0,0,sin(t*.11)), 6.);
    
    float d = RayMarch(ro, rd, t);
    
    float3 col = float3(0);
    
    float2 env = RaySphere(ro, rd, float4(0,0,0,20));
    
    if(d<MAX_DIST) {
        float4 snake = Material(ro, rd, d, t);
    	snake.rgb *= S(60., 10., d);
        col = mix(col, snake.rgb, snake.a);
    } else {
    	col = (rd.y*.5+.5)*float3(.4, 1.,.2);
        col *= float3(0.1,0.1,0.1);
        col *= 1.-S(.8, 1., rd.z);
        
        if(env.y>0.)	// vines behind
            col *= S(0., 1.1, sdGyroid(ro + env.y*rd, .4, .1, .0))*.5+.5;
    }
    
    if(env.x>0.)	// vines in front
        col *= S(0., .25, sdGyroid(ro + env.x*rd, .25, .1, .0));
    
    return col;
}


void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
    float2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	float2 m = (float2(0,0)-.5*iResolution.xy)/iResolution.xy;    
    if(m.x<-.49 && m.y<-.49) m*=0.;
    
    float3 col = Render(uv, m, iTime);
    
    col *= 1.5;						// exposure adjustment
    col = pow(col, float3(.4545));	// gamma correction
    col *= 1.-dot(uv,uv)*.3;		// vignette

    fragColor = float4(col,1.0);
}