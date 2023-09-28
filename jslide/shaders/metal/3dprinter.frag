// Signed distance functions from Inigo Quilez's 3D distance functions article (https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm):
float sdPyramid(float3 p, float h) {
    float m2 = h * h + 0.25;
    
    p.xz = abs(p.xz);
    p.xz = p.z > p.x ? p.zx : p.xz;
    p.xz -= 0.5;

    float3 q = float3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);
   
    float s = max(-q.x, 0.0);
    float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);
    
    float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
    float b = m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);
    
    float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);

    return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
}

float sdBox(float3 p, float3 b) {
    float3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdThreadedCylinder(float3 p, float h, float r, float turns, float turnOffset, float threadThickness) {
    float2 d = abs(float2(length(p.xz), p.y)) - float2(r, h);
    float cylinder = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));

    float a = p.y * turns + turnOffset;
    float c = cos(a), s = sin(a);
    p.xz = p.xz*float2x2(c, -s, s, c);
    p.z -= r;
    float threads = max(abs(p.x), abs(p.z)) - threadThickness;

    return max(cylinder, -threads);
}

float sdSphere(float3 p, float r) {
    return length(p) - r;
}

float sdPrintObject(float3 p) {
    float cube = sdBox(p, float3(1.35));
    float sphere = sdSphere(p, 1.6875);
    float cylinder1 = length(p.yz) - 0.6;
    float cylinder2 = length(p.xz) - 0.6;
    float cylinder3 = length(p.xy) - 0.6;
    return max(max(cube, sphere), -min(cylinder1, min(cylinder2, cylinder3)));
}

float mapScene(float3 p, float iTime, float3 iResolution) {
    p.yz = p.yz*float2x2(0.965925826289068, 0.258819045102521, -0.258819045102521, 0.965925826289068);

    float r = (0.5 / iResolution.x - 0.5) * 3.1415926535;
    float c = cos(r), s = sin(r);
    p.xz = p.xz*float2x2(c, -s, s, c);

    float printObj = sdPrintObject(p);

    float time = max(0.0, iTime - 1.0);
    float animTime = time;
    if (time > 10.0) animTime = time * 10.0 - 100.0;
    if (time > 20.0) animTime = time * 100.0 - 2000.0;
    if (time > 30.0) animTime = time * 1000.0 - 30000.0;

    p += 1.35;
    float3 pos = floor(fmod(animTime / float3(1.0, 18225.0, 135.0), 2.7) / 0.02) * 0.02;
    if (animTime > 49207.5) pos = float3(2.7);

    float stack = p.y - pos.y;
    float layer = max(stack - 0.02, p.z - pos.z);
    float row = max(max(stack - 0.02, p.z - pos.z - 0.02), p.x - pos.x);

    float3 bp = p;
    bp.xz -= 1.35;
    float base = sdBox(float3(bp.x, bp.y + 0.5, bp.z), float3(3.25, 0.25, 3.25)) - 0.1;

    float3 lp = bp;
    lp.xz = abs(lp.xz) - 2.5;
    lp.y -= 2.25;
    float lifts = sdThreadedCylinder(lp, 2.5, 0.1, 15.0, pos.y * 10.0, 0.05);

    float3 rp = float3(lp.x, bp.y - pos.y - 2.0, bp.z);
    float risers = sdBox(lp - float3(0.0, pos.y - 0.25, 0.0), float3(0.4)) - 0.1;
    risers = min(risers, sdThreadedCylinder(rp.xzy, 2.5, 0.1, 15.0, pos.z * 10.0, 0.05));

    float3 sp = float3(rp.x, rp.y, rp.z + 1.35 - pos.z);
    float sliders = sdBox(sp, float3(0.4)) - 0.1;
    sliders = min(sliders, sdThreadedCylinder(float3(sp.y, bp.x, sp.z), 2.5, 0.1, 15.0, pos.x * 10.0, 0.05));

    float3 hp = p - pos;
    hp.y = 1.0 - hp.y;
    float head = sdPyramid(hp, 1.0) - 0.05;
    hp.y += 0.65;
    head = min(head, sdBox(hp, float3(0.45, 0.65, 0.45)) - 0.1);

    float printer = min(base, min(min(lifts, min(risers, sliders)), head));

    return min(printer, max(printObj, min(stack, min(layer, row))));
}

float3 getNormal(float3 p, float iTime, float3 iResolution) {
    float2 e = float2(0.001, 0.0);
    return normalize(float3(mapScene(p + e.xyy,iTime,iResolution) - mapScene(p - e.xyy,iTime,iResolution),
                          mapScene(p + e.yxy,iTime,iResolution) - mapScene(p - e.yxy,iTime,iResolution),
                          mapScene(p + e.yyx,iTime,iResolution) - mapScene(p - e.yyx,iTime,iResolution)));
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) {
    float2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    fragColor = float4(0.0, 0.0, 0.0, 1.0);

    float3 ro = float3(0.0, -0.125, 10.0);
    float3 rd = normalize(float3(uv, -1.0));

    float t = 0.0;
    for (float iters=0.0; iters < 150.0; iters++) {
        float3 p = ro + rd * t;
        float d = mapScene(p,iTime,iResolution);
        if (d < 0.001) {
            float3 n = getNormal(p,iTime,iResolution);
            float3 l = float3(-0.58, 0.58, 0.58);
            fragColor.rgb += (0.5 + 0.5 * n) * max(0.3, dot(n, l));
            break;
        }

        if (t > 50.0) {
            break;
        }

        t += d;
    }
}