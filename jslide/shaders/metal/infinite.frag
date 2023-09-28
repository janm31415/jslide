


#define Rot(a) float2x2(cos(a),-sin(a),sin(a),cos(a))
#define antialiasing(n) n/min(iResolution.y,iResolution.x)
#define S(d,b) smoothstep(antialiasing(1.0),b,d)
#define B(p,s) max(abs(p).x-s.x,abs(p).y-s.y)
#define deg45 .707
#define R45(p) (( p + float2(p.y,-p.x) ) *deg45)
#define Tri(p,s) max(R45(p).x,max(R45(p).y,B(p,s)))
#define DF(a,b) length(a) * cos( fmod( atan2(a.y,a.x)+6.28/(b*8.0), 6.28/((b*8.0)*0.5))+(b-1.)*6.28/(b*8.0) + float2(0,11) )
#define SkewX(a) float2x2(1.0,tan(a),0.0,1.0)
#define seg_0 0
#define seg_1 1
#define seg_2 2
#define seg_3 3
#define seg_4 4
#define seg_5 5
#define seg_6 6
#define seg_7 7
#define seg_8 8
#define seg_9 9

float radians(float deg) {
  return deg*3.1415926535897/180.0;
}

float segBase(float2 p){
    float2 prevP = p;
    
    float size = 0.02;
    float padding = 0.05;

    float w = padding*3.0;
    float h = padding*5.0;

    p = fmod(p,0.05)-0.025;
    float thickness = 0.005;
    float gridMask = min(abs(p.x)-thickness,abs(p.y)-thickness);
    
    p = prevP;
    float d = B(p,float2(w*0.5,h*0.5));
    return d;
}

float seg0(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    float mask = B(p,float2(size,size*2.7));
    d = max(-mask,d);
    return d;
}

float seg1(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x+=size;
    p.y+=size;
    float mask = B(p,float2(size*2.,size*3.7));
    d = max(-mask,d);
    
    p = prevP;
    
    p.x+=size*1.9;
    p.y-=size*3.2;
    mask = B(p,float2(size,size+0.01));
    d = max(-mask,d);
    
    return d;
}

float seg2(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x+=size;
    p.y-=0.05;
    float mask = B(p,float2(size*2.,size));
    d = max(-mask,d);

    p = prevP;
    p.x-=size;
    p.y+=0.05;
    mask = B(p,float2(size*2.,size));
    d = max(-mask,d);
    
    return d;
}

float seg3(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.y = abs(p.y);
    p.x+=size;
    p.y-=0.05;
    float mask = B(p,float2(size*2.,size));
    d = max(-mask,d);

    p = prevP;
    p.x+=0.06;
    mask = B(p,float2(size,size+0.01));
    d = max(-mask,d);
    
    return d;
}

float seg4(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    
    p.x+=size;
    p.y+=0.08;
    float mask = B(p,float2(size*2.,size*2.0));
    d = max(-mask,d);

    p = prevP;
    
    p.y-=0.08;
    mask = B(p,float2(size,size*2.0));
    d = max(-mask,d);
    
    return d;
}

float seg5(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x-=size;
    p.y-=0.05;
    float mask = B(p,float2(size*2.,size));
    d = max(-mask,d);

    p = prevP;
    p.x+=size;
    p.y+=0.05;
    mask = B(p,float2(size*2.,size));
    d = max(-mask,d);
    
    return d;
}

float seg6(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x-=size;
    p.y-=0.05;
    float mask = B(p,float2(size*2.,size));
    d = max(-mask,d);

    p = prevP;
    p.y+=0.05;
    mask = B(p,float2(size,size));
    d = max(-mask,d);
    
    return d;
}

float seg7(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.x+=size;
    p.y+=size;
    float mask = B(p,float2(size*2.,size*3.7));
    d = max(-mask,d);
    return d;
}


float seg8(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.y = abs(p.y);
    p.y-=0.05;
    float mask = B(p,float2(size,size));
    d = max(-mask,d);
    
    return d;
}

float seg9(float2 p){
    float2 prevP = p;
    float d = segBase(p);
    float size = 0.03;
    p.y-=0.05;
    float mask = B(p,float2(size,size));
    d = max(-mask,d);

    p = prevP;
    p.x+=size;
    p.y+=0.05;
    mask = B(p,float2(size*2.,size));
    d = max(-mask,d);
    
    return d;
}

