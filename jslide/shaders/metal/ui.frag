


#define Rot(a) float2x2(cos(a),-sin(a),sin(a),cos(a))
#define antialiasing(n) n/min(iResolution.y,iResolution.x)
#define S(d,b) smoothstep(antialiasing(1.0),b,d)
#define B(p,s) max(abs(p).x-s.x,abs(p).y-s.y)
#define Tri(p,s,a) max(-dot(p,float2(cos(-a),sin(-a))),max(dot(p,float2(cos(a),sin(a))),max(abs(p).x-s.x,abs(p).y-s.y)))
#define DF(a,b) length(a) * cos( fmod( atan2(a.y,a.x)+6.28/(b*8.0), 6.28/((b*8.0)*0.5))+(b-1.)*6.28/(b*8.0) + float2(0,11) )
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


float Hash21(float2 p) {
    p = fract(p*float2(234.56,789.34));
    p+=dot(p,p+34.56);
    return fract(p.x+p.y);
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
    float a = radians(45.0);
    p.x = abs(p.x)-0.1;
    p.y = abs(p.y)-0.05;
    float d2 = dot(p,float2(cos(a),sin(a)));
    d = max(d2,d);
    d = max(-gridMask,d);
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
    
    p.x+=size*1.8;
    p.y-=size*3.5;
    mask = B(p,float2(size));
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
    p.x+=0.05;
    mask = B(p,float2(size,size));
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

float drawFont(float2 p, int ch){
    p*=2.0;
    float d = 10.;
    if(ch == seg_0) {
        d = seg0(p);
    } else if(ch == seg_1) {
        d = seg1(p);
    } else if(ch == seg_2) {
        d = seg2(p);
    } else if(ch == seg_3) {
        d = seg3(p);
    } else if(ch == seg_4) {
        d = seg4(p);
    } else if(ch == seg_5) {
        d = seg5(p);
    } else if(ch == seg_6) {
        d = seg6(p);
    } else if(ch == seg_7) {
        d = seg7(p);
    } else if(ch == seg_8) {
        d = seg8(p);
    } else if(ch == seg_9) {
        d = seg9(p);
    }
    
    return d;
}
float barCode(float2 p, float iTime){
    p*=1.1;
    float2 prevP = p;
    p.x+=iTime*0.5;
    p*=15.0;
    float2 gv = fract(p)-0.5;
    float2 id = floor(p);

    float n = Hash21(float2(id.x))*5.;
    
    p.x = fmod(p.x,0.2)-0.1;
    float d = abs(p.x)-((0.01*n)+0.01);
    
    p = prevP;
    d = max(abs(p.x)-0.15,d);
    d = max(abs(p.y)-0.1,d);

    float d2 = abs(B(p,float2(0.16,0.11)))-0.001;
    d2 = max(-(abs(p.x)-0.14),d2);
    d2 = max(-(abs(p.y)-0.09),d2);

    return min(d,d2);
}

float circleUI(float2 p, float iTime){
    float2 prevP = p;
    float speed = 3.;
    float2x2 animRot = Rot(radians(iTime*speed)*30.0);
    p*=animRot;
    
    p = DF(p,32.0);
    p -= float2(0.28);
    
    float d = B(p*Rot(radians(45.0)), float2(0.002,0.02));
    
    p = prevP;
    p*=animRot;
    
    float a = radians(130.);
    d = max(dot(p,float2(cos(a),sin(a))),d);
    a = radians(-130.);
    d = max(dot(p,float2(cos(a),sin(a))),d);
    
    p = prevP;
    animRot = Rot(radians(iTime)*20.0);
    p*=animRot;
    
    p = DF(p,24.0);
    p -= float2(0.19);
    
    float d2 = B(p*Rot(radians(45.0)), float2(0.003,0.015));
    
    p = prevP;
    p*=animRot;
    
    a = radians(137.5);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-137.5);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    
    d = min(d,d2);
    

    p = prevP;
    animRot = Rot(-radians(iTime*speed)*25.0);
    p*=animRot;
    
    p = DF(p,16.0);
    p -= float2(0.16);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.003,0.01));
    
    p = prevP;
    p*=animRot;
    
    a = radians(25.5);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-25.5);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    
    d = min(d,d2);
    
    
    p = prevP;
    animRot = Rot(radians(iTime*speed)*35.0);
    p*=animRot;
    
    p = DF(p,8.0);
    p -= float2(0.23);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.02,0.02));
    
    p = prevP;
    p*=animRot;
    
    a = radians(40.0);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-40.0);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    
    d = min(d,d2);    
    
    
    p = prevP;
    
    animRot = Rot(radians(iTime*speed)*15.0);
    p*=animRot;
    
    d2 = abs(length(p)-0.36)-0.002;
    d2 = max(abs(p.x)-0.2,d2);
    d = min(d,d2);    
    
    p = prevP;
    
    animRot = Rot(radians(90.)+radians(iTime*speed)*38.0);
    p*=animRot;
    
    d2 = abs(length(p)-0.245)-0.002;
    d2 = max(abs(p.x)-0.1,d2);
    d = min(d,d2);    
    
    p = prevP;
    d2 = abs(length(p)-0.18)-0.001;
    d = min(d,d2);       
    
    p = prevP;
    animRot = Rot(radians(145.)+radians(iTime*speed)*32.0);
    p*=animRot;
    d2 = abs(length(p)-0.18)-0.008;
    
    a = radians(30.0);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-30.0);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);    
    
    d = min(d,d2);  
    
    p = prevP;
    
    a = radians(iTime*speed)*30.0;
    p.x+=cos(a)*0.45;
    p.y+=sin(a)*0.45;
    
    d2 = Tri(p*Rot(-a)*Rot(radians(90.0)),float2(0.02),radians(45.));
    d = min(d,d2);  
    
    p = prevP;
    
    a = radians(-sin(iTime*speed*0.5))*120.0;
    a+=radians(-70.);
    p.x+=cos(a)*0.45;
    p.y+=sin(a)*0.45;
    
    d2 = abs(Tri(p*Rot(-a)*Rot(radians(90.0)),float2(0.02),radians(45.)))-0.001;
    d = min(d,d2);      
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*27.0);
    p*=animRot;
    
    d2 = abs(length(p)-0.43)-0.0001;
    d2 = max(abs(p.x)-0.3,d2);
    d = min(d,d2);    
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*12.0);
    p*=animRot;
    
    p = DF(p,8.0);
    p -= float2(0.103);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.001,0.007));    
    d = min(d,d2);  
    
    p = prevP;
    animRot = Rot(radians(16.8)-radians(iTime*speed)*12.0);
    p*=animRot;    
    
    p = DF(p,8.0);
    p -= float2(0.098);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.001,0.013));    
    d = min(d,d2);      
    
    
    p = prevP;
    animRot = Rot(radians(iTime*speed)*30.0);
    p*=animRot;    
    
    p = DF(p,10.0);
    p -= float2(0.28);
    
    d2 = abs(B(p*Rot(radians(45.0)), float2(0.02,0.02)))-0.001;
    
    p = prevP;
    p*=animRot;
    
    a = radians(50.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-50.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);    
    d = min(d,d2);   
    
    p = prevP;
    int num = int(fmod(iTime*10.0,10.0));
    d2 = drawFont(p-float2(0.038,0.),num);
    d = min(d,abs(d2)-0.001); 
    num = int(fmod(iTime*3.0,10.0));
    d2 = drawFont(p-float2(-0.038,0.),num);
    d = min(d,d2); 
    
    return d;
}

