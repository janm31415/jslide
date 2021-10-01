float snoise(vec3 uv, float res) {
    const vec3 s = vec3(1.0, 100.0, 1000.0);
    uv *= res;

    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + vec3(1.0, 1.0, 1.0), res)) * s;

    vec3 f = fract(uv);
    f = f * f * (3.0 - 2.0 * f);

    vec4 v = vec4(uv0.x + uv0.y + uv0.z, 
                  uv1.x + uv0.y + uv0.z,
                  uv0.x + uv1.y + uv0.z,
                  uv1.x + uv1.y + uv0.z);
    vec4 r = fract(sin(v * 0.1) * 1000.0);
    float r0 = mix(mix(r.x, r.y, r.x), 
                   mix(r.z, r.w, f.x), f.y);
    r = fract(sin((v + uv1.z - uv0.z) * 0.1) * 1000.0);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = -0.5 + fragCoord.xy / iResolution.xy;
    p.x *= iResolution.x / iResolution.y;

    float color = 3.0 - (3.0 * length(2.0 * p));

    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5,
                      length(p) * 0.4, 0.5);
    
    for (int i = 1; i <= 7; i++) {
        float power = pow(2.0, float(i));
        color += (1.5 / power) * snoise(coord + vec3(0.0, iGlobalTime * 0.05, iGlobalTime * 0.01),
                power * 16.0);
    }

    fragColor = vec4(color, pow(max(color, 0.0), 2.0) * 0.4, 
                     pow(max(color, 0.0), 3.0) * 0.15, 1.0);
}