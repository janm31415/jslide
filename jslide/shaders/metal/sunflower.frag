

#define smoothing      0.006
#define TWO_PI 6.28318530718
#define lineSize       0.01
#define skyColor  float3(101., 164., 208.)/255.
#define skyButton float3(178., 208., 232.)/255.
#define MountainsLayerOneCol float3(50., 118., 165.)/255.
#define MountainsLayerTwoCol float3(46., 94., 130.)/255.
#define MountainLayerThreecol float3(26., 65., 74.)/255.
#define MountainLayerFourCol float3(14., 49., 55.)/255.
#define SunflowerInsideOne    float3(203., 77., 23.)/255.
#define SunflowerInsideTwo    float3(134., 71., 48.)/255.
#define SunflowerInsideThree  float3(158., 159., 33.)/255.
#define SunflowerLeavesOne    float3(247., 214., 0.)/255.
#define SunflowerHighlight    float3(247., 218., 63.)/255.
#define SunflowerLeavesTwo    float3(236., 168., 3.)/255.
#define SunflowerStem         float3(97., 128., 52.)/255.
#define SunflowerStemBright   float3(176., 186., 53.)/255.
#define FieldDark             float3(44., 62., 40.)/255.
#define FieldMid              float3(94., 121., 62.)/255.
#define Clouddark             float3(177., 203., 229.)/255.
#define CloudLight            float3(250., 251., 253.)/255.

float TriangularWave(float x)
{
 return abs(fract(x) - 0.5) * 4. - 1.;
}


float randOneD(float x){
return fract(sin(x *52.163)*268.2156);}

float2 randTwoD(float2 n){
  return float2(0.5,0.5);
}


float ConcateClouds(float amplitude, float period, float translateX, float translateY, float Seed, float x)
{

  Seed = randOneD(Seed);
  float toReturn = 0.;
  for(int i = 0; i< 6; i++){
     toReturn += sin( (x + Seed *6. + translateX  + float(i) *(0.125+  Seed *6.)) * period * TWO_PI) *  amplitude;
     amplitude *= 0.5;
     period *= 2.;
  }
  return toReturn + translateY ;
}


float ConcateTriangularWaves(float amplitude, float period, float translateX, float translateY, float Seed, float x)
{

  Seed = randOneD(Seed);
  float toReturn = 0.;
  for(int i = 0; i< 5; i++){
     toReturn += TriangularWave( (x + Seed *6. + translateX  + float(i) *(0.125+  Seed *6.)) * period) *  amplitude + translateY ;
     amplitude *= 0.85;
     period *= 1.25;
  }
  return toReturn;
}

void DrawLine(float m, float c, float2 uv, float size, float3 lineColor, thread float3& sceneColor){

    float2  xy   = float2(uv.x, uv.x * m + c); 
    float d    = distance(xy, uv);
    sceneColor = mix(lineColor, sceneColor, smoothstep(size, size + smoothing, d));
    
}
void DrawHalffloattorWithLength(float2 origin, float2 floattor, float len, float2 uv, float size, float3 lineColor, thread float3& sceneColor){
    
          uv  -= origin;
    float v2   = dot(floattor, floattor);
    float vUv  = dot(floattor, uv);
    float2  p    = floattor * vUv/v2;
    float d    = distance(p, uv);
    float m    = 1. - step(0.,vUv/v2);
          m   += step(len, vUv/v2);
    sceneColor = mix(lineColor, sceneColor, clamp(smoothstep(size, size + 0.01, d)+ m, 0. ,1.)); 
}

void DrawStemLeave(float2 origin, float2 floattor, float len, float2 uv, float size, float3 lineColor, thread float3& sceneColor){
    
          uv  -= origin;
    float v2   = dot(floattor, floattor);
    float vUv  = dot(floattor, uv);
    uv.y += pow(vUv/len, 2.)*4.;
    float2  p    = floattor * vUv/v2;
    float d    = distance(p, uv);
    float m    = 1. - step(0.,vUv/v2);
          m   += step(len, vUv/v2);
          
          size *= smoothstep(0.5, 0.0, abs(vUv - 0.5)/len) *0.5;
    sceneColor = mix(lineColor, sceneColor, clamp(smoothstep(size, size + 0.01, d)+ m, 0. ,1.)); 
}