float smallCircleUI(float2 p, float iTime){
    p*=1.3;
    float2 prevP = p;
    float speed = 3.;
    
    float2x2 animRot = Rot(radians(iTime*speed)*35.0);
    p*=animRot;  
    
    float d = abs(length(p)-0.2)-0.005;
    
    float a = radians(50.);
    d = max(dot(p,float2(cos(a),sin(a))),d);
    a = radians(-50.);
    d = max(dot(p,float2(cos(a),sin(a))),d);   
    
    p*=Rot(radians(10.));
    float d2 = abs(length(p)-0.19)-0.006;
    
    a = radians(60.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-60.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);   
    
    d = min(d,d2);
    
    p = prevP;
    
    d2 = abs(length(p)-0.195)-0.0001;
    d = min(d,d2);
    
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*30.0);
    p*=animRot;      
    
    p = DF(p,12.0);
    p -= float2(0.11);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.003,0.015));      
    

    
    d = min(d,d2);  
    
    p = prevP;
    animRot = Rot(radians(iTime*speed)*23.0);
    p*=animRot;  
    p = DF(p,2.5);
    p -= float2(0.05);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.01));      
    d = min(d,d2); 
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*26.0);
    p*=animRot;  
    d2 = abs(length(p)-0.11)-0.005;
    
    d2 = max(abs(p.x)-0.05,d2);
    
    d = min(d,d2);
    
    return d;
}

float smallCircleUI2(float2 p, float iTime){
    p.x = abs(p.x)-0.4;
    p.y = abs(p.y)-0.34;
    float2 prevP = p;
    float speed = 3.;
    float2x2 animRot = Rot(radians(iTime*speed)*28.0);
    p*=animRot;  
    
    float d = abs(length(p)-0.028)-0.0005;
    d = max(B(p,float2(0.015,0.1)),d);
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*31.0);
    p*=animRot;  
    float d2 = abs(length(p)-0.027)-0.004;
    
    float a = radians(50.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-50.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);    
    
    d = min(max(-d2,d),abs(d2)-0.001);
    
    p = prevP;
    animRot = Rot(-radians(iTime*speed)*30.0);
    p*=animRot;      
    
    p = DF(p,2.0);
    p -= float2(0.008);
    
    d2 = B(p*Rot(radians(45.0)), float2(0.0005,0.002));       
    d = min(d,d2);
    
    return d;
}

