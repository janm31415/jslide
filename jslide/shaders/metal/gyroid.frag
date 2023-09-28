
void mainImage(thread float4& O, float2 U, float iTime, float3 iResolution) {    
    float t = iTime,v,d=t;
    float2x2  R = float2x2( sin(t+0), sin(t+33), sin(t+11), sin(t+0) );
    float3  q = iResolution,
          D = float3(.3*(U+U-q.xy)/q.y, -1),              // ray direction
          p = 30./q, a;                                 // marching point along ray 
    O-=O; 
    for ( O++; O.x > 0. && d > .01 ; O-=.015 )
        q = p,
        q.xz = q.xz*R, q.yz = q.yz*R,                           // rotation
        d = abs( v= dot(sin(q),cos(q.yzx)) ) -.1,       // gyroid
        a = abs(q),
        d = max(d, max(a.x,max(a.y,a.z))-6.),           // clamped to cube
        a = abs(fract(q)-.5),
        d = max(d, max(a.x,max(a.y,a.z))-.5+.05*sin(t) ), // grid
        p += .5*d*D;                                    // step forward = dist to obj
    O *= v>0. ? float4(1,.8,.8,1) : float4(.8,.8,1,1);
}