void DrawPetals(float2 uv, thread float3& col, float seed, float offset, float3 petalColor)
{
     float leavesSpread = 0.35;
     float2  petalSpace = float2(fract((offset+ uv.x)* 6.28318530718 *leavesSpread), uv.y);
     float petalSpaceID = floor((uv.x+offset)* 6.28318530718 * leavesSpread);
     float petalLength = 1.;
     float petalThickness = smoothstep(-0.01, 1., pow( (1.-(petalSpace.y / petalLength)), 0.85)) *0.9
                          - smoothstep(0.7,0., petalSpace.y / petalLength);
     petalSpace.x += sin((petalSpace.y + randOneD(petalSpaceID + seed) * TWO_PI )*4. )*0.3 * smoothstep(0.5, 1., (petalSpace.y / petalLength));                  
     
     float3 drawnLeaves = col;
     DrawHalffloattorWithLength(float2(0.5, 0.), float2(0.,1.), 1., petalSpace, petalThickness,  petalColor, col);
     
}


void DrawSunFlower(float2 uv, float seed, thread float3& col, float mask)
{

    float noisetexture =  pow((randTwoD(uv*0.8)).x ,   2.)*0.1;
    
    DrawHalffloattorWithLength(float2(0.), float2(0.,-1.), 7., uv, 0.15, SunflowerStem + noisetexture, col);
    
    DrawStemLeave(float2(0.,-2.+ randOneD(seed+5.125) *-2.),
    normalize(float2(max(0.2,randOneD(seed+712.125)),(randOneD(seed+81.215) -0.3) * 0.3)), 5., uv, 0.3 +randOneD(seed+12.125) *0.4 , SunflowerStemBright + noisetexture, col);
    
        DrawStemLeave(float2(0.,-3.+ randOneD(seed+61.125) *-2.),
    normalize(float2(-1.0 * max(0.2,randOneD(seed+4.25)),(randOneD(seed+73.25) -0.3) * 0.3)), 5., uv, 0.3 + randOneD(seed+0.125) * 0.4, SunflowerStem + noisetexture, col);
    
    uv = float2(atan2(uv.y,uv.x), length(uv) * 0.55);
     float3 DrawnFlower= col;
    float2 fUV = fract(uv* 4.);
    float2 iUV = floor(uv* 4.);
    
    
     float2 disToCenter = abs( fUV - float2(0.5));
     
     DrawPetals(uv, DrawnFlower, 53.126 + seed, +0.4 + randOneD(seed), SunflowerLeavesTwo + noisetexture);
     DrawPetals(uv, DrawnFlower, 0. + seed, randOneD(seed+7.125)*-0.5, SunflowerLeavesOne + noisetexture);

     
     DrawnFlower = mix(DrawnFlower, SunflowerInsideOne    + noisetexture *1.4,smoothstep(lineSize, lineSize + smoothing, 0.45 - uv.y));
     DrawnFlower = mix(DrawnFlower, 
     mix(SunflowerInsideTwo, SunflowerInsideThree, noisetexture*5. * smoothstep(lineSize, lineSize + smoothing, 0.16 - uv.y)),
     smoothstep(lineSize, lineSize + smoothing, 0.20 - uv.y));
     DrawnFlower = mix(DrawnFlower, SunflowerInsideThree  + noisetexture,smoothstep(lineSize, lineSize + smoothing, 0.075 - uv.y));
     
     col = mix(col, DrawnFlower, mask);
     

}


void DrawSunFlowerField(float2 OG_UV, float seed, float2 offset, float fieldMask, float totalMovementSpeed, thread float3& col,float tiling, float iTime)
{

     
     OG_UV += offset;
     OG_UV.x += iTime *totalMovementSpeed;
     float2  flowerRepeatedSpace = float2(fract(OG_UV.x*tiling), OG_UV.y*tiling);
     float2  idFlowerCoord = float2(floor(OG_UV.x*tiling), seed*21.215);
     flowerRepeatedSpace -= float2(0.5) + float2(0.15,0.5) *(randOneD (dot(idFlowerCoord , float2(1.126, 26.6))) - 0.5) ;
     flowerRepeatedSpace *= 4. + 0.2 *(randOneD (dot(idFlowerCoord , float2(8.136, 5.316))) - 0.5);
     
     DrawSunFlower(flowerRepeatedSpace, randOneD (dot(idFlowerCoord , float2(21.126, 8.3216))), col,fieldMask );
    
}

float mapLinear(float a, float b, float x){ return (b-x)/(b-a);}


void DrawMountain(float movementSpeed, float2 uv, thread float3& col, float amplitude, float period, float translateY, float funcOffset, float translateX , float Seed
, float3 mountainColor, float iTime){
    
    float movement = iTime  * movementSpeed;
    
    mountainColor +=(1.-randTwoD((uv + float2(movement, 0.))*1.5)).x*0.1;
    
    float mountainOne = ConcateTriangularWaves(amplitude, period, translateX + movement , translateY, Seed, uv.x); 
    col = mix(col, mountainColor ,smoothstep(lineSize, lineSize + smoothing, mountainOne +funcOffset - uv.y));
    

}

