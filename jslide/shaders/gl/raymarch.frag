#define STEPS 10
#define ANIMDIR mouse.x-mouse.y>0.75
#define VELANIMDIR 0.5
#define ANIMRAY false
#define VELANIMRAY 10.

float sdCircle(vec2 p, float r){
    return length(p)-r;
}

float sdBox(vec2 p, vec2 r){
    vec2 d = abs(p)-r;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
    //return max(abs(p.x)-r.x,abs(p.y)-r.y);
}

float sdLine( vec2 p, vec2 a, vec2 b, float r )
{
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

//Signed distance scene (one square and four circles)
float scene(vec2 p){
    
    float res = sdCircle(p+vec2(-0.3,-0.5),0.25);
    res = min(res,sdCircle(p+vec2(-1.5,-0.1),0.4));
    res = min(res,sdCircle(p+vec2(0.3,0.2),0.1));
    res = min(res,sdCircle(p+vec2(1.2,-0.7),0.2));
    res = min(res,sdBox(p+vec2(1.2,-0.0),vec2(0.1,0.8)));
    
    return res;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = -1. + 2. * fragCoord.xy/iResolution.xy;
    vec2 p = uv;
    p.x*=iResolution.x/iResolution.y;
    
    vec3 col = vec3(0.);
    
    //Here we draw the scene
    float res = scene(p);
    
    //We make some kind of posterize over distances
    res = floor(res*15.)/15.;
    
    //Some colour based on distances
    float att =(1.+0.1*(0.5+0.5*sin(-15.*abs(res)+3.*iTime)));
    if(res<0.){
    col = 5.*vec3(0.,0.5,1.)*abs(res)*att;
    }else{
    col = 1.*vec3(1.,0.5,0.)*(abs(res)*1.1)*att;
    }
    
    vec2 inipos = vec2(1.1,-0.8);
    
    vec2 mouse = vec2(-600,400)/iResolution.xy;
    mouse-=0.5;
    mouse.x *= iResolution.x/iResolution.y;
    
    //We decide if we like a direction vector animated (simple) or no
    vec2 dir;
    if(ANIMDIR){
        float angle = 3.14159/1.3+1.6*sin(VELANIMDIR*iTime);
        dir = normalize(vec2(cos(angle),sin(angle))-inipos);  
    }else{
    	dir = normalize(vec2(2.*mouse.x,2.*mouse.y)-inipos);    
    }
    
	
    //Here we "fake" a raymarching ray, but it is the core of 3D raymarching
    //Because there no raymarching in 2D, in this case,each pixel knows automatically its distance to the scene
    
    float dis = 0.;
    float c = 0.;
    float a = 0.;
    
    vec2 pos = inipos;
    for(int i=0;i<STEPS;i++){
		
        //Animated raymarch
        if(ANIMRAY && mod(floor(VELANIMRAY*iTime),float(STEPS))<float(i)){
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
        	col =  mix(col,vec3(1.,1.,1.),0.5*c);
        }else{
            //Steps points, color based on step number
        	c = sdCircle(p-pos,0.01);
         	a = 3.14159*float(i)/(float(STEPS)+1.);
        	col =  mix(col,
                   vec3(sin(a),cos(a),0.),
                   (1.-step(0.,c)));   
        }

        
        //Distance region circle: in raymarch you can move in any direction inside this circle
        //because you have enough distance to move. The color is based in step number of raymarch
        c = sdCircle(p-pos,dis);
        col += mix(vec3(0.),0.2*vec3(sin(a),cos(a),0.),(1.-smoothstep(0.0,0.005,c)));
        
        //Distance region circumference: only for visual purposes
        c = abs(sdCircle(p-pos,dis))-0.001;
        col = mix(col,0.75*col,(1.-smoothstep(0.0,0.05,c)));
        col += mix(vec3(0.),0.75*vec3(0.5,0.5,0.),(1.-smoothstep(0.0,0.005,c)));

    }
    
    //Raymarch ray: only for visual purposes
    c = sdLine(p,inipos,pos,0.001);
    col = mix(col,0.75*col,(1.-smoothstep(0.0,0.05,c)));
    col += mix(vec3(0.),0.5*vec3(1.,1.,1.),(1.-smoothstep(0.0,0.005,c)));
    
    
    //Show the color
    fragColor = vec4(col,1.0);
}