float mainWave(float2 p, float iTime){
    p*=1.5;
    
    float thickness = 0.003;
    
    float2 prevP = p;

    float t = fract(sin(iTime*100.0))*0.5;

    p.x+=iTime*1.0;
    p.y+=sin(p.x*8.)*(0.05+abs(sin(t*10.0)*0.12));
    float d = abs(p.y)-thickness;

    p = prevP;
    
    p.x-=iTime*0.5;
    p.y+=sin(p.x*3.)*(0.1+abs(sin(t*9.0)*0.13));
    float d2 = abs(p.y)-thickness;

    d = min(d,d2);

    p = prevP;
    
    p.x+=iTime*0.7;
    p.y+=sin(p.x*5.)*(0.1+abs(sin(t*9.3)*0.15));
    d2 = abs(p.y)-thickness;

    d = min(d,d2);
    
    p = prevP;
    
    p.x-=iTime*0.6;
    p.y+=sin(p.x*10.)*(0.1+abs(sin(t*9.5)*0.08));
    d2 = abs(p.y)-thickness;

    d = min(d,d2);
        
    p = prevP;
    
    p.x+=iTime*1.2;
    p.y+=cos(-p.x*15.)*(0.1+abs(sin(t*10.0)*0.1));
    d2 = abs(p.y)-thickness;

    d = min(d,d2);
    
    return d;
}

float graph(float2 p, float iTime){
    float2 prevP = p;
    float d = 10.;
    float t = iTime+Hash21(float2(floor(p.y-0.5),0.0));
    p.y = abs(p.y);
    p.y+=0.127;
    for(float i = 1.0; i<=20.0; i+=1.0) {
        float x = 0.0;
        float y = i*-0.015;
        float w = abs(sin(Hash21(float2(i,0.0))*t*3.0)*0.1);
        float d2 = B(p+float2(0.1-w,y),float2(w,0.003));
        d = min(d,d2);
    }
    p = prevP;
    
    return max(abs(p.y)-0.2,d);
}

float scifiUI(float2 p){
    p*=1.1;
    float2 prevP = p;
    float d = B(p,float2(0.15,0.06));
    float a = radians(45.);
    p.x = abs(p.x)-0.195;
    p.y = abs(p.y);
    float m = dot(p,float2(cos(a),sin(a)));
    d = max(m,d);
    
    p = prevP;
    
    p.x+=0.16;
    p.y+=0.008;
    float d2 = B(p,float2(0.06,0.052));
    a = radians(45.);
    p.x = abs(p.x)-0.095;
    p.y = abs(p.y);
    m = dot(p,float2(cos(a),sin(a)));
    d2 = max(m,d2);
    
    p = prevP;
    d2 = min(d,d2);
    d2 = max(-B(p-float2(-0.03,-0.05),float2(0.2,0.05)),abs(d2)-0.003);
    
    return abs(d2)-0.001;
}

float triAnimatin(float2 p, float iTime){
    p.x = abs(p.x)-0.458;
    p.y = abs(p.y)-0.45;
    float2 prevP = p;
    p.x+=iTime*0.1;
    p.x=fmod(p.x,0.04)-0.02;
    p.x+=0.01;
    float d = abs(Tri(p*Rot(radians(-90.)),float2(0.012),radians(45.)))-0.0001;
    p = prevP;
    return max(abs(p.x)-0.125,d);
}

float randomDotLine(float2 p, float iTime){
    float2 prevP = p;
    p.x+=iTime*0.08;
    float2 gv = fract(p*17.0)-0.5;
    float2 id = floor(p*17.0);
    
    float n = Hash21(id);
    float d = B(gv,float2(0.25*(n*2.0),0.2));
    p = prevP;
    p.y+= 0.012;
    d = max(abs(p.y)-0.01,max(abs(p.x)-0.27,d));
    return d;
}