float segDot(float2 p){
    float2 prevP = p;
    p*=SkewX(-0.4);
    float size = 0.03;
    p.y = abs(p.y)-0.07;
    float d = B(p,float2(size));
    return d;
}

float checkChar(int targetChar, int ch){
    return 1.-abs(sign(float(targetChar) - float(ch)));
}

float drawFont(float2 p, int ch){
    p*=SkewX(-0.4);
    float d = seg0(p)*checkChar(seg_0,ch);
    d += seg1(p)*checkChar(seg_1,ch);
    d += seg2(p)*checkChar(seg_2,ch);
    d += seg3(p)*checkChar(seg_3,ch);
    d += seg4(p)*checkChar(seg_4,ch);
    d += seg5(p)*checkChar(seg_5,ch);
    d += seg6(p)*checkChar(seg_6,ch);
    d += seg7(p)*checkChar(seg_7,ch);
    d += seg8(p)*checkChar(seg_8,ch);
    d += seg9(p)*checkChar(seg_9,ch);
    
    return d;
}

float random (float2 p) {
    return fract(sin(dot(p.xy, float2(12.9898,78.233)))* 43758.5453123);
}

// principal value of logarithm of z
// https://gist.github.com/ikr7/d31b0ead87c73e6378e6911e85661b93
float2 clog (float2 z) {
	return float2(log(length(z)), atan2(z.y, z.x));
}

// The following code will return the Droste Zoom UV.
// by roywig https://www.shadertoy.com/view/Ml33R7
float2 drosteUV(float2 p, float iTime){
    float speed = 0.25;
    float animate = fmod(iTime*speed,2.07);
    float rate = sin(iTime*0.5);
    //p = clog(p)*mat2(1,.11,rate*0.5,1);
    p = clog(p);
    p = exp(p.x-animate) * float2( cos(p.y), sin(p.y));
    float2 c = abs(p);
    float2 duv = .5+p*exp2(ceil(-log2(max(c.y,c.x))-2.));
    return duv;
}

// circle animation
float widgetItem0(float2 p, float rval, float iTime){
    float2 prevP = p;
    
    float d = abs(length(p)-0.12)-0.005;
    p*=Rot(radians(iTime*60.*rval));
    d = max((abs(p.y)-0.05),d);
    float d2 = abs(length(p)-0.12)-0.03;
    d2 = max(-(abs(p.y)-0.05),d2);
    d = min(d,abs(d2)-0.005);
    
    d2 = abs(length(p)-0.03)-0.005;
    d = min(d,d2);
    
    p.y = abs(p.y)-0.135;
    d2 = Tri(p,float3(0.03));
    d = min(d,d2);
    
    p = prevP;
    p*=Rot(radians(sin(iTime*0.5)*-100.));
    p.y = abs(p.y)-0.175;
    p.y*=-1.;
    d2 = abs(Tri(p,float3(0.04)))-0.005;
    d = min(d,d2);    
    
    return d;
}

// clock animation
float widgetItem1(float2 p, float iTime){
    float2 prevP = p;
    
    p*=Rot(radians(iTime*30.));
    p = DF(p,8.);
    p-=0.25;
    p*=Rot(radians(45.));
    float d = B(p,float2(0.005,0.03)); 
    
    p = prevP;
    
    p*=Rot(radians(iTime*30.));
    p = DF(p,4.);
    p-=0.27;
    p*=Rot(radians(45.));
    float d2 = B(p,float2(0.005,0.05));     
    
    d = min(d,d2);
    
    p = prevP;
    
    p*=Rot(radians(sin(iTime)*180.));
    p.y = abs(p.y);
    p.y-=0.28;
    p.y*=0.07;
    d2 = Tri(p,float2(0.05));
    d = min(d,d2);
    
    p = prevP;
    d2 = length(p)-0.03;
    d = min(d,d2);
    
    return d;
}

