float brushb( float2 p, float3 c1, float3 c2, float an, float iTime)
{
    float3 c = mix(c2, c1, an);
    return exp(-(50.0 * c.z) * (50.0 * c.z) * dot(p - c.xy, p - c.xy));
}

float3 color(float3 c1, float3 c2, float an)
  {
  return mix(c2, c1, an);
  }

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution)
{
    float2 uv = fragCoord.xy / iResolution.y;
    uv.x -=  0.5*(iResolution.x / iResolution.y - 1.0);

    float speed = 0.25;
    float an = (clamp( cos(iTime*0.5), -speed, speed ) + speed)/(2.0*speed);

    float3 col = float3(0.0);
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.462879, 0.957154), an), brushb(uv, float3(0, 0.139927, 0.05), float3(0.27839, 0.581464, 1), an, iTime));
    col = mix(col, color(float3(0.230416, 0.312683, 0.590038), float3(0.281373, 0.268037, 0.319554), an), brushb(uv, float3(0.492135, 0.575168, 0.497329), float3(0.928581, 0.885936, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.918566, 0.251136, 0.61988), an), brushb(uv, float3(0, 0.924419, 0.05), float3(0.771735, 0.974577, 0.740521), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.69013, 0.857686, 0.65829), an), brushb(uv, float3(0, 0.819969, 0.05), float3(0.63341, 0.408045, 0.655241), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.483575, 0.182908, 0.852828), an), brushb(uv, float3(0, 0.173514, 0.05), float3(0.595839, 0.899059, 0.822733), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.959121, 0.385998, 0.614955), an), brushb(uv, float3(0, 0.853779, 0.05), float3(0.510536, 0.217999, 0.896305), an, iTime));
    col = mix(col, color(float3(0.324249, 1, 0.174224), float3(0.591199, 0.801786, 0.696295), an), brushb(uv, float3(0.131823, 0.578968, 0.541956), float3(0.980585, 0.591005, 0.71831), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.0833669, 0.0787493, 0.598772), an), brushb(uv, float3(1, 0.922895, 0.05), float3(0.946926, 0.971507, 0.167712), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.491506, 0.312804, 0.272023), an), brushb(uv, float3(0.999962, 0.138381, 0.05), float3(0.0803955, 0.374422, 0.410953), an, iTime));
    col = mix(col, color(float3(0.992293, 1, 1), float3(0.589693, 0.297657, 1), an), brushb(uv, float3(1, 0.888722, 0.05), float3(0.4916, 0.59878, 0.753718), an, iTime));
    col = mix(col, color(float3(0.15828, 0.473502, 0.028112), float3(0.30823, 0.31958, 0.232248), an), brushb(uv, float3(0.944132, 0.3521, 0.675309), float3(0.814002, 0.25634, 0.194881), an, iTime));
    col = mix(col, color(float3(0, 0.220754, 0.368038), float3(0.791963, 0.972807, 1), an), brushb(uv, float3(0.497637, 0.443184, 0.417678), float3(0.211559, 0.733305, 1), an, iTime));
    col = mix(col, color(float3(0, 0.0755253, 0.5768), float3(0.711336, 0.00931575, 0.638812), an), brushb(uv, float3(0.11453, 0.39253, 0.367267), float3(0.659063, 0.4373, 0.717953), an, iTime));
    col = mix(col, color(float3(0.309574, 0.633191, 0.0015962), float3(0.632156, 0.809256, 0.772531), an), brushb(uv, float3(0.852522, 0.334506, 0.697052), float3(0.888325, 0.497153, 0.641401), an, iTime));
    col = mix(col, color(float3(0.528625, 0.625608, 0.545832), float3(0.857191, 0.711431, 0.451383), an), brushb(uv, float3(0.34882, 0.698822, 0.330817), float3(0.312044, 0.310883, 0.944431), an, iTime));
    col = mix(col, color(float3(1, 0.993208, 1), float3(0.179657, 0.907308, 0.11902), an), brushb(uv, float3(0.992287, 0.722964, 0.05), float3(1, 0.870441, 0.680013), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.589636, 0.483543, 0.486517), an), brushb(uv, float3(0, 0.910748, 0.05), float3(0.339748, 0.367081, 0.999456), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.605281, 1, 0.677303), an), brushb(uv, float3(0, 0.183697, 0.05), float3(0.94828, 0.934538, 0.462175), an, iTime));
    col = mix(col, color(float3(0.374777, 0.350162, 0.498289), float3(0.61781, 0.0572092, 0.0666205), an), brushb(uv, float3(0.323432, 0.889379, 0.778285), float3(0.822262, 0.0913142, 0.682782), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.24017, 0.663079, 0.558344), an), brushb(uv, float3(1, 0.766217, 0.05), float3(0.568545, 1, 0.881941), an, iTime));
    col = mix(col, color(float3(0.237733, 0.256171, 0.0347249), float3(0.82295, 0.0490538, 0), an), brushb(uv, float3(0.478263, 0.162619, 0.647188), float3(0.88768, 0.225965, 0.314367), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.973651, 0.825552), an), brushb(uv, float3(1, 0.109728, 0.05), float3(0.334339, 0.294284, 0.896527), an, iTime));
    col = mix(col, color(float3(0.473192, 0.564596, 0.280022), float3(0.267842, 0.461339, 0.643607), an), brushb(uv, float3(0.802362, 0.336331, 0.490538), float3(0.915082, 0.75899, 0.959108), an, iTime));
    col = mix(col, color(float3(0.12332, 0.66998, 0.301717), float3(0.00019017, 0.387442, 1), an), brushb(uv, float3(0.663427, 1, 0.514611), float3(0.531322, 0.570738, 1), an, iTime));
    col = mix(col, color(float3(0.0963704, 0.43774, 0.445754), float3(0.904332, 0.305256, 1), an), brushb(uv, float3(0, 0.613251, 0.578037), float3(0.773881, 0.797493, 0.917294), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.705248, 0.46735, 0.0940396), an), brushb(uv, float3(0, 0.814994, 0.05), float3(0.481078, 0.209411, 0.917172), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.933376, 0.744579, 1), an), brushb(uv, float3(1, 0.268422, 0.05), float3(0.214747, 0.706942, 0.845357), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.639065, 0.0352724, 0.103499), an), brushb(uv, float3(1, 0.134068, 0.05), float3(0.686249, 0.171432, 0.687061), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.376528, 0.959257), an), brushb(uv, float3(0, 0.801814, 0.05), float3(0.474676, 0.167498, 0.851162), an, iTime));
    col = mix(col, color(float3(0.900834, 0.551532, 0.795983), float3(0.637688, 0.29783, 0.311881), an), brushb(uv, float3(0, 0.436533, 0.892203), float3(0.402333, 0.477032, 0.890394), an, iTime));
    col = mix(col, color(float3(0.0737148, 1, 0.228987), float3(0, 0.722658, 1), an), brushb(uv, float3(0.515954, 0.755396, 0.777585), float3(0.416115, 0.174232, 0.885105), an, iTime));
    col = mix(col, color(float3(0.436279, 0.983591, 0.636248), float3(0.864138, 1, 1), an), brushb(uv, float3(0.419741, 1, 0.668883), float3(0.381755, 0.1014, 1), an, iTime));
    col = mix(col, color(float3(0.717442, 0.743523, 0.914914), float3(0.648748, 0.0753015, 0.611082), an), brushb(uv, float3(0.346533, 0.0401832, 0.456405), float3(0.768821, 0.130621, 0.392372), an, iTime));
    col = mix(col, color(float3(0.981618, 0.711892, 0.326279), float3(1, 0.00429803, 0), an), brushb(uv, float3(0.0904565, 0.162503, 0.821544), float3(0.314112, 0.466606, 0.726405), an, iTime));
    col = mix(col, color(float3(0.131347, 0.88003, 0.617936), float3(1, 0.856539, 0.684663), an), brushb(uv, float3(1, 0.761999, 0.791542), float3(0.187432, 0.477948, 1), an, iTime));
    col = mix(col, color(float3(0.900179, 0.712036, 0.603102), float3(0.273845, 0.0537758, 0.003944), an), brushb(uv, float3(0.696499, 0.948904, 0.828879), float3(0.0648984, 0.341158, 0.604333), an, iTime));
    col = mix(col, color(float3(0.205915, 0.484147, 0.427648), float3(0.118368, 0.584941, 0.106252), an), brushb(uv, float3(0.689493, 0.322441, 0.481632), float3(0.749535, 0, 0.740799), an, iTime));
    col = mix(col, color(float3(0.419164, 0.833408, 0.0855912), float3(0.990694, 0.582091, 0.373943), an), brushb(uv, float3(0.672051, 0.282545, 0.622043), float3(0.800195, 0.341052, 0.26722), an, iTime));
    col = mix(col, color(float3(0.86665, 0.240403, 0.411827), float3(0.712033, 0.875214, 0.77686), an), brushb(uv, float3(0.462538, 0.866764, 0.909575), float3(0.194551, 0.680581, 0.954162), an, iTime));
    col = mix(col, color(float3(0.116179, 0.871498, 0.885384), float3(0.82321, 0.775946, 0.084808), an), brushb(uv, float3(0.724383, 0.295926, 0.862785), float3(0.696912, 0.160379, 0.566449), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.65357, 0.895466, 0.409601), an), brushb(uv, float3(1, 0.788063, 0.05), float3(0.928642, 0.316738, 0.753328), an, iTime));
    col = mix(col, color(float3(0.846068, 0.283379, 0.964227), float3(0.900694, 0.540401, 0.47054), an), brushb(uv, float3(0.835719, 0.584586, 0.987227), float3(0.341588, 0.281564, 1), an, iTime));
    col = mix(col, color(float3(0.245783, 0.628228, 0.496881), float3(0.848195, 0.425905, 0.715866), an), brushb(uv, float3(0.114956, 0.214894, 0.502125), float3(0.856376, 0.668355, 0.814996), an, iTime));
    col = mix(col, color(float3(0.642867, 0.799386, 0.819085), float3(0.779367, 0.769088, 0.184144), an), brushb(uv, float3(0.945112, 0.343384, 0.83531), float3(0.728783, 0.338229, 0.38352), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.464276, 0.565545, 0.266973), an), brushb(uv, float3(1, 0.881932, 0.05), float3(0.764595, 0.238736, 0.406789), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.00759128, 0.995319, 0.632454), an), brushb(uv, float3(1, 0.166857, 0.05), float3(0.81273, 0.809233, 0.607442), an, iTime));
    col = mix(col, color(float3(0.418053, 0.609842, 0.23307), float3(0.148679, 0.133595, 0.646587), an), brushb(uv, float3(0.778141, 0.198622, 0.366674), float3(0.884894, 0.213956, 0.437062), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.0321955, 0.954436, 0.930253), an), brushb(uv, float3(0, 0.146623, 0.05), float3(0.626214, 0.984654, 0.857311), an, iTime));
    col = mix(col, color(float3(0.98847, 0.672531, 0.723098), float3(0.00890641, 0.694014, 1), an), brushb(uv, float3(0.904044, 0.49778, 0.699449), float3(0.229308, 0.572759, 0.907432), an, iTime));
    col = mix(col, color(float3(0, 0.341738, 0.405093), float3(0.963472, 0.0235733, 0.78108), an), brushb(uv, float3(0.191969, 0.741635, 0.748238), float3(0.778048, 0.0302554, 0.704447), an, iTime));
    col = mix(col, color(float3(0.821536, 0.477092, 0.0680306), float3(0.17537, 0.563732, 0.302413), an), brushb(uv, float3(0.917952, 0.136698, 0.270709), float3(0.365357, 0.812994, 1), an, iTime));
    col = mix(col, color(float3(0.601099, 0.725407, 0.729562), float3(0.53924, 0.5848, 0.557612), an), brushb(uv, float3(0.0650272, 0.0333061, 0.272016), float3(0.828077, 0.547184, 0.849609), an, iTime));
    col = mix(col, color(float3(0.556192, 0.162467, 0.456888), float3(0.971354, 0.0869075, 0.399281), an), brushb(uv, float3(0.975003, 0.732477, 0.979046), float3(0.666004, 0.135499, 0.900739), an, iTime));
    col = mix(col, color(float3(0.011625, 0.410595, 0.250776), float3(0.927581, 0.140016, 0.221321), an), brushb(uv, float3(0.549027, 0.959001, 0.41819), float3(0.86609, 1, 0.222959), an, iTime));
    col = mix(col, color(float3(0.305237, 0.616306, 0.168831), float3(0.565297, 0.847211, 0.875979), an), brushb(uv, float3(0.516061, 0.332207, 0.413334), float3(0.814164, 0.988811, 0.310511), an, iTime));
    col = mix(col, color(float3(0.80621, 0.496602, 0.0198805), float3(0.771618, 0.643473, 0.484947), an), brushb(uv, float3(0.642582, 1, 0.925708), float3(0.590245, 0.95584, 0.946028), an, iTime));
    col = mix(col, color(float3(0.462439, 0.498026, 0.20575), float3(0.470063, 0.821206, 0.192401), an), brushb(uv, float3(0.907562, 0.201514, 0.547925), float3(0.0813113, 1, 0.671796), an, iTime));
    col = mix(col, color(float3(0.161603, 0.428877, 0.316084), float3(0.573452, 0.496533, 0.496287), an), brushb(uv, float3(0.33155, 0.870295, 0.376138), float3(0.349316, 0.514998, 1), an, iTime));
    col = mix(col, color(float3(0.738036, 0.0817133, 0.75073), float3(1, 1, 0.927223), an), brushb(uv, float3(0.502285, 0.497497, 0.993988), float3(0.24377, 0.198554, 1), an, iTime));
    col = mix(col, color(float3(0.388722, 1, 0.925366), float3(0.142295, 0.444132, 0.877332), an), brushb(uv, float3(0.833377, 0.424632, 1), float3(0, 1, 0.864243), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.928275, 0.500904), an), brushb(uv, float3(1, 0.542096, 0.05), float3(0.572525, 0.363689, 0.824376), an, iTime));
    col = mix(col, color(float3(0.22238, 0.479182, 0.220609), float3(0.470253, 0.656395, 0.295718), an), brushb(uv, float3(0.669219, 0.988836, 0.56512), float3(0.11602, 1, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.861712, 0.277481, 0.758924), an), brushb(uv, float3(1, 0.806457, 0.05), float3(0.705402, 0.880395, 1), an, iTime));
    col = mix(col, color(float3(0.72038, 0.507989, 0.19448), float3(0.606364, 0.481494, 0.0444779), an), brushb(uv, float3(0.650876, 0.804716, 0.94465), float3(0.34279, 0.698818, 0.506626), an, iTime));
    col = mix(col, color(float3(0.387101, 0.143891, 0.830878), float3(0.948051, 0.368733, 0.686489), an), brushb(uv, float3(0.996448, 0.534794, 0.300014), float3(0.823379, 0.301441, 0.396231), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.151849, 0.398424, 0.859142), an), brushb(uv, float3(1, 0.224211, 0.05), float3(0.817946, 0.0850992, 0.529942), an, iTime));
    col = mix(col, color(float3(1, 0.68303, 0.806782), float3(0.615524, 0.653135, 0.76688), an), brushb(uv, float3(0.443977, 0.666551, 0.749209), float3(0.23112, 0.372016, 1), an, iTime));
    col = mix(col, color(float3(0.993696, 1, 1), float3(0.973449, 0.127646, 0.784632), an), brushb(uv, float3(1, 0.769513, 0.05), float3(0.671305, 0.442585, 0.933025), an, iTime));
    col = mix(col, color(float3(0.307424, 0.51659, 0.546934), float3(1, 0.269425, 0), an), brushb(uv, float3(0.489084, 0.135029, 0.62998), float3(0.686153, 0.183618, 0.58348), an, iTime));
    col = mix(col, color(float3(0.240852, 0.118726, 0.072329), float3(0.751997, 0.20761, 0.332196), an), brushb(uv, float3(0.639433, 0.900423, 0.79404), float3(0.802399, 0.258554, 0.208431), an, iTime));
    col = mix(col, color(float3(0.20931, 0.742583, 0.711984), float3(0.142282, 0.945739, 0.613861), an), brushb(uv, float3(0.333669, 0.593247, 1), float3(0.226417, 0.958062, 0.897161), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 1, 1), an), brushb(uv, float3(0, 0.935156, 0.05), float3(0.302507, 0.177675, 1), an, iTime));
    col = mix(col, color(float3(0.865577, 0.328331, 0.626313), float3(0.928399, 0.786042, 0.304947), an), brushb(uv, float3(1, 0.800424, 0.720451), float3(1, 0.950733, 0.557067), an, iTime));
    col = mix(col, color(float3(0.814841, 0.643648, 0.938021), float3(0.275625, 0.732443, 0.526602), an), brushb(uv, float3(0.843862, 0.790868, 0.445214), float3(0.676887, 0.862614, 0.750413), an, iTime));
    col = mix(col, color(float3(0.954998, 0.846282, 0.483491), float3(0.366538, 0.405524, 0.474856), an), brushb(uv, float3(0.902956, 0.888175, 0.354509), float3(0.739054, 0.779823, 0.510982), an, iTime));
    col = mix(col, color(float3(0.445093, 0.645209, 0.119514), float3(0.981299, 0, 0.00569625), an), brushb(uv, float3(0.878445, 0.453581, 0.650701), float3(0.168308, 0.577947, 0.934945), an, iTime));
    col = mix(col, color(float3(0.0933285, 0.687035, 0.41046), float3(0.667264, 0.0601962, 0.966174), an), brushb(uv, float3(0.912773, 0.693562, 0.550658), float3(0.151101, 0.969464, 1), an, iTime));
    col = mix(col, color(float3(0.847831, 0.0580822, 0.667557), float3(0.277389, 1, 0), an), brushb(uv, float3(0.0227354, 0.756064, 0.502751), float3(0.698623, 0.0679673, 0.703553), an, iTime));
    col = mix(col, color(float3(0.594038, 0.779373, 0.72978), float3(1, 0.791453, 0.747917), an), brushb(uv, float3(0.795462, 0.298379, 0.890419), float3(0.422118, 0.419695, 1), an, iTime));
    col = mix(col, color(float3(0.0352389, 0.176403, 0.916882), float3(0.223414, 0.882221, 0.331148), an), brushb(uv, float3(0.955802, 0.82179, 0.867553), float3(0.680556, 0.299863, 0.47785), an, iTime));
    col = mix(col, color(float3(0.550989, 0.306712, 0.263186), float3(0.968031, 1, 0.531945), an), brushb(uv, float3(0.318606, 0.918341, 0.478834), float3(0.927116, 0.906571, 0.318921), an, iTime));
    col = mix(col, color(float3(0.191313, 0.0260804, 0.35729), float3(0.148249, 0.529391, 0.206329), an), brushb(uv, float3(0.156192, 0.910228, 0.831584), float3(0.718123, 0.810592, 0.571183), an, iTime));
    col = mix(col, color(float3(0.404354, 0.438715, 0.265446), float3(0.536826, 0.0954087, 0.363832), an), brushb(uv, float3(0.770559, 0.917348, 0.933744), float3(0.90654, 0.604201, 0.909581), an, iTime));
    col = mix(col, color(float3(0.0842252, 0.987427, 0.475783), float3(0.304076, 0.700649, 0.585879), an), brushb(uv, float3(1, 0.934816, 0.329599), float3(0.598216, 0.412132, 0.784446), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.626756, 0.328233), an), brushb(uv, float3(0, 0.824178, 0.05), float3(0.525864, 0.539851, 1), an, iTime));
    col = mix(col, color(float3(0.745432, 0.872381, 0.780077), float3(0.108258, 0.764726, 1), an), brushb(uv, float3(0.599672, 0.440141, 0.926091), float3(0.679114, 0.204008, 0.753145), an, iTime));
    col = mix(col, color(float3(0.0333939, 0.307636, 0.335482), float3(0.510163, 1, 0.408001), an), brushb(uv, float3(0.569503, 0.239495, 0.733748), float3(0.208927, 0.496252, 0.862513), an, iTime));
    col = mix(col, color(float3(0.348088, 0.645824, 0.0397254), float3(0.00655929, 0.913882, 0.783871), an), brushb(uv, float3(0.87012, 0.704906, 0.776397), float3(0.96505, 0.730777, 0.379719), an, iTime));
    col = mix(col, color(float3(0.352636, 0.717412, 0.941133), float3(0.141996, 0.43189, 0.821699), an), brushb(uv, float3(0.508778, 0.985985, 0.744451), float3(0.745261, 0.790584, 0.865968), an, iTime));
    col = mix(col, color(float3(0.0594837, 0.272832, 0.617734), float3(0.600882, 0.312311, 0.473124), an), brushb(uv, float3(0.0643658, 0.509289, 0.654044), float3(0.876343, 0.375066, 0.447055), an, iTime));
    col = mix(col, color(float3(0.401579, 1, 0.338936), float3(0.459032, 0.785021, 0.820222), an), brushb(uv, float3(0.336418, 0.109495, 0.195794), float3(0.594431, 0.306537, 0.946942), an, iTime));
    col = mix(col, color(float3(0.377171, 0.58453, 0), float3(0.156221, 0.751898, 0.248399), an), brushb(uv, float3(0.617363, 0.124483, 0.406641), float3(0.775984, 0.221908, 0.496992), an, iTime));
    col = mix(col, color(float3(0.778659, 1, 0.0684014), float3(1, 1, 0.750766), an), brushb(uv, float3(0.553721, 0.817919, 0.447251), float3(0.569972, 0.34496, 0.863315), an, iTime));
    col = mix(col, color(float3(0.863715, 0.259571, 0), float3(0.941759, 0.38095, 0), an), brushb(uv, float3(0.167392, 0.677974, 0.49862), float3(0.852798, 0.101604, 0.672503), an, iTime));
    col = mix(col, color(float3(0.0061867, 0.825958, 0.684399), float3(0.621268, 0.131513, 0.340759), an), brushb(uv, float3(0.252234, 1, 0.493829), float3(0.871768, 0.892053, 0.971569), an, iTime));
    col = mix(col, color(float3(0.086015, 0.378551, 0.485551), float3(0.556922, 0.862143, 0.493765), an), brushb(uv, float3(0.75119, 0.698586, 0.713316), float3(0.843614, 0.935884, 0.750625), an, iTime));
    col = mix(col, color(float3(0.457746, 0.177323, 0.127863), float3(0.661308, 1, 0.452912), an), brushb(uv, float3(0.829538, 0.247441, 0.843556), float3(0.661656, 0.272226, 0.544062), an, iTime));
    col = mix(col, color(float3(0.344912, 0.400515, 0.420248), float3(0.76876, 0.601301, 0.340611), an), brushb(uv, float3(0.184754, 0.997301, 0.980676), float3(0.424537, 0.0849966, 0.853155), an, iTime));
    col = mix(col, color(float3(0.892142, 0.916378, 0.656151), float3(1, 0.974817, 0.0359842), an), brushb(uv, float3(0.904772, 0.67656, 0.237433), float3(0.779969, 0, 0.613772), an, iTime));
    col = mix(col, color(float3(0.66962, 0.651112, 0.320775), float3(0, 0.0765164, 0.61435), an), brushb(uv, float3(0.0637014, 0.214126, 0.666905), float3(0.870358, 0.839625, 0.967306), an, iTime));
    col = mix(col, color(float3(0.802034, 0.930491, 0.721764), float3(0.251318, 0.111138, 0), an), brushb(uv, float3(0.547779, 0.942642, 0.562272), float3(0.898158, 0.21276, 0.360971), an, iTime));
    col = mix(col, color(float3(0.36836, 0.706294, 0.177631), float3(1, 0.623741, 1), an), brushb(uv, float3(0.706713, 0.554404, 0.643368), float3(0.33851, 0.524046, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.492653, 1, 0.101773), an), brushb(uv, float3(1, 0.107098, 0.05), float3(0.929779, 0.911713, 0.984618), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.158069, 1, 0.282749), an), brushb(uv, float3(1, 0.0960099, 0.05), float3(0.925678, 1, 0.710303), an, iTime));
    col = mix(col, color(float3(0.0968032, 1, 0.840635), float3(0.363228, 1, 1), an), brushb(uv, float3(0.779537, 1, 0.631425), float3(0.490933, 0.585967, 1), an, iTime));
    col = mix(col, color(float3(0.500799, 0.149381, 0.882589), float3(1, 0.457405, 1), an), brushb(uv, float3(0.805371, 0.417139, 0.819297), float3(0.269857, 0.118332, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.999788), float3(0.139313, 0.924926, 0.141792), an), brushb(uv, float3(1, 0.814334, 0.05), float3(0.94787, 0.898751, 0.740667), an, iTime));
    col = mix(col, color(float3(0.205693, 0.287871, 0.164127), float3(0.989103, 0.399136, 0.377349), an), brushb(uv, float3(0.0766912, 0.667688, 0.943671), float3(0.91763, 0.631474, 0.641535), an, iTime));
    col = mix(col, color(float3(0.541278, 0.80149, 0.0480984), float3(0.0308142, 0.271142, 0.487929), an), brushb(uv, float3(0.0639954, 0.80394, 0.453519), float3(0.852208, 0.371603, 0.366875), an, iTime));
    col = mix(col, color(float3(0.294973, 0.445491, 0.93793), float3(0.394476, 0.564686, 0.605892), an), brushb(uv, float3(0.110671, 0.397526, 0.519357), float3(0.650408, 0.086858, 0.639347), an, iTime));
    col = mix(col, color(float3(0.0593588, 0.150104, 0.0728176), float3(0.695248, 0.683411, 0.704683), an), brushb(uv, float3(0.623066, 0.905245, 0.895643), float3(0.235657, 0.140291, 1), an, iTime));
    col = mix(col, color(float3(0.345408, 0.459142, 0.648734), float3(0.177133, 0.365235, 0.167383), an), brushb(uv, float3(0.66999, 0.504553, 0.132441), float3(0.741021, 0.855047, 0.528632), an, iTime));
    col = mix(col, color(float3(0.797501, 0.0582523, 0.600058), float3(0.706563, 0.385331, 0.286911), an), brushb(uv, float3(0.513788, 0.539602, 0.703649), float3(0.285415, 0.233011, 0.884821), an, iTime));
    col = mix(col, color(float3(0.825924, 0.226627, 0.32472), float3(0.692461, 0.144513, 0.975401), an), brushb(uv, float3(0.834563, 0.512533, 0.52281), float3(1, 0.865398, 1), an, iTime));
    col = mix(col, color(float3(0.225877, 0.013783, 0.432056), float3(0.876969, 0.36238, 0.106797), an), brushb(uv, float3(0.671463, 0.293461, 0.479286), float3(0.95231, 0.987986, 0.484931), an, iTime));
    col = mix(col, color(float3(0.861408, 1, 0.754516), float3(0.771058, 0.360058, 0.750316), an), brushb(uv, float3(0.133413, 0.124199, 0.451749), float3(0.244436, 0.763143, 1), an, iTime));
    col = mix(col, color(float3(0.832988, 0.611282, 0.851381), float3(0.961812, 0.329326, 0.49033), an), brushb(uv, float3(0.705629, 0.417541, 0.146168), float3(0.703154, 0.953659, 0.949007), an, iTime));
    col = mix(col, color(float3(0.136396, 0.379301, 0.595556), float3(0.498153, 0, 0), an), brushb(uv, float3(0.939856, 0.123686, 0.193783), float3(0.434394, 0.360167, 0.543922), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 1, 0.99321), an), brushb(uv, float3(0, 0.347061, 0.05), float3(0.188978, 0.643418, 0.97285), an, iTime));
    col = mix(col, color(float3(0.311168, 0.626832, 0.235582), float3(0.832928, 0.18616, 0.493266), an), brushb(uv, float3(0.881204, 0.926597, 0.291128), float3(0.936996, 0.442666, 0.557221), an, iTime));
    col = mix(col, color(float3(0.608482, 0.257486, 0.0588757), float3(1, 1, 0.980729), an), brushb(uv, float3(0.64859, 0.286902, 0.813874), float3(0.662042, 0.181242, 0.938472), an, iTime));
    col = mix(col, color(float3(0.340136, 0.429704, 0.293057), float3(0.544025, 0.0868297, 0.167348), an), brushb(uv, float3(0.993407, 0.810173, 0.588336), float3(0.701875, 0.169716, 1), an, iTime));
    col = mix(col, color(float3(1, 0.282788, 0.186448), float3(0.506229, 0.180883, 0.752776), an), brushb(uv, float3(0.468134, 0.691026, 0.125711), float3(0.881215, 0.229587, 0.852), an, iTime));
    col = mix(col, color(float3(0.210462, 0.12604, 0.964698), float3(0.408886, 0.795507, 0.209556), an), brushb(uv, float3(0.165394, 0.45808, 0.375257), float3(0.855738, 0.460275, 0.52677), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.721639, 0.106016, 0.634674), an), brushb(uv, float3(0, 0.136334, 0.05), float3(0.0181613, 0.953796, 0.778364), an, iTime));
    col = mix(col, color(float3(0.345021, 0.412445, 0.0716368), float3(0.457878, 0.979714, 0.768335), an), brushb(uv, float3(0.281028, 0.871499, 0.489131), float3(0.774264, 0.999228, 0.224439), an, iTime));
    col = mix(col, color(float3(0.14935, 0.324158, 0), float3(0.402785, 0.850157, 0.556979), an), brushb(uv, float3(0.111834, 0.709348, 0.996461), float3(0.891986, 0.790792, 0.518288), an, iTime));
    col = mix(col, color(float3(0.752269, 0.466145, 0.368797), float3(0.244441, 0.198041, 0), an), brushb(uv, float3(0, 0.345074, 0.60046), float3(0.230445, 0.948896, 0.741792), an, iTime));
    col = mix(col, color(float3(0.229698, 0.490366, 0.623879), float3(0.597434, 0.40677, 0.949954), an), brushb(uv, float3(0.256984, 0.064684, 0.888034), float3(0.370222, 0.769397, 0.588528), an, iTime));
    col = mix(col, color(float3(0.32222, 0.441418, 0.312244), float3(0.979823, 0.577093, 0.349089), an), brushb(uv, float3(0.745663, 0.135331, 0.258046), float3(0.839993, 0.195165, 0.648764), an, iTime));
    col = mix(col, color(float3(0.205396, 0.224519, 0.0259072), float3(0.699684, 0.308307, 0.741345), an), brushb(uv, float3(0.0158545, 0.994082, 0.886241), float3(0.758571, 0.957994, 0.440672), an, iTime));
    col = mix(col, color(float3(0.466916, 0.491348, 0.0727725), float3(0.29314, 0.467685, 0.405939), an), brushb(uv, float3(0.523985, 0.300097, 0.560165), float3(0.792789, 0.738187, 0.424882), an, iTime));
    col = mix(col, color(float3(0.369231, 0.517624, 0.516241), float3(0.56002, 0.838961, 0.507298), an), brushb(uv, float3(0.848911, 0.977614, 0.61897), float3(0.859683, 0.259667, 0.955342), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.996669, 0.790743, 1), an), brushb(uv, float3(1, 0.267345, 0.05), float3(0.298218, 0.463616, 0.819691), an, iTime));
    col = mix(col, color(float3(0.0986366, 0.617723, 0.819908), float3(0.834505, 0.533768, 0.389442), an), brushb(uv, float3(0.826538, 0.873337, 0.60443), float3(0.355292, 0.424379, 1), an, iTime));
    col = mix(col, color(float3(0.778115, 0.392498, 0.214559), float3(0.889431, 0.0210403, 0.871874), an), brushb(uv, float3(0.5587, 0.418556, 0.0873581), float3(0.881328, 0.903063, 0.333115), an, iTime));
    col = mix(col, color(float3(0.0944643, 0.872182, 0.606639), float3(0.734525, 0.189241, 0), an), brushb(uv, float3(0.193173, 0.379417, 0.802513), float3(0.32168, 0.222802, 0.71446), an, iTime));
    col = mix(col, color(float3(0.315979, 0.35272, 0.386668), float3(0.854165, 0.839763, 0.480581), an), brushb(uv, float3(0.384896, 0.242547, 0.398261), float3(0.096625, 0.901684, 0.6546), an, iTime));
    col = mix(col, color(float3(0, 0.732632, 0.791299), float3(1, 0.47963, 0.312933), an), brushb(uv, float3(0.845268, 0.850904, 0.22884), float3(0.405903, 0.318092, 0.65651), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.262852, 0.460005, 0.105772), an), brushb(uv, float3(1, 0.860623, 0.05), float3(0.457797, 0.777293, 0.594164), an, iTime));
    col = mix(col, color(float3(0.832985, 0.513158, 0.0387729), float3(0.263014, 0.784509, 0.796236), an), brushb(uv, float3(0.942857, 0.282441, 0.564387), float3(0.900306, 0.704133, 0.786878), an, iTime));
    col = mix(col, color(float3(0.956886, 0.16763, 0.325276), float3(0, 0.686925, 0.0792988), an), brushb(uv, float3(0.376467, 0.138449, 1), float3(0.732371, 0.259966, 0.375589), an, iTime));
    col = mix(col, color(float3(0.111525, 0.374471, 0.209713), float3(0.988805, 0.997647, 1), an), brushb(uv, float3(0.761086, 0.224113, 0.197907), float3(0.195771, 0.241949, 1), an, iTime));
    col = mix(col, color(float3(0.779111, 0.37998, 0.188909), float3(0.342523, 0.293309, 0.250346), an), brushb(uv, float3(0.0893009, 0.169274, 0.654112), float3(0.639208, 0.99696, 0.712087), an, iTime));
    col = mix(col, color(float3(0.105033, 0.317852, 0.929419), float3(0.950511, 0.704591, 0.404833), an), brushb(uv, float3(0.047582, 0.409178, 0.667065), float3(0.196337, 0.497001, 0.686478), an, iTime));
    col = mix(col, color(float3(0.224829, 0.227802, 0.56488), float3(0.229541, 0.131937, 0), an), brushb(uv, float3(0.136406, 0.42718, 0.182347), float3(0.92039, 0.903971, 0.297249), an, iTime));
    col = mix(col, color(float3(0.163239, 0.656435, 0.814188), float3(0.336266, 0.0789584, 0.04235), an), brushb(uv, float3(0.193039, 0, 0.609702), float3(0.442127, 0.27659, 0.353469), an, iTime));
    col = mix(col, color(float3(0, 0, 0.0494064), float3(0.0877747, 0.895036, 0.207727), an), brushb(uv, float3(0.184615, 0.173652, 0.813434), float3(0.272903, 0.631464, 0.767413), an, iTime));
    col = mix(col, color(float3(0.542177, 0.607389, 0.962264), float3(0.442997, 0.9142, 0.340317), an), brushb(uv, float3(0.298628, 0.237948, 0.395601), float3(0.730521, 0.816265, 0.826865), an, iTime));
    col = mix(col, color(float3(0.270589, 0.159019, 0.791381), float3(0.148205, 0.581904, 0.308526), an), brushb(uv, float3(0.868276, 0.211545, 0.571092), float3(0.928061, 0.622641, 0.572628), an, iTime));
    col = mix(col, color(float3(0.1414, 0.731814, 0.229832), float3(0.0394163, 0.539994, 0.011507), an), brushb(uv, float3(0.687394, 0.0445544, 0.556836), float3(0.895415, 0.56751, 0.666996), an, iTime));
    col = mix(col, color(float3(0.353137, 0.373656, 0.800565), float3(0.442952, 0.244111, 0.421513), an), brushb(uv, float3(0.598211, 0.259685, 0.98893), float3(0.869919, 0.336855, 0.364831), an, iTime));
    col = mix(col, color(float3(1, 0.348137, 0.436118), float3(0.177044, 0.0461103, 0.0702595), an), brushb(uv, float3(0.546602, 0.439949, 0.0856898), float3(0.6665, 0.518745, 0.76957), an, iTime));
    col = mix(col, color(float3(0.0589815, 0.446294, 0.596517), float3(0.560044, 0.666023, 1), an), brushb(uv, float3(0.906801, 0.897071, 0.373698), float3(0.462525, 0.106242, 0.886834), an, iTime));
    col = mix(col, color(float3(0.00220143, 0.91629, 0.793267), float3(0.113494, 0.295553, 0.861681), an), brushb(uv, float3(0.170573, 0.925253, 0.38717), float3(1, 0.731691, 0.839062), an, iTime));
    col = mix(col, color(float3(0.0536253, 0.472804, 0.861845), float3(0.237944, 0.931129, 0.978135), an), brushb(uv, float3(0.339718, 0.293545, 0.844203), float3(0.691296, 0.826938, 0.772548), an, iTime));
    col = mix(col, color(float3(0.0996587, 0.214939, 0.518418), float3(0.990437, 0.49735, 0.242523), an), brushb(uv, float3(0.313132, 0.433505, 0.44769), float3(0.587315, 0.357406, 0.66432), an, iTime));
    col = mix(col, color(float3(1, 0.742948, 0.289272), float3(0.454376, 1, 1), an), brushb(uv, float3(0.888611, 0.536048, 0.823873), float3(0.416136, 0.104129, 0.974005), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.853094, 0.798733, 0.568623), an), brushb(uv, float3(0, 0.887915, 0.05), float3(0.391928, 0.727569, 0.60171), an, iTime));
    col = mix(col, color(float3(0.930357, 0.261892, 0.559347), float3(0.666734, 0.767599, 0.38883), an), brushb(uv, float3(0.20212, 0.682366, 0.770969), float3(0.254743, 0.775431, 0.959694), an, iTime));
    col = mix(col, color(float3(0.0874862, 0.381927, 0.667921), float3(0.81802, 1, 0.913081), an), brushb(uv, float3(0.244224, 0.569074, 0.279921), float3(0.794347, 1, 0.963344), an, iTime));
    col = mix(col, color(float3(0.971973, 0.0208754, 0.912334), float3(0.523165, 0.956489, 0.951926), an), brushb(uv, float3(0.0760475, 0.0795663, 0.559546), float3(0.314939, 0.702872, 0.942059), an, iTime));
    col = mix(col, color(float3(0.200095, 0.432414, 0.584324), float3(0.305262, 0.818032, 0.679332), an), brushb(uv, float3(0.958009, 0.308598, 0.988308), float3(0.77997, 0.991677, 0.249763), an, iTime));
    col = mix(col, color(float3(0.519252, 0.576384, 0.600208), float3(0.107741, 0.200074, 0.575763), an), brushb(uv, float3(0.39058, 0.219475, 0.283329), float3(0.947787, 0.468659, 0.235416), an, iTime));
    col = mix(col, color(float3(0.227511, 0.596344, 0.683154), float3(0.989981, 0.843065, 0.935913), an), brushb(uv, float3(0.174401, 0.523296, 0.751342), float3(0.238617, 0.0773701, 0.768772), an, iTime));
    col = mix(col, color(float3(0.388891, 0.423771, 0.350328), float3(0.114393, 0.812262, 0.472074), an), brushb(uv, float3(0.638263, 0.926564, 0.388194), float3(0.799197, 0.960923, 0.827132), an, iTime));
    col = mix(col, color(float3(0, 0.0668385, 0.802467), float3(0.210746, 0.0724644, 0.0609667), an), brushb(uv, float3(0.183709, 0.094869, 0.929918), float3(0.915686, 0.798133, 0.638121), an, iTime));
    col = mix(col, color(float3(0.0481795, 0.499675, 0.888028), float3(0.147215, 0.533857, 0.272594), an), brushb(uv, float3(0.319726, 0.342183, 0.204474), float3(0.845055, 0.706631, 0.905883), an, iTime));
    col = mix(col, color(float3(0.544394, 0.344547, 0.127774), float3(0.833982, 0.294223, 0), an), brushb(uv, float3(0.111243, 0.225471, 0.31972), float3(0.850178, 0.149661, 0.375213), an, iTime));
    col = mix(col, color(float3(0.0454406, 0.130815, 0.905073), float3(0, 0.529635, 0.707345), an), brushb(uv, float3(0.306962, 0.219238, 1), float3(1, 0.430392, 0.834966), an, iTime));
    col = mix(col, color(float3(0.873165, 0.49028, 0.428691), float3(0.953108, 1, 1), an), brushb(uv, float3(0.0500669, 0.117847, 0.619297), float3(0.428135, 0.0393804, 0.875031), an, iTime));
    col = mix(col, color(float3(0, 0.316372, 0.174219), float3(0.387444, 0.330782, 0.969433), an), brushb(uv, float3(0.861135, 0.193567, 0.63091), float3(0.524002, 0.621059, 0.816658), an, iTime));
    col = mix(col, color(float3(0.223206, 0.976084, 0.841623), float3(0.280576, 0.275822, 0.202791), an), brushb(uv, float3(0.494533, 0.695299, 1), float3(0.163173, 0.91507, 0.766562), an, iTime));
    col = mix(col, color(float3(0.536665, 0.463825, 0.946836), float3(0.671199, 0.177708, 0.469176), an), brushb(uv, float3(0.911426, 0.669352, 0.809222), float3(0.199165, 0.513825, 0.560964), an, iTime));
    col = mix(col, color(float3(0.237862, 0.506114, 0.802122), float3(0.724888, 0.34639, 0.725556), an), brushb(uv, float3(0.223479, 0.816367, 0.66575), float3(0.787795, 0.925648, 0.866677), an, iTime));
    col = mix(col, color(float3(0.0528742, 0.0792188, 0.145185), float3(0.291261, 0.131975, 0.544983), an), brushb(uv, float3(0.05001, 0.698821, 0.567853), float3(0.876433, 0.848364, 0.334327), an, iTime));
    col = mix(col, color(float3(0.257444, 0.451145, 0.116708), float3(1, 0.688645, 0.404369), an), brushb(uv, float3(0.0616527, 0.554403, 0.37772), float3(0.844769, 0.802135, 0.651701), an, iTime));
    col = mix(col, color(float3(0.300563, 0.354541, 0.367072), float3(1, 0.401932, 0.237244), an), brushb(uv, float3(0.822554, 0.413229, 0.837446), float3(0.241807, 0.335526, 1), an, iTime));
    col = mix(col, color(float3(0.984709, 0.869081, 0.304636), float3(0.893779, 0, 0.993067), an), brushb(uv, float3(0.937904, 0.448413, 1), float3(0.695713, 0.319239, 0.891056), an, iTime));
    col = mix(col, color(float3(0.144539, 0.682264, 0.865931), float3(0.564495, 0, 0), an), brushb(uv, float3(0.778883, 0.912392, 0.680351), float3(0.296828, 0.526011, 0.720827), an, iTime));
    col = mix(col, color(float3(1, 0.941888, 0.876122), float3(0.481563, 0.310778, 0.61051), an), brushb(uv, float3(0.511358, 0.639856, 0.316642), float3(0.696852, 0.368901, 0.389793), an, iTime));
    col = mix(col, color(float3(0.273342, 0.377854, 0.342468), float3(0.993915, 0.362134, 0.0130168), an), brushb(uv, float3(0.393242, 0.274217, 0.772469), float3(0.238282, 0.542537, 0.998943), an, iTime));
    col = mix(col, color(float3(1, 0.768677, 0.355469), float3(0.462473, 0.694474, 0.840116), an), brushb(uv, float3(0.694456, 0, 0.151837), float3(0.622385, 0.2767, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.328011, 1, 0.448358), an), brushb(uv, float3(0, 0.147012, 0.05), float3(0.438055, 0.630122, 0.653718), an, iTime));
    col = mix(col, color(float3(0.364553, 0.664481, 0.795817), float3(0.276145, 0, 0), an), brushb(uv, float3(0.847601, 0.526628, 0.793306), float3(0.0401596, 0.394184, 0.326098), an, iTime));
    col = mix(col, color(float3(0.766153, 1, 0.12525), float3(0.458371, 0.233527, 0.632984), an), brushb(uv, float3(0.678515, 0.0128402, 0.173482), float3(0.529923, 0.600078, 1), an, iTime));
    col = mix(col, color(float3(0.276107, 0.560121, 0.770371), float3(0.48483, 0.687645, 0.565562), an), brushb(uv, float3(0.48075, 0.5706, 0.65561), float3(0.895456, 0.678735, 0.782161), an, iTime));
    col = mix(col, color(float3(0.68739, 0.385693, 1), float3(0.528208, 0.120633, 0.231258), an), brushb(uv, float3(0.0286965, 0.75685, 0.173447), float3(0.362473, 0.366972, 0.951435), an, iTime));
    col = mix(col, color(float3(0.290054, 0.820171, 0.025057), float3(0.243905, 0.602562, 0.0376334), an), brushb(uv, float3(0.670196, 0.250352, 0.29496), float3(0.183756, 1, 0.991903), an, iTime));
    col = mix(col, color(float3(0.903072, 0.645147, 0.283963), float3(0, 0.0211184, 0.353981), an), brushb(uv, float3(0.958046, 0.946139, 0.894104), float3(0.851329, 0.529249, 0.432464), an, iTime));
    col = mix(col, color(float3(0.473145, 0.510563, 0.731768), float3(0.983607, 0.982225, 0.840729), an), brushb(uv, float3(0.184691, 0.506192, 0.242396), float3(0.53768, 0.631867, 0.990197), an, iTime));
    col = mix(col, color(float3(0.159925, 0.00989532, 1), float3(0.609596, 0.52528, 0.158839), an), brushb(uv, float3(0.762367, 0.0410854, 0.616453), float3(0.458602, 0.368688, 0.779462), an, iTime));
    col = mix(col, color(float3(0.513026, 0.119046, 0.17545), float3(1, 0.200042, 0.780407), an), brushb(uv, float3(0.793489, 0.434254, 0.790312), float3(0.246788, 0.730034, 0.663865), an, iTime));
    col = mix(col, color(float3(0.108145, 0.419248, 1), float3(0.706078, 0.739613, 1), an), brushb(uv, float3(0.66831, 0.642358, 0.622624), float3(0.535864, 0.582324, 1), an, iTime));
    col = mix(col, color(float3(0, 0.940962, 0.962581), float3(0.406461, 0.707408, 1), an), brushb(uv, float3(0.0761825, 0.88378, 0.751152), float3(0.887275, 0.407157, 0.822817), an, iTime));
    col = mix(col, color(float3(0.774122, 0.553857, 0.969283), float3(0.0901314, 0.854284, 0.770678), an), brushb(uv, float3(0.812074, 0.88364, 0.156396), float3(0.745341, 0.881287, 0.914364), an, iTime));
    col = mix(col, color(float3(0.464703, 0.371186, 0.507473), float3(0.637311, 0.5461, 0.759529), an), brushb(uv, float3(0.43882, 0.876879, 0.840024), float3(0.791441, 1, 0.334665), an, iTime));
    col = mix(col, color(float3(0.512043, 0.542853, 0.846768), float3(0.307228, 0.172801, 0.0382805), an), brushb(uv, float3(0.0600651, 0.839195, 0.539192), float3(0.404656, 0.285511, 0.588054), an, iTime));
    col = mix(col, color(float3(0.958922, 0, 0.821164), float3(0.135938, 0.863971, 0.407214), an), brushb(uv, float3(0.272337, 0.69328, 0.147794), float3(0.744637, 0.956405, 0.351938), an, iTime));
    col = mix(col, color(float3(0.75161, 0.197531, 0.729172), float3(0.84109, 0.565805, 0.19266), an), brushb(uv, float3(0.36275, 0.46153, 0.645541), float3(0.98511, 0.607594, 0.414078), an, iTime));
    col = mix(col, color(float3(0.552208, 0.715361, 0.577751), float3(1, 0.896121, 1), an), brushb(uv, float3(0.418147, 0.0885387, 0.490032), float3(0.378139, 0.375453, 1), an, iTime));
    col = mix(col, color(float3(0.545057, 0.20827, 0.285217), float3(0, 0, 0.00954824), an), brushb(uv, float3(0.684461, 0.239711, 0.218018), float3(0.501584, 0.313002, 0.627245), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.581833, 0.256743, 0.574359), an), brushb(uv, float3(0, 0.167677, 0.05), float3(0.964059, 0.421921, 1), an, iTime));
    col = mix(col, color(float3(0, 0.00197002, 0.283382), float3(0.0823504, 0.74208, 0.84385), an), brushb(uv, float3(0.103809, 0.829876, 0.542531), float3(0.81848, 0.305205, 0.877025), an, iTime));
    col = mix(col, color(float3(0.00568149, 0.0587809, 0.137581), float3(0.5384, 0.184407, 0.134817), an), brushb(uv, float3(0.485628, 0.859089, 0.534649), float3(0.918948, 0.935065, 0.19877), an, iTime));
    col = mix(col, color(float3(0.559696, 0.540309, 0.588748), float3(0.165373, 0.0207134, 0.0277758), an), brushb(uv, float3(0.676354, 0.19484, 0.380539), float3(0.833334, 0.311828, 0.421504), an, iTime));
    col = mix(col, color(float3(0.858123, 0.991066, 0.0256867), float3(1, 1, 0.774158), an), brushb(uv, float3(0.237307, 0.588272, 0.339425), float3(0.53378, 0.620812, 0.960683), an, iTime));
    col = mix(col, color(float3(0.36213, 0.402036, 0.251715), float3(0.667676, 0.0817381, 0.665096), an), brushb(uv, float3(0.2018, 0.47683, 0.78453), float3(0.650892, 0.902342, 0.806131), an, iTime));
    col = mix(col, color(float3(0.167089, 0.0709543, 0.838284), float3(0.900201, 0.542952, 0.567457), an), brushb(uv, float3(0.308545, 1, 0.987152), float3(0.750812, 0.960857, 0.607429), an, iTime));
    col = mix(col, color(float3(0.998909, 0.534612, 0.129044), float3(0.66757, 0.861438, 0.965869), an), brushb(uv, float3(0.417461, 0.875763, 0.953687), float3(0.79355, 0.0340267, 0.702323), an, iTime));
    col = mix(col, color(float3(0.629055, 0.231381, 0.58654), float3(0.0413987, 0.923769, 0.319808), an), brushb(uv, float3(0.15092, 0.0959519, 0.798537), float3(0.871639, 0.764106, 0.533511), an, iTime));
    col = mix(col, color(float3(0.887356, 0.715491, 1), float3(0.237246, 0.395705, 0.470219), an), brushb(uv, float3(0.597676, 0.728735, 0.188298), float3(0.644131, 0.0647229, 0.985454), an, iTime));
    col = mix(col, color(float3(0.548527, 0.899709, 0.759799), float3(0.610085, 0.464901, 0.408387), an), brushb(uv, float3(0.283912, 0.522409, 0.553999), float3(0.686057, 0.806431, 0.599951), an, iTime));
    col = mix(col, color(float3(0.716374, 0.093368, 0.115632), float3(0.336437, 0.606654, 0.547489), an), brushb(uv, float3(0.664705, 0.195699, 0.756031), float3(0.998385, 0.802691, 0.428887), an, iTime));
    col = mix(col, color(float3(0.947823, 0.570511, 0.18568), float3(0.369858, 0.66955, 0.992187), an), brushb(uv, float3(0.209226, 0.617692, 0.25433), float3(0.48299, 0.62846, 0.547433), an, iTime));
    col = mix(col, color(float3(0.42507, 0.157991, 0.133866), float3(0.938949, 0.717747, 0.545175), an), brushb(uv, float3(0.331209, 0.195531, 0.884746), float3(0.669929, 0.147024, 1), an, iTime));
    col = mix(col, color(float3(0.135595, 1, 0.480545), float3(0.204351, 0.380127, 0.144496), an), brushb(uv, float3(0.143622, 0.159019, 0.947213), float3(0.438994, 0.751983, 0.692989), an, iTime));
    col = mix(col, color(float3(0.187908, 0.194116, 0.870882), float3(0.145748, 0.596824, 1), an), brushb(uv, float3(0.632503, 0.723674, 0.949767), float3(0.62033, 0.431134, 0.856505), an, iTime));
    col = mix(col, color(float3(0.502629, 0.118222, 0.727002), float3(0.830849, 0.361149, 0.818708), an), brushb(uv, float3(0.374702, 0.187336, 0.915337), float3(0.737783, 0.396687, 0.696855), an, iTime));
    col = mix(col, color(float3(0.846883, 0.707883, 1), float3(0.864766, 0.784918, 0.490594), an), brushb(uv, float3(0.198314, 0.0845168, 0.344019), float3(0.76092, 0.368056, 0.568461), an, iTime));
    col = mix(col, color(float3(0.161396, 0.803965, 0.714476), float3(0.289137, 0.988169, 0.339783), an), brushb(uv, float3(0.646607, 0.0665838, 0.905661), float3(0.993478, 0.914635, 0.450889), an, iTime));
    col = mix(col, color(float3(0.629364, 0.667001, 1), float3(0.714468, 0.837927, 0.655682), an), brushb(uv, float3(0.744242, 0.0872542, 0.590176), float3(0.893872, 0.841571, 0.306053), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.907594, 0.366839), an), brushb(uv, float3(1, 0.249268, 0.05), float3(0.206203, 0.633541, 1), an, iTime));
    col = mix(col, color(float3(0.0959641, 0.955268, 0.768291), float3(0.812203, 0.182431, 0.169902), an), brushb(uv, float3(0.400396, 0.815953, 0.25067), float3(0.569464, 0.370191, 0.911017), an, iTime));
    col = mix(col, color(float3(0.302986, 0.84277, 0.678839), float3(0.152159, 1, 1), an), brushb(uv, float3(0.362479, 1, 0.99992), float3(0.392866, 0.585276, 1), an, iTime));
    col = mix(col, color(float3(0.914084, 0.270939, 0.692163), float3(0.906618, 0, 0.847215), an), brushb(uv, float3(0.670685, 0.0133371, 0.840964), float3(0.688714, 0.205061, 0.820693), an, iTime));
    col = mix(col, color(float3(0.801215, 0.203972, 0.0905967), float3(0.0329711, 0, 0.0757723), an), brushb(uv, float3(0.189837, 0.392139, 0.548072), float3(0.829434, 0.246627, 0.719276), an, iTime));
    col = mix(col, color(float3(0.667567, 0.455521, 0.563671), float3(0.550145, 0.903798, 0.517485), an), brushb(uv, float3(0, 0.600031, 0.370684), float3(0.377087, 0.660635, 0.668054), an, iTime));
    col = mix(col, color(float3(0.400787, 0.111919, 1), float3(0.674241, 0.722843, 0), an), brushb(uv, float3(0, 0.751719, 0.572166), float3(0.712455, 0.900122, 0.418251), an, iTime));
    col = mix(col, color(float3(0.326624, 0.412979, 0.455785), float3(0.0138858, 0.383949, 0.740885), an), brushb(uv, float3(0.972581, 0.527912, 0.863298), float3(0, 0.416225, 0.883388), an, iTime));
    col = mix(col, color(float3(0.441527, 0.723948, 0.482122), float3(0.602989, 0.270495, 0.917303), an), brushb(uv, float3(0.955318, 0.519828, 0.83657), float3(0.252026, 0.123644, 0.95963), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.947245, 0.9934), an), brushb(uv, float3(0, 0.245937, 0.05), float3(0.384728, 0.236886, 0.80572), an, iTime));
    col = mix(col, color(float3(0.250127, 0.216006, 0.355029), float3(0, 0.974717, 0.0546077), an), brushb(uv, float3(0.590971, 0.658695, 0.764092), float3(0.730343, 0.278998, 0.383732), an, iTime));
    col = mix(col, color(float3(0.604908, 0.352992, 0.17059), float3(0.715024, 0.384477, 1), an), brushb(uv, float3(0.759072, 0, 0.750876), float3(0.696301, 0.78474, 0.659023), an, iTime));
    col = mix(col, color(float3(0.294239, 0.161162, 0.340125), float3(0.340695, 0.407032, 0.774297), an), brushb(uv, float3(0.31229, 0.136679, 0.312433), float3(0.793443, 0.951967, 0.727207), an, iTime));
    col = mix(col, color(float3(0.708393, 0.119664, 0.0189221), float3(0.636337, 0.239494, 0.807397), an), brushb(uv, float3(0.00137574, 0.638141, 0.767593), float3(0.702253, 0.251019, 0.957774), an, iTime));
    col = mix(col, color(float3(0.474515, 0.546937, 0.868628), float3(0.977164, 0.779635, 0.127926), an), brushb(uv, float3(0.18229, 0.923196, 0.396232), float3(0.446871, 0.2196, 0.68022), an, iTime));
    col = mix(col, color(float3(0.538154, 0.37653, 0.120066), float3(0.696911, 0.838682, 0.577561), an), brushb(uv, float3(0.304464, 0.436595, 0.350371), float3(0.398727, 0.599657, 1), an, iTime));
    col = mix(col, color(float3(0.012065, 0.775687, 0.21183), float3(0.969545, 0.552891, 0.727259), an), brushb(uv, float3(0.157993, 0.574416, 0.346408), float3(0.103354, 1, 0.604158), an, iTime));
    col = mix(col, color(float3(0.247377, 0.70496, 0.582904), float3(0.695443, 0.730126, 0.46252), an), brushb(uv, float3(0.805137, 0.776759, 0.591507), float3(0.935624, 0.309985, 0.921923), an, iTime));
    col = mix(col, color(float3(0.0654229, 0.121081, 1), float3(0.163842, 0, 0), an), brushb(uv, float3(0.553271, 0.725419, 0.313934), float3(0.633182, 0.0329878, 0.444722), an, iTime));
    col = mix(col, color(float3(0.0379001, 0.218416, 0.715734), float3(1, 0.271034, 0), an), brushb(uv, float3(0.685042, 0.155033, 0.523923), float3(0.210326, 0.535034, 0.768811), an, iTime));
    col = mix(col, color(float3(0.727238, 0.457128, 0.107849), float3(0.405512, 0.650583, 0.6795), an), brushb(uv, float3(0.36486, 0.50601, 0.18141), float3(0.83223, 0, 0.615678), an, iTime));
    col = mix(col, color(float3(0.205664, 0, 0.15646), float3(0.464629, 0.74909, 0.773369), an), brushb(uv, float3(0.371977, 0.979636, 0.262129), float3(0.958099, 0.908769, 0.933488), an, iTime));
    col = mix(col, color(float3(0.432514, 0.115157, 0.492481), float3(0.930122, 0.766403, 0.474268), an), brushb(uv, float3(0.398834, 0.533262, 0.553184), float3(0.37808, 0.320112, 0.907537), an, iTime));
    col = mix(col, color(float3(0.0428175, 0.615828, 0.215628), float3(0.428218, 0.574686, 0.646394), an), brushb(uv, float3(0.844503, 0.346054, 0.820386), float3(0.0918178, 1, 0.421513), an, iTime));
    col = mix(col, color(float3(0.993602, 0.358452, 0.471989), float3(0.616178, 0.714771, 0.9297), an), brushb(uv, float3(0.520267, 0.429345, 0.868564), float3(0.943356, 0.543971, 0.988188), an, iTime));
    col = mix(col, color(float3(0.535279, 0.451013, 0.764481), float3(0.565805, 0.261368, 0.479771), an), brushb(uv, float3(0.35615, 0.686441, 0.418593), float3(0.834838, 0.702982, 0.563563), an, iTime));
    col = mix(col, color(float3(0.572035, 0.651819, 0.914194), float3(0.396266, 0.563788, 0.448493), an), brushb(uv, float3(0.436073, 0.488982, 0.508238), float3(0.745622, 0, 0.605317), an, iTime));
    col = mix(col, color(float3(0.660112, 0.470014, 0.961554), float3(0.835015, 0.550104, 0.0513119), an), brushb(uv, float3(0.408954, 0.302989, 0.194628), float3(0.334082, 0.300926, 0.781409), an, iTime));
    col = mix(col, color(float3(0.627233, 0.12225, 0.319537), float3(0.0536537, 0.722992, 0), an), brushb(uv, float3(0.369351, 1, 0.33638), float3(0.16789, 0.941266, 0.950417), an, iTime));
    col = mix(col, color(float3(0.448946, 0.245536, 0.748479), float3(0, 0.956535, 0.290688), an), brushb(uv, float3(0.484852, 0.574294, 0.182647), float3(0.884651, 0.838439, 0.949268), an, iTime));
    col = mix(col, color(float3(0.739038, 0.713478, 0.578957), float3(0.920047, 0.584126, 0.845226), an), brushb(uv, float3(0.196108, 0.605728, 0.418766), float3(0.34863, 0.040391, 0.99769), an, iTime));
    col = mix(col, color(float3(0.347473, 0.66231, 0.481781), float3(0.865515, 0.872418, 0.414215), an), brushb(uv, float3(0.477725, 0.663063, 0.331311), float3(0.165524, 1, 0.838405), an, iTime));
    col = mix(col, color(float3(0.1993, 0.39895, 0.881263), float3(0.850291, 0.135462, 0.775407), an), brushb(uv, float3(0.618096, 0.0502534, 0.795374), float3(0.940812, 0.602524, 0.591586), an, iTime));
    col = mix(col, color(float3(0.569594, 0.886994, 0.247881), float3(1, 0.669956, 0.610012), an), brushb(uv, float3(0.654056, 0.630992, 0.589098), float3(0.171377, 0.536117, 0.9413), an, iTime));
    col = mix(col, color(float3(0.587945, 0.0154092, 0.242263), float3(1, 0.570884, 0.0457667), an), brushb(uv, float3(0.940662, 0.899902, 0.36975), float3(0.585105, 0.398398, 0.798214), an, iTime));
    col = mix(col, color(float3(0.467236, 0.708612, 0.231155), float3(0.948132, 0.962718, 0.942979), an), brushb(uv, float3(0, 0.260161, 0.23853), float3(0.629, 0.224429, 1), an, iTime));
    col = mix(col, color(float3(0.370756, 0.548847, 0.171828), float3(0.606235, 0.519883, 0.612755), an), brushb(uv, float3(0.197995, 0.901055, 0.375185), float3(0.767185, 0.0657217, 0.605694), an, iTime));
    col = mix(col, color(float3(0.346322, 0.416553, 0.832169), float3(0.349955, 0.57107, 0.472771), an), brushb(uv, float3(0.207613, 0.907473, 0.345283), float3(0.172673, 0.959319, 0.485583), an, iTime));
    col = mix(col, color(float3(0.821385, 0.494296, 0.286759), float3(0.574522, 0.418478, 0.126939), an), brushb(uv, float3(0.722152, 0.0745929, 0.653094), float3(1, 0.506136, 0.417828), an, iTime));
    col = mix(col, color(float3(0.275963, 0.843581, 0.422765), float3(0.672104, 0.400615, 0.412454), an), brushb(uv, float3(0.745721, 0.553479, 0.871866), float3(0.824356, 0.957427, 0.652995), an, iTime));
    col = mix(col, color(float3(0.555707, 0.220219, 0.711945), float3(0.549519, 0.0875112, 0.0315552), an), brushb(uv, float3(0.208586, 0.714438, 0.715843), float3(0.403106, 0.722918, 0.814659), an, iTime));
    col = mix(col, color(float3(0.0998996, 0.502393, 0.498032), float3(0.998557, 0.515348, 0.449891), an), brushb(uv, float3(0.941161, 0.534478, 0.808854), float3(0.23215, 0.386043, 0.740327), an, iTime));
    col = mix(col, color(float3(0.700701, 0.924718, 0.618366), float3(0.994637, 0.968071, 0.678346), an), brushb(uv, float3(0.283199, 0.784573, 0.870242), float3(0.338188, 0.531975, 1), an, iTime));
    col = mix(col, color(float3(0.276049, 0.334624, 0.980483), float3(0.927353, 0.275058, 0.000275665), an), brushb(uv, float3(0.106185, 0.461413, 0.44511), float3(0.450351, 0.376781, 0.878062), an, iTime));
    col = mix(col, color(float3(0.260578, 0, 0.0661329), float3(0.305239, 0.887103, 0.866575), an), brushb(uv, float3(0, 0.00393629, 0.871174), float3(0.85038, 0.269396, 0.456945), an, iTime));
    col = mix(col, color(float3(0.937291, 0.643134, 0.0513818), float3(0.605564, 0.321357, 0.0525589), an), brushb(uv, float3(0.663034, 0.748753, 0.505884), float3(0.694486, 0.789508, 0.603347), an, iTime));
    col = mix(col, color(float3(0.459184, 0.0455956, 0.716674), float3(0.798955, 0.750404, 0.850148), an), brushb(uv, float3(0.861449, 0.329098, 0.313981), float3(0.662787, 0.261095, 0.595032), an, iTime));
    col = mix(col, color(float3(1, 0.299847, 0.807423), float3(0.0635554, 0.881453, 0.324189), an), brushb(uv, float3(0.192697, 0.321751, 0.693615), float3(0.503428, 0.704845, 0.806531), an, iTime));
    col = mix(col, color(float3(0.737635, 0.318172, 0.968768), float3(0, 0.941133, 0.325503), an), brushb(uv, float3(0.382995, 0.451555, 0.7863), float3(0.674807, 0.192881, 1), an, iTime));
    col = mix(col, color(float3(0.724286, 0.845462, 0.624952), float3(0.366344, 0.142599, 0.594999), an), brushb(uv, float3(0.801896, 0.417677, 0.854481), float3(0.746099, 0.281105, 0.728623), an, iTime));
    col = mix(col, color(float3(0.519911, 0.511164, 0.542031), float3(0.725257, 0.315541, 0.301109), an), brushb(uv, float3(0.303189, 0.00137639, 0.848501), float3(0.562783, 0.941913, 0.938687), an, iTime));
    col = mix(col, color(float3(0.247465, 0.48179, 0.502237), float3(0.219727, 0.127942, 0.393419), an), brushb(uv, float3(0.0982507, 1, 0.672049), float3(0.641914, 0.0438374, 1), an, iTime));
    col = mix(col, color(float3(0.6682, 0.157695, 1), float3(0.709767, 0.320473, 0.377848), an), brushb(uv, float3(0, 0.563929, 0.266619), float3(0.491619, 0.191511, 0.782396), an, iTime));
    col = mix(col, color(float3(0.671723, 0.851022, 1), float3(0.398116, 1, 0.90864), an), brushb(uv, float3(0.111809, 0.0169753, 0.706945), float3(0.344145, 0.656859, 0.831652), an, iTime));
    col = mix(col, color(float3(0.519728, 0.755227, 1), float3(0.721862, 0.894103, 0.97129), an), brushb(uv, float3(0.0173647, 0.594677, 0.43785), float3(0.800195, 0.352114, 0.818419), an, iTime));
    col = mix(col, color(float3(0.726633, 0.77573, 0.674484), float3(0.615231, 0.166519, 0.796789), an), brushb(uv, float3(0.947304, 0.253538, 0.490479), float3(0.856026, 0.965706, 0.936837), an, iTime));
    col = mix(col, color(float3(0.529913, 0.519463, 0.79402), float3(0, 0.920368, 0.770567), an), brushb(uv, float3(0.697264, 0.97958, 0.888035), float3(0.735757, 0.362201, 0.536269), an, iTime));
    col = mix(col, color(float3(0.371423, 0.920425, 0.15369), float3(0.58428, 0.180728, 0.221079), an), brushb(uv, float3(0.44421, 0.806369, 0.672273), float3(0.129297, 1, 0.605401), an, iTime));
    col = mix(col, color(float3(0.909926, 0.921412, 0), float3(0.536614, 0.551546, 0.0321564), an), brushb(uv, float3(0, 0.430317, 0.810592), float3(0.950748, 0.561742, 0.699665), an, iTime));
    col = mix(col, color(float3(0.062134, 0.0559441, 0.834788), float3(0.939869, 0.334137, 0.905984), an), brushb(uv, float3(0.300464, 0.150458, 0.621742), float3(0.926191, 0.500702, 0.928569), an, iTime));
    col = mix(col, color(float3(0.734875, 0.684754, 0.545742), float3(0.432707, 0.0516939, 0.712955), an), brushb(uv, float3(0.092357, 0.872209, 0.928705), float3(0.916144, 0.73628, 0.718572), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.583866, 0.962437, 0.552513), an), brushb(uv, float3(1, 0.7507, 0.05), float3(0.889614, 1, 0.396342), an, iTime));
    col = mix(col, color(float3(0.281789, 0.210503, 0.90351), float3(0.437509, 0.466606, 0.907669), an), brushb(uv, float3(0.0728187, 0.119477, 0.450076), float3(0.952228, 0.654984, 0.722724), an, iTime));
    col = mix(col, color(float3(0, 0.795697, 0.723051), float3(0.336692, 0.564606, 0.972931), an), brushb(uv, float3(0.0507797, 0.921929, 0.332047), float3(0.507046, 0.112013, 0.682337), an, iTime));
    col = mix(col, color(float3(0.578761, 0.290373, 0.720969), float3(0.754862, 0.154236, 0.0920525), an), brushb(uv, float3(0.854538, 0, 0.923594), float3(0.952603, 0.851642, 0.421632), an, iTime));
    col = mix(col, color(float3(0.956744, 0.544432, 0.933024), float3(0.250692, 0.351138, 0), an), brushb(uv, float3(0.084619, 0.790648, 0.774305), float3(0.384497, 0.742012, 0.514381), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.998021, 0.618394, 0.535539), an), brushb(uv, float3(0, 0.778235, 0.05), float3(0.94217, 0.828396, 0.263957), an, iTime));
    col = mix(col, color(float3(0.987244, 0.557607, 0.466468), float3(0.587383, 0.722857, 0), an), brushb(uv, float3(0.355461, 0.396781, 0.399626), float3(0.935721, 0.807673, 0.248828), an, iTime));
    col = mix(col, color(float3(0.765323, 0.903022, 0.275866), float3(1, 0.32923, 0.574773), an), brushb(uv, float3(0.503214, 0.563287, 0.423321), float3(0.493212, 0.660686, 0.659981), an, iTime));
    col = mix(col, color(float3(0.600949, 0.528157, 0.424983), float3(0.480277, 0.703388, 0.846647), an), brushb(uv, float3(0.857998, 0.815172, 1), float3(0.216021, 0.68016, 0.704588), an, iTime));
    col = mix(col, color(float3(0.264086, 0.0629816, 0.697526), float3(0.0117179, 0.51675, 0.541969), an), brushb(uv, float3(0.29689, 0.955828, 0.788842), float3(0.900163, 0.46622, 0.755855), an, iTime));
    col = mix(col, color(float3(0.0981721, 0.385312, 0.702833), float3(1, 0.498123, 0.0402866), an), brushb(uv, float3(0.118142, 0.542476, 0.897435), float3(0.397822, 0.610451, 0.882154), an, iTime));
    col = mix(col, color(float3(0.984969, 0.303881, 0.687371), float3(0.639861, 0.252308, 0.118482), an), brushb(uv, float3(0.910759, 0.14157, 0.517803), float3(0.76815, 0.519133, 0.939686), an, iTime));
    col = mix(col, color(float3(1, 0.661942, 0.650231), float3(0.961356, 0, 0), an), brushb(uv, float3(0.163114, 0.587127, 0.781233), float3(0.230528, 0.434862, 0.504897), an, iTime));
    col = mix(col, color(float3(0.384754, 0.303709, 0.351699), float3(0.0293517, 0, 0.297723), an), brushb(uv, float3(0.909344, 0.471257, 0.703416), float3(0.0506613, 0.943026, 0.392733), an, iTime));
    col = mix(col, color(float3(0.637868, 0.389283, 0.22946), float3(0, 0.0497909, 1), an), brushb(uv, float3(0.0675337, 0.868076, 0.671088), float3(0.437053, 0.628553, 0.526122), an, iTime));
    col = mix(col, color(float3(0.859519, 0.421695, 0.292218), float3(0.498336, 0.585112, 1), an), brushb(uv, float3(0.429735, 0.949861, 0.670314), float3(0.979408, 0.890151, 0.745131), an, iTime));
    col = mix(col, color(float3(0.547242, 0.42491, 0.866693), float3(0.177312, 0.986231, 0), an), brushb(uv, float3(0.535849, 0.385209, 0.626595), float3(0.786088, 0.00649945, 0.644695), an, iTime));
    col = mix(col, color(float3(0.558375, 0.71587, 0.902621), float3(0.949457, 0.134151, 0.258705), an), brushb(uv, float3(0.706413, 0.973634, 0.474109), float3(0.884803, 0.597052, 0.563413), an, iTime));
    col = mix(col, color(float3(0.870012, 0.672161, 0.376895), float3(1, 0.204185, 0.788298), an), brushb(uv, float3(0.697373, 0, 0.227649), float3(0.535809, 0.0828115, 0.950509), an, iTime));
    col = mix(col, color(float3(0.987455, 0.53194, 0.422547), float3(0.973894, 0.571293, 0), an), brushb(uv, float3(0.473571, 1, 0.736703), float3(0.667243, 0.334781, 0.786615), an, iTime));
    col = mix(col, color(float3(1, 0.787055, 0.914753), float3(0.110879, 0.130748, 0.143322), an), brushb(uv, float3(0.730534, 0.487254, 0.326535), float3(0.927996, 1, 0.207117), an, iTime));
    col = mix(col, color(float3(0.190372, 0.364611, 0.672582), float3(0.770485, 0.519957, 0.961457), an), brushb(uv, float3(0.962076, 0.979382, 1), float3(0.942481, 0.827426, 0.927883), an, iTime));
    col = mix(col, color(float3(0.956523, 0.100654, 0.37373), float3(0.0336088, 0.227178, 0.919416), an), brushb(uv, float3(0.950148, 0.193118, 0.362067), float3(0.34662, 0.322845, 0.846551), an, iTime));
    col = mix(col, color(float3(0.68812, 0.0415626, 0.523892), float3(0.257665, 0.568316, 0), an), brushb(uv, float3(0.169764, 0.0671399, 0.397803), float3(0.661686, 0.319444, 0.62955), an, iTime));
    col = mix(col, color(float3(0.401139, 0.985666, 0.860414), float3(0.865336, 0.501877, 0.0851854), an), brushb(uv, float3(0.719047, 0.237987, 0.216831), float3(0.807826, 0.318322, 0.74368), an, iTime));
    col = mix(col, color(float3(0.136428, 0.661862, 0.399489), float3(0.834941, 0.149223, 0.383426), an), brushb(uv, float3(0.354567, 0.065817, 0.38111), float3(0.769087, 0.292539, 0.264747), an, iTime));
    col = mix(col, color(float3(0.62245, 0.194752, 0.389049), float3(0.664661, 0.809878, 0.860133), an), brushb(uv, float3(0.39823, 0.464345, 1), float3(0.515548, 0.672589, 0.841245), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.569088, 0.173983, 0.226432), an), brushb(uv, float3(0, 0.148402, 0.05), float3(0.941599, 0.299964, 0.811355), an, iTime));
    col = mix(col, color(float3(0.302222, 0.52668, 0.377776), float3(0, 0.467915, 0.501741), an), brushb(uv, float3(0.316427, 0.139272, 0.745687), float3(0.750913, 0.358355, 0.540128), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.548724, 0.666687, 0.638559), an), brushb(uv, float3(1, 0.243715, 0.05), float3(1, 0.895254, 0.706089), an, iTime));
    col = mix(col, color(float3(0.366905, 0.842078, 0.831871), float3(0.415386, 0.0079298, 1), an), brushb(uv, float3(0.742346, 0.299345, 0.894299), float3(1, 0.536107, 0.789813), an, iTime));
    col = mix(col, color(float3(0.290225, 0.343911, 0.956872), float3(0, 0, 0), an), brushb(uv, float3(0.891235, 0.904362, 0.360196), float3(0.259471, 0.590105, 0.891686), an, iTime));
    col = mix(col, color(float3(0.087091, 0.51965, 0.845351), float3(0.265674, 0.512237, 0.932823), an), brushb(uv, float3(0.907809, 0.201444, 0.581766), float3(0.611893, 0.352226, 0.830144), an, iTime));
    col = mix(col, color(float3(0.158005, 0.988386, 0.194478), float3(0.860317, 0.235464, 0.75523), an), brushb(uv, float3(0.381631, 0.518937, 0.750455), float3(0.188908, 0.988076, 0.956766), an, iTime));
    col = mix(col, color(float3(0.948636, 0, 0.496333), float3(0.108754, 0.728846, 0.778888), an), brushb(uv, float3(0.156739, 0.871853, 0.559659), float3(0.658068, 0.0913615, 0.666993), an, iTime));
    col = mix(col, color(float3(0.345821, 0.558605, 0.909048), float3(0.72633, 0.0175789, 0.0300455), an), brushb(uv, float3(0.299451, 0.351637, 0.528136), float3(0.606846, 0.414198, 0.622971), an, iTime));
    col = mix(col, color(float3(1, 0.698646, 0.068338), float3(0.578384, 0.27789, 0.323864), an), brushb(uv, float3(0.0548542, 0.698245, 0.440131), float3(0.0160324, 0.260242, 0.662682), an, iTime));
    col = mix(col, color(float3(0.225807, 1, 0.806191), float3(0.878882, 0.909932, 0.28587), an), brushb(uv, float3(0.757313, 0.0538393, 0.551455), float3(0.517051, 0.688139, 0.905032), an, iTime));
    col = mix(col, color(float3(0.708464, 0.841848, 0.301764), float3(0.734787, 0.344706, 0.417137), an), brushb(uv, float3(0.660393, 0.413763, 0.803464), float3(0.761026, 0.763773, 0.688717), an, iTime));
    col = mix(col, color(float3(0.178295, 0.0160813, 0.880596), float3(0.0819743, 0.0978702, 0.642351), an), brushb(uv, float3(0.173886, 0.771836, 0.627049), float3(0.871863, 0.84311, 0.435486), an, iTime));
    col = mix(col, color(float3(0.0401309, 0.387604, 0.569345), float3(0.0901989, 0.708854, 0.118791), an), brushb(uv, float3(0.735077, 0.118204, 0.491257), float3(1, 0.404428, 0.496774), an, iTime));
    col = mix(col, color(float3(0.831105, 0.0752183, 0.424147), float3(0.224463, 0.586634, 0.00408342), an), brushb(uv, float3(0.648304, 0.998667, 0.854147), float3(0.821177, 0.260963, 0.541064), an, iTime));
    col = mix(col, color(float3(0.450944, 0.781347, 0.550249), float3(0.901252, 0, 0.394438), an), brushb(uv, float3(0.324252, 0.0488956, 0.337424), float3(0.861425, 0.687966, 0.775813), an, iTime));
    col = mix(col, color(float3(0.140654, 0.233513, 0.990707), float3(0.525824, 0.420869, 0.641909), an), brushb(uv, float3(0.766085, 0.482381, 0.517435), float3(0.0539899, 0.156445, 0.919446), an, iTime));
    col = mix(col, color(float3(0.523186, 0.581835, 0.633111), float3(0.331037, 0.188197, 0.69401), an), brushb(uv, float3(0.0476615, 0.341934, 0.403581), float3(0.699128, 0.25288, 0.844159), an, iTime));
    col = mix(col, color(float3(0.484492, 0.869687, 0.0954693), float3(1, 0.263672, 0.389592), an), brushb(uv, float3(0.635092, 0.022465, 0.451824), float3(0.448488, 0.350678, 0.710254), an, iTime));
    col = mix(col, color(float3(0.358252, 0.182875, 0.927538), float3(0.834967, 0.570856, 0.633736), an), brushb(uv, float3(0.601094, 0.714418, 1), float3(0.497585, 0.723537, 1), an, iTime));
    col = mix(col, color(float3(0.742787, 0.526856, 0.915471), float3(0.530441, 0.761934, 0.867379), an), brushb(uv, float3(0.560871, 0.40488, 0.403489), float3(0.698617, 0.811387, 1), an, iTime));
    col = mix(col, color(float3(0.718732, 0.73723, 0.266352), float3(0.86555, 0.808268, 0.358489), an), brushb(uv, float3(0.579211, 1, 0.601301), float3(0.921378, 0.487721, 0.512961), an, iTime));
    col = mix(col, color(float3(0.696662, 0.0418292, 0.943526), float3(0.0836974, 0.847745, 0.0191537), an), brushb(uv, float3(0.522328, 0.379678, 0.160013), float3(0.829072, 0.901108, 0.466768), an, iTime));
    col = mix(col, color(float3(0.411289, 0.369794, 1), float3(0.0184123, 0.117854, 0.539825), an), brushb(uv, float3(0.590524, 0.427906, 0.634865), float3(0.68045, 0.789527, 0.667858), an, iTime));
    col = mix(col, color(float3(0.499895, 0.504657, 0.753938), float3(0.0134861, 1, 0.695469), an), brushb(uv, float3(0.621733, 0.357405, 0.746994), float3(0.80774, 0.329198, 0.477398), an, iTime));
    col = mix(col, color(float3(0, 0.112892, 0.730881), float3(0.547196, 0.290635, 0.227238), an), brushb(uv, float3(0.43099, 0.535618, 0.903116), float3(0.764653, 0.303757, 0.783805), an, iTime));
    col = mix(col, color(float3(0.860286, 0.260477, 0.7246), float3(0.726356, 0.196944, 0.850285), an), brushb(uv, float3(0.385135, 0.438831, 0.78485), float3(0.709206, 0.254269, 0.900012), an, iTime));
    col = mix(col, color(float3(0.0667945, 0.707042, 0.376489), float3(0.536494, 0.559861, 0.0597473), an), brushb(uv, float3(0.831914, 0.0731863, 0.332298), float3(0.873589, 0.954452, 0.227633), an, iTime));
    col = mix(col, color(float3(0.946359, 0.706589, 0.334055), float3(0.360948, 0.393549, 0.150984), an), brushb(uv, float3(0.13033, 0.531104, 0.747909), float3(0.246921, 0.728045, 0.953173), an, iTime));
    col = mix(col, color(float3(0.382427, 0.031882, 0.26316), float3(0.100874, 0.0299588, 0.127513), an), brushb(uv, float3(0.182654, 0.106319, 0.442153), float3(0.633206, 1, 0.413753), an, iTime));
    col = mix(col, color(float3(1, 0.101772, 0.24336), float3(1, 0.751696, 1), an), brushb(uv, float3(0.575649, 0.850646, 0.768871), float3(0.516111, 0.491016, 1), an, iTime));
    col = mix(col, color(float3(0, 0.320002, 0.264594), float3(0.0356618, 0.979245, 0.702913), an), brushb(uv, float3(0.38791, 0.772783, 0.543446), float3(0.619632, 0.499577, 0.953333), an, iTime));
    col = mix(col, color(float3(0.421537, 0.270788, 0.570347), float3(0.983744, 1, 0.951303), an), brushb(uv, float3(0.162661, 0.351406, 0.537045), float3(0.286309, 0.317348, 1), an, iTime));
    col = mix(col, color(float3(0.776337, 0.350631, 0.0933599), float3(0.511075, 0.400488, 0), an), brushb(uv, float3(0.847959, 0.11409, 0.72468), float3(1, 0.424728, 0.851419), an, iTime));
    col = mix(col, color(float3(0.136729, 0.151083, 0.888018), float3(0.814655, 0.245163, 0.479115), an), brushb(uv, float3(0.724629, 0.0741446, 1), float3(0.727775, 1, 0.500589), an, iTime));
    col = mix(col, color(float3(0.730801, 0.281847, 0.0824286), float3(0.830876, 0.097934, 0.0756401), an), brushb(uv, float3(0.504564, 0.873427, 0.824805), float3(0.961336, 0.464817, 0.727592), an, iTime));
    col = mix(col, color(float3(0.483213, 0.120487, 0.00273551), float3(0.442256, 0.0696423, 0.0932334), an), brushb(uv, float3(0.383621, 0.53828, 0.249277), float3(0.841486, 0.751697, 0.928784), an, iTime));
    col = mix(col, color(float3(0.864875, 0.496499, 0.52681), float3(1, 0.997917, 1), an), brushb(uv, float3(0.422295, 1, 0.363316), float3(0.350998, 0.0392845, 0.934099), an, iTime));
    col = mix(col, color(float3(0.604633, 0.528137, 0.00171194), float3(0.17494, 0.504114, 0.168076), an), brushb(uv, float3(0.278459, 0.517458, 0.564409), float3(0.458744, 0.644486, 0.782225), an, iTime));
    col = mix(col, color(float3(0.786606, 0.793379, 0.856435), float3(0, 0.761537, 0.0844737), an), brushb(uv, float3(0.341405, 1, 0.249437), float3(0.878424, 0.374468, 0.607981), an, iTime));
    col = mix(col, color(float3(0, 0.0214743, 0.296869), float3(0, 0.0308745, 0.102139), an), brushb(uv, float3(0, 0.196137, 0.957684), float3(0.0856056, 1, 0.208203), an, iTime));
    col = mix(col, color(float3(1, 0.727373, 0.172796), float3(0.618098, 0.239079, 0.00449033), an), brushb(uv, float3(0.332984, 0.963788, 0.302331), float3(0.0839867, 0.419072, 0.614516), an, iTime));
    col = mix(col, color(float3(0.347399, 0.443697, 0.852077), float3(1, 0.477607, 0.188138), an), brushb(uv, float3(0.287214, 0.134609, 0.948027), float3(0.50202, 0.433918, 0.985013), an, iTime));
    col = mix(col, color(float3(0.121694, 0.696317, 0.596114), float3(0, 0, 0), an), brushb(uv, float3(0.484462, 0.935255, 1), float3(0, 0.894455, 0.190642), an, iTime));
    col = mix(col, color(float3(0.464512, 0.611733, 0), float3(0.983589, 1, 0.781445), an), brushb(uv, float3(0.566174, 0.541445, 1), float3(0.255198, 0.661813, 0.949391), an, iTime));
    col = mix(col, color(float3(1, 0.969525, 0.745232), float3(0, 0.347585, 0.912869), an), brushb(uv, float3(0.280012, 0.650215, 0.782136), float3(0.416354, 0.547361, 1), an, iTime));
    col = mix(col, color(float3(0.258911, 0.783219, 0.381946), float3(0.531582, 0.0924199, 0.826215), an), brushb(uv, float3(0.284967, 0.0944304, 0.346746), float3(0.488979, 0.649619, 0.69557), an, iTime));
    col = mix(col, color(float3(0.77362, 0.974429, 0.492234), float3(0, 0.618361, 0.599841), an), brushb(uv, float3(0.734097, 0.0129156, 0.764851), float3(0.836134, 0.307481, 0.678121), an, iTime));
    col = mix(col, color(float3(0.826888, 0.599891, 0.631414), float3(0.568929, 0.893731, 0.307135), an), brushb(uv, float3(0.460922, 0.820991, 0.265711), float3(0.816039, 0.451501, 0.788181), an, iTime));
    col = mix(col, color(float3(0.734479, 0, 0.899832), float3(0.186108, 0.304176, 0.391552), an), brushb(uv, float3(0.65725, 0.318147, 0.422891), float3(0.7026, 0.939654, 0.531149), an, iTime));
    col = mix(col, color(float3(0.547993, 0.0709528, 0.707167), float3(0.453786, 0.202153, 0.0104497), an), brushb(uv, float3(0.943277, 0.457989, 0.439794), float3(0.729119, 0.983869, 0.275094), an, iTime));
    col = mix(col, color(float3(0.186735, 0.824214, 0.847573), float3(0.770255, 0, 0.0273898), an), brushb(uv, float3(0.968807, 0.716733, 1), float3(0.394834, 0.605736, 1), an, iTime));
    col = mix(col, color(float3(0.290725, 0.43692, 0.989709), float3(1, 0.800618, 0.618827), an), brushb(uv, float3(0.797959, 0.888926, 0.362226), float3(0.310187, 0.298413, 1), an, iTime));
    col = mix(col, color(float3(0.220226, 0.59348, 0.27265), float3(0.712859, 0.615175, 0.510902), an), brushb(uv, float3(0.290086, 0.164158, 0.61064), float3(0.921818, 0.411614, 0.519102), an, iTime));
    col = mix(col, color(float3(0.237231, 0.907227, 0.258466), float3(0, 0.264133, 0.305366), an), brushb(uv, float3(0.331695, 0.179514, 0.389269), float3(0.344134, 0.311823, 0.689705), an, iTime));
    col = mix(col, color(float3(0.32091, 0.485816, 0.849856), float3(0.28796, 0.993369, 0.726055), an), brushb(uv, float3(0.316348, 0.751904, 0.436551), float3(0.184072, 0.94112, 0.698761), an, iTime));
    col = mix(col, color(float3(0.656125, 0.679304, 0.0879739), float3(1, 0, 0), an), brushb(uv, float3(0.635111, 0.981248, 0.701489), float3(0.474702, 0.240736, 0.282288), an, iTime));
    col = mix(col, color(float3(0.753405, 0.456813, 0.570238), float3(1, 0.0339448, 0), an), brushb(uv, float3(0.390338, 0.10706, 0.491715), float3(0.280605, 0.475029, 0.533496), an, iTime));
    col = mix(col, color(float3(0.185395, 0.551332, 0.0688648), float3(0.950952, 0.587219, 0.575194), an), brushb(uv, float3(0.453466, 0.87352, 0.544606), float3(0.846058, 0.723616, 0.96705), an, iTime));
    col = mix(col, color(float3(0.444872, 0.429708, 0.726897), float3(0.00707203, 0, 0), an), brushb(uv, float3(0.38093, 0.136288, 0.587222), float3(0.924485, 0.684723, 0.203965), an, iTime));
    col = mix(col, color(float3(0.879588, 0.602599, 0.914693), float3(0.64675, 0.408297, 0.466446), an), brushb(uv, float3(0.341607, 0.743237, 0.881197), float3(0.911865, 0.622486, 0.852513), an, iTime));
    col = mix(col, color(float3(0.751899, 0.973761, 0.873577), float3(0, 0.992155, 0.891467), an), brushb(uv, float3(0.06941, 0.111908, 0.983286), float3(0.95604, 0.79699, 0.656717), an, iTime));
    col = mix(col, color(float3(0.0855764, 0.108723, 0.5976), float3(0.91941, 1, 0.921512), an), brushb(uv, float3(0.156191, 0.700423, 0.475568), float3(0.342353, 0.369669, 1), an, iTime));
    col = mix(col, color(float3(0, 0.620822, 0.714514), float3(0.0620905, 0.804712, 0.305601), an), brushb(uv, float3(0.489466, 0.7374, 0.792989), float3(0.505665, 0.0456832, 0.850475), an, iTime));
    col = mix(col, color(float3(0, 0.245139, 0.385227), float3(0.61773, 0.0971794, 0.323322), an), brushb(uv, float3(0.771858, 0.696449, 0.98017), float3(0.957928, 0.898542, 0.997465), an, iTime));
    col = mix(col, color(float3(0.552006, 1, 0.116442), float3(0.0750788, 0.915472, 0.106372), an), brushb(uv, float3(0.785598, 0.648472, 0.403904), float3(0.900064, 0.427688, 0.499282), an, iTime));
    col = mix(col, color(float3(0.819322, 0.257854, 0.218329), float3(0.851471, 0.994517, 1), an), brushb(uv, float3(0.963529, 0.226185, 1), float3(0.186122, 0.0621389, 1), an, iTime));
    col = mix(col, color(float3(0.49195, 0.830921, 0.941713), float3(0.728355, 0.714008, 0.182775), an), brushb(uv, float3(0.423425, 0.895406, 0.724036), float3(0.952825, 0.501293, 0.894087), an, iTime));
    col = mix(col, color(float3(0.802074, 0.317676, 0.422335), float3(0.17907, 0, 0.0337812), an), brushb(uv, float3(0.481806, 0.597265, 0.852981), float3(0.739649, 0.421067, 0.399441), an, iTime));
    col = mix(col, color(float3(0.899537, 0.799228, 0.450219), float3(1, 0.646407, 0.228298), an), brushb(uv, float3(0.622651, 0, 0.531017), float3(0.244864, 0.61495, 1), an, iTime));
    col = mix(col, color(float3(0.187812, 0.0602109, 0.819667), float3(1, 0, 0.0562791), an), brushb(uv, float3(0.351382, 1, 0.350747), float3(0.844538, 0.995527, 0.256102), an, iTime));
    col = mix(col, color(float3(0, 0.0221014, 0), float3(0.672713, 0.725219, 0.725901), an), brushb(uv, float3(0.181806, 0.697432, 0.410673), float3(0.332402, 0.118244, 0.812909), an, iTime));
    col = mix(col, color(float3(0.816128, 0.236554, 0.529808), float3(1, 0, 0), an), brushb(uv, float3(0.735565, 0.201305, 0.660975), float3(0.461489, 0.362938, 0.348707), an, iTime));
    col = mix(col, color(float3(0.750436, 0.856586, 0.371331), float3(0.925779, 0.776145, 0.201291), an), brushb(uv, float3(0.143316, 0.133277, 0.965029), float3(0.578058, 0.0294856, 1), an, iTime));
    col = mix(col, color(float3(0.609391, 0.56897, 0.319254), float3(1, 1, 1), an), brushb(uv, float3(0.247483, 0.486481, 0.508986), float3(0.266805, 0.122941, 1), an, iTime));
    col = mix(col, color(float3(0.637527, 0.348012, 0), float3(0.364345, 0.603431, 0.736852), an), brushb(uv, float3(0.370409, 0.0845714, 0.926251), float3(0.608087, 0.289398, 0.933787), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.445619, 0.293708, 0.0639255), an), brushb(uv, float3(0, 0.308438, 0.05), float3(1, 0.638645, 1), an, iTime));
    col = mix(col, color(float3(0.865505, 0.95585, 0.114415), float3(0.0544304, 0.386648, 0.849567), an), brushb(uv, float3(0.0572037, 0.067866, 0.491816), float3(0.355512, 0.585535, 1), an, iTime));
    col = mix(col, color(float3(0.252239, 0.0621017, 0.237411), float3(1, 0.561039, 0.0129246), an), brushb(uv, float3(0.55868, 0.195712, 0.279549), float3(0.376118, 0.650727, 0.639995), an, iTime));
    col = mix(col, color(float3(0.0361987, 0.146287, 0.944421), float3(0.0806867, 0.59912, 0.365523), an), brushb(uv, float3(0.762929, 0.4882, 0.905747), float3(0.928366, 0.959212, 0.359471), an, iTime));
    col = mix(col, color(float3(0.10647, 0.603854, 0.165254), float3(0.92653, 0.19614, 0.588978), an), brushb(uv, float3(0.314733, 0.496941, 0.339897), float3(0.523676, 0.126209, 0.908514), an, iTime));
    col = mix(col, color(float3(0.414655, 0.752691, 0.971801), float3(0.868371, 0.774489, 0.259573), an), brushb(uv, float3(0.441521, 0.60214, 0.635265), float3(0.509113, 0.0865323, 0.547467), an, iTime));
    col = mix(col, color(float3(0.308113, 0.721571, 0.609125), float3(0.806669, 0, 0.343952), an), brushb(uv, float3(0.857648, 0.72165, 0.956194), float3(0.107207, 0.392534, 0.807977), an, iTime));
    col = mix(col, color(float3(0.48466, 0.696027, 0.548256), float3(0, 0.999964, 0.949683), an), brushb(uv, float3(0.328738, 0.727227, 0.80508), float3(0.415932, 0.181098, 0.755392), an, iTime));
    col = mix(col, color(float3(0.681509, 0.876642, 0.420325), float3(0.914943, 0.217602, 0.741171), an), brushb(uv, float3(0.0352018, 0.878825, 0.939867), float3(0.978687, 0.526877, 0.732488), an, iTime));
    col = mix(col, color(float3(0.0888823, 0.30253, 0.763052), float3(0.695292, 0.0110929, 1), an), brushb(uv, float3(0.64831, 0.908621, 0.569584), float3(0.643776, 0.869391, 0.888234), an, iTime));
    col = mix(col, color(float3(0.215743, 0.235544, 0.613886), float3(1, 0.181783, 0.246711), an), brushb(uv, float3(0.652944, 0.668436, 0.875178), float3(0.900264, 0.63846, 0.51049), an, iTime));
    col = mix(col, color(float3(0.0831876, 0.681516, 0.083648), float3(1, 0.456049, 0.819287), an), brushb(uv, float3(0.400451, 0.273514, 0.825502), float3(0.652171, 0.0541789, 0.731536), an, iTime));
    col = mix(col, color(float3(0.385235, 0.43845, 0.823749), float3(0.701736, 0.255654, 0.093447), an), brushb(uv, float3(0.936953, 0.607713, 1), float3(0.625445, 0.907327, 0.550445), an, iTime));
    col = mix(col, color(float3(1, 0.898099, 0.735422), float3(0.993851, 0.121056, 0.157236), an), brushb(uv, float3(0.262288, 0.584979, 0.316671), float3(0.177579, 0.497662, 0.905148), an, iTime));
    col = mix(col, color(float3(0.668718, 0.759613, 0.628701), float3(1, 0.618975, 0.443248), an), brushb(uv, float3(0.915673, 0.351891, 0.355012), float3(0.292459, 0.412955, 1), an, iTime));
    col = mix(col, color(float3(0.668805, 0.768806, 0.58951), float3(0.0986092, 0.212602, 0.751408), an), brushb(uv, float3(0.0708963, 0.923555, 0.48232), float3(0.21556, 1, 0.812875), an, iTime));
    col = mix(col, color(float3(0.434784, 0.905609, 0.621617), float3(1, 0.587122, 1), an), brushb(uv, float3(0.532535, 0.17077, 0.385078), float3(0.376425, 0.820261, 0.91667), an, iTime));
    col = mix(col, color(float3(0.481737, 0.361256, 0.759847), float3(0.302079, 0.470721, 0.0700886), an), brushb(uv, float3(0.124109, 0.684687, 0.448223), float3(0.328169, 0.683062, 1), an, iTime));
    col = mix(col, color(float3(0.0826648, 0.442429, 0.694513), float3(0.043642, 0, 0), an), brushb(uv, float3(0.946462, 0.653674, 0.814345), float3(0.772079, 0.553283, 0.309146), an, iTime));
    col = mix(col, color(float3(0.502629, 0.677814, 0.18297), float3(0.92523, 0.826124, 0.166466), an), brushb(uv, float3(0.208824, 0.37642, 0.656315), float3(0.912867, 0.36642, 0.66257), an, iTime));
    col = mix(col, color(float3(0.353299, 0.150852, 0.261202), float3(0.774249, 0.607116, 0.705232), an), brushb(uv, float3(0.86605, 0.419984, 0.721103), float3(0.745064, 0.276787, 1), an, iTime));
    col = mix(col, color(float3(0.153392, 0.813598, 0.0913607), float3(0.54272, 0.378324, 0.197842), an), brushb(uv, float3(0.169094, 0.369585, 0.492359), float3(0.139175, 0.90416, 1), an, iTime));
    col = mix(col, color(float3(0.789701, 0.887869, 0.0354029), float3(0.637673, 0.702852, 0.0308069), an), brushb(uv, float3(0.227394, 0.945618, 0.950781), float3(0.982698, 0.619469, 0.797963), an, iTime));
    col = mix(col, color(float3(0.445062, 0.211072, 0.138601), float3(0.693989, 0.89616, 0.89732), an), brushb(uv, float3(0.92142, 0.830651, 0.620228), float3(0.286332, 0.322326, 1), an, iTime));
    col = mix(col, color(float3(0.738245, 0.537459, 1), float3(0.813336, 0, 0.346787), an), brushb(uv, float3(0.408238, 0.144941, 0.621201), float3(0.703703, 0.200532, 0.651794), an, iTime));
    col = mix(col, color(float3(0.342269, 0.0421609, 0.39812), float3(0.824674, 0.0621915, 0.206175), an), brushb(uv, float3(0.908618, 0.605628, 0.875284), float3(0.947571, 1, 0.423943), an, iTime));
    col = mix(col, color(float3(0.924843, 0.914861, 0.234934), float3(0.0054617, 0, 0.242469), an), brushb(uv, float3(0, 0.636629, 0.551904), float3(0.866656, 0.314146, 0.950837), an, iTime));
    col = mix(col, color(float3(0.193211, 0.870955, 0.18267), float3(0, 0.723749, 1), an), brushb(uv, float3(0.447604, 0.901578, 0.406698), float3(0.512071, 0.591866, 0.722386), an, iTime));
    col = mix(col, color(float3(0.764932, 0.672623, 0.900452), float3(0.235738, 0.257548, 0.439156), an), brushb(uv, float3(0.0624835, 0.0728176, 0.556479), float3(0, 0.241434, 0.678656), an, iTime));
    col = mix(col, color(float3(0.174767, 0.122783, 0.100863), float3(0.225861, 0, 0.00521838), an), brushb(uv, float3(0.807088, 0.39702, 0.41165), float3(0.36801, 0.604567, 1), an, iTime));
    col = mix(col, color(float3(0.367554, 0.453649, 0.570712), float3(1, 0.981084, 1), an), brushb(uv, float3(0.901974, 0.472561, 0.486919), float3(0.497972, 0.593748, 0.757299), an, iTime));
    col = mix(col, color(float3(0.633337, 0.292386, 0.53351), float3(0.00567633, 0.0177077, 0.00513968), an), brushb(uv, float3(0.311042, 0.368078, 0.656621), float3(0.692766, 0.568308, 0.392968), an, iTime));
    col = mix(col, color(float3(0.147837, 0.443646, 0.590804), float3(0, 0, 0), an), brushb(uv, float3(0.424508, 0.660523, 0.345392), float3(0.475683, 0.813206, 0.211943), an, iTime));
    col = mix(col, color(float3(0.589773, 0.744465, 0.599297), float3(0.312538, 0.505495, 0.641946), an), brushb(uv, float3(0.622502, 0.340155, 0.511106), float3(0.36138, 0.170686, 0.966381), an, iTime));
    col = mix(col, color(float3(0.550428, 0.588906, 0.448775), float3(0.843182, 0.963377, 1), an), brushb(uv, float3(0.488443, 0.79072, 0.552179), float3(0.444463, 0.734847, 0.859809), an, iTime));
    col = mix(col, color(float3(0.686667, 0.692684, 0.535008), float3(0.760911, 0.908738, 0), an), brushb(uv, float3(0.672132, 0.713334, 1), float3(0.882563, 0.927334, 0.932695), an, iTime));
    col = mix(col, color(float3(0.458002, 0.190537, 0), float3(0.721967, 0.750364, 0), an), brushb(uv, float3(0.840152, 0.633463, 1), float3(0.957256, 0.50718, 0.910552), an, iTime));
    col = mix(col, color(float3(0.752445, 0.965895, 0.089163), float3(1, 0.68168, 0.157706), an), brushb(uv, float3(0.490611, 0.717545, 0.652164), float3(0.565165, 0.371741, 0.981207), an, iTime));
    col = mix(col, color(float3(0.77378, 0.726754, 0.442295), float3(0.0198925, 0.788812, 0.384519), an), brushb(uv, float3(0.404892, 0.0615347, 0.419484), float3(0.606322, 0.109483, 1), an, iTime));
    col = mix(col, color(float3(0.983142, 0.173695, 0.721689), float3(0.492235, 0.150882, 0), an), brushb(uv, float3(0.452908, 0.162504, 0.586941), float3(0.614228, 0.401413, 0.607966), an, iTime));
    col = mix(col, color(float3(0.200072, 0.268745, 0.364785), float3(0.283557, 0.940996, 1), an), brushb(uv, float3(0.177474, 0.0467144, 0.337695), float3(0.642248, 0.518632, 0.857445), an, iTime));
    col = mix(col, color(float3(0, 0.526367, 0.6028), float3(1, 1, 1), an), brushb(uv, float3(0.227395, 0.794424, 0.41362), float3(0.190531, 0.126379, 0.82312), an, iTime));
    col = mix(col, color(float3(0.462329, 0.644122, 0.33615), float3(0.873937, 0.778442, 0.421009), an), brushb(uv, float3(0.0271068, 0.899308, 0.883955), float3(0.643782, 0.789359, 0.781346), an, iTime));
    col = mix(col, color(float3(0.644589, 0, 0.0663769), float3(0.244557, 0.73689, 0.307869), an), brushb(uv, float3(0, 0.47806, 0.961986), float3(0.446396, 0.0957267, 0.841072), an, iTime));
    col = mix(col, color(float3(0.109493, 0.110529, 0.167584), float3(0, 0.484703, 1), an), brushb(uv, float3(0.234568, 0.680001, 0.49961), float3(0.450711, 0.588086, 0.782661), an, iTime));
    col = mix(col, color(float3(0.549208, 0.0278386, 0.362089), float3(0.849357, 0.408894, 0.162059), an), brushb(uv, float3(0.366644, 0.393579, 0.450417), float3(0.923611, 0.985709, 0.720424), an, iTime));
    col = mix(col, color(float3(0.426021, 0.535588, 0.92982), float3(0.158413, 0.220456, 0.180971), an), brushb(uv, float3(1, 0.393916, 0.665458), float3(0.175652, 0.995253, 0.912961), an, iTime));
    col = mix(col, color(float3(0.35592, 0.883087, 0.626267), float3(0.247103, 0, 0.0732327), an), brushb(uv, float3(0.663636, 0.082124, 0.69151), float3(0.756437, 1, 1), an, iTime));
    col = mix(col, color(float3(0.392523, 0.999798, 0.532494), float3(0.0420575, 0.047131, 0), an), brushb(uv, float3(0.635621, 0.335175, 1), float3(0.267632, 0.443101, 0.903523), an, iTime));
    col = mix(col, color(float3(0, 0.908261, 0.375927), float3(0, 0, 0), an), brushb(uv, float3(0.597003, 0.384642, 0.487002), float3(0.625102, 0, 0.768527), an, iTime));
    col = mix(col, color(float3(0.745647, 0.521727, 0.571946), float3(0.992965, 0.886001, 0.871734), an), brushb(uv, float3(0.662851, 0.155243, 0.751522), float3(0.698352, 0.195878, 0.975801), an, iTime));
    col = mix(col, color(float3(0.560941, 0.0745848, 0.044126), float3(0.476723, 0.282088, 0.700414), an), brushb(uv, float3(0.86761, 0, 0.918838), float3(0.978419, 1, 0.943439), an, iTime));
    col = mix(col, color(float3(0.701341, 0.729032, 1), float3(1, 0, 0), an), brushb(uv, float3(0.137501, 0.255092, 0.886877), float3(0.492491, 0.45101, 0.782268), an, iTime));
    col = mix(col, color(float3(0.249892, 0.500192, 0.55792), float3(0.507684, 0.682777, 0.309171), an), brushb(uv, float3(0.441028, 0.489206, 0.969519), float3(0.806175, 0.71905, 0.941242), an, iTime));
    col = mix(col, color(float3(0.955503, 0.533768, 0.833609), float3(0, 0, 0), an), brushb(uv, float3(0.233816, 0.854972, 0.429343), float3(0.464214, 0.928301, 0.0874596), an, iTime));
    col = mix(col, color(float3(0.604377, 0.872812, 0.823021), float3(0.660097, 0.398093, 0.960733), an), brushb(uv, float3(0.753699, 0.393523, 0.404866), float3(0.982536, 0.499286, 0.632666), an, iTime));
    col = mix(col, color(float3(0.647691, 0.764802, 0.290332), float3(1, 0.758711, 0.994245), an), brushb(uv, float3(0.0147756, 0.889781, 0.921154), float3(0.275914, 0.0982447, 0.879293), an, iTime));
    col = mix(col, color(float3(0.374114, 0.551469, 0.759342), float3(0, 1, 0.136492), an), brushb(uv, float3(0.162587, 0.731265, 0.248087), float3(0.601726, 1, 0.908585), an, iTime));
    col = mix(col, color(float3(0.200681, 0.643166, 0.0842157), float3(0.325704, 0.260066, 1), an), brushb(uv, float3(0.383691, 1, 0.968277), float3(0.896415, 0.786618, 0.838159), an, iTime));
    col = mix(col, color(float3(0.42885, 0.526715, 0.329704), float3(0.717889, 0.512707, 0.784561), an), brushb(uv, float3(0.0960771, 0.637997, 0.897175), float3(0.922339, 0.72959, 0.418687), an, iTime));
    col = mix(col, color(float3(1, 0.987107, 1), float3(0.163083, 0.189796, 0), an), brushb(uv, float3(0.690965, 0.739772, 0.125134), float3(0.219292, 1, 0.75732), an, iTime));
    col = mix(col, color(float3(0.345651, 0.242596, 0), float3(0.387044, 0.681386, 0.862125), an), brushb(uv, float3(0.351946, 0.34188, 0.720008), float3(0.78535, 0.866765, 0.413278), an, iTime));
    col = mix(col, color(float3(0.673805, 1, 0.420747), float3(0.117074, 0.516838, 1), an), brushb(uv, float3(0.98066, 0.214675, 0.827774), float3(0.427114, 0.172409, 0.735136), an, iTime));
    col = mix(col, color(float3(0.551375, 0.751045, 0.0869348), float3(0, 0.495202, 0.807321), an), brushb(uv, float3(0.964642, 0.482335, 0.654618), float3(0.405395, 0.268825, 0.820711), an, iTime));
    col = mix(col, color(float3(0.683695, 0.581669, 0.259704), float3(0.6588, 0.56545, 0.244668), an), brushb(uv, float3(0.831877, 0.591661, 1), float3(0.863011, 0.887399, 0.728736), an, iTime));
    col = mix(col, color(float3(0.481037, 0.284932, 0.0418509), float3(1, 0.551756, 0), an), brushb(uv, float3(0.963012, 0.351928, 0.386329), float3(0.811761, 0.167254, 0.305898), an, iTime));
    col = mix(col, color(float3(0.942333, 0.780805, 0.968147), float3(0, 0.0135581, 0.0926108), an), brushb(uv, float3(0.648947, 0.0770007, 1), float3(0.883659, 0, 0.484999), an, iTime));
    col = mix(col, color(float3(0.564614, 0.257596, 0), float3(0.738967, 0.548188, 0.673584), an), brushb(uv, float3(0.830592, 0.345591, 0.483762), float3(0.778436, 0.9594, 0.967381), an, iTime));
    col = mix(col, color(float3(1, 1, 0.743071), float3(0.166863, 0.872186, 0.895924), an), brushb(uv, float3(0.784682, 0.760058, 0.246213), float3(0.499057, 0.0715775, 0.691005), an, iTime));
    col = mix(col, color(float3(0.00503634, 0.805548, 0.126047), float3(0.737121, 0.557619, 0.639143), an), brushb(uv, float3(0.566593, 0.984426, 0.328692), float3(0.90444, 0.344176, 0.723665), an, iTime));
    col = mix(col, color(float3(0.342901, 0.0662784, 0), float3(0.148527, 0.97343, 1), an), brushb(uv, float3(0.659186, 0.360927, 0.671857), float3(0.442449, 0.510162, 0.992197), an, iTime));
    col = mix(col, color(float3(0.104654, 0.907233, 0.217584), float3(0.699154, 0.846134, 0.59253), an), brushb(uv, float3(0.177711, 0.388983, 0.530156), float3(0.769038, 0.322156, 1), an, iTime));
    col = mix(col, color(float3(0.31071, 1, 0.347875), float3(0.591614, 0.957455, 0.870194), an), brushb(uv, float3(0.899595, 0.676094, 0.49667), float3(0.751576, 0.0839051, 0.53451), an, iTime));
    col = mix(col, color(float3(0.239807, 0.252825, 0.43668), float3(0.667849, 1, 0.658836), an), brushb(uv, float3(0.0278693, 0.442465, 0.698196), float3(0.340217, 0.657905, 0.765754), an, iTime));
    col = mix(col, color(float3(0.393366, 0.673472, 0), float3(1, 0.665855, 0.970126), an), brushb(uv, float3(0.11511, 0.339077, 0.616033), float3(0.499354, 0.732417, 1), an, iTime));
    col = mix(col, color(float3(0.0670654, 0.664739, 0.798274), float3(0.102822, 0.5749, 0.255468), an), brushb(uv, float3(0.865562, 0.145901, 0.503448), float3(0.196992, 0.923021, 0.79019), an, iTime));
    col = mix(col, color(float3(0.8417, 0.214058, 0), float3(0, 0, 0.0273666), an), brushb(uv, float3(0.946488, 0, 1), float3(0.281302, 0.509323, 0.820265), an, iTime));
    col = mix(col, color(float3(0.179006, 0.631746, 0.731532), float3(0.603689, 0.600832, 0.588997), an), brushb(uv, float3(0.787857, 0.610256, 0.856249), float3(0.178051, 0.344462, 1), an, iTime));
    col = mix(col, color(float3(0.569713, 0.706061, 0.64049), float3(0.214538, 0.0461472, 0.404471), an), brushb(uv, float3(0.572545, 0.46811, 0.716234), float3(0.59702, 0.37693, 0.79297), an, iTime));
    col = mix(col, color(float3(0.915217, 0.282073, 0.905417), float3(0.33273, 0.258924, 0.55799), an), brushb(uv, float3(0.712481, 0.0818244, 0.729844), float3(0.038419, 0.218827, 0.6287), an, iTime));
    col = mix(col, color(float3(0.0993404, 0.488381, 0.480173), float3(0.320001, 0.340286, 0.34545), an), brushb(uv, float3(0.352206, 0.707755, 0.613852), float3(0.207994, 0.178114, 0.804752), an, iTime));
    col = mix(col, color(float3(0.543693, 0.540246, 0.160489), float3(0, 0, 0), an), brushb(uv, float3(0.390363, 0.0747053, 0.348448), float3(0.55335, 0.0822471, 0.637295), an, iTime));
    col = mix(col, color(float3(0.872805, 0.675348, 0.0809559), float3(0.9904, 0.0917791, 0.479868), an), brushb(uv, float3(0.834173, 0.665715, 0.627925), float3(0.766433, 0.302742, 0.974734), an, iTime));
    col = mix(col, color(float3(0.132502, 0.56411, 0.841503), float3(0.012514, 0.238667, 0.234301), an), brushb(uv, float3(1, 0.315847, 0.913295), float3(0, 0.427502, 0.661379), an, iTime));
    col = mix(col, color(float3(0.981425, 0.478672, 0.818786), float3(0.512399, 0.237746, 0.983321), an), brushb(uv, float3(0.273496, 0, 0.404276), float3(0.806274, 1, 0.808011), an, iTime));
    col = mix(col, color(float3(0.88687, 0.934703, 0.633125), float3(1, 0.693288, 0.206895), an), brushb(uv, float3(0.476496, 0, 0.769355), float3(0.47361, 0.648481, 0.619189), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.553101, 0.420766, 0.457323), an), brushb(uv, float3(0.862651, 0.252055, 0.05), float3(0.692848, 0.805231, 0.530615), an, iTime));
    col = mix(col, color(float3(0.758634, 0.715488, 0.144911), float3(1, 0.188204, 0.0151559), an), brushb(uv, float3(0.981416, 0.263321, 0.958518), float3(0.386344, 0.690716, 0.603215), an, iTime));
    col = mix(col, color(float3(1, 0.118551, 0.525662), float3(0.750747, 0.345168, 0.309913), an), brushb(uv, float3(0.37145, 0.939498, 0.634161), float3(0.791401, 0.834711, 0.485659), an, iTime));
    col = mix(col, color(float3(0.421462, 0.546644, 0), float3(0.629391, 0, 0.433107), an), brushb(uv, float3(0.304226, 0.121794, 1), float3(0.870902, 1, 0.541729), an, iTime));
    col = mix(col, color(float3(0.555684, 0.484193, 0.175225), float3(0.286384, 0, 0.562893), an), brushb(uv, float3(0.437475, 0.166189, 0.482441), float3(0.387764, 0.668736, 0.575289), an, iTime));
    col = mix(col, color(float3(0.659791, 0.602782, 0.792552), float3(0.828681, 0.389934, 0.112221), an), brushb(uv, float3(0.464223, 0.23435, 0.767817), float3(0.451918, 0.603222, 0.909932), an, iTime));
    col = mix(col, color(float3(0.155714, 0.30142, 0.245338), float3(0.624771, 0.395879, 0.124601), an), brushb(uv, float3(0.638186, 0.373796, 1), float3(0.872697, 0.409471, 0.510935), an, iTime));
    col = mix(col, color(float3(0.563508, 0.718731, 0.526405), float3(1, 1, 0.950249), an), brushb(uv, float3(0.774709, 0.845499, 0.410074), float3(0.53785, 0.60679, 1), an, iTime));
    col = mix(col, color(float3(0, 0.564644, 0.535296), float3(0.874591, 1, 1), an), brushb(uv, float3(0.645327, 0.44663, 0.434883), float3(0.530823, 0.659374, 0.851508), an, iTime));
    col = mix(col, color(float3(0.731558, 0.771352, 0.386398), float3(0.620062, 0.724482, 0.809676), an), brushb(uv, float3(0.790099, 0.10257, 0.594193), float3(0.983317, 0.633846, 0.757458), an, iTime));
    col = mix(col, color(float3(0.208734, 0.163051, 1), float3(0.452944, 0.958613, 0.534522), an), brushb(uv, float3(0.331917, 0.90066, 0.920716), float3(0.772863, 0.178919, 1), an, iTime));
    col = mix(col, color(float3(0.830062, 0.897402, 0.642886), float3(0.821532, 0.927181, 0.933471), an), brushb(uv, float3(0.0232923, 0.743662, 0.73343), float3(0.285451, 0.800608, 1), an, iTime));
    col = mix(col, color(float3(0.0607384, 0.233345, 0.830501), float3(0.794947, 0.200044, 0.796244), an), brushb(uv, float3(0.471084, 0.768698, 0.237065), float3(0.752116, 0.924243, 0.552357), an, iTime));
    col = mix(col, color(float3(0.138118, 0.227452, 0), float3(0.973743, 0.698071, 0.502577), an), brushb(uv, float3(0.371785, 0.374863, 0.337063), float3(0.591785, 0.311969, 0.846878), an, iTime));
    col = mix(col, color(float3(0.460218, 0.881051, 0.373143), float3(1, 0.74038, 0.906404), an), brushb(uv, float3(0.118093, 0.758479, 0.440496), float3(0.226995, 0.621305, 1), an, iTime));
    col = mix(col, color(float3(0.151527, 0.258094, 0.726117), float3(0.788912, 0.306462, 0), an), brushb(uv, float3(0.402621, 0.760989, 0.877667), float3(0.5906, 0.433297, 0.747312), an, iTime));
    col = mix(col, color(float3(0.0874726, 0.376488, 0.867532), float3(0.320057, 0.176779, 0.884094), an), brushb(uv, float3(0.0438381, 0.51797, 0.849482), float3(0.933061, 0.867276, 0.567141), an, iTime));
    col = mix(col, color(float3(1, 0.583287, 0.241176), float3(0.990743, 1, 0.776977), an), brushb(uv, float3(0.847379, 0.5055, 0.871681), float3(0.397069, 0.803256, 0.97257), an, iTime));
    col = mix(col, color(float3(0.122258, 0.111502, 0.779807), float3(0.487695, 0.471846, 0.531565), an), brushb(uv, float3(0.0287714, 0.120455, 0.850703), float3(0.336031, 0.817104, 0.988904), an, iTime));
    col = mix(col, color(float3(0.567401, 0.671429, 0.271311), float3(0.277202, 0.934391, 0.619912), an), brushb(uv, float3(0.0549652, 0.668874, 0.47882), float3(0.80141, 0.731154, 0.657533), an, iTime));
    col = mix(col, color(float3(0.750057, 0.902166, 0.0877227), float3(0, 0.314582, 0.108714), an), brushb(uv, float3(0.933682, 0.931785, 0.402905), float3(0.860628, 0.480302, 0.942928), an, iTime));
    col = mix(col, color(float3(0.688553, 0.726276, 0.263364), float3(0, 0.0134548, 0.784774), an), brushb(uv, float3(0.237185, 0.130265, 0.55373), float3(0.400373, 0.646395, 0.703699), an, iTime));
    col = mix(col, color(float3(1, 0.76636, 0.136291), float3(0.36581, 0.437398, 0.978386), an), brushb(uv, float3(0.357684, 1, 0.825128), float3(0.102683, 0.89894, 0.987365), an, iTime));
    col = mix(col, color(float3(0.887821, 0.489625, 0.236794), float3(0, 0, 0), an), brushb(uv, float3(0.641588, 0.740634, 0.7507), float3(0.565414, 0.150727, 0.145959), an, iTime));
    col = mix(col, color(float3(0.59666, 0.249718, 0.00777846), float3(0.666484, 0.198021, 0.688628), an), brushb(uv, float3(0.870479, 0.59874, 0.985784), float3(0.825612, 0.79706, 0.686609), an, iTime));
    col = mix(col, color(float3(0.266074, 0.213813, 0.200313), float3(1, 0.689884, 0.999521), an), brushb(uv, float3(0.39405, 0.481998, 0.182033), float3(0.677563, 0.139585, 0.811711), an, iTime));
    col = mix(col, color(float3(0.673524, 0.243726, 0.110589), float3(0.675814, 0.0861615, 0.718714), an), brushb(uv, float3(0.102883, 0.127161, 0.918963), float3(1, 0.468971, 0.458961), an, iTime));
    col = mix(col, color(float3(0.166117, 0.310796, 0.744605), float3(1, 0.0570798, 0.344904), an), brushb(uv, float3(0.388807, 0.764788, 0.190537), float3(0.421237, 0.502623, 1), an, iTime));
    col = mix(col, color(float3(0.46595, 0.69564, 0.0398618), float3(0.993895, 0.662902, 0.264491), an), brushb(uv, float3(0.252008, 0.0966579, 0.653575), float3(1, 0.634844, 0.332915), an, iTime));
    col = mix(col, color(float3(0.624268, 0.731228, 0.334515), float3(0.655495, 0.707124, 0.849582), an), brushb(uv, float3(0.0358542, 0.0974975, 0.801463), float3(0.400033, 0.806713, 0.999979), an, iTime));
    col = mix(col, color(float3(0.814096, 0.561989, 0.551512), float3(0, 0.514063, 0.459233), an), brushb(uv, float3(0.693405, 0.888872, 0.596094), float3(0.69653, 0.117625, 0.56417), an, iTime));
    col = mix(col, color(float3(0.0356048, 0.715854, 0.559885), float3(0.664127, 0.536448, 0.913866), an), brushb(uv, float3(0.737804, 0.673255, 0.839423), float3(0.790982, 0.151582, 0.82477), an, iTime));
    col = mix(col, color(float3(0.162658, 0.4316, 0.475832), float3(0.208686, 0.68439, 0.830331), an), brushb(uv, float3(0.212941, 0.829439, 0.417191), float3(0.480042, 0.694965, 0.572472), an, iTime));
    col = mix(col, color(float3(0.334536, 0.550504, 0.868646), float3(1, 0.553309, 0.0225265), an), brushb(uv, float3(0.91766, 0.862311, 0.671165), float3(0.513162, 0.255554, 0.866051), an, iTime));
    col = mix(col, color(float3(0.937759, 0.407418, 0.765953), float3(1, 0.694521, 0.790552), an), brushb(uv, float3(0.823682, 0, 0.322246), float3(0.325264, 0.479251, 1), an, iTime));
    col = mix(col, color(float3(0.769914, 0.365577, 0.399273), float3(0.0657677, 0.036093, 0.0441766), an), brushb(uv, float3(0.95429, 0.349624, 0.799676), float3(1, 0.706333, 0.450725), an, iTime));
    col = mix(col, color(float3(0.673726, 0.207386, 0.134053), float3(0, 0.851671, 0.369722), an), brushb(uv, float3(0.85636, 0.140257, 0.848009), float3(0.612213, 0.367908, 0.72797), an, iTime));
    col = mix(col, color(float3(0.430297, 0, 0.25225), float3(1, 0.801466, 0.713127), an), brushb(uv, float3(0.510622, 0.406938, 0.365225), float3(0.242403, 0.341489, 1), an, iTime));
    col = mix(col, color(float3(0.209143, 0, 0.0584523), float3(0.609403, 0, 0.835623), an), brushb(uv, float3(0.505692, 0.449458, 0.215172), float3(0.881209, 1, 0.976817), an, iTime));
    col = mix(col, color(float3(0.607115, 0.304595, 0.389731), float3(0.624482, 0.609646, 0.630618), an), brushb(uv, float3(0.0686343, 0, 0.573008), float3(0.217504, 0.735719, 1), an, iTime));
    col = mix(col, color(float3(0.867387, 0.583652, 0.160669), float3(0.711363, 0.571591, 0.59364), an), brushb(uv, float3(0.840141, 0.348041, 0.711368), float3(0.923439, 0.917799, 0.703471), an, iTime));
    col = mix(col, color(float3(0.671548, 0.402768, 0.313552), float3(0.835478, 0.838429, 0.708087), an), brushb(uv, float3(0.128251, 0.156914, 0.623428), float3(0.647683, 0.205938, 1), an, iTime));
    col = mix(col, color(float3(0.848534, 0.895258, 0.645654), float3(0, 0.0708812, 0.739901), an), brushb(uv, float3(0.052168, 0.845845, 0.384671), float3(0.417982, 0.736606, 0.697879), an, iTime));
    col = mix(col, color(float3(0.295591, 0.450373, 0.439873), float3(0, 0, 0), an), brushb(uv, float3(0.33135, 0.945527, 0.511897), float3(0.634591, 0.775129, 0.246684), an, iTime));
    col = mix(col, color(float3(1, 0.187746, 0.0945105), float3(0, 0, 0), an), brushb(uv, float3(0.0726291, 0.4339, 0.383595), float3(0.759043, 0.870587, 0.109287), an, iTime));
    col = mix(col, color(float3(0.533477, 0.545833, 0), float3(0.541311, 0.962179, 0.181541), an), brushb(uv, float3(0.934545, 0.404947, 0.347161), float3(0.885183, 0.723071, 0.998461), an, iTime));
    col = mix(col, color(float3(0.887582, 0.535589, 0.306824), float3(0.33836, 0.900981, 0.49596), an), brushb(uv, float3(0.172213, 0.465622, 0.708591), float3(0.255613, 0.464887, 0.912071), an, iTime));
    col = mix(col, color(float3(0.459535, 0.434011, 0.879773), float3(0.152707, 0.348543, 0.456244), an), brushb(uv, float3(0.754527, 0.133942, 0.864675), float3(0.661729, 0.205586, 0.997727), an, iTime));
    col = mix(col, color(float3(0.134324, 0.076387, 0.0872012), float3(0.538795, 0.277095, 0.351645), an), brushb(uv, float3(0.508904, 0.483045, 0.299223), float3(0.731496, 0.221889, 0.369391), an, iTime));
    col = mix(col, color(float3(0.176947, 0.0104741, 0.41773), float3(0.43451, 1, 1), an), brushb(uv, float3(0.825508, 0.489569, 0.59906), float3(0.428384, 0.102655, 0.946231), an, iTime));
    col = mix(col, color(float3(0.178116, 0.334155, 0.683076), float3(0.563544, 0.763005, 0.842201), an), brushb(uv, float3(0.795838, 0.701858, 0.857145), float3(0.780469, 0, 0.812558), an, iTime));
    col = mix(col, color(float3(0.732389, 0.820019, 0.385198), float3(0.930605, 0.953072, 0.964528), an), brushb(uv, float3(0.564687, 0.199871, 0.524375), float3(0.536307, 0.228027, 0.997324), an, iTime));
    col = mix(col, color(float3(0.0704842, 0.830658, 0.0557896), float3(0.444263, 0.465552, 0.912259), an), brushb(uv, float3(0.216004, 0.849044, 0.522879), float3(0.485418, 0.0948162, 0.594173), an, iTime));
    col = mix(col, color(float3(0.771669, 0.751402, 0.457805), float3(0.921517, 0.920883, 1), an), brushb(uv, float3(0.215652, 0.0742341, 0.385223), float3(0.450804, 0.785357, 1), an, iTime));
    col = mix(col, color(float3(0.393278, 0.637632, 0), float3(0.123308, 0.107113, 0.10323), an), brushb(uv, float3(0.972619, 0.149711, 0.598465), float3(0.48083, 0.591326, 1), an, iTime));
    col = mix(col, color(float3(0.33, 0.427444, 0.0984858), float3(0, 0, 0), an), brushb(uv, float3(0.433726, 0.449027, 0.251107), float3(0.530205, 0.310545, 0.155032), an, iTime));
    col = mix(col, color(float3(0.549025, 0.0277535, 0.610797), float3(0.35899, 0.714178, 0.396748), an), brushb(uv, float3(0.526589, 0.694402, 0.533947), float3(0.821458, 0.815733, 0.408495), an, iTime));
    col = mix(col, color(float3(0, 0.803792, 1), float3(0.263912, 0.993513, 0.951699), an), brushb(uv, float3(0.908933, 0.67462, 0.5706), float3(0.77887, 0.162457, 0.977874), an, iTime));
    col = mix(col, color(float3(0.124125, 0.855169, 0.121153), float3(1, 0.666506, 0.818433), an), brushb(uv, float3(0.200996, 0.860015, 0.460626), float3(0.436224, 0.348105, 0.695131), an, iTime));
    col = mix(col, color(float3(0.0761879, 0.0290366, 0.0538116), float3(1, 0.142542, 0), an), brushb(uv, float3(0.252579, 0.383569, 0.388284), float3(0.636292, 0.336622, 0.465143), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.717686, 0.562482), an), brushb(uv, float3(0.676932, 0.180824, 0.0964799), float3(0.452796, 0.302194, 1), an, iTime));
    col = mix(col, color(float3(1, 0.758674, 0.46527), float3(0, 0, 0), an), brushb(uv, float3(0.966729, 0, 0.490022), float3(0.519062, 0.0394494, 0.416485), an, iTime));
    col = mix(col, color(float3(0.486697, 0.496604, 0.755398), float3(0.293704, 0.994826, 0.538659), an), brushb(uv, float3(0.27782, 0, 0.982767), float3(0.811298, 0.420899, 1), an, iTime));
    col = mix(col, color(float3(0.196244, 0.681596, 0.830898), float3(0.875387, 0.876424, 0.660617), an), brushb(uv, float3(0.783962, 0.954079, 0.940315), float3(0.782402, 0.806371, 0.624651), an, iTime));
    col = mix(col, color(float3(0.0363668, 0.402113, 0.1661), float3(0.265827, 0.469847, 0.479736), an), brushb(uv, float3(0.487168, 0.995111, 0.526396), float3(0.994101, 0.826343, 0.476066), an, iTime));
    col = mix(col, color(float3(0.11657, 0.199693, 0.130553), float3(0.886744, 0.603698, 0.50891), an), brushb(uv, float3(0.499356, 0.708841, 0.473523), float3(0.785695, 0.325325, 0.723356), an, iTime));
    col = mix(col, color(float3(0.527475, 0.605359, 0.317238), float3(0.738566, 0.376734, 0.302354), an), brushb(uv, float3(0.131449, 0.9325, 0.562795), float3(0.245659, 0.259357, 0.870673), an, iTime));
    col = mix(col, color(float3(0.899796, 0.720661, 0.389718), float3(0.31622, 0.14659, 0.916048), an), brushb(uv, float3(0.844159, 1, 0.901402), float3(0.341563, 0.777344, 0.757653), an, iTime));
    col = mix(col, color(float3(0.904242, 0.933059, 0.718254), float3(0.967634, 0.406758, 0), an), brushb(uv, float3(0.70146, 0.101469, 0.462268), float3(0.821434, 1, 0.762912), an, iTime));
    col = mix(col, color(float3(0.403544, 0.660987, 0.0185916), float3(0.915837, 0.790172, 0.864168), an), brushb(uv, float3(0.204291, 0.149602, 0.882658), float3(0.873519, 0.723587, 0.619586), an, iTime));
    col = mix(col, color(float3(0.481814, 0.938827, 0.231317), float3(0.2914, 0.128077, 0.400951), an), brushb(uv, float3(0.296508, 0.617565, 0.706764), float3(0.994075, 0.648026, 0.884177), an, iTime));
    col = mix(col, color(float3(0.644841, 0.492634, 0.164154), float3(0.726247, 0.887056, 0.056106), an), brushb(uv, float3(0.955003, 0.374843, 0.84344), float3(0.368052, 0.782729, 0.726628), an, iTime));
    col = mix(col, color(float3(0.810393, 0.901756, 1), float3(0.562709, 0.449435, 0.187938), an), brushb(uv, float3(0.306959, 0, 0.42397), float3(0.213903, 0.935902, 0.795525), an, iTime));
    col = mix(col, color(float3(0.95641, 0.367026, 0.397032), float3(0, 0.00691959, 0), an), brushb(uv, float3(0.558745, 0.947806, 0.222055), float3(0.370357, 0.621543, 0.695467), an, iTime));
    col = mix(col, color(float3(0.450466, 0.659644, 0.120103), float3(0.13448, 0.275949, 0), an), brushb(uv, float3(0.909, 0.346449, 0.841873), float3(0.615555, 0.3414, 0.631428), an, iTime));
    col = mix(col, color(float3(0.833706, 0.854602, 0.551964), float3(0, 0, 0), an), brushb(uv, float3(0.818453, 0.357305, 0.605781), float3(0.114769, 0.892851, 0.155431), an, iTime));
    col = mix(col, color(float3(0, 0.862278, 0.860604), float3(0.686247, 0.861405, 0.737726), an), brushb(uv, float3(0.922852, 0.657841, 0.556575), float3(0.507569, 0.102446, 0.725489), an, iTime));
    col = mix(col, color(float3(0, 0.149639, 0.100601), float3(1, 0, 0), an), brushb(uv, float3(0.364084, 0.366545, 0.595728), float3(0.344782, 0.345037, 0.427904), an, iTime));
    col = mix(col, color(float3(0.25797, 0.953289, 0.648019), float3(1, 1, 1), an), brushb(uv, float3(0.232437, 0.848656, 0.345779), float3(0.584457, 0.0391831, 1), an, iTime));
    col = mix(col, color(float3(0.998074, 0.587074, 0.77461), float3(0.500195, 0.499967, 0.56694), an), brushb(uv, float3(0.34307, 0.862239, 0.936572), float3(0.905239, 0.767408, 0.788108), an, iTime));
    col = mix(col, color(float3(0.425499, 0.632551, 0), float3(0.639845, 0.871717, 0.810868), an), brushb(uv, float3(0.205195, 0.448231, 0.559794), float3(0.253279, 0.128616, 1), an, iTime));
    col = mix(col, color(float3(0.980183, 0.589152, 0.846271), float3(0, 0, 0), an), brushb(uv, float3(0.46108, 0.641439, 0.250857), float3(0.735544, 0, 0.05), an, iTime));
    col = mix(col, color(float3(0.583712, 0.420331, 0.0493295), float3(0.70082, 0.804317, 0.977426), an), brushb(uv, float3(0.394921, 0.106006, 0.517803), float3(0.504947, 0.0520355, 0.664104), an, iTime));
    col = mix(col, color(float3(0.108287, 0.521937, 0.613882), float3(0, 0.257031, 0.195293), an), brushb(uv, float3(0.356437, 0.614725, 0.450683), float3(0.788269, 0.971369, 0.327646), an, iTime));
    col = mix(col, color(float3(0.342972, 0.0190196, 0.552285), float3(1, 0.513545, 0.478392), an), brushb(uv, float3(0.180928, 0.175248, 0.885587), float3(0.180843, 0.541313, 0.696168), an, iTime));
    col = mix(col, color(float3(0.323966, 0.350809, 0.201072), float3(0.00444535, 0.0509707, 0.133507), an), brushb(uv, float3(0.128609, 0.666199, 0.545227), float3(0.892002, 0.571541, 0.636849), an, iTime));
    col = mix(col, color(float3(0.686634, 0.750151, 0.925879), float3(0.825749, 0.979098, 0.945142), an), brushb(uv, float3(0.389977, 0.953471, 0.796016), float3(0.505368, 0.71024, 0.874171), an, iTime));
    col = mix(col, color(float3(0.801072, 0.825612, 0.326186), float3(1, 1, 1), an), brushb(uv, float3(0.622308, 0.111981, 0.435042), float3(0.183634, 0.665083, 1), an, iTime));
    col = mix(col, color(float3(0.146647, 0.629499, 0.31093), float3(1, 0.997577, 1), an), brushb(uv, float3(0.582439, 0.121388, 0.527021), float3(0.524523, 0.685488, 0.926622), an, iTime));
    col = mix(col, color(float3(0.0625208, 0.285885, 0.55314), float3(1, 0.213444, 0.223758), an), brushb(uv, float3(0.964818, 0.300128, 0.890658), float3(0.495335, 0.39163, 1), an, iTime));
    col = mix(col, color(float3(0.105319, 0.532541, 0.941627), float3(0.342362, 0.290404, 0.844325), an), brushb(uv, float3(0.496517, 0.811931, 0.919801), float3(0.940246, 0.841326, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.972902, 1, 1), an), brushb(uv, float3(1, 0.345868, 0.05), float3(0.334016, 0.0812737, 1), an, iTime));
    col = mix(col, color(float3(0.454641, 0.399965, 0.400174), float3(0.375037, 0.186873, 0.438356), an), brushb(uv, float3(0.872529, 0.996368, 0.264463), float3(0.723304, 0.825375, 0.494994), an, iTime));
    col = mix(col, color(float3(0.288191, 0.592618, 0.72447), float3(0.440397, 1, 0.219543), an), brushb(uv, float3(0.400899, 0.997845, 0.798915), float3(0.720269, 0.870337, 0.711588), an, iTime));
    col = mix(col, color(float3(0.992173, 1, 0.129485), float3(1, 0.408188, 0.320531), an), brushb(uv, float3(0.300712, 0.652922, 0.108991), float3(0.285906, 0.325184, 0.62742), an, iTime));
    col = mix(col, color(float3(0.6083, 0.602876, 0), float3(1, 1, 1), an), brushb(uv, float3(0.0202543, 0.314348, 0.667481), float3(0.458156, 0.36438, 0.686011), an, iTime));
    col = mix(col, color(float3(0.494419, 0.497586, 0), float3(0.170425, 0.879807, 0.238065), an), brushb(uv, float3(0.585698, 0.407514, 0.27566), float3(0.986279, 0.91637, 0.815525), an, iTime));
    col = mix(col, color(float3(0.892634, 0.817598, 0.589514), float3(0.799287, 0.583128, 0.026951), an), brushb(uv, float3(0.993101, 0.419982, 0.711629), float3(0.779822, 0.233314, 0.684999), an, iTime));
    col = mix(col, color(float3(0.061894, 0.00506253, 0.0451733), float3(1, 1, 0.999325), an), brushb(uv, float3(0.909116, 0.194499, 1), float3(0.274662, 0.117603, 0.917676), an, iTime));
    col = mix(col, color(float3(0.623896, 0.31949, 0.429121), float3(0.43022, 0.000826896, 0.992346), an), brushb(uv, float3(0.883616, 0.66899, 0.793061), float3(0.890786, 0.285305, 0.596456), an, iTime));
    col = mix(col, color(float3(0.115809, 0.45332, 0.0248856), float3(0.709881, 1, 0.713021), an), brushb(uv, float3(0.496922, 0.377909, 0.557306), float3(0.94257, 0.661898, 0.761724), an, iTime));
    col = mix(col, color(float3(0.80311, 0.650072, 0.841009), float3(0.191101, 0.0141715, 0.145085), an), brushb(uv, float3(0.444636, 0.0962721, 0.730425), float3(0.930698, 0.244738, 0.889916), an, iTime));
    col = mix(col, color(float3(0.729145, 0.607517, 0), float3(1, 1, 1), an), brushb(uv, float3(0.506666, 0.111332, 0.274196), float3(0.231647, 0.0771757, 0.708373), an, iTime));
    col = mix(col, color(float3(1, 1, 0.557798), float3(0.255187, 0.300011, 0.544517), an), brushb(uv, float3(0.513754, 0.631162, 0.144076), float3(0.635135, 0.255714, 0.813973), an, iTime));
    col = mix(col, color(float3(0.766252, 0.717609, 0.724401), float3(0, 0, 0), an), brushb(uv, float3(0.191527, 0.826744, 0.181433), float3(0, 1, 0.102793), an, iTime));
    col = mix(col, color(float3(0.673764, 0.436452, 0.123479), float3(0.896186, 0.999163, 0.998008), an), brushb(uv, float3(0.477401, 0.970266, 0.483546), float3(0.283855, 0.117906, 0.94943), an, iTime));
    col = mix(col, color(float3(0.813232, 0.684975, 0.183091), float3(0.888583, 0.926647, 0.980764), an), brushb(uv, float3(0.0302352, 0.0314884, 0.697639), float3(0.26813, 0.0581939, 0.611558), an, iTime));
    col = mix(col, color(float3(0, 0.377977, 0.619696), float3(0.385016, 0.281859, 0.687301), an), brushb(uv, float3(0.437963, 0.822197, 0.543168), float3(0.950892, 0.538264, 0.888007), an, iTime));
    col = mix(col, color(float3(0.90594, 0.871418, 0.735147), float3(0.251734, 0.107121, 0.896715), an), brushb(uv, float3(0.15186, 0.757921, 0.204062), float3(0.838865, 0.763081, 1), an, iTime));
    col = mix(col, color(float3(0.334986, 0.348389, 0), float3(0.107143, 0.711341, 0.126185), an), brushb(uv, float3(0.385317, 0.388247, 0.355659), float3(1, 0.490201, 0.7535), an, iTime));
    col = mix(col, color(float3(0.563242, 0.686523, 0.351235), float3(1, 0.446802, 0.74292), an), brushb(uv, float3(0.360573, 0.606947, 0.522218), float3(0.49877, 0.436235, 0.944652), an, iTime));
    col = mix(col, color(float3(0.207543, 0.749678, 0.891364), float3(0.208836, 0.44935, 0.468062), an), brushb(uv, float3(0.26304, 0, 0.572622), float3(0.917523, 0.829163, 0.742543), an, iTime));
    col = mix(col, color(float3(0.748096, 0.792612, 0.183352), float3(0.275381, 1, 0.14652), an), brushb(uv, float3(0.900499, 0.0655433, 0.552135), float3(0.917345, 0.620148, 0.828327), an, iTime));
    col = mix(col, color(float3(1, 1, 0.942253), float3(0.87744, 0.615359, 0.499336), an), brushb(uv, float3(0.449474, 0.638999, 0.0881721), float3(0.307614, 0.22766, 1), an, iTime));
    col = mix(col, color(float3(0.840443, 0.776399, 0.289939), float3(0, 0, 0), an), brushb(uv, float3(0.622074, 0.113669, 0.622097), float3(0.646914, 0.572293, 0.42512), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.314686, 0.03506, 0.33756), an), brushb(uv, float3(0.428606, 0.253818, 0.05), float3(0.247777, 0, 0.901046), an, iTime));
    col = mix(col, color(float3(0.843007, 0.881121, 0.935507), float3(0.973359, 0.980426, 1), an), brushb(uv, float3(0.176651, 0.0418498, 0.665597), float3(0.301563, 0.669425, 1), an, iTime));
    col = mix(col, color(float3(0.188114, 0.301878, 0.231252), float3(0.209977, 0.0782315, 0.848407), an), brushb(uv, float3(0.573184, 0.623535, 0.752258), float3(0.929621, 0.47071, 0.636659), an, iTime));
    col = mix(col, color(float3(0.462725, 0.1419, 0.907543), float3(1, 0.826324, 0.743986), an), brushb(uv, float3(0.857657, 0.882468, 0.621821), float3(0.436012, 0.270492, 0.800381), an, iTime));
    col = mix(col, color(float3(0.00472805, 0, 0.000183826), float3(0.9457, 0.0391819, 0.571278), an), brushb(uv, float3(0.866405, 0.244707, 1), float3(0.745952, 0.873136, 0.468555), an, iTime));
    col = mix(col, color(float3(0.646366, 0.704732, 0.0722155), float3(0.382554, 0.664998, 0.0646677), an), brushb(uv, float3(0.380703, 0.0459309, 0.984313), float3(0.948093, 1, 0.917754), an, iTime));
    col = mix(col, color(float3(0.178401, 0.462004, 0.491754), float3(0.32558, 0.455196, 0.326701), an), brushb(uv, float3(0.650658, 1, 0.793158), float3(0.333117, 0.774189, 0.47656), an, iTime));
    col = mix(col, color(float3(0.144055, 0.150064, 0), float3(1, 0.569781, 0.288962), an), brushb(uv, float3(0.50649, 0.603263, 1), float3(0.244183, 0.230409, 1), an, iTime));
    col = mix(col, color(float3(0.605109, 0.225201, 1), float3(1, 0.956766, 0.701245), an), brushb(uv, float3(0.00396965, 0.482989, 0.736908), float3(0.864895, 0.76418, 0.705619), an, iTime));
    col = mix(col, color(float3(0.801368, 0.957617, 0.763623), float3(0.00491585, 0.0755724, 0.180912), an), brushb(uv, float3(0.732704, 0.849465, 0.84559), float3(0.614229, 0.350242, 0.744173), an, iTime));
    col = mix(col, color(float3(0.0542079, 0.150075, 0.0422403), float3(0.831906, 0.54776, 0.311545), an), brushb(uv, float3(0.611562, 0.609655, 0.950238), float3(0.76434, 0.426818, 0.774666), an, iTime));
    col = mix(col, color(float3(0.962181, 0.403005, 0.870354), float3(0.00751732, 0.702322, 0.984647), an), brushb(uv, float3(0.249567, 0.225305, 0.807574), float3(0.790651, 0.278264, 0.728354), an, iTime));
    col = mix(col, color(float3(0.919185, 0.833773, 1), float3(0.784323, 0.0133179, 0.0209526), an), brushb(uv, float3(0.4535, 0.988152, 0.627568), float3(0.663797, 0.54407, 0.504865), an, iTime));
    col = mix(col, color(float3(0.903958, 0.868355, 0.466642), float3(0.778323, 0.156651, 0.139856), an), brushb(uv, float3(0.0224261, 0.146596, 0.864951), float3(1, 0.421396, 0.4575), an, iTime));
    col = mix(col, color(float3(0.717811, 0.777058, 0.392897), float3(0.397403, 0.210003, 0.907835), an), brushb(uv, float3(0.950646, 0.065875, 0.571637), float3(0.919524, 0.449293, 0.697495), an, iTime));
    col = mix(col, color(float3(1, 0.888692, 0.778449), float3(0.651214, 0.60574, 0.662), an), brushb(uv, float3(0.79097, 0.790675, 0.490711), float3(0.524834, 0.191866, 1), an, iTime));
    col = mix(col, color(float3(0.178083, 0.471344, 0.00691344), float3(0.749113, 0, 0.14729), an), brushb(uv, float3(0.575279, 1, 0.390219), float3(0.821581, 0.900409, 0.482012), an, iTime));
    col = mix(col, color(float3(0.724869, 0.741388, 0.527052), float3(0.765079, 0.941098, 0.0468584), an), brushb(uv, float3(0.456979, 0.779712, 0.351041), float3(0.858258, 0.866262, 0.509066), an, iTime));
    col = mix(col, color(float3(0.861571, 0.895943, 0.713998), float3(0.0549512, 0.0244689, 0.515395), an), brushb(uv, float3(0.463429, 0.343332, 0.632723), float3(0.905262, 0.706635, 0.967068), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.0977558, 0, 0.282344), an), brushb(uv, float3(1, 0.420047, 0.190286), float3(0.841781, 0.96889, 0.76687), an, iTime));
    col = mix(col, color(float3(0, 0.717239, 0.752176), float3(1, 0.996969, 1), an), brushb(uv, float3(0.972559, 0.59989, 1), float3(0.323511, 0.482074, 1), an, iTime));
    col = mix(col, color(float3(0.539313, 0.72282, 0.0828195), float3(0.0297287, 0, 0), an), brushb(uv, float3(0.0540234, 0.517553, 0.58195), float3(0.36056, 0.452384, 1), an, iTime));
    col = mix(col, color(float3(0.505817, 0.661249, 0.0479232), float3(0.0776058, 0.12241, 0.0917028), an), brushb(uv, float3(0.0645128, 0.51078, 0.743885), float3(0.635461, 0.248127, 0.822471), an, iTime));
    col = mix(col, color(float3(0.495727, 1, 0.13992), float3(0.655779, 0.0337919, 0), an), brushb(uv, float3(0.638493, 0.978686, 0.491425), float3(0.625509, 0.477806, 0.606236), an, iTime));
    col = mix(col, color(float3(0.760698, 0.89946, 0.443235), float3(0.73717, 0.517904, 0.661648), an), brushb(uv, float3(0.0610792, 0.112095, 0.775084), float3(0.369743, 0.767222, 0.589175), an, iTime));
    col = mix(col, color(float3(0.776683, 0.736629, 0.262776), float3(0.359095, 0.940895, 0.654763), an), brushb(uv, float3(0.984529, 0.0821111, 1), float3(0.427215, 0.779442, 0.863802), an, iTime));
    col = mix(col, color(float3(0.772951, 0.875772, 0.53365), float3(0.770093, 0.164598, 0), an), brushb(uv, float3(0.438764, 0.114661, 0.567804), float3(0.804554, 0.473721, 0.690921), an, iTime));
    col = mix(col, color(float3(0.649514, 0.171509, 0.0215671), float3(0.620408, 0.033094, 0.00949816), an), brushb(uv, float3(0.687241, 0.611739, 0.776727), float3(0.740243, 0.958872, 0.716954), an, iTime));
    col = mix(col, color(float3(0.811333, 0.751637, 0.466842), float3(0.265519, 0.42662, 0.435988), an), brushb(uv, float3(0.0432637, 0.935927, 0.571971), float3(0.528384, 0.0903139, 0.753071), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.760002, 0.175651, 0.535492), an), brushb(uv, float3(0.564011, 0.215271, 0.05), float3(0.96809, 0.624861, 0.533494), an, iTime));
    col = mix(col, color(float3(0.285898, 0.15375, 0.817371), float3(0.56282, 0.219989, 0.556486), an), brushb(uv, float3(0.285453, 0.937222, 0.307118), float3(0.598011, 0.96723, 1), an, iTime));
    col = mix(col, color(float3(0.0688516, 0.807229, 1), float3(0.655027, 0.737806, 0.7474), an), brushb(uv, float3(0.967194, 0.686247, 0.995109), float3(0.243604, 0.763525, 0.912578), an, iTime));
    col = mix(col, color(float3(0.20437, 1, 0.94271), float3(1, 0.412707, 0.197749), an), brushb(uv, float3(0.951055, 0.67923, 0.739209), float3(0.275244, 0.339754, 0.65856), an, iTime));
    col = mix(col, color(float3(0.258965, 0.208351, 0.227797), float3(1, 0.864838, 0.79107), an), brushb(uv, float3(0.771066, 0.63083, 0.669405), float3(0.328331, 0.179495, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.390418, 0.782359), an), brushb(uv, float3(0.956059, 0.184946, 0.590966), float3(1, 0.931382, 0.413972), an, iTime));
    col = mix(col, color(float3(0.593629, 0.553116, 0.0827741), float3(0.995291, 1, 1), an), brushb(uv, float3(0.0371341, 0.342104, 0.650772), float3(0.415008, 0.789891, 0.774242), an, iTime));
    col = mix(col, color(float3(0.861158, 0.736088, 0.108791), float3(0.598394, 0.63716, 0.435441), an), brushb(uv, float3(0.14655, 0.382977, 0.416859), float3(0.859015, 0.530759, 1), an, iTime));
    col = mix(col, color(float3(0.331338, 0, 0.37938), float3(0.464855, 0.324721, 0.149893), an), brushb(uv, float3(0.1303, 0.5444, 1), float3(0.260386, 0.693619, 0.505137), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.0369859, 0.171218, 0.982714), an), brushb(uv, float3(0.727253, 0.306286, 1), float3(0.632914, 0.441952, 0.670565), an, iTime));
    col = mix(col, color(float3(0.991096, 0.97744, 0.910941), float3(0, 0, 0), an), brushb(uv, float3(0.252463, 0, 0.224632), float3(0.586389, 1, 0.201581), an, iTime));
    col = mix(col, color(float3(0, 0.222792, 0.44129), float3(1, 0.949842, 0.768308), an), brushb(uv, float3(0.931733, 0.603433, 0.97177), float3(0.176487, 0.526019, 0.66447), an, iTime));
    col = mix(col, color(float3(0.0916614, 0, 0.950116), float3(0, 0.680911, 0.780849), an), brushb(uv, float3(0.698441, 0.912365, 0.835539), float3(0.706547, 0.264443, 0.541603), an, iTime));
    col = mix(col, color(float3(0.623672, 0.370097, 0.000952859), float3(0.959342, 0.559171, 0.637263), an), brushb(uv, float3(0.297041, 0.897834, 0.195259), float3(0.41665, 0.761038, 0.6429), an, iTime));
    col = mix(col, color(float3(0, 0.616792, 0.202016), float3(1, 0.689601, 0.226904), an), brushb(uv, float3(0.963775, 0.680643, 0.938338), float3(0.211209, 0.650326, 0.721036), an, iTime));
    col = mix(col, color(float3(0.856784, 0.886071, 0.309128), float3(0, 0.155913, 0.240033), an), brushb(uv, float3(0.166436, 0.155106, 0.665609), float3(0.25983, 0.00364987, 0.830062), an, iTime));
    col = mix(col, color(float3(0.372952, 0.425956, 0.914791), float3(0.290015, 0.977114, 1), an), brushb(uv, float3(0.862049, 0.875388, 0.72748), float3(0.8825, 0.99332, 0.986722), an, iTime));
    col = mix(col, color(float3(0.283149, 0, 0.939273), float3(0.168628, 0.269727, 0.315921), an), brushb(uv, float3(0.569108, 0.836937, 0.633599), float3(0.70522, 0.90114, 0.651996), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.0437702, 0.0162324), an), brushb(uv, float3(0.430303, 0.239896, 1), float3(0.210962, 0.466968, 0.328021), an, iTime));
    col = mix(col, color(float3(1, 0.778625, 0.273493), float3(0.0110493, 0, 0), an), brushb(uv, float3(0.199233, 0.00527254, 0.659236), float3(0.35903, 0.35437, 1), an, iTime));
    col = mix(col, color(float3(0.698921, 0.803815, 0.32035), float3(0, 0.0631618, 0.125551), an), brushb(uv, float3(0.12708, 0.418864, 0.464213), float3(0.977811, 0.509878, 0.174823), an, iTime));
    col = mix(col, color(float3(0.135308, 0.602731, 0.00039222), float3(0.664675, 0.789719, 0.741808), an), brushb(uv, float3(0.702623, 0.264333, 0.917118), float3(0.48369, 0.763739, 1), an, iTime));
    col = mix(col, color(float3(0.513972, 0.939394, 0.140223), float3(0.15249, 0.402728, 0.033914), an), brushb(uv, float3(0.309351, 0.875077, 0.652297), float3(0.278744, 0.338816, 0.98984), an, iTime));
    col = mix(col, color(float3(0.571912, 0.630255, 0), float3(0.200066, 0.437558, 0.199301), an), brushb(uv, float3(0.0217025, 0.651492, 0.646995), float3(1, 0.599472, 1), an, iTime));
    col = mix(col, color(float3(0.522286, 0.0525191, 0.22314), float3(0.503785, 0.754559, 0.125021), an), brushb(uv, float3(0.552324, 1, 0.416854), float3(0.19933, 1, 0.776676), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 1, 1), an), brushb(uv, float3(0.460035, 0.938622, 0.05), float3(0.193343, 0.704172, 1), an, iTime));
    col = mix(col, color(float3(0.203913, 0.15279, 0.136838), float3(0.0767225, 0.398611, 0.0911944), an), brushb(uv, float3(0.30858, 0.299813, 1), float3(0.807233, 0.743038, 1), an, iTime));
    col = mix(col, color(float3(0.796723, 0.875096, 0.219751), float3(1, 0.239221, 0.145389), an), brushb(uv, float3(0.678595, 0.962472, 0.258707), float3(0.493793, 0.467703, 0.763491), an, iTime));
    col = mix(col, color(float3(0.880247, 0.910657, 0.724172), float3(0, 0, 0), an), brushb(uv, float3(0.328035, 0.889778, 0.186933), float3(0.148521, 0.701157, 1), an, iTime));
    col = mix(col, color(float3(0.98371, 0.982242, 0.886777), float3(0.615916, 0.645284, 0.991758), an), brushb(uv, float3(0.282984, 0.402198, 0.359938), float3(0.691638, 0.366412, 0.767451), an, iTime));
    col = mix(col, color(float3(0.322854, 0.0878662, 1), float3(0.181815, 0.393381, 0.272477), an), brushb(uv, float3(0.629732, 0.999992, 0.470892), float3(0.368398, 0.0958831, 1), an, iTime));
    col = mix(col, color(float3(0.52867, 0.260455, 0.214456), float3(1, 0.0295357, 0), an), brushb(uv, float3(0.837579, 0.947351, 0.634444), float3(0.187312, 0.540772, 0.510068), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.589644, 0.907004, 0.333741), an), brushb(uv, float3(1, 1, 0.0844285), float3(0.863911, 0.710513, 0.552802), an, iTime));
    col = mix(col, color(float3(0.754246, 1, 0.448605), float3(0.607202, 0.739435, 0.668968), an), brushb(uv, float3(0.210813, 0.99795, 0.863147), float3(0.681756, 0.908695, 0.796224), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 1, 1), an), brushb(uv, float3(0, 0.593225, 0.05), float3(0.502186, 0.0328387, 0.782552), an, iTime));
    col = mix(col, color(float3(0.305443, 0.503553, 0.46034), float3(0.761122, 0.172062, 0.2198), an), brushb(uv, float3(0.116757, 0.0316091, 0.865238), float3(0.49254, 0.516159, 0.807761), an, iTime));
    col = mix(col, color(float3(0.788099, 0.752101, 0.0347394), float3(1, 0.535706, 0.0133032), an), brushb(uv, float3(0.0377316, 0.415931, 0.422597), float3(1, 0.945261, 0.630101), an, iTime));
    col = mix(col, color(float3(0.756113, 0.74368, 0.989605), float3(0.390472, 0.147003, 0), an), brushb(uv, float3(0.682691, 1, 0.950686), float3(0.807911, 0.201969, 0.847991), an, iTime));
    col = mix(col, color(float3(0.457201, 0.556455, 0.704783), float3(0, 0, 0), an), brushb(uv, float3(0.611912, 1, 0.805084), float3(0.310015, 0.0838521, 1), an, iTime));
    col = mix(col, color(float3(0.78741, 0.940658, 0.323955), float3(1, 0.832628, 0.497329), an), brushb(uv, float3(0.908692, 0.921781, 0.31722), float3(0.472638, 0.360327, 0.796446), an, iTime));
    col = mix(col, color(float3(0.6405, 0.326455, 0.16879), float3(0.429602, 0.0629812, 0.612254), an), brushb(uv, float3(0.534456, 0.888402, 0.525524), float3(1, 0.83704, 0.68091), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.524009, 0.0716776, 1), an), brushb(uv, float3(0.138673, 0.224126, 0.05), float3(0.957499, 0.597484, 0.743294), an, iTime));
    col = mix(col, color(float3(0.986272, 0.997592, 0.988799), float3(0.651531, 0.804996, 0.665252), an), brushb(uv, float3(0.220398, 0, 0.87852), float3(0.885259, 0.862075, 0.808521), an, iTime));
    col = mix(col, color(float3(0.737777, 0.261973, 0.340997), float3(0.198744, 0.289396, 0.412325), an), brushb(uv, float3(0.540735, 0.949246, 1), float3(0.221139, 0.0447422, 1), an, iTime));
    col = mix(col, color(float3(0.173694, 0.238058, 0.309232), float3(0.621663, 0.584852, 0.132594), an), brushb(uv, float3(0.716074, 1, 1), float3(0.620833, 0.394136, 0.859118), an, iTime));
    col = mix(col, color(float3(0.783177, 0.521243, 0.556683), float3(0, 0, 0), an), brushb(uv, float3(0.293102, 0.644785, 1), float3(1, 0.376551, 0.0815363), an, iTime));
    col = mix(col, color(float3(0.834435, 0.9149, 0.553125), float3(0.534154, 0.701913, 0.781677), an), brushb(uv, float3(0.0151293, 0, 0.950056), float3(0.193431, 0.11537, 0.823884), an, iTime));
    col = mix(col, color(float3(0, 0.00275587, 0), float3(0.598987, 0.42927, 0.133241), an), brushb(uv, float3(0.393362, 0.208992, 1), float3(0.456452, 0.714617, 0.541653), an, iTime));
    col = mix(col, color(float3(0.743387, 0.601251, 0.977606), float3(0.0611645, 0.0251862, 0.0514982), an), brushb(uv, float3(0.845366, 0, 0.951654), float3(0.234347, 0.0182668, 0.592739), an, iTime));
    col = mix(col, color(float3(0.737934, 0.809554, 0.24935), float3(0.709667, 0.511728, 0.534749), an), brushb(uv, float3(0.593831, 0.849273, 0.847571), float3(0.72937, 0.306026, 0.741005), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.162391, 0.0567595), an), brushb(uv, float3(0, 0.455455, 0.0955529), float3(0.420119, 0.4815, 0.693028), an, iTime));
    col = mix(col, color(float3(0.19714, 0.635341, 0.973013), float3(0.100722, 0.53756, 1), an), brushb(uv, float3(0.590699, 0.913294, 0.506358), float3(0.884757, 0.643336, 0.598116), an, iTime));
    col = mix(col, color(float3(0, 0.501106, 0.587365), float3(0.401909, 0.300499, 0.0157437), an), brushb(uv, float3(0.625524, 0.622384, 0.736557), float3(0.854066, 0.624376, 0.517713), an, iTime));
    col = mix(col, color(float3(0.857542, 0.87032, 0.954295), float3(0.508459, 0.185916, 0.145619), an), brushb(uv, float3(0.867869, 0.483835, 0.909648), float3(0.336298, 0.713555, 0.393411), an, iTime));
    col = mix(col, color(float3(0.978655, 1, 0.946528), float3(0.977224, 1, 0.983761), an), brushb(uv, float3(0.0566674, 0.111622, 0.706987), float3(0.232273, 0.712641, 0.635784), an, iTime));
    col = mix(col, color(float3(0.369705, 0.328892, 0.252578), float3(0.493222, 0.308683, 0.257983), an), brushb(uv, float3(0.691119, 0.301642, 1), float3(0.531937, 0.252958, 0.775826), an, iTime));
    col = mix(col, color(float3(0, 0, 0.0118797), float3(0.81025, 0.852359, 0.754254), an), brushb(uv, float3(0.722632, 0.263072, 1), float3(0.401415, 0.752829, 0.526836), an, iTime));
    col = mix(col, color(float3(0.0816067, 0.750367, 0.668587), float3(1, 0.894856, 0.925026), an), brushb(uv, float3(0.822354, 0.697669, 0.611646), float3(0.295799, 0.447682, 0.866178), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.829397, 0.872706, 0.470814), an), brushb(uv, float3(0.878311, 0.253492, 0.921646), float3(0.401853, 0.234493, 0.614956), an, iTime));
    col = mix(col, color(float3(0.547375, 0.709193, 0.591809), float3(0.219352, 0.0351102, 0), an), brushb(uv, float3(0.802755, 0, 0.797664), float3(0.0995632, 0.436029, 0.537491), an, iTime));
    col = mix(col, color(float3(0.187003, 0.0812886, 0.454563), float3(0.379113, 0.165494, 0), an), brushb(uv, float3(0.568805, 0.619127, 0.851411), float3(0.244871, 0.235898, 1), an, iTime));
    col = mix(col, color(float3(0.915525, 1, 0.350787), float3(0.567099, 0, 0.838273), an), brushb(uv, float3(0.587199, 0.97422, 0.332785), float3(0.830465, 0.752678, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.248272, 0.633943, 0.725803), an), brushb(uv, float3(0.81562, 0.545167, 0.692513), float3(0.509077, 0.679917, 0.725207), an, iTime));
    col = mix(col, color(float3(0.858512, 1, 0.715718), float3(0.507251, 0.537097, 0.531285), an), brushb(uv, float3(0.645102, 0.459884, 0.822958), float3(0.760906, 0.0925293, 0.302991), an, iTime));
    col = mix(col, color(float3(0, 0.28578, 0.677467), float3(0, 0.742602, 0.534579), an), brushb(uv, float3(0.706609, 0.674575, 0.803599), float3(0.685573, 0.360846, 0.626063), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.550614, 0.292163), an), brushb(uv, float3(0.713121, 0.343652, 0.7705), float3(0.270724, 0.608852, 1), an, iTime));
    col = mix(col, color(float3(0, 0.902831, 1), float3(0.481419, 0.678472, 0), an), brushb(uv, float3(0.96752, 0.631204, 0.988276), float3(0.958265, 0.575006, 0.893911), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.446932, 1, 0.36234), an), brushb(uv, float3(0.901609, 0.250224, 0.933053), float3(0.685442, 0.388784, 0.645245), an, iTime));
    col = mix(col, color(float3(0.656935, 0.360485, 0.573595), float3(0.239902, 0.29483, 0.270935), an), brushb(uv, float3(0.965679, 1, 0.904714), float3(0.750258, 0.178412, 0.501618), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.294105, 0.0770184, 0), an), brushb(uv, float3(0.704351, 0.294082, 1), float3(0.614302, 0.358636, 0.454888), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.911481, 0.369113, 1), an), brushb(uv, float3(0.232351, 0.268014, 1), float3(0.477903, 0.694449, 0.608957), an, iTime));
    col = mix(col, color(float3(0.00846258, 0.314166, 0.723215), float3(0.915924, 0.279961, 0.169842), an), brushb(uv, float3(0.103397, 0.549331, 0.770373), float3(0.930292, 0.424039, 0.488942), an, iTime));
    col = mix(col, color(float3(0.838236, 0.491233, 0.124507), float3(1, 0.795834, 0.630533), an), brushb(uv, float3(0.613157, 0.83547, 0.401194), float3(0.502135, 0.416215, 1), an, iTime));
    col = mix(col, color(float3(0.991299, 0.984554, 0.949365), float3(0.535884, 0.385651, 0.460993), an), brushb(uv, float3(0.979437, 0.323498, 0.686576), float3(0.433219, 0.0667202, 0.691054), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.68927, 0.607902), an), brushb(uv, float3(0.903644, 0.255422, 0.961445), float3(0.449718, 0.278824, 0.997966), an, iTime));
    col = mix(col, color(float3(0.549396, 0.770775, 0.244039), float3(0.136225, 0.939189, 0.265964), an), brushb(uv, float3(0.382551, 0.941093, 0.99743), float3(0.788774, 0.402438, 0.686033), an, iTime));
    col = mix(col, color(float3(0.430592, 0.746443, 0.00682404), float3(0.334254, 0.351872, 0.391608), an), brushb(uv, float3(0.380443, 0.926691, 0.977513), float3(0.618206, 0.155639, 1), an, iTime));
    col = mix(col, color(float3(1, 0.978056, 1), float3(0.891545, 0.913228, 0.366318), an), brushb(uv, float3(0.715862, 0.37929, 0.536901), float3(0.418703, 0.314421, 0.601167), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 1, 0.579699), an), brushb(uv, float3(0.716307, 0.226657, 0.959467), float3(0.796238, 0.830035, 0.809138), an, iTime));
    col = mix(col, color(float3(0.995443, 0.811714, 0.693226), float3(0.0866863, 0, 0.265821), an), brushb(uv, float3(0.916332, 1, 0.546909), float3(0.987525, 0.903391, 0.9622), an, iTime));
    col = mix(col, color(float3(0.934099, 0.932, 0.907318), float3(0.199668, 0, 0.709544), an), brushb(uv, float3(0.186552, 0.0178897, 0.925699), float3(0.938305, 0.841328, 0.954536), an, iTime));
    col = mix(col, color(float3(0.0165591, 0.402297, 0), float3(0.306062, 0.409273, 0.57369), an), brushb(uv, float3(0.531406, 0.917653, 0.740295), float3(0.730251, 0.228998, 0.607655), an, iTime));
    col = mix(col, color(float3(1, 1, 0.759851), float3(1, 0.708547, 0.514445), an), brushb(uv, float3(0.859271, 0.931773, 0.210109), float3(0.219896, 0.419305, 0.456596), an, iTime));
    col = mix(col, color(float3(0.740461, 0.80178, 0.361815), float3(0.653452, 0.364534, 0.538773), an), brushb(uv, float3(0.650181, 0.857767, 0.317902), float3(0.988966, 0.918464, 0.680359), an, iTime));
    col = mix(col, color(float3(0.484539, 0.79381, 0.860859), float3(0.402927, 0.281665, 0.219323), an), brushb(uv, float3(0.22926, 0.972007, 0.665801), float3(0.212683, 0.707405, 1), an, iTime));
    col = mix(col, color(float3(0.666752, 0.719367, 0.515799), float3(0.96353, 0.911122, 0.129632), an), brushb(uv, float3(0.94945, 0.933353, 0.273559), float3(0.665316, 0.934908, 0.689876), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.119653, 0, 0.0903086), an), brushb(uv, float3(0.671275, 0.35797, 0.527365), float3(0.160537, 0.401813, 0.680456), an, iTime));
    col = mix(col, color(float3(0, 0.57412, 0.714378), float3(0.958293, 0.217967, 0.443994), an), brushb(uv, float3(0.512832, 0.614047, 0.986478), float3(0.696857, 0.285082, 0.910617), an, iTime));
    col = mix(col, color(float3(0.129399, 0.239841, 0), float3(0.391012, 0.166305, 0.778887), an), brushb(uv, float3(0.660218, 0.632192, 0.605861), float3(0.720417, 0.846323, 0.854555), an, iTime));
    col = mix(col, color(float3(0.197343, 0.124556, 0.188318), float3(0, 0, 0), an), brushb(uv, float3(0.512428, 0.268658, 1), float3(0.625345, 0.433121, 0.480111), an, iTime));
    col = mix(col, color(float3(0.62096, 0.935216, 0.0744582), float3(0.325177, 0.314316, 0.562631), an), brushb(uv, float3(0.268841, 0.966034, 0.974236), float3(0.665116, 0.934088, 0.925753), an, iTime));
    col = mix(col, color(float3(0.424612, 0.449506, 0.406384), float3(0.532223, 0.248479, 0.416905), an), brushb(uv, float3(0.490975, 0.932509, 0.748508), float3(0.510705, 0.602365, 0.895411), an, iTime));
    col = mix(col, color(float3(1, 0.902392, 0.800051), float3(0.113267, 0.344383, 0.389398), an), brushb(uv, float3(0.0659887, 0.942364, 0.846032), float3(0.97208, 0.941707, 0.4786), an, iTime));
    col = mix(col, color(float3(0.302466, 0.30771, 0.575555), float3(0.316947, 0.190864, 0.080368), an), brushb(uv, float3(0.579581, 0.892381, 0.706058), float3(0.314328, 0.336896, 0.478329), an, iTime));
    col = mix(col, color(float3(0.59255, 0.112173, 0.195387), float3(0.46677, 0.479864, 0.48513), an), brushb(uv, float3(0.606859, 0.809186, 0.823792), float3(0.311363, 0.819296, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.792431), float3(1, 0.612281, 0.540698), an), brushb(uv, float3(0.279311, 1, 0.842576), float3(0.307569, 0.367701, 0.872268), an, iTime));
    col = mix(col, color(float3(0.447552, 0.505175, 0.916553), float3(0.252754, 0.704422, 0.303777), an), brushb(uv, float3(0.606486, 0.863496, 0.387261), float3(0.929077, 0.848408, 0.386876), an, iTime));
    col = mix(col, color(float3(0, 0.47281, 0.980561), float3(0.430517, 0.536503, 0.0926964), an), brushb(uv, float3(0.764001, 0.695548, 1), float3(0.963505, 0.395977, 0.824668), an, iTime));
    col = mix(col, color(float3(0.469095, 0.0377638, 0.170137), float3(0.128472, 0.185535, 0.18438), an), brushb(uv, float3(0.441193, 0.932276, 0.843641), float3(0.603418, 0.287317, 1), an, iTime));
    col = mix(col, color(float3(0.911942, 0.981127, 0.822565), float3(0.983709, 0.61155, 0.565205), an), brushb(uv, float3(0.578292, 0.817628, 0.28711), float3(0.386114, 0.421578, 1), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.553556, 0.309116, 1), float3(0.267081, 0.876593, 0.449502), an, iTime));
    col = mix(col, color(float3(0.794403, 0.558273, 0.074088), float3(0.960298, 0.678142, 0.399185), an), brushb(uv, float3(0.937453, 1, 0.355843), float3(0.840817, 0.702759, 0.611733), an, iTime));
    col = mix(col, color(float3(0, 0.00108831, 0), float3(0.134928, 0.616448, 0.114946), an), brushb(uv, float3(0.25925, 0.256963, 1), float3(0.81619, 0.94555, 0.742009), an, iTime));
    col = mix(col, color(float3(0.623552, 0.621344, 0), float3(0.41111, 0.222586, 0.265531), an), brushb(uv, float3(0.932845, 0.929985, 0.408737), float3(0.63352, 0.0967505, 0.714707), an, iTime));
    col = mix(col, color(float3(0.218771, 0.713723, 0.852571), float3(0.463067, 0.970092, 0.766671), an), brushb(uv, float3(0.579817, 0.877213, 0.512664), float3(0.549728, 0.0573375, 0.831987), an, iTime));
    col = mix(col, color(float3(0.723666, 0.588809, 0.714193), float3(1, 1, 1), an), brushb(uv, float3(0.761506, 0.608804, 0.954129), float3(0.362332, 0.0604025, 0.550577), an, iTime));
    col = mix(col, color(float3(0.0816006, 0.346734, 0.153666), float3(0.558744, 0.188555, 0.0148239), an), brushb(uv, float3(0.56292, 0.906007, 0.733575), float3(0.144914, 0.383158, 0.664692), an, iTime));
    col = mix(col, color(float3(0.439526, 0.434983, 0.728857), float3(0.200456, 0.153655, 0), an), brushb(uv, float3(0.793321, 0.479157, 0.922922), float3(0.878972, 0.37461, 0.701455), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0.524303, 0.8625), an), brushb(uv, float3(0.322304, 0.240409, 1), float3(0.758693, 0.397254, 0.688523), an, iTime));
    col = mix(col, color(float3(0.804607, 0.876452, 0.607044), float3(0.0697209, 0.102765, 0), an), brushb(uv, float3(0.754835, 0.921017, 0.962393), float3(0.600817, 0.92326, 0.738307), an, iTime));
    col = mix(col, color(float3(0.867364, 0.633123, 0.474672), float3(0, 0, 0), an), brushb(uv, float3(0.971545, 0.778626, 1), float3(0.618238, 0.838861, 0.271711), an, iTime));
    col = mix(col, color(float3(0.608223, 0.179076, 0), float3(0.969117, 0.414684, 0.288034), an), brushb(uv, float3(0.634387, 0.844532, 0.826907), float3(0.516639, 0.614007, 0.722191), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.831356, 0.361163, 1), an), brushb(uv, float3(0.164523, 0.262877, 1), float3(0.96469, 1, 0.273496), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.620656, 0.901957, 0.0696152), float3(0.136129, 0.47988, 1), an, iTime));
    col = mix(col, color(float3(0.417911, 0.779383, 0.689369), float3(0.964182, 0.122643, 0.177051), an), brushb(uv, float3(0.746147, 0.449001, 1), float3(0.851737, 0.793864, 0.617898), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0.0100741), an), brushb(uv, float3(0.203002, 0.194906, 0.523802), float3(0.132484, 0.0974016, 0.307992), an, iTime));
    col = mix(col, color(float3(0.21025, 0.617046, 0.712712), float3(0.981911, 1, 0.70385), an), brushb(uv, float3(0.257986, 0.989793, 0.70818), float3(0.95443, 0.691946, 0.841405), an, iTime));
    col = mix(col, color(float3(0.785622, 0.932089, 0.960961), float3(0.140765, 0.10395, 0.0166048), an), brushb(uv, float3(0.378131, 0.949968, 0.615953), float3(0.612191, 0.422534, 0.546492), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.884036, 0.320588, 0.629642), an), brushb(uv, float3(0.906309, 0.0717886, 0.272288), float3(0.798974, 0.779503, 0.566223), an, iTime));
    col = mix(col, color(float3(0, 0.00927849, 0.00776359), float3(0.298675, 0.0823673, 0), an), brushb(uv, float3(0.227185, 0.216308, 1), float3(0.636427, 0.447738, 0.522905), an, iTime));
    col = mix(col, color(float3(0.164106, 0.213145, 0.190442), float3(0.879799, 0.826163, 0.266044), an), brushb(uv, float3(0.177303, 0.207379, 1), float3(0.680548, 0.893864, 0.811483), an, iTime));
    col = mix(col, color(float3(0.454866, 0.128268, 0.611205), float3(0, 0, 0), an), brushb(uv, float3(0.311407, 1, 0.715433), float3(0.655845, 0.557069, 0.280511), an, iTime));
    col = mix(col, color(float3(0.434801, 0.92391, 0.120261), float3(1, 0.755009, 0.483676), an), brushb(uv, float3(0.549704, 0.947976, 0.958216), float3(0.472256, 0.500993, 0.695971), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.910407, 1, 1), an), brushb(uv, float3(0.476947, 0.201379, 1), float3(0.500353, 0.144879, 0.95626), an, iTime));
    col = mix(col, color(float3(0, 0, 0.353377), float3(0.985473, 0.212666, 0.760232), an), brushb(uv, float3(0.808446, 0.612177, 0.836037), float3(0.874685, 0.303209, 0.937752), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.97081, 0.59869, 0.101303), an), brushb(uv, float3(0.94355, 0.268367, 0.977097), float3(0.477941, 0.653798, 0.424661), an, iTime));
    col = mix(col, color(float3(0.00397997, 0, 0), float3(0.408119, 0.0952985, 0.852927), an), brushb(uv, float3(0.337858, 0.199727, 1), float3(0.889596, 0.846404, 1), an, iTime));
    col = mix(col, color(float3(0, 0.274566, 0.739081), float3(0.676536, 0.596833, 0.535871), an), brushb(uv, float3(0.536364, 0.613229, 0.912992), float3(0.281179, 0.538828, 1), an, iTime));
    col = mix(col, color(float3(0.730367, 0.891294, 0.817491), float3(0.396626, 0.0909323, 0.055827), an), brushb(uv, float3(0.215964, 0, 0.900634), float3(0.234939, 0.67772, 0.672195), an, iTime));
    col = mix(col, color(float3(0.382993, 0.479123, 0.978049), float3(0.847778, 0.533995, 0.39182), an), brushb(uv, float3(0.443077, 0.903997, 1), float3(0.345596, 0.527762, 0.997883), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.55003, 0.204891, 0.0382869), an), brushb(uv, float3(1, 0.913174, 0.0714471), float3(0.900086, 0.729601, 0.459152), an, iTime));
    col = mix(col, color(float3(0, 0.841965, 1), float3(0.496093, 0.734766, 0.719366), an), brushb(uv, float3(0.6416, 0.638378, 0.614846), float3(0.426971, 0.0859016, 0.746259), an, iTime));
    col = mix(col, color(float3(0, 0.0837595, 0.87702), float3(0, 0, 0), an), brushb(uv, float3(0.0986381, 0.54026, 0.806441), float3(0.694906, 0.777348, 0.168304), an, iTime));
    col = mix(col, color(float3(0.349499, 0.814323, 0), float3(0.490341, 0.294016, 0), an), brushb(uv, float3(0.272003, 0.93318, 0.905908), float3(0.961061, 0.862366, 0.689111), an, iTime));
    col = mix(col, color(float3(0.713685, 0.0273173, 1), float3(0.733987, 0.815478, 0.79588), an), brushb(uv, float3(0.330513, 0.99804, 1), float3(0.551396, 0.225332, 0.83291), an, iTime));
    col = mix(col, color(float3(0, 0.0322464, 0.624354), float3(0.499508, 0.141519, 0.0365387), an), brushb(uv, float3(0.2981, 0.579625, 1), float3(0.736891, 0.326959, 0.626272), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.802835, 0.477265, 0.23722), an), brushb(uv, float3(1, 0.13943, 0.362872), float3(0.930226, 0.799435, 0.93752), an, iTime));
    col = mix(col, color(float3(0.977906, 0.653572, 0.843247), float3(0.477234, 0.856836, 0.635418), an), brushb(uv, float3(0.140292, 0, 1), float3(0.739601, 0.281443, 0.646547), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.436213, 0.391202, 0.161965), an), brushb(uv, float3(0.4116, 0.221033, 1), float3(0.811902, 0.657857, 0.889352), an, iTime));
    col = mix(col, color(float3(0.451332, 1, 0.59802), float3(0.873445, 0.856899, 0.579344), an), brushb(uv, float3(0.335044, 0.979175, 0.863948), float3(0.872777, 0.452681, 0.740215), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.0474748, 0.140638, 0.886197), an), brushb(uv, float3(0.251449, 0.211701, 0.92225), float3(1, 0.448066, 0.849731), an, iTime));
    col = mix(col, color(float3(0.0165452, 0.798883, 0.940498), float3(0.495493, 0.318993, 0.00995638), an), brushb(uv, float3(0.747591, 0.688357, 1), float3(0.696339, 0.31094, 0.563222), an, iTime));
    col = mix(col, color(float3(0.631332, 0.609354, 0.265625), float3(1, 1, 0.999381), an), brushb(uv, float3(0.0463981, 0.00194068, 1), float3(0.388494, 0.0440461, 0.835917), an, iTime));
    col = mix(col, color(float3(0.998545, 0.97613, 0.702615), float3(0.837152, 0.338987, 0.255232), an), brushb(uv, float3(0.361576, 0.953707, 0.995508), float3(0.288543, 0.448893, 0.832131), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.966249, 1, 0.989817), an), brushb(uv, float3(0, 0, 0.283886), float3(0.534294, 0.628243, 0.878819), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.287594, 0.0873098, 0.121261), an), brushb(uv, float3(0.378325, 0.2311, 1), float3(0.655278, 0.380316, 0.39043), an, iTime));
    col = mix(col, color(float3(0.374901, 0.763889, 0.864639), float3(0.501608, 0.148425, 0.3961), an), brushb(uv, float3(0.602462, 0.4624, 1), float3(0.854043, 0.681708, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.573296, 0, 0), an), brushb(uv, float3(1, 1, 0.0737728), float3(0.464795, 0.374019, 1), an, iTime));
    col = mix(col, color(float3(0.95353, 0.973125, 0.974002), float3(0.901105, 0.985681, 1), an), brushb(uv, float3(0.142707, 0, 0.575348), float3(0.196671, 0.0938263, 0.927088), an, iTime));
    col = mix(col, color(float3(0.866756, 1, 0.86956), float3(0.449523, 0.992884, 0.0185745), an), brushb(uv, float3(0.0492108, 1, 0.626682), float3(0.88289, 0.897783, 0.671715), an, iTime));
    col = mix(col, color(float3(0.0761238, 0.963924, 1), float3(0, 0.408984, 0.579434), an), brushb(uv, float3(0.921575, 0.612929, 0.634914), float3(0.846825, 0.293473, 0.656056), an, iTime));
    col = mix(col, color(float3(0.141712, 0.169308, 0.183703), float3(0.45371, 0.706188, 0.786598), an), brushb(uv, float3(0.54832, 0.205101, 1), float3(0.454955, 0.106054, 0.916131), an, iTime));
    col = mix(col, color(float3(0.876777, 0.962184, 0.823241), float3(0.893831, 0, 0), an), brushb(uv, float3(0.608421, 0.814314, 0.621721), float3(0.905314, 0.357877, 0.403715), an, iTime));
    col = mix(col, color(float3(0, 0.854132, 1), float3(0.893466, 0.393269, 0), an), brushb(uv, float3(0.846745, 0.718697, 0.88712), float3(0.749226, 0.105272, 0.654268), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.0098897, 0), an), brushb(uv, float3(0.548147, 0.362284, 0.600438), float3(0.162267, 0.419401, 0.789363), an, iTime));
    col = mix(col, color(float3(0.774414, 0.887751, 0.19426), float3(0, 0, 0.106905), an), brushb(uv, float3(0.405454, 0.921001, 0.624315), float3(0.264366, 0.102736, 0.85517), an, iTime));
    col = mix(col, color(float3(0.00269824, 0.982553, 1), float3(0.881809, 0.137033, 0.346813), an), brushb(uv, float3(0.965047, 0.61519, 0.851538), float3(0.663942, 0.420524, 0.571149), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.947007, 0.769957, 0.459031), an), brushb(uv, float3(0.322824, 0.209132, 1), float3(0.965388, 0.779793, 0.587449), an, iTime));
    col = mix(col, color(float3(0, 0.988733, 0.977786), float3(1, 0.966759, 0.996535), an), brushb(uv, float3(0.954236, 0.73461, 0.712681), float3(0.209292, 0.578972, 1), an, iTime));
    col = mix(col, color(float3(0.218042, 0.475059, 0.821461), float3(0.994416, 0.64455, 0.52365), an), brushb(uv, float3(0.461207, 0.907916, 0.783832), float3(0.662914, 0.388069, 0.678173), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.229513, 1, 0.554048), an), brushb(uv, float3(0.806315, 0.558287, 0.872155), float3(1, 0.875905, 0.910407), an, iTime));
    col = mix(col, color(float3(0, 0.218037, 0.858071), float3(0.869592, 0, 0), an), brushb(uv, float3(0.151568, 0.556521, 0.770502), float3(0.880428, 0.372421, 0.702186), an, iTime));
    col = mix(col, color(float3(0.896096, 0.820757, 0.591077), float3(0.330607, 0, 0.139772), an), brushb(uv, float3(0.0328625, 0.923404, 0.946279), float3(0.403043, 0.314074, 0.595324), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.0986205, 0.813059, 0.951142), an), brushb(uv, float3(0.449258, 0.202389, 0.976131), float3(0.822641, 0.345648, 1), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.780569, 0.660784), an), brushb(uv, float3(0.68482, 0.287671, 1), float3(0.219696, 0.522454, 0.800428), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.889854, 0.261825, 0.965297), float3(0.713207, 0.832315, 0.176807), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.0827137, 0.275397, 0.479011), an), brushb(uv, float3(0.321096, 0.274625, 1), float3(0.269924, 0.557799, 1), an, iTime));
    col = mix(col, color(float3(0.350282, 0.13735, 0.484467), float3(0.967052, 1, 0.898741), an), brushb(uv, float3(0.296502, 1, 0.756823), float3(0.534202, 0.0570216, 0.625212), an, iTime));
    col = mix(col, color(float3(0, 0.0643987, 0.0180056), float3(0.331207, 0.483351, 1), an), brushb(uv, float3(0.814013, 0.27709, 1), float3(0.688257, 0.413324, 0.764561), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1.59451e-05, 0, 0), an), brushb(uv, float3(0.635833, 0.208475, 1), float3(0.737388, 0.906215, 0.14205), an, iTime));
    col = mix(col, color(float3(0, 0.64548, 0.85888), float3(1, 0.996928, 0.950313), an), brushb(uv, float3(0.559516, 0.6143, 0.766093), float3(0.423572, 0.360188, 0.713362), an, iTime));
    col = mix(col, color(float3(0, 0.946772, 1), float3(0.980466, 0.487788, 0.642926), an), brushb(uv, float3(0.967416, 0.661389, 0.878801), float3(0.694227, 0.0657342, 0.893102), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.63055, 0.721356, 0.738876), an), brushb(uv, float3(0.803357, 0.214109, 0.998166), float3(0.2563, 0.0904555, 0.74701), an, iTime));
    col = mix(col, color(float3(0, 0.535761, 0.897666), float3(0.152692, 0.439721, 0.760118), an), brushb(uv, float3(0.468088, 0.606702, 1), float3(0.550647, 0.533385, 1), an, iTime));
    col = mix(col, color(float3(0.304353, 0.952393, 0.907436), float3(0.211123, 0.902149, 0.285825), an), brushb(uv, float3(0.869807, 0.700425, 0.68277), float3(0.87495, 0.998735, 0.753725), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.162631, 0.843495, 0.16602), an), brushb(uv, float3(0.554402, 0.552602, 0.808352), float3(1, 0.79576, 0.741949), an, iTime));
    col = mix(col, color(float3(0.00130033, 0, 0), float3(0.943553, 1, 1), an), brushb(uv, float3(0.871093, 0.260516, 1), float3(0.542522, 0.109764, 1), an, iTime));
    col = mix(col, color(float3(0.742998, 0.480488, 0.230623), float3(0, 0, 0), an), brushb(uv, float3(0.580544, 0.931767, 0.737543), float3(0.137669, 0.724013, 0.728781), an, iTime));
    col = mix(col, color(float3(0.162758, 0.425452, 0.882463), float3(0.659399, 0.727595, 0.742787), an), brushb(uv, float3(0.274534, 0.973544, 0.878084), float3(0.511553, 0.170711, 1), an, iTime));
    col = mix(col, color(float3(0.0248107, 0.887269, 0.922874), float3(0.0277217, 0, 0), an), brushb(uv, float3(0.883405, 0.60745, 0.710234), float3(0.499089, 0.30594, 0.960213), an, iTime));
    col = mix(col, color(float3(0.911309, 0.905967, 0.561165), float3(1, 1, 1), an), brushb(uv, float3(0.84693, 0, 0.932604), float3(0.543378, 0.599367, 1), an, iTime));
    col = mix(col, color(float3(0, 0.928903, 0.974401), float3(0, 0, 0), an), brushb(uv, float3(0.888847, 0.72738, 0.847842), float3(1, 0.648503, 0.136286), an, iTime));
    col = mix(col, color(float3(0, 0.823666, 1), float3(0, 0.1523, 0.0507695), an), brushb(uv, float3(0.685209, 0.657913, 0.662272), float3(1, 0.943086, 0.913507), an, iTime));
    col = mix(col, color(float3(0.916171, 0.872494, 0.660397), float3(0.00679734, 0.870262, 0.0663068), an), brushb(uv, float3(0.448132, 0.926198, 0.272883), float3(0.829662, 0.887667, 0.78049), an, iTime));
    col = mix(col, color(float3(0.961195, 0.877293, 0.591885), float3(0.34475, 0.289151, 0.150059), an), brushb(uv, float3(0.237741, 0, 0.934525), float3(1, 0.855149, 0.79297), an, iTime));
    col = mix(col, color(float3(1, 0.997826, 1), float3(0.0557415, 0, 0.000615465), an), brushb(uv, float3(0.61231, 0.807828, 0.281602), float3(0.482894, 0.18236, 0.616549), an, iTime));
    col = mix(col, color(float3(0.781213, 0.992271, 0.0626163), float3(0, 0, 0.000488203), an), brushb(uv, float3(0.0108013, 0.952209, 0.73564), float3(0.122989, 0.524753, 0.996347), an, iTime));
    col = mix(col, color(float3(0.364576, 0.389123, 0.394686), float3(0.120332, 0, 0), an), brushb(uv, float3(0.866136, 0.203438, 1), float3(0.617832, 0.515882, 0.50647), an, iTime));
    col = mix(col, color(float3(0.871082, 0.389583, 0.272323), float3(0.938541, 0.596047, 0.577123), an), brushb(uv, float3(0.0096801, 0.955144, 0.833041), float3(0.516787, 0.647227, 0.745654), an, iTime));
    col = mix(col, color(float3(0.558916, 0.918494, 1), float3(0.947809, 0.00550289, 0.63717), an), brushb(uv, float3(1, 0.0356769, 1), float3(0.910738, 0.937523, 0.766869), an, iTime));
    col = mix(col, color(float3(0.37558, 0.15015, 0.582747), float3(1, 1, 1), an), brushb(uv, float3(0.59599, 0.937907, 1), float3(0.173738, 0.617825, 1), an, iTime));
    col = mix(col, color(float3(0.784243, 0.41004, 0.911519), float3(0.687476, 0.703194, 0.750524), an), brushb(uv, float3(0.79754, 0.481609, 0.880315), float3(0.481362, 0.109638, 0.684792), an, iTime));
    col = mix(col, color(float3(0.871979, 1, 0.591745), float3(0.0453159, 0.30196, 0), an), brushb(uv, float3(0.341446, 1, 0.702594), float3(0.392999, 0.71773, 0.544213), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.632312, 0.684643, 0.814367), an), brushb(uv, float3(0.426692, 0.25195, 1), float3(0.321228, 0.591826, 1), an, iTime));
    col = mix(col, color(float3(0.886109, 0.793749, 1), float3(0.562787, 0.8308, 0.477555), an), brushb(uv, float3(0.314027, 1, 0.365228), float3(0.192243, 1, 0.796105), an, iTime));
    col = mix(col, color(float3(0.0424784, 0.444756, 0.60372), float3(0.987384, 0.492712, 0.208479), an), brushb(uv, float3(0.277095, 1, 0.62939), float3(0.13879, 0.39446, 0.816731), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.764354, 0.760504, 0.839782), an), brushb(uv, float3(0.256463, 0.261625, 1), float3(0.543824, 0.0835655, 0.921462), an, iTime));
    col = mix(col, color(float3(0.375902, 0.875258, 0.598752), float3(1, 1, 1), an), brushb(uv, float3(0.0123918, 0.939951, 1), float3(0.193548, 0.668285, 0.954614), an, iTime));
    col = mix(col, color(float3(1, 1, 0.927874), float3(0, 0, 0.103004), an), brushb(uv, float3(0.268197, 1, 0.108524), float3(0.155106, 0.386616, 0.650752), an, iTime));
    col = mix(col, color(float3(0.886843, 0.871092, 1), float3(0.791619, 0.412412, 0.321717), an), brushb(uv, float3(1, 1, 1), float3(0.243238, 0.621388, 0.749683), an, iTime));
    col = mix(col, color(float3(0, 0.771464, 0.952304), float3(0.734954, 0.526305, 0.471348), an), brushb(uv, float3(0.802554, 0.688423, 0.589849), float3(0.229058, 0.227882, 1), an, iTime));
    col = mix(col, color(float3(0, 0.424005, 0.941867), float3(0.910633, 1, 0.387009), an), brushb(uv, float3(0.605434, 0.627513, 0.687601), float3(0.494252, 0.488977, 0.621117), an, iTime));
    col = mix(col, color(float3(0.265923, 0.986817, 0.527949), float3(0.468939, 0.0788594, 0), an), brushb(uv, float3(0.465696, 0.92456, 0.90053), float3(0.325499, 0.647054, 0.47485), an, iTime));
    col = mix(col, color(float3(0.471006, 0.575558, 0.841954), float3(1, 0.868268, 0.744168), an), brushb(uv, float3(0.565312, 0.96019, 0.773479), float3(0.215068, 0.564193, 0.937904), an, iTime));
    col = mix(col, color(float3(0.00029266, 0, 0), float3(0.599748, 0, 0), an), brushb(uv, float3(0.240224, 0.216845, 0.914434), float3(0.796823, 0.444648, 0.380387), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.996906, 0.624456, 0.550654), an), brushb(uv, float3(0.170227, 0.243554, 1), float3(0.419954, 0.530573, 1), an, iTime));
    col = mix(col, color(float3(0, 1, 1), float3(0.273646, 0.52718, 0.400924), an), brushb(uv, float3(0.804634, 0.614267, 0.781571), float3(0, 0.471636, 0.728911), an, iTime));
    col = mix(col, color(float3(0.108739, 0.924609, 1), float3(0.700543, 0.752372, 0.493653), an), brushb(uv, float3(0.8036, 0.691886, 0.599537), float3(0.737045, 0.417684, 0.953265), an, iTime));
    col = mix(col, color(float3(0, 0.73689, 1), float3(0, 0.229017, 0.708367), an), brushb(uv, float3(0.576498, 0.622902, 0.697461), float3(0.745964, 0.285041, 0.811691), an, iTime));
    col = mix(col, color(float3(1, 0.277933, 0.934839), float3(0.229284, 0.262476, 0.0730934), an), brushb(uv, float3(1, 0, 1), float3(0.150426, 0.37332, 0.997196), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.607414, 0.468106, 0), an), brushb(uv, float3(0.23595, 0.211611, 0.895612), float3(0.902319, 0.829272, 0.79747), an, iTime));
    col = mix(col, color(float3(0, 0.81299, 0.944563), float3(0.790975, 1, 1), an), brushb(uv, float3(0.848143, 0.603802, 0.869734), float3(0.0531498, 0.139734, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.581686, 0.362123), an), brushb(uv, float3(0.395978, 0.580766, 0.635025), float3(0.254128, 0.322541, 0.948632), an, iTime));
    col = mix(col, color(float3(0.0173575, 0, 0), float3(1, 0.612448, 0.549687), an), brushb(uv, float3(0.557782, 0.269162, 1), float3(0.451685, 0.60832, 0.771564), an, iTime));
    col = mix(col, color(float3(0.184237, 0.958816, 1), float3(0.102086, 1, 0.302108), an), brushb(uv, float3(0.957932, 0.616548, 0.79532), float3(0.802837, 0.347451, 0.55563), an, iTime));
    col = mix(col, color(float3(1, 0.841683, 0.75702), float3(0.257538, 0.104747, 0.22764), an), brushb(uv, float3(0.294688, 0.893108, 0.319143), float3(0.958995, 0.882929, 0.650627), an, iTime));
    col = mix(col, color(float3(0, 0.763363, 0.947365), float3(1, 0.772326, 0.725657), an), brushb(uv, float3(0.687413, 0.625367, 0.555961), float3(0.426521, 0.432478, 0.981604), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.24633, 0, 0.189987), an), brushb(uv, float3(0.248659, 0.211242, 0.872067), float3(0.906523, 1, 0.738078), an, iTime));
    col = mix(col, color(float3(0.912987, 0.923564, 0.847733), float3(0.420367, 0.941833, 1), an), brushb(uv, float3(0.296343, 0.666541, 0.615264), float3(0.731723, 0.238791, 0.701254), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.593382, 0.603923, 0.661048), an), brushb(uv, float3(0.949396, 0.554522, 0.945155), float3(0.464857, 0.175025, 1), an, iTime));
    col = mix(col, color(float3(0.454461, 0.742536, 0.0835909), float3(0.935542, 0.928858, 0.35973), an), brushb(uv, float3(0.291447, 0.895842, 0.449531), float3(0.743392, 0.0996446, 0.951641), an, iTime));
    col = mix(col, color(float3(0.950816, 0.962072, 0.882615), float3(0.0305647, 0.029888, 0.183266), an), brushb(uv, float3(0.98142, 0.998232, 0.546798), float3(0.964753, 0.785379, 0.34393), an, iTime));
    col = mix(col, color(float3(0.259061, 0.822742, 0.908887), float3(0.932604, 0.795472, 0.268807), an), brushb(uv, float3(0.590412, 1, 1), float3(0.351809, 0.705123, 0.959744), an, iTime));
    col = mix(col, color(float3(0, 0.203058, 0.905262), float3(0, 0, 0), an), brushb(uv, float3(0.0104963, 0.496351, 1), float3(0.678383, 0.407453, 0.174627), an, iTime));
    col = mix(col, color(float3(0.947016, 0.884456, 0.78422), float3(0.926748, 0.934883, 0.0163357), an), brushb(uv, float3(0.641784, 0.462755, 0.794741), float3(0.969462, 0.788168, 0.823563), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.20864, 1, 0.979429), an), brushb(uv, float3(0.704257, 0.250682, 0.843137), float3(0.76089, 0.367144, 0.393259), an, iTime));
    col = mix(col, color(float3(0, 0.685434, 0.989588), float3(0.300015, 0.846803, 0), an), brushb(uv, float3(0.653299, 0.616362, 0.625489), float3(0.900726, 0.915102, 0.82558), an, iTime));
    col = mix(col, color(float3(0, 0.72227, 0.868349), float3(0.00116981, 0, 0), an), brushb(uv, float3(0.721611, 0.597198, 1), float3(0.304491, 0.848182, 0.986869), an, iTime));
    col = mix(col, color(float3(0.204518, 0.171155, 0.194044), float3(1, 1, 1), an), brushb(uv, float3(0.777348, 0.246791, 1), float3(0.540161, 0.582791, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.159853, 0.0479362, 0), an), brushb(uv, float3(0.285805, 0.895769, 0.0841703), float3(0.885047, 0.282137, 0.22909), an, iTime));
    col = mix(col, color(float3(0, 0.916068, 1), float3(0.00233807, 0, 0), an), brushb(uv, float3(0.733629, 0.662239, 0.559887), float3(0.166261, 0.945575, 0.279579), an, iTime));
    col = mix(col, color(float3(0.845473, 0.959246, 0.513672), float3(0.815437, 0.870364, 0.93717), an), brushb(uv, float3(0.80859, 0.481081, 0.811341), float3(0.262714, 0.780841, 0.96373), an, iTime));
    col = mix(col, color(float3(0, 0.895353, 0.929072), float3(1, 1, 0.954913), an), brushb(uv, float3(0.921868, 0.734707, 0.6273), float3(0.430985, 0.48528, 0.735393), an, iTime));
    col = mix(col, color(float3(0.955141, 0.967584, 0.925542), float3(0.968706, 1, 1), an), brushb(uv, float3(0.580132, 1, 0.240426), float3(0.537352, 0.277852, 1), an, iTime));
    col = mix(col, color(float3(0.89237, 0.932978, 0.904442), float3(1, 0.748963, 0.720199), an), brushb(uv, float3(0.607334, 0.463214, 0.849035), float3(0.386009, 0.328527, 0.640333), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.768681, 0.565558, 0.136764), an), brushb(uv, float3(0.149402, 0.24, 1), float3(0.945006, 0.651649, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0.0409953), an), brushb(uv, float3(0, 0.944713, 0.108385), float3(0.743782, 0.264444, 0.221448), an, iTime));
    col = mix(col, color(float3(0.667954, 0.621317, 0.533458), float3(0.0296813, 0.0585288, 0.170166), an), brushb(uv, float3(0.471055, 0.92118, 1), float3(0.93032, 0.6611, 0.247599), an, iTime));
    col = mix(col, color(float3(1, 1, 0.990802), float3(0.591919, 0.556639, 0.602073), an), brushb(uv, float3(0.665553, 0.560198, 1), float3(0.315552, 0.640113, 0.819234), an, iTime));
    col = mix(col, color(float3(0.736463, 0.699581, 0.149311), float3(0.168822, 0.369537, 0.185278), an), brushb(uv, float3(0.461013, 0.913197, 0.834385), float3(1, 0.927163, 0.282126), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.092375, 0), an), brushb(uv, float3(0.866232, 0.162689, 0.804447), float3(0.772169, 0.11713, 0.824942), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.689576, 0.743071, 0.731132), an), brushb(uv, float3(0.658265, 0.285145, 1), float3(0.469713, 0.0517517, 0.629275), an, iTime));
    col = mix(col, color(float3(0, 0.117318, 0.946655), float3(0.0682296, 0.0582664, 0.470062), an), brushb(uv, float3(0.0130933, 0.561522, 1), float3(0.740999, 0.0809373, 0.3707), an, iTime));
    col = mix(col, color(float3(0, 0.961917, 0.993067), float3(0, 0, 0), an), brushb(uv, float3(0.974489, 0.762724, 1), float3(0.709671, 0.929378, 0.248839), an, iTime));
    col = mix(col, color(float3(0.0668054, 0.0543097, 0.0544558), float3(0.187618, 0, 0), an), brushb(uv, float3(0.336177, 0.268181, 1), float3(0.156202, 0.390548, 0.625508), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.387573, 0, 0.651206), an), brushb(uv, float3(0.42819, 0.248713, 0.967271), float3(0.928589, 0.902355, 0.641935), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.714717, 0.205287, 0.365334), an), brushb(uv, float3(0.630382, 0.556621, 1), float3(0.690148, 0.103602, 0.901071), an, iTime));
    col = mix(col, color(float3(0.0860537, 0.958369, 1), float3(0.220464, 0, 0.330483), an), brushb(uv, float3(0.932922, 0.720741, 0.568214), float3(0.975665, 0.78058, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.9528), float3(0, 0, 0), an), brushb(uv, float3(0.581476, 0.948209, 0.211122), float3(0.627049, 0.937419, 0.189261), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.846137, 0.719958), an), brushb(uv, float3(1, 1, 0.399325), float3(0.499105, 0.399236, 1), an, iTime));
    col = mix(col, color(float3(0.749367, 0.376229, 0.505538), float3(1, 1, 1), an), brushb(uv, float3(0.795614, 0.490442, 0.864428), float3(0.18818, 0.652339, 0.860938), an, iTime));
    col = mix(col, color(float3(0, 0.0356332, 1), float3(0.314965, 0.350149, 0.409438), an), brushb(uv, float3(0.0273716, 0.528971, 0.770672), float3(0.375484, 0.81469, 1), an, iTime));
    col = mix(col, color(float3(0.94325, 0.922293, 0.860102), float3(0, 0, 0), an), brushb(uv, float3(0.63054, 0.932011, 0.429796), float3(0.224244, 0.834999, 0.608371), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.053529, 0.010072, 0.371462), float3(0.405378, 0.878886, 0.605916), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.0465083, 0, 0), an), brushb(uv, float3(0.422195, 0.193788, 1), float3(0.248328, 0, 0.662968), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.390323, 0.84967), an), brushb(uv, float3(1, 0.0727853, 0.247157), float3(0.414108, 0.587607, 0.843822), an, iTime));
    col = mix(col, color(float3(0.971792, 0.907209, 0.872794), float3(0, 0, 0), an), brushb(uv, float3(0.598416, 0.476133, 1), float3(0.834355, 0.674424, 0.182139), an, iTime));
    col = mix(col, color(float3(0.00230736, 0.233099, 0.580617), float3(0.278073, 0.248641, 1), an), brushb(uv, float3(0.0552717, 0.517778, 0.993329), float3(0.974302, 0.418338, 0.800854), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.977982, 0.513583, 0.21412), an), brushb(uv, float3(0.613647, 0.19808, 1), float3(0.314604, 0.511775, 0.732392), an, iTime));
    col = mix(col, color(float3(0, 0.446925, 0.985113), float3(0.997616, 0.36316, 0.0190673), an), brushb(uv, float3(0.204588, 0.563171, 1), float3(0.416014, 0.599269, 0.931611), an, iTime));
    col = mix(col, color(float3(1, 1, 0.988949), float3(0.496581, 0.0561629, 0.153928), an), brushb(uv, float3(0.122064, 0.0314192, 0.286459), float3(0.697933, 0.331062, 0.522016), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.416938, 0.259072, 1), float3(0.174492, 0.438433, 1), an, iTime));
    col = mix(col, color(float3(0.141037, 0.196344, 0.168802), float3(0.0503634, 0.435679, 0.269319), an), brushb(uv, float3(0.122741, 0.253048, 1), float3(0.197416, 1, 0.92666), an, iTime));
    col = mix(col, color(float3(0.982982, 1, 0.94346), float3(0.188682, 0.489522, 0), an), brushb(uv, float3(0.729287, 0.444411, 0.380266), float3(0.899178, 0.483099, 0.840908), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.936292, 0.628778, 0.974268), an), brushb(uv, float3(0.850901, 0.142457, 0.553676), float3(0.718626, 0.350778, 0.665511), an, iTime));
    col = mix(col, color(float3(0.702554, 0.680764, 0.351789), float3(0.125041, 0.141511, 0), an), brushb(uv, float3(0.289228, 0.638584, 1), float3(0.85496, 0.899051, 0.930264), an, iTime));
    col = mix(col, color(float3(0.95508, 0.948844, 0.786643), float3(0.649711, 0.617668, 0.602851), an), brushb(uv, float3(0.606169, 0.473641, 0.942799), float3(0.224535, 0.739875, 0.98715), an, iTime));
    col = mix(col, color(float3(0, 0.0700662, 0.904728), float3(0.655467, 0.638964, 0.658374), an), brushb(uv, float3(0.0566809, 0.544298, 0.666775), float3(0.184173, 0.296758, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.861348, 0.853333, 0.909806), an), brushb(uv, float3(0.822449, 0.309167, 0.716114), float3(0.583144, 0.188703, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.372494, 0.10943, 0), an), brushb(uv, float3(0.461157, 0.916978, 0.156423), float3(0.781218, 0.33059, 0.202223), an, iTime));
    col = mix(col, color(float3(0.289507, 0.311753, 0.298479), float3(0, 0, 0), an), brushb(uv, float3(0.0983285, 0.273364, 1), float3(0.86688, 0.457223, 0.191639), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.106607, 0.0705119, 0), an), brushb(uv, float3(0.064538, 0.233346, 1), float3(0.724826, 0.351308, 0.188306), an, iTime));
    col = mix(col, color(float3(1, 1, 0.979846), float3(0.390489, 0.0463654, 0), an), brushb(uv, float3(0.873055, 0.471571, 0.400907), float3(0.884383, 0.397585, 0.639159), an, iTime));
    col = mix(col, color(float3(1, 1, 0.963805), float3(0.625533, 0.79954, 0.190989), an), brushb(uv, float3(0.919498, 0.535854, 0.58926), float3(1, 0.444853, 0.934175), an, iTime));
    col = mix(col, color(float3(1, 0.996732, 0.960203), float3(0, 0, 0), an), brushb(uv, float3(0.878645, 0.556239, 0.911447), float3(0.827195, 0.823376, 0.134206), an, iTime));
    col = mix(col, color(float3(0.925516, 0.955304, 1), float3(0.126513, 0.075875, 0.0231882), an), brushb(uv, float3(0.627264, 0.950611, 0.847526), float3(0.143124, 0.372595, 0.505536), an, iTime));
    col = mix(col, color(float3(0.873301, 0.891503, 0.672633), float3(0, 0.00691343, 0), an), brushb(uv, float3(0.612133, 0.460876, 0.825378), float3(0.13204, 0.631478, 0.983089), an, iTime));
    col = mix(col, color(float3(0.747341, 1, 0.619999), float3(0.973834, 0.00048871, 0.695233), an), brushb(uv, float3(0.295625, 0.62933, 0.967439), float3(0.916168, 1, 0.740923), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.213405, 0.0144935, 0), an), brushb(uv, float3(0.701744, 0.240614, 0.859346), float3(0.832749, 0.454736, 0.460781), an, iTime));
    col = mix(col, color(float3(0.00568739, 0.744617, 1), float3(1, 0.490606, 0.311793), an), brushb(uv, float3(0.510018, 0.611876, 0.915796), float3(0.23537, 0.358265, 0.865981), an, iTime));
    col = mix(col, color(float3(1, 1, 0.997526), float3(0.1957, 0.0687026, 0.00893486), an), brushb(uv, float3(0.440984, 0.145153, 0.668039), float3(0.112017, 0.37934, 0.39874), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.806542, 1, 1), an), brushb(uv, float3(0.900162, 0.535428, 0.45905), float3(0.443005, 0.190364, 0.686458), an, iTime));
    col = mix(col, color(float3(0.0692591, 0.862161, 1), float3(0, 0, 0), an), brushb(uv, float3(0.807298, 0.620823, 0.715686), float3(0.901125, 0.642552, 0.132437), an, iTime));
    col = mix(col, color(float3(0, 0.00025278, 0), float3(1, 0.750596, 0.498141), an), brushb(uv, float3(0.229185, 0.213638, 1), float3(0.434407, 0.245124, 0.874871), an, iTime));
    col = mix(col, color(float3(0, 1, 1), float3(0.555054, 0.479386, 0.436705), an), brushb(uv, float3(0.967308, 0.704093, 0.892245), float3(0.268962, 0.755923, 0.698354), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.399052, 0.255359, 0.927473), float3(0.225579, 0.885615, 0.510428), an, iTime));
    col = mix(col, color(float3(0.951452, 0.940687, 0.867905), float3(0.420582, 0.388449, 0.240546), an), brushb(uv, float3(0.259546, 0, 0.972683), float3(0.370107, 0.767303, 0.497871), an, iTime));
    col = mix(col, color(float3(1, 1, 0.994262), float3(0.964644, 0.49437, 0.810983), an), brushb(uv, float3(0.197188, 0.0109033, 0.389947), float3(1, 0.896242, 0.543222), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.910269, 0.245111, 1), float3(0.128557, 0.63051, 0.914674), an, iTime));
    col = mix(col, color(float3(0.223386, 0.874877, 1), float3(0, 0, 0), an), brushb(uv, float3(0.780114, 0.649041, 0.43927), float3(0.532751, 1, 0.186533), an, iTime));
    col = mix(col, color(float3(1, 0.843344, 0.354518), float3(0.0100909, 0, 0), an), brushb(uv, float3(0.995546, 0.014489, 0.949465), float3(0.0676193, 0.470394, 0.426794), an, iTime));
    col = mix(col, color(float3(0.417615, 0.714617, 1), float3(0, 0, 0), an), brushb(uv, float3(0.857707, 0.652469, 0.508144), float3(0.994919, 1, 0.0724031), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.723925, 0.201381, 1), float3(0.429455, 0.864036, 0.603302), an, iTime));
    col = mix(col, color(float3(0.994279, 0.991259, 1), float3(0, 0.0525553, 0), an), brushb(uv, float3(0.731595, 0.438975, 0.402381), float3(0.721191, 0.0694177, 0.233763), an, iTime));
    col = mix(col, color(float3(0.0619056, 0.0562076, 0.0877101), float3(0.523908, 0, 0.460848), an), brushb(uv, float3(0.633524, 0.270874, 1), float3(0.802302, 0.08302, 0.839782), an, iTime));
    col = mix(col, color(float3(0, 0.411754, 0.671784), float3(0.163332, 0.235844, 0.211143), an), brushb(uv, float3(0.376428, 0.596835, 1), float3(0.709751, 0.414829, 0.675024), an, iTime));
    col = mix(col, color(float3(0.153, 0.136387, 0.166879), float3(0.174767, 0.0444349, 0), an), brushb(uv, float3(0.122464, 0.208572, 1), float3(0.724364, 0.427251, 0.252099), an, iTime));
    col = mix(col, color(float3(0.940242, 0.927644, 0.932892), float3(0.923477, 0.497387, 0.427884), an), brushb(uv, float3(0.707869, 0.228659, 1), float3(0.40467, 0.354156, 0.729712), an, iTime));
    col = mix(col, color(float3(0.112721, 0.130818, 0.147313), float3(0.277927, 0.00970477, 0.224942), an), brushb(uv, float3(0.779229, 0.200418, 1), float3(0.945145, 0.452539, 0.897907), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.951326, 0.588783, 0.645298), an), brushb(uv, float3(0.30191, 0.54597, 0.893921), float3(0.381406, 0.629598, 0.853394), an, iTime));
    col = mix(col, color(float3(1, 0.996051, 1), float3(0, 0, 0), an), brushb(uv, float3(0.821781, 0.520288, 0.462681), float3(0.905906, 0.997612, 0.0901792), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.0353604, 0.114803, 0.392304), float3(0.124239, 0.867047, 0.252947), an, iTime));
    col = mix(col, color(float3(0, 0.322226, 0.990279), float3(0.6404, 0.746426, 0.721241), an), brushb(uv, float3(0.0198531, 0.556148, 0.909276), float3(0.551193, 0.237295, 0.896626), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.406985, 0, 0.526989), an), brushb(uv, float3(0.371383, 0.61824, 1), float3(1, 0.425621, 0.610821), an, iTime));
    col = mix(col, color(float3(1, 1, 0.988517), float3(0, 0, 0), an), brushb(uv, float3(0.46595, 0.667621, 0.704253), float3(0.277146, 0, 0.822422), an, iTime));
    col = mix(col, color(float3(0.911966, 1, 1), float3(0.0713717, 0, 0), an), brushb(uv, float3(1, 0, 0.8309), float3(0.227423, 0.278132, 0.47903), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 1, 0.935341), an), brushb(uv, float3(1, 0.323593, 0.463805), float3(0.197792, 0.636863, 0.887359), an, iTime));
    col = mix(col, color(float3(0.0735752, 0, 0.171052), float3(0.412168, 0.0954018, 0.40798), an), brushb(uv, float3(0.546138, 0.237224, 1), float3(0.39078, 0.697941, 0.321205), an, iTime));
    col = mix(col, color(float3(1, 1, 0.985203), float3(1, 0.530602, 0.293269), an), brushb(uv, float3(0.279038, 0.542709, 0.908754), float3(1, 0.465953, 0.946587), an, iTime));
    col = mix(col, color(float3(0, 0.843972, 0.988688), float3(1, 0.667749, 0.458803), an), brushb(uv, float3(0.760708, 0.60207, 0.944), float3(0.164419, 0.585346, 1), an, iTime));
    col = mix(col, color(float3(0.0984878, 0.801914, 1), float3(0, 0, 0), an), brushb(uv, float3(0.685136, 0.633476, 0.535158), float3(0.236714, 0.838977, 0.789166), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.00814601, 0, 0), an), brushb(uv, float3(0.598164, 0.224017, 1), float3(0.120812, 0.483607, 0.78355), an, iTime));
    col = mix(col, color(float3(1, 1, 0.951076), float3(0.792486, 0.51184, 0.605898), an), brushb(uv, float3(0.785599, 0.484223, 0.370427), float3(0.430452, 0.102764, 0.92974), an, iTime));
    col = mix(col, color(float3(0, 0.371501, 1), float3(0.838506, 0.886916, 1), an), brushb(uv, float3(0.0405375, 0.533497, 0.676094), float3(0.358923, 0.161026, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.919509, 0.710911), an), brushb(uv, float3(0.573686, 0.284999, 1), float3(0.508814, 0.450658, 0.834975), an, iTime));
    col = mix(col, color(float3(0.934369, 0.929004, 0.958585), float3(0.810502, 0.111299, 0.0426071), an), brushb(uv, float3(0.244553, 0.250097, 1), float3(1, 0.898779, 0.98156), an, iTime));
    col = mix(col, color(float3(1, 0.951396, 0.586637), float3(0.68229, 0.837782, 0.822004), an), brushb(uv, float3(0.296594, 0.632716, 0.874573), float3(0.390726, 0.100645, 0.831804), an, iTime));
    col = mix(col, color(float3(0.0522555, 0.0822069, 0.0738726), float3(0.305412, 0.144801, 0.0677508), an), brushb(uv, float3(0.89003, 0.19469, 1), float3(0.911991, 0.858945, 0.92979), an, iTime));
    col = mix(col, color(float3(0.213647, 0.940002, 1), float3(1, 0.630507, 0.634843), an), brushb(uv, float3(0.87986, 0.712634, 0.692991), float3(0.317747, 0.506758, 0.597269), an, iTime));
    col = mix(col, color(float3(0.192, 0.938123, 1), float3(1, 0.828091, 0.796364), an), brushb(uv, float3(0.91599, 0.669721, 0.440365), float3(0.503227, 0.475463, 0.72148), an, iTime));
    col = mix(col, color(float3(0.190468, 0.865981, 1), float3(0.0150037, 0, 0), an), brushb(uv, float3(0.724928, 0.636023, 0.469117), float3(0.201369, 0, 0.679137), an, iTime));
    col = mix(col, color(float3(1, 0, 0.888392), float3(0.873626, 0.863516, 0.870692), an), brushb(uv, float3(0.848493, 0.649818, 1), float3(0.509642, 0.330479, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.514734, 0.465874, 0.644275), an), brushb(uv, float3(1, 1, 0.323714), float3(0.75269, 0.0642828, 0.556183), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.90965, 0.846425), an), brushb(uv, float3(0.637091, 0.313407, 0.765253), float3(0.487322, 0.622975, 0.534614), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.33344, 0.278125, 0.28522), an), brushb(uv, float3(0.379743, 0.557267, 0.90508), float3(0.34618, 0.798005, 0.601122), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.039412, 0, 0), an), brushb(uv, float3(1, 0.0241892, 0.219784), float3(0.244148, 0.973883, 0.581705), an, iTime));
    col = mix(col, color(float3(1, 1, 0.99705), float3(0.25909, 0.24114, 0.055975), an), brushb(uv, float3(0.556629, 0.340876, 0.889816), float3(1, 0.404018, 0.904612), an, iTime));
    col = mix(col, color(float3(0.723157, 0.77907, 0.474409), float3(0.686982, 0.653257, 0.758482), an), brushb(uv, float3(0.635484, 0.947082, 0.985399), float3(0.378073, 0.0813012, 0.601205), an, iTime));
    col = mix(col, color(float3(1, 0.994682, 0.98515), float3(1, 0.815701, 0.590894), an), brushb(uv, float3(0.723698, 1, 0.739516), float3(0.204186, 0.48723, 0.590504), an, iTime));
    col = mix(col, color(float3(0, 0.552583, 0.878355), float3(0.787364, 0.83766, 0.847284), an), brushb(uv, float3(0.407457, 0.600318, 1), float3(0.18551, 0.263355, 1), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.596217, 0.212421, 1), float3(0.251404, 0.0193406, 0.810478), an, iTime));
    col = mix(col, color(float3(0, 0.433632, 1), float3(0.888927, 0.904262, 0.986497), an), brushb(uv, float3(0.105083, 0.549717, 0.702224), float3(0.559665, 0.22602, 0.960192), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.857698, 0.740566), an), brushb(uv, float3(0.807675, 0.219869, 1), float3(0.48578, 0.370724, 0.967006), an, iTime));
    col = mix(col, color(float3(0, 0.794265, 1), float3(0.150079, 0.156372, 0.152756), an), brushb(uv, float3(0.606545, 0.630235, 0.650569), float3(0.0939478, 0.131274, 0.558789), an, iTime));
    col = mix(col, color(float3(1, 1, 0.993416), float3(0.813577, 0.727309, 0.0464367), an), brushb(uv, float3(0.384123, 0.0452578, 0.355671), float3(1, 0.874188, 0.730369), an, iTime));
    col = mix(col, color(float3(0.998482, 1, 1), float3(1, 0.642247, 0.851075), an), brushb(uv, float3(0.34111, 0.244581, 1), float3(0.42105, 0.61861, 0.663954), an, iTime));
    col = mix(col, color(float3(0, 0.605982, 0.943232), float3(0.0229902, 0.0715466, 0.317127), an), brushb(uv, float3(0.440968, 0.601119, 1), float3(1, 0.413909, 0.958597), an, iTime));
    col = mix(col, color(float3(1, 1, 0.980748), float3(0, 0, 0), an), brushb(uv, float3(0.75319, 0.550886, 0.694441), float3(0.266186, 0, 0.606382), an, iTime));
    col = mix(col, color(float3(0.0433174, 0.062137, 0.0586713), float3(0.0231595, 0.0546732, 0.0605258), an), brushb(uv, float3(0.783358, 0.273606, 1), float3(0.360515, 0, 0.21801), an, iTime));
    col = mix(col, color(float3(1, 0.996666, 1), float3(1, 0.618806, 0.547857), an), brushb(uv, float3(0.450437, 0.131206, 0.569577), float3(0.230744, 0.479378, 0.599499), an, iTime));
    col = mix(col, color(float3(0.0562586, 0.684032, 0.988336), float3(0.291387, 0.0643189, 0.0430313), an), brushb(uv, float3(0.483474, 0.60449, 1), float3(0.843259, 0.39389, 0.275116), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.810685, 1, 0.911341), an), brushb(uv, float3(0.79832, 0.202967, 1), float3(0.498177, 0.722541, 0.838031), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.417104, 0.254906, 0.912095), float3(0.32699, 0, 0.899617), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.537554, 0.216016, 0.143333), an), brushb(uv, float3(0.431615, 0.141947, 0.766524), float3(0.282062, 0.634948, 0.456887), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.128485, 0.556607, 0.318726), an), brushb(uv, float3(0.3843, 0.624329, 0.862517), float3(0.776988, 0.0774658, 0.45074), an, iTime));
    col = mix(col, color(float3(1, 1, 0.997998), float3(0.809081, 0.884592, 0.92549), an), brushb(uv, float3(0.711835, 0.565226, 1), float3(0.575638, 0.202737, 1), an, iTime));
    col = mix(col, color(float3(0.887507, 0.916693, 0.89864), float3(0.0428394, 0.052881, 0.0316538), an), brushb(uv, float3(0.617148, 0.219102, 1), float3(0.0204179, 0.231269, 0.242027), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.00122143, 0, 0), an), brushb(uv, float3(0.0353207, 0.230295, 0.982017), float3(1, 0.424578, 0.294685), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.577088, 0.55086), an), brushb(uv, float3(0.859002, 0.228418, 1), float3(0.349922, 0.343126, 0.66774), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0.839492, 0.418004), an), brushb(uv, float3(0.342652, 0.227387, 1), float3(0.936065, 0.838007, 0.932619), an, iTime));
    col = mix(col, color(float3(1, 1, 0.990624), float3(1, 0.438599, 0.301303), an), brushb(uv, float3(0.58849, 0.466382, 0.270279), float3(0.409671, 0.236421, 0.625833), an, iTime));
    col = mix(col, color(float3(0.0041986, 0, 0), float3(0.640031, 0.292393, 0.227027), an), brushb(uv, float3(0.489733, 0.266975, 1), float3(0.27147, 0.336423, 0.811994), an, iTime));
    col = mix(col, color(float3(0, 0.446967, 0.967032), float3(0.124438, 0.029502, 0.0222524), an), brushb(uv, float3(0.184346, 0.560118, 0.874189), float3(0.722435, 0.446838, 0.463626), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.892982, 0.830346, 0.777084), an), brushb(uv, float3(0.257083, 0.223071, 0.938636), float3(0.271379, 0.180403, 1), an, iTime));
    col = mix(col, color(float3(0.995156, 0.994597, 0.988094), float3(0.93836, 0.572381, 0.439674), an), brushb(uv, float3(0.954958, 0.891903, 0.500187), float3(0.498072, 0.67923, 0.622957), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.0907605, 0.835485, 0.0567083), an), brushb(uv, float3(0.378976, 0.634004, 0.676341), float3(1, 0.468276, 0.914066), an, iTime));
    col = mix(col, color(float3(0.0187274, 0, 0), float3(0, 0, 0), an), brushb(uv, float3(0.0681575, 0.203879, 1), float3(1, 0.460278, 0.05), an, iTime));
    col = mix(col, color(float3(0.258963, 0.964086, 0.994205), float3(0.43861, 0.362677, 0.339517), an), brushb(uv, float3(0.948017, 0.72594, 0.663179), float3(0.284926, 0.783807, 0.773206), an, iTime));
    col = mix(col, color(float3(0.755322, 0.752954, 0.755533), float3(0.0705698, 0.133608, 0.228904), an), brushb(uv, float3(0.792409, 0.218019, 1), float3(0.499081, 0.109727, 1), an, iTime));
    col = mix(col, color(float3(0.176796, 0.791872, 0.985307), float3(0.156763, 0.479228, 0.374587), an), brushb(uv, float3(0.604209, 0.623578, 0.687553), float3(0.812397, 0.0805264, 0.840345), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.251567, 0, 0.36394), float3(0.951146, 0.846778, 0.123637), an, iTime));
    col = mix(col, color(float3(1, 0.946473, 0.881703), float3(0.899677, 0.863553, 0.84187), an), brushb(uv, float3(0.644473, 0.936762, 0.751626), float3(0.216979, 0.68819, 0.769692), an, iTime));
    col = mix(col, color(float3(0, 0, 0.0165937), float3(1, 0.749037, 0.674716), an), brushb(uv, float3(0.597459, 0.271684, 1), float3(0.435471, 0.417806, 0.943417), an, iTime));
    col = mix(col, color(float3(0.812855, 1, 0.977054), float3(0, 0, 0), an), brushb(uv, float3(0.800209, 0, 0.724734), float3(1, 0.896641, 0.0684494), an, iTime));
    col = mix(col, color(float3(0.96402, 0.927817, 0.62564), float3(0.920051, 0.553558, 0.555514), an), brushb(uv, float3(0.623364, 0.940513, 0.87608), float3(0.471453, 0.482923, 0.431786), an, iTime));
    col = mix(col, color(float3(1, 1, 0.981455), float3(0.660363, 0.824246, 0.763639), an), brushb(uv, float3(0.667805, 0.730168, 0.67576), float3(0.533105, 0.624334, 0.836828), an, iTime));
    col = mix(col, color(float3(0.92147, 0.945235, 0.95683), float3(0.818461, 0.84255, 0.846804), an), brushb(uv, float3(0.887386, 0.251611, 1), float3(0.524254, 0.299741, 1), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0.504789, 0.50773, 0.584431), an), brushb(uv, float3(0.55026, 0.254073, 1), float3(0.549204, 0.0559513, 0.68293), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.635879, 0.579692, 0.702461), an), brushb(uv, float3(0.777704, 0.318891, 0.656167), float3(0.529776, 0.110862, 1), an, iTime));
    col = mix(col, color(float3(0.00258321, 0.473528, 1), float3(0.752425, 0.9684, 1), an), brushb(uv, float3(0.071758, 0.540521, 0.652221), float3(0.778008, 0.066821, 0.725733), an, iTime));
    col = mix(col, color(float3(0.779503, 0.805841, 0.816432), float3(0, 0, 0), an), brushb(uv, float3(0.242673, 0.215719, 1), float3(0.0397813, 0.128056, 0.209404), an, iTime));
    col = mix(col, color(float3(0, 0.453455, 1), float3(0, 0, 0), an), brushb(uv, float3(0.139916, 0.55383, 0.696748), float3(0.206185, 0.969916, 0.143199), an, iTime));
    col = mix(col, color(float3(0, 0.751401, 0.965996), float3(0.978064, 0.883334, 1), an), brushb(uv, float3(0.2991, 0.590708, 1), float3(0.452802, 0.662922, 0.378899), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.975386, 0.782137, 0.633593), an), brushb(uv, float3(0.63225, 0.941864, 0.171952), float3(0.322612, 0.219296, 1), an, iTime));
    col = mix(col, color(float3(1, 0.979222, 1), float3(0.916795, 1, 1), an), brushb(uv, float3(0.30676, 0.612189, 0.751226), float3(0.365135, 0.17897, 0.707687), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(1, 0.594679, 0.436387), an), brushb(uv, float3(0.07258, 0.263501, 1), float3(0.359528, 0.211334, 0.698331), an, iTime));
    col = mix(col, color(float3(1, 1, 0.988928), float3(0.25786, 0, 0.199594), an), brushb(uv, float3(0.410906, 0.66377, 0.452026), float3(0.0248554, 0.434324, 0.726533), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(1, 0.835893, 0.720584), an), brushb(uv, float3(0.58184, 0.30116, 1), float3(0.30125, 0.395506, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.985648), float3(0.717059, 0.532257, 0.431681), an), brushb(uv, float3(0.303898, 0.644473, 0.445154), float3(0.530693, 0.588723, 1), an, iTime));
    col = mix(col, color(float3(0, 0, 0), float3(0, 0.0277794, 0), an), brushb(uv, float3(0.398709, 0.257644, 0.917276), float3(0, 0.420529, 0.319046), an, iTime));
    col = mix(col, color(float3(1, 1, 0.988195), float3(0.0728831, 0.00437592, 0.0243227), an), brushb(uv, float3(0.144574, 0.614127, 0.891807), float3(0.784882, 0.0668264, 0.263484), an, iTime));
    col = mix(col, color(float3(0.121448, 0.993158, 1), float3(0.44524, 0.516209, 0.524139), an), brushb(uv, float3(0.849692, 0.648574, 0.40115), float3(0.533283, 0.102682, 0.916213), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.575899, 0.253795, 1), float3(0.753705, 0, 0.15635), an, iTime));
    col = mix(col, color(float3(0, 3.52391e-06, 0), float3(0.0321168, 0.0343026, 0.0454298), an), brushb(uv, float3(0.692439, 0.20333, 1), float3(0.508956, 0, 0.245119), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.70831, 0.196542, 1), float3(0.858307, 0.0172792, 0.142589), an, iTime));
    col = mix(col, color(float3(0, 0.521508, 0.937682), float3(0.384545, 0.310393, 0.307877), an), brushb(uv, float3(0.265566, 0.576165, 1), float3(0.469086, 0.76635, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.979846), float3(0.646361, 0.403257, 0.437478), an), brushb(uv, float3(0.580371, 0.68551, 0.958255), float3(0.484881, 0.715216, 0.670063), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.278547, 0.230116, 0.231311), an), brushb(uv, float3(0.847443, 0.00706338, 0.278857), float3(0.399605, 0.801924, 0.970453), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.513503, 0.242003, 0.880825), float3(0.284775, 0.873951, 0.718549), an, iTime));
    col = mix(col, color(float3(0.163896, 0.129926, 0.140055), float3(0.414422, 0.495403, 0.515398), an), brushb(uv, float3(0.13608, 0.270379, 1), float3(0.433883, 0.107913, 0.996822), an, iTime));
    col = mix(col, color(float3(0.173975, 0.176611, 0.208415), float3(0.550499, 0.586822, 0.601081), an), brushb(uv, float3(0.479914, 0.235826, 1), float3(0.492109, 0.122097, 0.621584), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.268217, 0.61215, 0.81161), float3(0.571242, 0.707684, 0.922309), an, iTime));
    col = mix(col, color(float3(1, 1, 0.996556), float3(0.00358684, 0, 0), an), brushb(uv, float3(0.666367, 0.555138, 0.807525), float3(0, 0.464463, 0.0656289), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.645397, 0.458248, 0.31084), float3(0.179467, 0, 0.122604), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.938387, 0.594719, 0.409523), an), brushb(uv, float3(0.286522, 0.656214, 0.342418), float3(0.423391, 0.671461, 0.264768), an, iTime));
    col = mix(col, color(float3(0.0331623, 0.426936, 1), float3(0.0173242, 0.0267165, 0.0276973), an), brushb(uv, float3(0.060053, 0.545808, 0.642374), float3(0.619582, 0.0863341, 0.525777), an, iTime));
    col = mix(col, color(float3(0.0271759, 0.00794426, 0.0119761), float3(0.89776, 0.61229, 0.566133), an), brushb(uv, float3(0.637821, 0.238341, 1), float3(0.423479, 0.330157, 0.542709), an, iTime));
    col = mix(col, color(float3(0.193708, 0.856424, 0.997884), float3(0, 0, 0), an), brushb(uv, float3(0.660065, 0.633933, 0.592549), float3(0.18509, 0.966705, 0.165957), an, iTime));
    col = mix(col, color(float3(1, 1, 0.981856), float3(0.351633, 0.28594, 0.277215), an), brushb(uv, float3(0.847312, 0.556086, 0.841056), float3(0.427737, 0.786682, 0.934031), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0.758527, 0.896344, 0.935525), an), brushb(uv, float3(0.798847, 0.47667, 0.287872), float3(0.352309, 0.183952, 0.721989), an, iTime));
    col = mix(col, color(float3(0, 0.48904, 0.957168), float3(0.614945, 0.364761, 0.227282), an), brushb(uv, float3(0.233951, 0.568059, 1), float3(0.357644, 0.207667, 0.659658), an, iTime));
    col = mix(col, color(float3(0.927402, 0.964293, 0.965314), float3(0.583593, 0.622097, 0.647498), an), brushb(uv, float3(0.411762, 0.252234, 1), float3(0.597904, 0.169171, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.990046), float3(0.683944, 0.768194, 0.802877), an), brushb(uv, float3(0.902701, 0.791629, 0.816308), float3(0.544797, 0.256768, 1), an, iTime));
    col = mix(col, color(float3(1, 1, 0.98949), float3(0.854358, 0.579518, 0.506837), an), brushb(uv, float3(0.788355, 0.0191596, 0.32211), float3(0.516219, 0.62335, 0.695687), an, iTime));
    col = mix(col, color(float3(1, 1, 1), float3(0, 0, 0), an), brushb(uv, float3(0.781724, 0.753146, 0.883844), float3(0.552143, 0.750186, 0.647959), an, iTime));
    col = mix(col, color(float3(0.000413835, 0.372722, 1), float3(0.778886, 0.525488, 0.536994), an), brushb(uv, float3(0.0197735, 0.513269, 0.918162), float3(0.430714, 0.666642, 0.480672), an, iTime));
    col = mix(col, color(float3(0.131041, 0.79708, 1), float3(0.725192, 0.614927, 0.540867), an), brushb(uv, float3(0.540291, 0.615236, 0.772223), float3(0.409223, 0.200817, 0.378406), an, iTime));
    col = mix(col, color(float3(0.953921, 0.940782, 0.99597), float3(0.0311989, 0.000777119, 0), an), brushb(uv, float3(0.709772, 0.264416, 1), float3(0.554292, 0.450909, 1), an, iTime));
    fragColor = float4(col, 1);
}