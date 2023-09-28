void mainImage(out vec4 O, vec2 U) {
    
    float t = iTime,v,d=t;
    mat2  R = mat2( sin(t+vec4(0,33,11,0)) );
    vec3  q = iResolution,
          D = vec3(.3*(U+U-q.xy)/q.y, -1),              // ray direction
          p = 30./q, a;                                 // marching point along ray 
    O-=O; 
    for ( O++; O.x > 0. && d > .01 ; O-=.015 )
        q = p,
        q.xz *= R, q.yz *= R,                           // rotation
        d = abs( v= dot(sin(q),cos(q.yzx)) ) -.1,       // gyroid
        a = abs(q),
        d = max(d, max(a.x,max(a.y,a.z))-6.),           // clamped to cube
        a = abs(fract(q)-.5),
        d = max(d, max(a.x,max(a.y,a.z))-.5+.05*sin(t) ), // grid
        p += .5*d*D;                                    // step forward = dist to obj
    O *= v>0. ? vec4(1,.8,.8,1) : vec4(.8,.8,1,1);
}