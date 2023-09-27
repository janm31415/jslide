// Coffee & Tablet - @P_Malin

#define PI 3.141592654

//#define LOW_QUALITY


#define ENABLE_REFLECTIONS
#define ENABLE_FOG
#define ENABLE_SPECULAR
#define ENABLE_POINT_LIGHT
#define ENABLE_POINT_LIGHT_FLARE

#ifdef LOW_QUALITY

#define kRaymarchMatIter 32

#else

#define kRaymarchMatIter 128

#endif 
 
struct C_Ray
{
	float3 vOrigin;
	float3 vDir;
};

struct C_HitInfo
{
	float3 vPos;
	float fDistance;
	float3 vObjectId;
};

struct C_Material
{
	float3 cAlbedo;
	float fR0;
	float fSmoothness;
	float2 vParam;
};

float2 SinCos( float x )
{
	return float2(sin(x), cos(x));
}
	
float3 RotateX( float3 vPos, float2 vSinCos )
{
	return float3( vPos.x, vSinCos.y * vPos.y + vSinCos.x * vPos.z, -vSinCos.x * vPos.y + vSinCos.y * vPos.z);
}

float3 RotateY( float3 vPos, float2 vSinCos )
{
	return float3( vSinCos.y * vPos.x + vSinCos.x * vPos.z, vPos.y, -vSinCos.x * vPos.x + vSinCos.y * vPos.z );
}

float3 RotateZ( float3 vPos, float2 vSinCos )
{
	return float3( vSinCos.y * vPos.x + vSinCos.x * vPos.y, -vSinCos.x * vPos.x + vSinCos.y * vPos.y, vPos.z);
}
	
float3 RotateX( float3 vPos, float fAngle )
{
	return RotateX( vPos, SinCos(fAngle) );
}

float3 RotateY( float3 vPos, float fAngle )
{
	return RotateY( vPos, SinCos(fAngle) );
}
      
float3 RotateZ( float3 vPos, float fAngle )
{
	return RotateZ( vPos, SinCos(fAngle) );
}

float4 DistCombineUnion( float4 v1, float4 v2 )
{
	//if(v1.x < v2.x) return v1; else return v2;
	return mix(v1, v2, step(v2.x, v1.x));
}

float4 DistCombineIntersect( float4 v1, float4 v2 )
{
	return mix(v2, v1, step(v2.x,v1.x));
}

float4 DistCombineSubtract( float4 v1, float4 v2 )
{
	return DistCombineIntersect(v1, float4(-v2.x, v2.yzw));
}

float GetDistanceYZTorus( float3 p, float r1, float r2 )
{
	float2 q = float2(length(p.yz)-r1,p.x);
	return length(q)-r2;
}

float GetDistanceRoundedBox( float3 vPos, float3 vSize, float fRadius )
{
	float3 vClosest = max(min(vPos, vSize), -vSize);
	return length(vClosest - vPos) - fRadius;
}


float GetDistanceMug( float3 vPos )
{
	float fDistCylinderOutside = length(vPos.xz) - 1.0;
	float fDistCylinderInterior = length(vPos.xz) - 0.9;
	float fTop = vPos.y - 1.0;
       
	float r1 = 0.6;
	float r2 = 0.15;
	float2 q = float2(length(vPos.xy + float2(1.2, -0.1))-r1,vPos.z);
	float fDistHandle = length(q)-r2;
       
	float fDistMug = max(max(min(fDistCylinderOutside, fDistHandle), fTop), -fDistCylinderInterior);
	return fDistMug;
}

float GetDistanceCoffee( float3 vPos )
{
	float fTopCoffee = vPos.y - 0.7;
	float fDistCylinderCoffee = length(vPos.xz) - 0.95;
	
	float fDistCoffee = max(fTopCoffee, fDistCylinderCoffee);
	return fDistCoffee;
}

