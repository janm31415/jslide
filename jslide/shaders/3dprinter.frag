// Signed distance functions from Inigo Quilez's 3D distance functions article (https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm):
float sdPyramid(in vec3 p, in float h) {
    float m2 = h * h + 0.25;
    
    p.xz = abs(p.xz);
    p.xz = p.z > p.x ? p.zx : p.xz;
    p.xz -= 0.5;

    vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);
   
    float s = max(-q.x, 0.0);
    float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);
    
    float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
    float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);
    
    float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);

    return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
}

float sdBox(in vec3 p, in vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdThreadedCylinder(in vec3 p, in float h, in float r, in float turns, in float turnOffset, in float threadThickness) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    float cylinder = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));

    float a = p.y * turns + turnOffset;
    float c = cos(a), s = sin(a);
    p.xz *= mat2(c, -s, s, c);
    p.z -= r;
    float threads = max(abs(p.x), abs(p.z)) - threadThickness;

    return max(cylinder, -threads);
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r;
}

float sdPrintObject(in vec3 p) {
    float cube = sdBox(p, vec3(1.35));
    float sphere = sdSphere(p, 1.6875);
    float cylinder1 = length(p.yz) - 0.6;
    float cylinder2 = length(p.xz) - 0.6;
    float cylinder3 = length(p.xy) - 0.6;
    return max(max(cube, sphere), -min(cylinder1, min(cylinder2, cylinder3)));
}

float mapScene(in vec3 p) {
    p.yz *= mat2(0.965925826289068, 0.258819045102521, -0.258819045102521, 0.965925826289068);

    float r = (0.5 / iResolution.x - 0.5) * 3.1415926535;
    float c = cos(r), s = sin(r);
    p.xz *= mat2(c, -s, s, c);

    float printObj = sdPrintObject(p);

    float time = max(0.0, iTime - 1.0);
    float animTime = time;
    if (time > 10.0) animTime = time * 10.0 - 100.0;
    if (time > 20.0) animTime = time * 100.0 - 2000.0;
    if (time > 30.0) animTime = time * 1000.0 - 30000.0;

    p += 1.35;
    vec3 pos = floor(mod(animTime / vec3(1.0, 18225.0, 135.0), 2.7) / 0.02) * 0.02;
    if (animTime > 49207.5) pos = vec3(2.7);

    float stack = p.y - pos.y;
    float layer = max(stack - 0.02, p.z - pos.z);
    float row = max(max(stack - 0.02, p.z - pos.z - 0.02), p.x - pos.x);

    vec3 bp = p;
    bp.xz -= 1.35;
    float base = sdBox(vec3(bp.x, bp.y + 0.5, bp.z), vec3(3.25, 0.25, 3.25)) - 0.1;

    vec3 lp = bp;
    lp.xz = abs(lp.xz) - 2.5;
    lp.y -= 2.25;
    float lifts = sdThreadedCylinder(lp, 2.5, 0.1, 15.0, pos.y * 10.0, 0.05);

    vec3 rp = vec3(lp.x, bp.y - pos.y - 2.0, bp.z);
    float risers = sdBox(lp - vec3(0.0, pos.y - 0.25, 0.0), vec3(0.4)) - 0.1;
    risers = min(risers, sdThreadedCylinder(rp.xzy, 2.5, 0.1, 15.0, pos.z * 10.0, 0.05));

    vec3 sp = vec3(rp.x, rp.y, rp.z + 1.35 - pos.z);
    float sliders = sdBox(sp, vec3(0.4)) - 0.1;
    sliders = min(sliders, sdThreadedCylinder(vec3(sp.y, bp.x, sp.z), 2.5, 0.1, 15.0, pos.x * 10.0, 0.05));

    vec3 hp = p - pos;
    hp.y = 1.0 - hp.y;
    float head = sdPyramid(hp, 1.0) - 0.05;
    hp.y += 0.65;
    head = min(head, sdBox(hp, vec3(0.45, 0.65, 0.45)) - 0.1);

    float printer = min(base, min(min(lifts, min(risers, sliders)), head));

    return min(printer, max(printObj, min(stack, min(layer, row))));
}

vec3 getNormal(in vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(mapScene(p + e.xyy) - mapScene(p - e.xyy),
                          mapScene(p + e.yxy) - mapScene(p - e.yxy),
                          mapScene(p + e.yyx) - mapScene(p - e.yyx)));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 ro = vec3(0.0, -0.125, 10.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    float t = 0.0;
    for (float iters=0.0; iters < 150.0; iters++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) {
            vec3 n = getNormal(p);
            vec3 l = vec3(-0.58, 0.58, 0.58);
            fragColor.rgb += (0.5 + 0.5 * n) * max(0.3, dot(n, l));
            break;
        }

        if (t > 50.0) {
            break;
        }

        t += d;
    }
}