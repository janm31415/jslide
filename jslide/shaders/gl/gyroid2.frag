void mainImage(out vec4 O, vec2 U) {
    
    float t = iTime,v,d=t;
    mat2  R = mat2( sin(.5*t+vec4(0,33,11,0)) );
    vec3  q = iResolution,
          D = vec3(.3*(U+U-q.xy)/q.y, -1),              // ray direction
          p = 90./q, a;                                 // marching point along ray 
    O-=O; 
    for ( O++; O.x > 0. && d > .01 ; O-=.015 )
        q = p,
        q.xz *= R, q.yz *= R,                           // rotation
        v= dot(sin(q),cos(q.yzx)) ,
        d = abs(v-1.3),                                 // gyroid
        fract(t/4.)>.5 ? d = min(d, abs(v+1.3)) : d,    // dual                  
     // d = abs(v)-.1,                                  // regular gyroid
        a = abs(q),
        d = max(d, max(a.x,max(a.y,a.z))-18.),          // clamped to cube

        p += .5*d*D;                                    // step forward = dist to obj
 
    O *= v>0. ? vec4(1,.8,.8,1) : vec4(.8,.8,1,1);
}