float4 GetDistanceTablet( float3 vPos )
{             
	float3 vBevelPos = vPos - float3(0.0, 1.71, 0.0);
	float r = 1.0;
	float fBevelDist = GetDistanceRoundedBox( vBevelPos, float3(1.5, 1.0, 2.0), r );

	float3 vCasePos = vPos - float3(0.0, 0.0, 0.0);
	float fCaseDist = GetDistanceRoundedBox( vCasePos, float3(1.5, 1.0, 2.0), 0.5 );

	float4 vResult = float4(max(fBevelDist, fCaseDist), 4.0, vPos.xz);
	
	float4 vScreenDist = float4(-vPos.y, 5.0, vPos.xz);
	vResult = DistCombineSubtract(vResult, vScreenDist);
       
	float4 vButtonDist = float4( length(vPos + float3(0.0, -0.25, 2.1)) - 0.3, 5.0, vPos.xz);
	vResult = DistCombineSubtract(vResult, vButtonDist);
	
	return vResult;
}

// result is x=scene distance y=material or object id; zw are material specific parameters (maybe uv co-ordinates)
float4 GetDistanceScene( float3 vPos )
{           
	float4 vResult = float4(10000.0, -1.0, 0.0, 0.0);
	
	float3 vMugDomain = vPos + float3(2.4, 0.0, -2.0);
	vMugDomain = RotateY(vMugDomain, 1.0);
	
	float4 vDistMug = float4( GetDistanceMug(vMugDomain), 2.0, atan2(vMugDomain.z,vMugDomain.x), vMugDomain.y);
	vResult = DistCombineUnion(vResult, vDistMug);
	
	float4 vDistCoffee = float4( GetDistanceCoffee(vMugDomain), 3.0, vMugDomain.xz);
	vResult = DistCombineUnion(vResult, vDistCoffee);
	
	float4 vDistFloor = float4(vPos.y + 1.0, 1.0, vPos.xz);
	vResult = DistCombineUnion(vResult, vDistFloor);
	
	float3 vTabletDomain = vPos;
	vTabletDomain += float3(-0.8, 0.7, 0.0);
	vTabletDomain = RotateY(vTabletDomain, -1.0);
	float4 vDistTablet = GetDistanceTablet(vTabletDomain);
	vResult = DistCombineUnion(vResult, vDistTablet);
	
	return vResult;
}
 
C_Material GetObjectMaterial( float3 vObjId, float3 vPos )
{
	C_Material mat;
	
	if(vObjId.x < 1.5)
	{
		// floor
		float4 cTextureSample = float4(0.8, 0.4, 0.8, 1.0);                    
		mat.fR0 = 0.02;
		mat.cAlbedo = cTextureSample.rgb * cTextureSample.rgb; // cheap gamma
		mat.fSmoothness = mat.cAlbedo.r;
	}
	else
	if(vObjId.x < 2.5)
	{
		// mug
		mat.fR0 = 0.05;
		mat.fSmoothness = 0.9;
		float2 vUV = vObjId.yz / float2(PI, -2.0) + float2(1.0, 0.5);
		vUV = clamp( vUV, 0.0, 1.0);
		vUV = (vUV / (float2(6.0,1.0)) - float2(0.0,0.0));
		float4 cTextureSample = float4(0.2, 0.8, 0.0, 1.0);
		float3 vColour = cTextureSample.rgb * cTextureSample.rgb;
		mat.cAlbedo = mix(float3(0.05, 0.35, 0.75), vColour, cTextureSample.a);
	}
	else
	if(vObjId.x < 3.5)
	{
		// coffee
		mat.fR0 = 0.01;
		mat.fSmoothness = 1.0;
		mat.cAlbedo = float3(0.5, 0.3, 0.2);
	}
	else
	if(vObjId.x < 4.5)
	{
		// tablet back
		mat.fR0 = 0.25;
		mat.fSmoothness = 0.0;
		mat.cAlbedo = float3(0.8, 0.8, 0.8);                            
	}
	else
	{
		// tablet screen
		mat.fR0 = 0.01;
		mat.fSmoothness = 1.0;                               
		mat.cAlbedo = float3(0.025);
	}
               	
	
	return mat;
}
 
float3 GetSkyGradient( float3 vDir )
{
	float fBlend = vDir.y * 0.5 + 0.5;
	return mix(float3(0.0, 0.0, 0.0), float3(1, 1, 1), fBlend);
}
 
float3 GetLightPos()
{
	float3 vLightPos = float3(0.0, 1.0, 3.0);

	return vLightPos;
}
 
float3 GetLightCol()
{
	return float3(32.0, 6.0, 1.0);
}

