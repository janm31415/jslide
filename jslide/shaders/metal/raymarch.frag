

#define STEPS 10
#define ANIMDIR mouse.x-mouse.y>0.75
#define VELANIMDIR 0.5
#define ANIMRAY false
#define VELANIMRAY 10.

float sdCircle(float2 p, float r){
    return length(p)-r;
}

float sdBox(float2 p, float2 r){
    float2 d = abs(p)-r;
    return length(max(d,float2(0))) + min(max(d.x,d.y),0.0);
    //return max(abs(p.x)-r.x,abs(p.y)-r.y);
}

float sdLine( float2 p, float2 a, float2 b, float r )
{
    float2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

//Signed distance scene (one square and four circles)
float scene(float2 p){
    
    float res = sdCircle(p+float2(-0.3,-0.5),0.25);
    res = min(res,sdCircle(p+float2(-1.5,-0.1),0.4));
    res = min(res,sdCircle(p+float2(0.3,0.2),0.1));
    res = min(res,sdCircle(p+float2(1.2,-0.7),0.2));
    res = min(res,sdBox(p+float2(1.2,-0.0),float2(0.1,0.8)));
    
    return res;
}


void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
    float2 uv = -1. + 2. * fragCoord.xy/iResolution.xy;
    float2 p = uv;
    p.x*=iResolution.x/iResolution.y;
    
    float3 col = float3(0.);
    
    //Here we draw the scene
    float res = scene(p);
    
    //We make some kind of posterize over distances
    res = floor(res*15.)/15.;
    
    //Some colour based on distances
    float att =(1.+0.1*(0.5+0.5*sin(-15.*abs(res)+3.*iTime)));
    if(res<0.){
    col = 5.*float3(0.,0.5,1.)*abs(res)*att;
    }else{
    col = 1.*float3(1.,0.5,0.)*(abs(res)*1.1)*att;
    }
    
    float2 inipos = float2(1.1,-0.8);
    
    float2 mouse = float2(-600,400)/iResolution.xy;
    mouse-=0.5;
    mouse.x *= iResolution.x/iResolution.y;
    
    //We decide if we like a direction floattor animated (simple) or no
    float2 dir;
    if(ANIMDIR){
        float angle = 3.14159/1.3+1.6*sin(VELANIMDIR*iTime);
        dir = normalize(float2(cos(angle),sin(angle))-inipos);  
    }else{
    	dir = normalize(float2(2.*mouse.x,2.*mouse.y)-inipos);    
    }
    
	
    //Here we "fake" a raymarching ray, but it is the core of 3D raymarching
    //Because there no raymarching in 2D, in this case,each pixel knows automatically its distance to the scene
    
    float dis = 0.;
    float c = 0.;
    float a = 0.;
    
    float2 pos = inipos;
    for(int i=0;i<STEPS;i++){
		
        //Animated raymarch
        if(ANIMRAY && fmod(floor(VELANIMRAY*iTime),float(STEPS))<float(i)){
        	break;   
        }
        
        //Raymarch core/////
        pos+=dis*dir;
        dis = scene(pos);
        if(dis<0.001) break;
        ////////////////////
        
        //Drawing stuff
        if(i==0){
            //Camera position, a annulus with an animated radii
            c = 1.-smoothstep(0.0,0.003,abs(sdCircle(sin(p-pos),0.05+0.005*sin(10.*iTime)))-0.005);
        	col =  mix(col,float3(1.,1.,1.),0.5*c);
        }else{
            //Steps points, color based on step number
        	c = sdCircle(p-pos,0.01);
         	a = 3.14159*float(i)/(float(STEPS)+1.);
        	col =  mix(col,
                   float3(sin(a),cos(a),0.),
                   (1.-step(0.,c)));   
        }

        
        //Distance region circle: in raymarch you can move in any direction inside this circle
        //because you have enough distance to move. The color is based in step number of raymarch
        c = sdCircle(p-pos,dis);
        col += mix(float3(0.),0.2*float3(sin(a),cos(a),0.),(1.-smoothstep(0.0,0.005,c)));
        
        //Distance region circumference: only for visual purposes
        c = abs(sdCircle(p-pos,dis))-0.001;
        col = mix(col,0.75*col,(1.-smoothstep(0.0,0.05,c)));
        col += mix(float3(0.),0.75*float3(0.5,0.5,0.),(1.-smoothstep(0.0,0.005,c)));

    }
    
    //Raymarch ray: only for visual purposes
    c = sdLine(p,inipos,pos,0.001);
    col = mix(col,0.75*col,(1.-smoothstep(0.0,0.05,c)));
    col += mix(float3(0.),0.5*float3(1.,1.,1.),(1.-smoothstep(0.0,0.005,c)));
    
    
    //Show the color
    fragColor = float4(col,1.0);
}