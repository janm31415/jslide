void mainImage(thread float4& O, float2 U, float iTime, float3 iResolution) {    
    
    float t = iTime,v,d=t;
    float2x2  R = float2x2( sin(t+0), sin(t+33), sin(t+11), sin(t+0) );
    float3  q = iResolution,
          D = float3(.3*(U+U-q.xy)/q.y, -1),              // ray direction
          p = 90./q, a;                                 // marching point along ray 
    O-=O; 
    for ( O++; O.x > 0. && d > .01 ; O-=.015 )
        q = p,
        q.xz = q.xz*R, q.yz = q.yz*R,                           // rotation
        v= dot(sin(q),cos(q.yzx)) ,
        d = abs(v-1.3),                                 // gyroid
        fract(t/4.)>.5 ? d = min(d, abs(v+1.3)) : d,    // dual                  
     // d = abs(v)-.1,                                  // regular gyroid
        a = abs(q),
        d = max(d, max(a.x,max(a.y,a.z))-18.),          // clamped to cube

        p += .5*d*D;                                    // step forward = dist to obj
 
    O *= v>0. ? float4(1,.8,.8,1) : float4(.8,.8,1,1);
}