float3 GetAmbientLight(float3 vNormal)
{
	return GetSkyGradient(vNormal);
}
 
#define kFogDensity 0.025
void ApplyAtmosphere(thread float3& col, C_Ray ray, C_HitInfo intersection)
{
	#ifdef ENABLE_FOG
	// fog
	float fFogAmount = exp(intersection.fDistance * -kFogDensity);
	float3 cFog = GetSkyGradient(ray.vDir);
	col = mix(cFog, col, fFogAmount);
	#endif
	
	// glare from light (a bit hacky - use length of closest approach from ray to light)
	#ifdef ENABLE_POINT_LIGHT_FLARE
	float3 vToLight = GetLightPos() - ray.vOrigin;
	float fDot = dot(vToLight, ray.vDir);
	fDot = clamp(fDot, 0.0, intersection.fDistance);
	
	float3 vClosestPoint = ray.vOrigin + ray.vDir * fDot;
	float fDist = length(vClosestPoint - GetLightPos());
	col += GetLightCol() * 0.01/ (fDist * fDist);
	#endif      
}
 
float3 GetSceneNormal( float3 vPos )
{
	// tetrahedron normal
	float fDelta = 0.025;

	float3 vOffset1 = float3( fDelta, -fDelta, -fDelta);
	float3 vOffset2 = float3(-fDelta, -fDelta,  fDelta);
	float3 vOffset3 = float3(-fDelta,  fDelta, -fDelta);
	float3 vOffset4 = float3( fDelta,  fDelta,  fDelta);

	float f1 = GetDistanceScene( vPos + vOffset1 ).x;
	float f2 = GetDistanceScene( vPos + vOffset2 ).x;
	float f3 = GetDistanceScene( vPos + vOffset3 ).x;
	float f4 = GetDistanceScene( vPos + vOffset4 ).x;

	float3 vNormal = vOffset1 * f1 + vOffset2 * f2 + vOffset3 * f3 + vOffset4 * f4;

	return normalize( vNormal );
}
 
#define kRaymarchEpsilon 0.01
#define kRaymarchStartDistance 0.1
 
// This is an excellent resource on ray marching -> http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
void Raymarch( C_Ray ray, thread C_HitInfo& result, const float fMaxDist, const int maxIter )
{          
	result.fDistance = kRaymarchStartDistance;
	result.vObjectId.x = 0.0;
				    
	for(int i=0;i<=kRaymarchMatIter;i++)                
	{
		result.vPos = ray.vOrigin + ray.vDir * result.fDistance;
		float4 vSceneDist = GetDistanceScene( result.vPos );
		result.vObjectId = vSceneDist.yzw;
		
		// abs allows backward stepping - should only be necessary for non uniform distance functions
		if((abs(vSceneDist.x) <= kRaymarchEpsilon) || (result.fDistance >= fMaxDist) || (i > maxIter))
		{
			break;
		}                          	
		
		result.fDistance = result.fDistance + vSceneDist.x;      
	}
	
	
	if(result.fDistance >= fMaxDist)
	{
		result.vPos = ray.vOrigin + ray.vDir * result.fDistance;
		result.vObjectId.x = 0.0;
		result.fDistance = 1000.0;
	}
}
 
float GetShadow( float3 vPos, float3 vLightDir, float fLightDistance )
{
	C_Ray shadowRay;
	shadowRay.vDir = vLightDir;
	shadowRay.vOrigin = vPos;

	C_HitInfo shadowIntersect;
	Raymarch(shadowRay, shadowIntersect, fLightDistance, 32);
													     
	return step(0.0, shadowIntersect.fDistance) * step(fLightDistance, shadowIntersect.fDistance );           
}
 
// http://en.wikipedia.org/wiki/Schlick's_approximation
float Schlick( float3 vNormal, float3 vView, float fR0, float fSmoothFactor)
{
	float fDot = dot(vNormal, -vView);
	fDot = min(max((1.0 - fDot), 0.0), 1.0);
	float fDot2 = fDot * fDot;
	float fDot5 = fDot2 * fDot2 * fDot;
	return fR0 + (1.0 - fR0) * fDot5 * fSmoothFactor;
}
 