void DrawCloudLayer(thread float3& col, float seed, float2 uv, float tilingCloud, float amplitude, float period, float offsetY, float offsetX ){
    
    uv.x += offsetX;
    
    float noise = pow((randTwoD(uv*1.1)).x ,   2.)*0.1;
    
    seed+=floor(uv.x *tilingCloud);
    
    float2 cloudsCoord = float2(fract(uv.x*tilingCloud), uv.y);
    cloudsCoord.x -= 0.5;
    cloudsCoord.y += -0.8 + (randOneD(floor(uv.x *tilingCloud)) - 0.5)* 0.25;
    
    float Contcatedcloud = ConcateClouds(amplitude, period, offsetX*0.1, offsetY, seed, cloudsCoord.x);
    
    
    Contcatedcloud *= smoothstep(0.5, 0.4, abs(cloudsCoord.x));
    float3 cloudColor = mix(Clouddark, CloudLight, smoothstep(0.3,0.9, cloudsCoord.y/ Contcatedcloud));
    cloudColor += noise;
    col = mix( col, cloudColor, smoothstep(0., smoothing, Contcatedcloud - cloudsCoord.y) 
    * smoothstep(0.0,smoothing*5., cloudsCoord.y));
}

void mainImage(thread float4& fragColor, float2 fragCoord, float iTime, float3 iResolution) 
{

    float2 uv = fragCoord/iResolution.xy;
    uv -= float2(0.5,0.5);
    
    uv.x *=iResolution.x/iResolution.y;
    uv *= 5.;
   
    

    
    float3 col = mix(skyButton, skyColor, smoothstep(0., 1.5, uv.y)) ;
    
 
    
    col += pow((randTwoD(uv*1.2)).x ,   2.)*0.05;

    
    
    
    
    float totalMovementSpeed = 0.15;
    
    float movement =  iTime  * totalMovementSpeed;
    
      DrawCloudLayer(col, 12.21, uv,  0.015, 0.5, 5., +0.0 ,movement * 0.1 );
     DrawCloudLayer(col, 0.,     uv,  0.015, 0.7, 8.76, -0.05 ,movement * 0.16 );
     
     
    DrawMountain(totalMovementSpeed * 0.2, uv, col, 0.2, 0.12, -0.11, 1.25, 1.216, 1.,MountainsLayerOneCol, iTime);
    DrawMountain(totalMovementSpeed * 0.5, uv, col, 0.16, 0.16, -0.12, 0.85, 0., 2.125, MountainsLayerTwoCol, iTime);
    DrawMountain(totalMovementSpeed * 1., uv, col, 0.5, 0.08, -0.135, 0.4, -0.612, 52.125, MountainLayerThreecol, iTime);
    DrawMountain(totalMovementSpeed * 1., uv, col, 0.5, 0.08, -0.135, 0.4, 0., 2.723, MountainLayerFourCol, iTime);
    
  
     
     
     float fieldMask = smoothstep(lineSize, lineSize + smoothing*4., 0.1 - uv.y);
     
     float3 fieldBaseColor = col;
     fieldBaseColor = mix(FieldMid + pow((randTwoD((uv + float2(movement * 4.7,0.))*1.2)).x ,   2.)*0.05   ,
              SunflowerLeavesOne + pow((randTwoD((uv + float2(movement*1.,0.))*1.2)).x ,   2.)*0.05
              , smoothstep(-0.2, 0.0, uv.y));
     fieldBaseColor = mix(fieldBaseColor,
     FieldDark + pow((randTwoD((uv + float2(movement*6.2,0.))*1.2)).x ,   2.)*0.05
     , smoothstep(-0.6, -1.4, uv.y));
     
    
     
     col = mix(col,  fieldBaseColor ,fieldMask);
     
     
     
     

 float2 OG_UV = fragCoord/iResolution.xy;
      OG_UV.x *=iResolution.x/iResolution.y;
    
      
      DrawSunFlowerField(OG_UV, 0., float2(0.51,-0.48),    fieldMask,  totalMovementSpeed, col, 90., iTime);
      totalMovementSpeed *= 1.1;
      DrawSunFlowerField(OG_UV, 6.621, float2(0.51,-0.46), fieldMask,  totalMovementSpeed, col, 50., iTime);
      totalMovementSpeed *= 1.1;
      DrawSunFlowerField(OG_UV, 7.23, float2(0.51,-0.43),  fieldMask,  totalMovementSpeed, col, 29., iTime);
      totalMovementSpeed *= 1.1;
      DrawSunFlowerField(OG_UV, 12.6, float2(0.51,-0.4),   fieldMask,  totalMovementSpeed, col, 22., iTime);
      totalMovementSpeed *= 1.1;
      DrawSunFlowerField(OG_UV, -7.21, float2(0.51,-0.35), fieldMask,  totalMovementSpeed, col, 15., iTime);
      totalMovementSpeed *= 1.1;
      DrawSunFlowerField(OG_UV, 2.125, float2(0.51,-0.3),  fieldMask,  totalMovementSpeed, col, 12., iTime);
      totalMovementSpeed *= 1.2;
      DrawSunFlowerField(OG_UV, 1., float2(1.126,-0.2),    fieldMask,  totalMovementSpeed, col, 8., iTime);
      totalMovementSpeed *= 1.2;
      DrawSunFlowerField(OG_UV, 5., float2(0.,-0.05),      fieldMask,  totalMovementSpeed, col, 4., iTime);
      totalMovementSpeed *= 1.3;
      DrawSunFlowerField(OG_UV, 71.612, float2(0.,0.1),    fieldMask,  totalMovementSpeed, col, 3., iTime);
     
    
     
     
    // Output to screen
    fragColor = float4(col,1.0); 
    
    /*
//--------------------------------------------------    
// SLIDE Three Domain Repition 
  float2 uv = fragCoord/iResolution.xy;
   float y = uv.y;
    uv -= float2(0.5,0.5);
    
    uv.x *=iResolution.x/iResolution.y;
    uv *= 5.;
   
    
    
    
    float3 col = float3( 0.0);
    
    float2 fUV = fract(uv* 4.);
    float2 iUV = floor(uv* 4.);
    
    
   float2 disToCenter = abs( fUV - float2(0.5));
    
  
    
    if(max(disToCenter.x, disToCenter.y)> 0.45) col = float3(0.1);
    

     
    col = float3(fract(uv.x), fract(uv.y), 0. ) ;


     
    // Output to screen
    fragColor = float4(col,1.0); */
    
    
//--------------------------------------------------    
// SLIDE TWO SUPER IMPOSITION WAVES
 /* float2 uv = fragCoord/iResolution.xy;
    uv -= float2(0.5,0.5);
    
    uv.x *=iResolution.x/iResolution.y;
    uv *= 5.;
   
    
    
    
    float3 col = float3( 0.0);
    
    float2 fUV = fract(uv* 4.);
    float2 iUV = floor(uv* 4.);
    
    
   float2 disToCenter = abs( fUV - float2(0.5));
    
  
    
    if(max(disToCenter.x, disToCenter.y)> 0.45) col = float3(0.1);
    
     
    float curveOne =  sin((uv.x+ iTime) *0.75 )* 0.7 ;
    col = mix(float3(0.1,0.9,0.), col,smoothstep(lineSize, lineSize + smoothing, abs(curveOne + 1.5 - uv.y)));
     
    float curveTwo =  sin((uv.x+ iTime) *3.)* 0.25 ;
    col = mix(float3(0.9,0.3,0.), col,smoothstep(lineSize, lineSize + smoothing, abs(curveTwo + 0.1 - uv.y)));
     
     
    col = mix(float3(1.,0.86,0.), col,smoothstep(lineSize, lineSize + smoothing, abs(curveTwo + curveOne -1.5 - uv.y)));
     
    // Output to screen
    fragColor = float4(col,1.0); */
    
//--------------------------------------------------
/*

// SLIDE ONE
// DRAWING THE FILLING GRID
    float2 uv = fragCoord/iResolution.xy;
    uv.x *=iResolution.x/iResolution.y;
    
    uv -= float2(0.8,0.45);
    
    uv *= 1.2;
    float2 fUV = fract(uv* 16.);
    float2 iUV = floor(uv* 16.);
    
    float3 col = float3( 0.5);
     col = mix(col, float3( iUV.xy/16.,0.), (((iUV.x+8.) + (iUV.y + 7.)*16.)< fmod(iTime * 60., 296.)) ? 1.: 0.  );

    float2 disToCenter = abs( fUV - float2(0.5));
    
    if(max(disToCenter.x, disToCenter.y)> 0.45) col = float3(1.);
    if(iUV.x >= 9. || iUV.y >= 9. || iUV.x <= -8. || iUV.y <= -8.) col = float3(0.);
    
    
    // Output to screen
    fragColor = float4(col,1.0);*/
}