// digit number animation
float widgetItem2(float2 p, float iTime){
    float2 prevP = p;
    p*=1.05;
    float d = drawFont(p-float2(-0.35,0.0),int(fmod(iTime,9.)));
    float d2 = drawFont(p-float2(-0.15,0.0),int(fmod(iTime*2.,9.)));
    d = min(d,d2);
    d2 = drawFont(p-float2(0.15,0.0),int(fmod(iTime*15.,9.)));
    d = min(d,d2);
    d2 = drawFont(p-float2(0.35,0.0),int(fmod(iTime*30.,9.)));
    d = min(d,d2);
    d2 = segDot(p);
    d = min(d,d2);
    return abs(d)-0.002;
}

// slider animation
float widgetItem3(float2 p, float iTime){
    float2 prevP = p;
    float d = B(p,float2(0.42,0.002));
    p.x += sin(iTime)*0.35;
    d = max(-(length(p)-0.02),d);
    p = prevP;
    p.x = abs(p.x)-0.42;
    float d2 = B(p,float2(0.002,0.03));
    d = min(d,d2);
    p = prevP;
    p.x += sin(iTime)*0.35;
    d2 = abs(length(p)-0.02)-0.002;
    d = min(d,d2);
    
    p = prevP;
    p.x-=iTime*0.1;
    p.x = fmod(p.x,0.06)-0.03;
    d2 = length(p)-0.008;
    p = prevP;
    d2 = max((abs(p.x)-0.4),d2);
    p.x += sin(iTime)*0.35;
    d2 = max(-(length(p)-0.02),d2);
    d = min(d,d2);
    
    
    p = prevP;
    p*=15.;
    p.x+=iTime*1.5;
    d2 = sin(p.y*0.6)*0.23+cos(p.x*1.5)*0.2;
    d2 = abs(d2)-0.005;
    p = prevP;
    d2 = max(abs(p.x)-0.4,d2);
    d2 = max(abs(p.y)-0.2,d2);
    d = min(d,d2);
    
    return d;
}

float widgetItem4(float2 p, float iTime){
    float2 prevP = p;
    float d = B(p,float2(0.42,0.002));
    p.x = abs(p.x)-0.42;
    float d2 = B(p,float2(0.002,0.05));
    d = min(d,d2);
    
    p = prevP;
    p.x-=iTime*0.1;
    p.x =fmod(p.x,0.06)-0.03;
    d2 = B(p,float2(0.002,0.025));
    p = prevP;
    d2 = max((abs(p.x)-0.4),d2);
    d = min(d,d2);
    
    p.x -= sin(iTime*1.1)*-0.35;
    p.y = abs(p.y)-0.05;
    p.y*=-1.;
    d2 = abs(Tri(p,float2(0.03)))-0.002;
    d = min(d,d2);
    
    return d;
}

float widgetItem5(float2 p, float iTime){
    float2 prevP = p;
    float d = B(p,float2(0.002,0.42));
    p.y -= sin(iTime)*0.33;
    p*=Rot(radians(45.));
    d = max(-B(p,float2(0.03)),d);
    p = prevP;
    p.y = abs(p.y)-0.42;
    float d2 = B(p,float2(0.03,0.002));
    d = min(d,d2);
    p = prevP;
    p.y -= sin(iTime)*0.33;
    p*=Rot(radians(45.));
    d2 = abs(B(p,float2(0.03)))-0.002;
    d = min(d,d2);
    return d;
}

float widgetItem6(float2 p, float iTime){
    float2 prevP = p;
    float d = B(p,float2(0.002,0.42));
    p.y = abs(p.y)-0.42;
    float d2 = B(p,float2(0.05,0.002));
    d = min(d,d2);
    
    p = prevP;
    p.y+=iTime*0.1;
    p.y = fmod(p.y,0.06)-0.03;
    d2 = B(p,float2(0.025,0.002));
    p = prevP;
    d2 = max((abs(p.y)-0.4),d2);
    d = min(d,d2);
    
    p.y -= sin(iTime*1.1)*-0.35;
    p.x = abs(p.x)-0.05;
    p*=Rot(radians(-90.));
    d2 = abs(Tri(p,float2(0.03)))-0.002;
    d = min(d,d2);
    
    return d;
}

float pattern1(float2 p, float iTime){
    float d = abs(B(p-float2(0.002),float2(0.5)))-0.004;
    
    float d2 = widgetItem1(p, iTime);
    d = min(d,d2);
    return d;
}