float GetDiffuseIntensity(float3 vLightDir, float3 vNormal)
{
	return max(0.0, dot(vLightDir, vNormal));
}
 
float GetBlinnPhongIntensity(C_Ray ray, C_Material mat, float3 vLightDir, float3 vNormal)
{            
	float3 vHalf = normalize(vLightDir - ray.vDir);
	float fNdotH = max(0.0, dot(vHalf, vNormal));

	float fSpecPower = exp2(4.0 + 6.0 * mat.fSmoothness);
	float fSpecIntensity = (fSpecPower + 2.0) * 0.125;

	return pow(fNdotH, fSpecPower) * fSpecIntensity;
}
 
// use distance field to evaluate ambient occlusion
float GetAmbientOcclusion(C_Ray ray, C_HitInfo intersection, float3 vNormal)
{
	float3 vPos = intersection.vPos;
	
	float fAmbientOcclusion = 1.0;
	
	float fDist = 0.0;
	for(int i=0; i<=5; i++)
	{
		fDist += 0.1;
	
		float4 vSceneDist = GetDistanceScene(vPos + vNormal * fDist);
	
		fAmbientOcclusion *= 1.0 - max(0.0, (fDist - vSceneDist.x) * 0.2 / fDist );                                    
	}
	
	return fAmbientOcclusion;
}

float3 GetObjectLighting(C_Ray ray, C_HitInfo intersection, C_Material material, float3 vNormal, float3 cReflection)
{
	float3 cScene ;
	
	float3 vSpecularReflection = float3(0.0);
	float3 vDiffuseReflection = float3(0.0);
	
	float fAmbientOcclusion = GetAmbientOcclusion(ray, intersection, vNormal);
	float3 vAmbientLight = GetAmbientLight(vNormal) * fAmbientOcclusion;
	
	vDiffuseReflection += vAmbientLight;
	
	vSpecularReflection += cReflection * fAmbientOcclusion;
		
	#ifdef ENABLE_POINT_LIGHT
	float3 vLightPos = GetLightPos();
	float3 vToLight = vLightPos - intersection.vPos;
	float3 vLightDir = normalize(vToLight);
	float fLightDistance = length(vToLight);
	
	float fAttenuation = 0.1 / (fLightDistance * fLightDistance);
	
	float fShadowBias = 0.1;              
	float fShadowFactor = GetShadow( intersection.vPos + vLightDir * fShadowBias, vLightDir, fLightDistance - fShadowBias );
	float3 vIncidentLight = GetLightCol() * fShadowFactor * fAttenuation;
	
	vDiffuseReflection += GetDiffuseIntensity( vLightDir, vNormal ) * vIncidentLight;                                                                                  
	vSpecularReflection += GetBlinnPhongIntensity( ray, material, vLightDir, vNormal ) * vIncidentLight;
	#endif // ENABLE_POINT_LIGHT
	
	vDiffuseReflection *= material.cAlbedo;

	// emmissive glow from screen
	if(intersection.vObjectId.x > 4.5)
	{
		float2 vScreenPos = intersection.vObjectId.zy * float2(-0.25, -0.3) + float2(0.54, 0.5);
	       
		// emissive brightness is 0 unless screen
		float2 vMul = step(vScreenPos, float2(1.0)) * step(float2(0.0), vScreenPos);
		float kScreenBrightness = 0.8;
		float fMul = vMul.x * vMul.y * kScreenBrightness;
		float3 cVideoColour = float3(0,0,0);
		vDiffuseReflection += cVideoColour * cVideoColour * fMul; // cheap gamma correction
	}
	
	
	#ifdef ENABLE_SPECULAR
	float fFresnel = Schlick(vNormal, ray.vDir, material.fR0, material.fSmoothness * 0.9 + 0.1);
	cScene = mix(vDiffuseReflection , vSpecularReflection, fFresnel);
	#else
	cScene = vDiffuseReflection;
	#endif
	
	return cScene;
}
 