float scifiUI2(float2 p, float iTime){
    float2 prevP = p;

    p*=1.2;
    p.x= abs(p.x)-0.72;
    p.y= abs(p.y)-0.53;
    
    float d = B(p,float2(0.03));
    float a = radians(-45.);
    
    float m = -dot(p-float2(-0.005,0.0),float2(cos(a),sin(a)));
    d = max(m,d);
    m = dot(p-float2(0.005,0.0),float2(cos(a),sin(a)));
    d = max(m,d);
    
    float d2 = B(p-float2(0.175,0.0256),float2(0.15,0.004));
    d = min(d,d2);
    d2 = B(p-float2(-0.175,-0.0256),float2(0.15,0.004));
    d = abs(min(d,d2))-0.0005;
    
    p.y-=0.003;
    p.x+=iTime*0.05;
    p.x = fmod(p.x,0.03)-0.015;
    p.x-=0.01;
    d2 = B(p,float2(0.026));
    
    m = -dot(p-float2(-0.005,0.0),float2(cos(a),sin(a)));
    d2 = max(m,d2);
    m = dot(p-float2(0.005,0.0),float2(cos(a),sin(a)));
    d2 = max(m,d2);
    
    p = prevP;
    p*=1.2;
    p.x= abs(p.x)-0.72;
    p.y= abs(p.y)-0.53;
    m = -dot(p-float2(0.02,0.0),float2(cos(a),sin(a)));
    d2 = max(m,d2);
    m = dot(p-float2(0.32,0.0),float2(cos(a),sin(a)));
    d2 = max(m,d2);
    
    d = min(d,d2);
    
    p = prevP;
    
    d2 = triAnimatin(p, iTime);
    d = min(d,d2);
    
    
    p = prevP;
    p.x= abs(p.x)-0.6;
    p.y= abs(p.y)-0.418;
    
    d2 = randomDotLine(p,iTime);
    d = min(d,d2);
    
    return d;
}

float scifiUI3Base(float2 p,float iTime){
    float d = abs(length(p)-0.03)-0.01;
    p.x=abs(p.x)-0.1;
    float d2 = abs(length(p)-0.03)-0.01;
    d = min(d,d2);
    return d;
}

float scifiUI3(float2 p, float iTime){
    float2 prevP = p;
    float speed = 3.;
    float d = abs(length(p)-0.03)-0.01;
    
    float2x2 animRot = Rot(radians(iTime*speed)*40.0);
    p*=animRot;  
    
    float a = radians(50.);
    d = max(dot(p,float2(cos(a),sin(a))),d);
    a = radians(-50.);
    d = max(dot(p,float2(cos(a),sin(a))),d);   
    
    p = prevP;
    p.x=abs(p.x)-0.1;
    animRot = Rot(radians(iTime*speed)*45.0);
    p*=animRot;  
    
    
    float d2 = abs(length(p)-0.03)-0.01;
    
    a = radians(170.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);
    a = radians(-170.);
    d2 = max(dot(p,float2(cos(a),sin(a))),d2);   
    
    return min(d,d2);
}

float slider(float2 p, float iTime){
    float2 prevP = p;
    
    float d = abs(B(p,float2(0.15,0.015)))-0.001;
    float d2 = B(p-float2(sin(iTime*1.5)*0.13,0),float2(0.02,0.013));
    d = min(d,d2);
    
    p.y = abs(p.y)-0.045;
    d2 = abs(B(p,float2(0.15,0.015)))-0.001;
    d = min(d,d2);
    d2 = B(p-float2(sin(iTime*2.0)*-0.13,0),float2(0.02,0.013));
    d = min(d,d2);
    
    p = prevP;
    p.y=abs(p.y);
    d2 = scifiUI(p-float2(0.032,0.045));
    d = min(d,d2);
    
    return d;
}

float bg(float2 p){
    p = fmod(p,0.3)-0.15;
    float d = B(p,float2(0.001,0.01));
    float d2 = B(p,float2(0.01,0.001));
    d = min(d,d2);
    return d;
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
    float2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;

    float3 col =float3(0.0);
    float d = bg(uv);
    col = mix(col, float3(0.3),S(d,0.0));
    
    d = mainWave(uv,iTime);
    col = mix(col, float3(1.),S(d,-0.005));
    
    d = scifiUI2(uv,iTime);
    
    float d2 = circleUI(uv,iTime);
    d = min(d,d2);

    d2 = smallCircleUI(uv-float2(-0.62,-0.22),iTime);
    d = min(d,d2);
    
    d2 = smallCircleUI2(uv,iTime);
    d = min(d,d2);
    
    d2 = graph(uv-float2(-0.67,0.19),iTime);
    d = min(d,d2);
    
    d2 = barCode(uv-float2(0.63,-0.27),iTime);
    d = min(d,d2);
    
    d2 = slider(uv-float2(0.62,0.26),iTime);
    d = min(d,d2);
    
    col = mix(col, float3(1.),S(d,0.0));
    
    d = scifiUI3Base(uv-float2(0.65,0.),iTime);
    col = mix(col, col+float3(0.5),S(d,0.0));
    
    d = scifiUI3(uv-float2(0.65,0.),iTime);
    col = mix(col, float3(1.),S(d,0.0));
    
    fragColor = float4(col,1.0);
}