float pattern2(float2 p, float iTime){
    float d = abs(B(p-float2(0.002,0.002+0.25),float2(0.5,0.25)))-0.004;
    float d2 = abs(B(p-float2(0.002,0.002-0.25),float2(0.5,0.25)))-0.004;
    d = min(d,d2);
        
    d2 = widgetItem3(p-float2(0,0.25), iTime);
    d = min(d,d2);
    d2 = widgetItem4(p-float2(0,-0.25), iTime);
    d = min(d,d2);
    
    return d;
}

float pattern3(float2 p, float iTime){
    float d = abs(B(p-float2(0.002+0.25,0.002),float2(0.25,0.5)))-0.004;
    float d2 = abs(B(p-float2(0.002-0.25,0.002),float2(0.25,0.5)))-0.004;
    
    d = min(d,d2);
    
    d2 = length(p-float2(0.25,0.0))-0.2;
    d2 = widgetItem5(p-float2(0.25,0.0), iTime);
    d = min(d,d2);
    d2 = length(p-float2(-0.25,0.0))-0.2;
    d2 = widgetItem6(p-float2(-0.25,0.0), iTime);
    d = min(d,d2);    
    
    return d;
}

float pattern4(float2 p, float rval, float iTime){
    float2 prevP = p;
    float d = abs(B(p-float2(0.002+0.25,0.002+0.25),float2(0.25)))-0.004;
    float d2 = abs(B(p-float2(0.002-0.25,0.002+0.25),float2(0.25)))-0.004;
    d = min(d,d2);
    d2 = abs(B(p-float2(0.002,0.002-0.25),float2(0.5,0.25)))-0.004;
    d = min(d,d2);
    
    p.x = abs(p.x);
    p.x-=0.25;
    p*= float2(sign(prevP.x),1);
    d2 = widgetItem0(p-float2(0.0,0.25),-rval, iTime);
    d = min(d,d2);
    
    p = prevP;
    d2 = widgetItem2(p-float2(0.0,-0.25), iTime);
    d = min(d,d2);  
    
    return min(d,d2);
}

float pattern5(float2 p, float rval, float iTime){
    float2 prevP = p;
    float d = abs(B(p-float2(0.002+0.25,0.002-0.25),float2(0.25)))-0.004;
    float d2 = abs(B(p-float2(0.002-0.25,0.002-0.25),float2(0.25)))-0.004;
    d = min(d,d2);
    d2 = abs(B(p-float2(0.002,0.002+0.25),float2(0.5,0.25)))-0.004;
    d = min(d,d2);
    
    p.x = abs(p.x);
    p.x-=0.25;
    p*= float2(sign(prevP.x),1);
    d2 = widgetItem0(p-float2(0.0,-0.25),-rval, iTime);
    d = min(d,d2);
    
    p = prevP;
    d2 = widgetItem2(p-float2(0.0,0.25), iTime);
    d = min(d,d2);  
    
    return min(d,d2);
}

float3 draw(float2 p, float3 col, float size, float iTime, float3 iResolution){
    float2 prevP = p;
    
    p*=size;
    float2 id = floor(p);
    float2 gr = fract(p)-0.5;
    float n = random(id);
    
    if(n<0.2){
        float d = pattern1(gr, iTime);
        col = mix(col, float3(1.), S(d,0.0));
    } else if(n>=0.2 && n<0.35){
        float d = pattern2(gr, iTime);
        col = mix(col, float3(1.), S(d,0.0));
    } else if(n>=0.35 && n<0.5){
        float d = pattern3(gr, iTime);
        col = mix(col, float3(1.), S(d,0.0));
    } else if(n>=0.5 && n<0.75){
        float d = pattern4(gr,n, iTime);
        col = mix(col, float3(1.), S(d,0.0));
    } else {
        float d = pattern5(gr,n, iTime);
        col = mix(col, float3(1.), S(d,0.0));
    }
    
    return col;
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    float2 p = (fragCoord-0.5*iResolution.xy)/iResolution.y;
    float2 prevP = p;
    
    p = drosteUV(p,iTime);
    //p.y-=iTime*0.1;
    float3 col = float3(0.);
    col =draw(p,col,4.,iTime,iResolution);
    p = prevP;
    col*=B(p,float2(0.1));
 
    fragColor = float4(sqrt(col),1.0);
}