float3 GetSceneColourSimple( C_Ray ray )
{
	C_HitInfo intersection;
	Raymarch(ray, intersection, 16.0, 32);
			     
	float3 cScene;
       
	if(intersection.vObjectId.x < 0.5)
	{
		cScene = GetSkyGradient(ray.vDir);
	}
	else
	{
		C_Material material = GetObjectMaterial(intersection.vObjectId, intersection.vPos);
		float3 vNormal = GetSceneNormal(intersection.vPos);
      
		// use sky gradient instead of reflection
		float3 cReflection = GetSkyGradient(reflect(ray.vDir, vNormal));
      
		// apply lighting
		cScene = GetObjectLighting(ray, intersection, material, vNormal, cReflection );
	}
       
	ApplyAtmosphere(cScene, ray, intersection);
       
	return cScene;
}
 
float3 GetSceneColour( C_Ray ray )
{                                                           
	C_HitInfo intersection;
	Raymarch(ray, intersection, 30.0, 256);
		     
	float3 cScene;
	
	if(intersection.vObjectId.x < 0.5)
	{
		cScene = GetSkyGradient(ray.vDir);
	}
	else
	{
		C_Material material = GetObjectMaterial(intersection.vObjectId, intersection.vPos);
		float3 vNormal = GetSceneNormal(intersection.vPos);
	

	
		float3 cReflection;
		#ifdef ENABLE_REFLECTIONS	
		{
			// get colour from reflected ray
			float fSepration = 0.05;
			C_Ray reflectRay;
			reflectRay.vDir = reflect(ray.vDir, vNormal);
			reflectRay.vOrigin = intersection.vPos + reflectRay.vDir * fSepration;
									       
			cReflection = GetSceneColourSimple(reflectRay);                                                                          
		}
		#else
		cReflection = GetSkyGradient(reflect(ray.vDir, vNormal));                               
		#endif
		// apply lighting
		cScene = GetObjectLighting(ray, intersection, material, vNormal, cReflection );
	}
	
	ApplyAtmosphere(cScene, ray, intersection);
	
	return cScene;
}
 
void GetCameraRay( float3 vPos, float3 vForwards, float3 vWorldUp, float2 fragCoord, thread C_Ray& ray, float3 iResolution)
{
	float2 vPixelCoord = fragCoord.xy;
	float2 vUV = ( vPixelCoord / iResolution.xy );
	float2 vViewCoord = vUV * 2.0 - 1.0;

	vViewCoord *= 0.75;
	
	float fRatio = iResolution.x / iResolution.y;

	vViewCoord.y /= fRatio;                            

	ray.vOrigin = vPos;

	float3 vRight = normalize(cross(vForwards, vWorldUp));
	float3 vUp = cross(vRight, vForwards);
	     
	ray.vDir = normalize( vRight * vViewCoord.x + vUp * vViewCoord.y + vForwards);         
}
 
void GetCameraRayLookat( float3 vPos, float3 vInterest, float2 fragCoord, thread C_Ray& ray, float3 iResolution)
{
	float3 vForwards = normalize(vInterest - vPos);
	float3 vUp = float3(0.0, 1.0, 0.0);

	GetCameraRay(vPos, vForwards, vUp, fragCoord, ray, iResolution);
}
 
float3 OrbitPoint( float fHeading, float fElevation )
{
	return float3(sin(fHeading) * cos(fElevation), sin(fElevation), cos(fHeading) * cos(fElevation));
}
 
float3 Tonemap( float3 cCol )
{
	return 1.0 - exp2(-cCol);
}
 
void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{
	C_Ray ray;
	
	float2 mouse = float2(0.5+0.01*sin(iTime*0.5), 0.5+0.01*cos(iTime*0.5));
	
		
	float3 vCameraPos = OrbitPoint(-mouse.x * 14.0 + PI, (mouse.y) * PI * 0.2 + PI * 0.025) * 7.0 - float3(0.0, 0.9+cos(iTime)*0.2, 0.0);
	
	GetCameraRayLookat( vCameraPos, float3(0.0, 0.0, 0.0), fragCoord, ray, iResolution);
	//GetCameraRayLookat(float3(0.0, 0.0, -5.0), float3(0.0, 0.0, 0.0), ray);
	
	float3 cScene = GetSceneColour( ray );	
	
	float fExposure = 2.5;
	cScene = cScene * fExposure;
	float3 cCurr = Tonemap(cScene );
	
	float3 cFinal = cCurr;
	
	float fAlpha = 1.0;

	
	fragColor = float4( cFinal, fAlpha );    
}