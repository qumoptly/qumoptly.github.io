{@}RoverArrow.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAlpha;
uniform vec3 uColor;

#!VARYINGS

varying vec2 vUv;

#!SHADER: RoverArrow.vs

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: RoverArrow.fs

void addGap(inout float stroke, float mask, float offset) {
    float t = mod(uTime * 0.2 + offset, 1.0);
    float gap = 0.02;
    float strokeWidth = 0.02;

    float lineGap = smoothstep(gap, gap + 0.01, abs(vUv.x - t));
    float lineOuter = smoothstep(gap + strokeWidth + 0.01, gap + strokeWidth, abs(vUv.x - t));
    float gapStroke = lineOuter * lineGap * mask;

    stroke *= lineGap;
    stroke = max(stroke, gapStroke);
}

void main() {
    vec3 tex = texture2D(uTexture, vUv).rgb;
    float mask = tex.r;
    float stroke = tex.g;

    addGap(stroke, mask, 0.0);
    addGap(stroke, mask, 0.25);
    addGap(stroke, mask, 0.5);
    addGap(stroke, mask, 0.75);

    gl_FragColor.rgb = uColor;
    gl_FragColor.a = stroke * uAlpha;
}
{@}RoverAddonCode.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAlpha;

#!VARYINGS

varying vec2 vUv;

#!SHADER: RoverAddonCode.vs

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: RoverAddonCode.fs

void main() {
    vec2 uv = vUv;
    uv.y -= floor(uTime * 7.0) / 7.0 * 0.2;
    float mask = texture2D(uTexture, uv).g;

    float alpha = mask * smoothstep(0.8, 0.81, vUv.y) * smoothstep(1.0, 0.99, vUv.y) * 0.8;

    gl_FragColor.rgb = vec3(1.0);
    gl_FragColor.a = alpha * uAlpha;
}
{@}RoverAddons.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform float uTime;
uniform float uAlpha;

#!VARYINGS

varying vec2 vUv;
varying vec3 vNormal;

#!SHADER: RoverAddons.vs

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: RoverAddons.fs

#require(rgb2hsv.fs)

void main() {
    vec3 color = vec3(0.6, 0.6, 1.0);
    color -= normalize(vNormal).yxz * 0.5;

    color = rgb2hsv(color);
    color.x = 0.62;//mix(color.x, 0.6, 0.5);
    color.y *= 0.4;
    color.y += 0.2;
    color.z *= 1.2;
    color = hsv2rgb(color);

    gl_FragColor.rgb = color;
    gl_FragColor.a = uAlpha;
}
{@}Background.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform sampler2D uOpen;
uniform sampler2D uMars;

#!VARYINGS
varying vec2 vUv;

#!SHADER: Background.vs
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

#!SHADER: Background.fs
void main() {
    #drawbuffer Color gl_FragColor = texture2D(uOpen, vUv);
    #drawbuffer Mars gl_FragColor = texture2D(uMars, vUv);
}{@}BackgroundMars.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uTexture;

#!VARYINGS

varying vec2 vUv;

#!SHADER: BackgroundMars.vs

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: BackgroundMars.fs

#require(range.glsl)
#require(simplenoise.glsl)

void main() {
    vec2 uv = vUv + vec2(getNoise(vUv, 1.0), getNoise(vUv, 6.0)) * 0.002;
    vec3 tex = texture2D(uTexture, uv).rgb;

    gl_FragColor.rgb = tex;
    gl_FragColor.a = 1.0;
}
{@}BackgroundOpen.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uTexture;

#!VARYINGS

varying vec2 vUv;

#!SHADER: BackgroundOpen.vs

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: BackgroundOpen.fs

#require(range.glsl)
#require(simplenoise.glsl)

void main() {
    vec2 uv = vUv + vec2(getNoise(vUv, 1.0), getNoise(vUv, 6.0)) * 0.01;
    vec3 tex = texture2D(uTexture, uv).rgb;

    gl_FragColor.rgb = tex;
    gl_FragColor.a = 1.0;
}
{@}Hotspot.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform vec3 uColorInner;
uniform vec3 uColorOuter;
uniform vec3 uColorVisited;
uniform float uTransition;
uniform float uVisited;

#!VARYINGS
varying vec2 vUv;

#!SHADER: Hotspot.vs
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: Hotspot.fs

float circleSDF(vec2 st) {
    return length(st-.5)*2.;
}

float fill(float x, float size) {
    return 1.-step(size, x);
}

void main() {
    vec2 uv = vUv;
    vec3 color = vec3(0.0);

    float SDF = circleSDF(uv);

    vec3 inner = mix(uColorInner, uColorVisited, uVisited);

    float size = 0.85 - 0.2*uTransition;
    color = mix(inner, uColorOuter, smoothstep(size-0.01, size+0.01, SDF));

    float alpha = smoothstep(1., 0.98, SDF);

    //alpha *= SDF;

    gl_FragColor = vec4(color, alpha*uTransition);
}{@}AntimatterCopy.fs{@}uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(tDiffuse, vUv);
}{@}AntimatterCopy.vs{@}varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}{@}AntimatterPass.vs{@}void main() {
    gl_Position = vec4(position, 1.0);
}{@}AntimatterPosition.vs{@}uniform sampler2D tPos;

#require(antimatter.glsl)

void main() {
    vec4 decodedPos = texture2D(tPos, position.xy);
    vec3 pos = decodedPos.xyz;
    float size = 0.02;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (1000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}{@}AntimatterDepth.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform sampler2D tPos;
uniform float pointSize;
uniform vec3 lightPos;
uniform float far;

#!VARYINGS
varying vec4 vWorldPosition;

#!SHADER: AntimatterDepth.vs

#chunk(common);
#chunk(morphtarget_pars_vertex);
#chunk(skinning_pars_vertex);
#chunk(clipping_planes_pars_vertex);

void main() {
	#chunk(skinbase_vertex);
	#chunk(begin_vertex);
	#chunk(morphtarget_vertex);
	#chunk(skinning_vertex);
	#chunk(project_vertex);
	#chunk(worldpos_vertex);
	#chunk(clipping_planes_vertex);

	vec4 decodedPos = texture2D(tPos, position.xy);
    vec3 pos = decodedPos.xyz;
    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    worldPosition = modelMatrix * vec4(pos, 1.0);
	vWorldPosition = worldPosition;

	gl_PointSize = pointSize;
}

#!SHADER: AntimatterDepth.fs

#chunk(common);
#chunk(packing);
#chunk(clipping_planes_pars_fragment);

void main () {
	#chunk(clipping_planes_fragment);
	gl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - lightPos.xyz ) / far );
}{@}antimatter.glsl{@}vec3 getData(sampler2D tex, vec2 uv) {
    return texture2D(tex, uv).xyz;
}

vec4 getData4(sampler2D tex, vec2 uv) {
    return texture2D(tex, uv);
}{@}antimattershadow.vs{@}vNormal = normalMatrix * normal;

vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
#chunk(shadowmap_vertex);{@}conditionals.glsl{@}vec4 when_eq(vec4 x, vec4 y) {
  return 1.0 - abs(sign(x - y));
}

vec4 when_neq(vec4 x, vec4 y) {
  return abs(sign(x - y));
}

vec4 when_gt(vec4 x, vec4 y) {
  return max(sign(x - y), 0.0);
}

vec4 when_lt(vec4 x, vec4 y) {
  return max(sign(y - x), 0.0);
}

vec4 when_ge(vec4 x, vec4 y) {
  return 1.0 - when_lt(x, y);
}

vec4 when_le(vec4 x, vec4 y) {
  return 1.0 - when_gt(x, y);
}

vec3 when_eq(vec3 x, vec3 y) {
  return 1.0 - abs(sign(x - y));
}

vec3 when_neq(vec3 x, vec3 y) {
  return abs(sign(x - y));
}

vec3 when_gt(vec3 x, vec3 y) {
  return max(sign(x - y), 0.0);
}

vec3 when_lt(vec3 x, vec3 y) {
  return max(sign(y - x), 0.0);
}

vec3 when_ge(vec3 x, vec3 y) {
  return 1.0 - when_lt(x, y);
}

vec3 when_le(vec3 x, vec3 y) {
  return 1.0 - when_gt(x, y);
}

vec2 when_eq(vec2 x, vec2 y) {
  return 1.0 - abs(sign(x - y));
}

vec2 when_neq(vec2 x, vec2 y) {
  return abs(sign(x - y));
}

vec2 when_gt(vec2 x, vec2 y) {
  return max(sign(x - y), 0.0);
}

vec2 when_lt(vec2 x, vec2 y) {
  return max(sign(y - x), 0.0);
}

vec2 when_ge(vec2 x, vec2 y) {
  return 1.0 - when_lt(x, y);
}

vec2 when_le(vec2 x, vec2 y) {
  return 1.0 - when_gt(x, y);
}

float when_eq(float x, float y) {
  return 1.0 - abs(sign(x - y));
}

float when_neq(float x, float y) {
  return abs(sign(x - y));
}

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}

float when_ge(float x, float y) {
  return 1.0 - when_lt(x, y);
}

float when_le(float x, float y) {
  return 1.0 - when_gt(x, y);
}

vec4 and(vec4 a, vec4 b) {
  return a * b;
}

vec4 or(vec4 a, vec4 b) {
  return min(a + b, 1.0);
}

vec4 not(vec4 a) {
  return 1.0 - a;
}

vec3 and(vec3 a, vec3 b) {
  return a * b;
}

vec3 or(vec3 a, vec3 b) {
  return min(a + b, 1.0);
}

vec3 not(vec3 a) {
  return 1.0 - a;
}

vec2 and(vec2 a, vec2 b) {
  return a * b;
}

vec2 or(vec2 a, vec2 b) {
  return min(a + b, 1.0);
}


vec2 not(vec2 a) {
  return 1.0 - a;
}

float and(float a, float b) {
  return a * b;
}

float or(float a, float b) {
  return min(a + b, 1.0);
}

float not(float a) {
  return 1.0 - a;
}{@}FXAA.glsl{@}#!ATTRIBUTES
attribute vec2 uv;
attribute vec3 position;

#!UNIFORMS
uniform vec2 resolution;

#!VARYINGS
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

#!SHADER: FXAA.vs
precision highp float;
precision highp int;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec2 fragCoord = uv * resolution;
    vec2 inverseVP = 1.0 / resolution.xy;
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);

    gl_Position = vec4(position, 1.0);
}

#!SHADER: FXAA.fs

#ifndef FXAA_REDUCE_MIN
    #define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
    #define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
    #define FXAA_SPAN_MAX     8.0
#endif

vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,
            vec2 v_rgbNW, vec2 v_rgbNE,
            vec2 v_rgbSW, vec2 v_rgbSE,
            vec2 v_rgbM) {
    vec4 color;
    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
              dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {
    vec2 fragCoord = vUv * resolution;
    gl_FragColor = fxaa(tDiffuse, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}{@}glscreenprojection.glsl{@}vec2 applyProjection(vec3 pos, mat4 projMatrix, vec2 screenSize) {
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    mat4 e = projMatrix;

    float d = 1.0 / ( e[0][3] * x + e[1][3] * y + e[2][3] * z + e[3][3] );

    x = ( e[0][0] * x + e[1][0] * y + e[2][0] * z + e[3][0] ) * d;
    y = ( e[0][1] * x + e[1][1] * y + e[2][1] * z + e[3][1] ) * d;
    z = ( e[0][2] * x + e[1][2] * y + e[2][2] * z + e[3][2] ) * d;

    vec2 screen = vec2(0.0);
    screen.x = (x + 1.0) / 2.0 * screenSize.x;
    screen.y = -(y - 1.0) / 2.0 * screenSize.y;
    return screen;
}{@}MouseFlowMapBlend.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uTexture;
uniform sampler2D uStamp;
uniform float uSpeed;
uniform float uFirstDraw;

#!VARYINGS

varying vec2 vUv;

#!SHADER: MouseFlowMapBlend.vs

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

#!SHADER: MouseFlowMapBlend.fs

vec3 blend(vec3 base, vec3 blend, float opacity) {
     return blend + (base * (1.0 - opacity));
}

#require(range.glsl)

void main() {
    vec3 prev = texture2D(uTexture, vUv).rgb;
    prev = prev * 2.0 - 1.0;
    float amount = crange(length(prev.rg), 0.0, 0.4, 0.0, 1.0);
    amount = 0.5 + 0.48 * (1.0 - pow(1.0 - amount, 3.0));
    prev *= amount;
    prev = prev * 0.5 + 0.5;
    prev.b = 1.0;

    prev = mix(prev, vec3(0.5, 0.5, 1.0), uFirstDraw);

    vec4 tex = texture2D(uStamp, vUv);
    gl_FragColor.rgb = blend(prev, tex.rgb, tex.a);
    gl_FragColor.a = 1.0;
}
{@}MouseFlowMapStamp.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform vec2 uVelocity;
uniform float uFalloff;

#!VARYINGS

varying vec2 vUv;

#!SHADER: MouseFlowMapStamp.vs

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: MouseFlowMapStamp.fs

void main() {
    gl_FragColor.rgb = vec3(uVelocity * 0.5 + 0.5, 1.0);
    gl_FragColor.a = smoothstep(0.5, 0.499 - (uFalloff * 0.499), length(vUv - 0.5));
}
{@}flowmap.fs{@}float getFlowMask(sampler2D map, vec2 uv) {
    vec2 flow = texture2D(map, uv).rg;
    return length(flow.rg * 2.0 - 1.0);
}

vec2 getFlow(sampler2D map, vec2 uv) {
    return texture2D(map, uv).rg * 2.0 - 1.0;
}{@}normalmap.glsl{@}vec3 unpackNormal( vec3 eye_pos, vec3 surf_norm, sampler2D normal_map, float intensity, float scale, vec2 uv ) {
    surf_norm = normalize(surf_norm);

    if (length(uv) == 0.0) return surf_norm;
    
    vec3 q0 = dFdx( eye_pos.xyz );
    vec3 q1 = dFdy( eye_pos.xyz );
    vec2 st0 = dFdx( uv.st );
    vec2 st1 = dFdy( uv.st );
    
    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( surf_norm );
    
    vec3 mapN = texture2D( normal_map, uv * scale ).xyz * 2.0 - 1.0;
    mapN.xy *= intensity;
    mat3 tsn = mat3( S, T, N );
    return normalize( tsn * mapN );
}

//mvPosition.xyz, normalMatrix * normal, normalMap, intensity, scale, uv{@}range.glsl{@}float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMax, newMin), max(newMin, newMax));
}{@}rgb2hsv.fs{@}vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}{@}rgbshift.fs{@}vec4 getRGB(sampler2D tDiffuse, vec2 uv, float angle, float amount) {
    vec2 offset = vec2(cos(angle), sin(angle)) * amount;
    vec4 r = texture2D(tDiffuse, uv + offset);
    vec4 g = texture2D(tDiffuse, uv);
    vec4 b = texture2D(tDiffuse, uv - offset);
    return vec4(r.r, g.g, b.b, g.a);
}{@}ScreenQuad.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform sampler2D tMap;

#!VARYINGS
varying vec2 vUv;

#!SHADER: ScreenQuad.vs
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}

#!SHADER: ScreenQuad.fs
void main() {
    gl_FragColor = texture2D(tMap, vUv);
}{@}simplenoise.glsl{@}float getNoise(vec2 uv, float time) {
    float x = uv.x * uv.y * time * 1000.0;
    x = mod(x, 13.0) * mod(x, 123.0);
    float dx = mod(x, 0.01);
    float amount = clamp(0.1 + dx * 100.0, 0.0, 1.0);
    return amount;
}

highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

float cnoise(vec3 v) {
    float t = v.z * 0.3;
    v.y *= 0.8;
    float noise = 0.0;
    float s = 0.5;
    noise += range(sin(v.x * 0.9 / s + t * 10.0) + sin(v.x * 2.4 / s + t * 15.0) + sin(v.x * -3.5 / s + t * 4.0) + sin(v.x * -2.5 / s + t * 7.1), -1.0, 1.0, -0.3, 0.3);
    noise += range(sin(v.y * -0.3 / s + t * 18.0) + sin(v.y * 1.6 / s + t * 18.0) + sin(v.y * 2.6 / s + t * 8.0) + sin(v.y * -2.6 / s + t * 4.5), -1.0, 1.0, -0.3, 0.3);
    return noise;
}

float cnoise(vec2 v) {
    float t = v.x * 0.3;
    v.y *= 0.8;
    float noise = 0.0;
    float s = 0.5;
    noise += range(sin(v.x * 0.9 / s + t * 10.0) + sin(v.x * 2.4 / s + t * 15.0) + sin(v.x * -3.5 / s + t * 4.0) + sin(v.x * -2.5 / s + t * 7.1), -1.0, 1.0, -0.3, 0.3);
    noise += range(sin(v.y * -0.3 / s + t * 18.0) + sin(v.y * 1.6 / s + t * 18.0) + sin(v.y * 2.6 / s + t * 8.0) + sin(v.y * -2.6 / s + t * 4.5), -1.0, 1.0, -0.3, 0.3);
    return noise;
}{@}simplex3d.glsl{@}// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    i = mod289(i);
    vec4 p = permute( permute( permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

//float surface(vec3 coord) {
//    float n = 0.0;
//    n += 1.0 * abs(snoise(coord));
//    n += 0.5 * abs(snoise(coord * 2.0));
//    n += 0.25 * abs(snoise(coord * 4.0));
//    n += 0.125 * abs(snoise(coord * 8.0));
//    float rn = 1.0 - n;
//    return rn * rn;
//}{@}CustomShadow.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform vec3 uLightPos;
uniform float uFar;

#!VARYINGS
varying vec4 vWorldPosition;

#!SHADER: CustomShadow.vs

#chunk(common);
#chunk(morphtarget_pars_vertex);
#chunk(skinning_pars_vertex);
#chunk(clipping_planes_pars_vertex);

//customUniforms

void main() {
	#chunk(skinbase_vertex);
	#chunk(begin_vertex);
	#chunk(morphtarget_vertex);
	#chunk(skinning_vertex);
	#chunk(project_vertex);
	#chunk(worldpos_vertex);
	#chunk(clipping_planes_vertex);

	//customPos

    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    worldPosition = modelMatrix * vec4(pos, 1.0);
	vWorldPosition = worldPosition;
}

#!SHADER: CustomShadow.fs

#chunk(common);
#chunk(packing);
#chunk(clipping_planes_pars_fragment);

void main () {
	#chunk(clipping_planes_fragment);
	gl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - uLightPos.xyz ) / uFar );
}{@}ParticleDepth.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform float pointSize;
uniform vec3 lightPos;
uniform float far;

#!VARYINGS
varying vec4 vWorldPosition;

#!SHADER: ParticleDepth.vs

#chunk(common);
#chunk(morphtarget_pars_vertex);
#chunk(skinning_pars_vertex);
#chunk(clipping_planes_pars_vertex);

void main() {
	#chunk(skinbase_vertex);
	#chunk(begin_vertex);
	#chunk(morphtarget_vertex);
	#chunk(skinning_vertex);
	#chunk(project_vertex);
	#chunk(worldpos_vertex);
	#chunk(clipping_planes_vertex);
	vWorldPosition = worldPosition;

	gl_PointSize = pointSize;
}

#!SHADER: ParticleDepth.fs

#chunk(common);
#chunk(packing);
#chunk(clipping_planes_pars_fragment);

void main () {
	#chunk(clipping_planes_fragment);
	gl_FragColor = packDepthToRGBA( length( vWorldPosition.xyz - lightPos.xyz ) / far );
}{@}instance.vs{@}vec3 transformNormal(vec4 orientation) {
    vec3 n = normal;
    vec3 ncN = cross(orientation.xyz, n);
    n = ncN * (2.0 * orientation.w) + (cross(orientation.xyz, ncN) * 2.0 + n);
    return n;
}

vec3 transformPosition(vec3 position, vec3 offset, vec3 scale, vec4 orientation) {
     vec3 pos = position;
     pos *= scale;
     pos += offset;

     vec3 iq = cross(orientation.xyz, pos);
     return iq * (2.0 * orientation.w) + (cross(orientation.xyz, iq) * 2.0 + pos);
}

vec3 transformPosition(vec3 position, vec3 offset, float scale, vec4 orientation) {
    return transformPosition(position, offset, vec3(scale), orientation);
}

vec3 transformPosition(vec3 position, vec3 offset) {
    return position + offset;
}{@}lights.fs{@}vec3 worldLight(vec3 pos, vec3 vpos) {
    vec4 mvPos = modelViewMatrix * vec4(vpos, 1.0);
    vec4 worldPosition = viewMatrix * vec4(pos, 1.0);
    return worldPosition.xyz - mvPos.xyz;
}{@}lights.vs{@}vec3 worldLight(vec3 pos) {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vec4 worldPosition = viewMatrix * vec4(pos, 1.0);
    return worldPosition.xyz - mvPos.xyz;
}

vec3 worldLight(vec3 lightPos, vec3 localPos) {
    vec4 mvPos = modelViewMatrix * vec4(localPos, 1.0);
    vec4 worldPosition = viewMatrix * vec4(lightPos, 1.0);
    return worldPosition.xyz - mvPos.xyz;
}{@}shadow.fs{@}#chunk(common);
#chunk(bsdfs);
#chunk(packing);
#chunk(lights_pars);
#chunk(shadowmap_pars_fragment);

varying vec3 vShadowNormal;

float getShadowValue() {
    float shadow = 1.0;

    #ifdef USE_SHADOWMAP

    #if ( NUM_POINT_LIGHTS > 0 )

	    PointLight pointLight;

        #pragma unroll_loop
	    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		    pointLight = pointLights[ i ];

		    float shadowValue = getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] );
		    shadowValue += 1.0 - step(0.002, dot(pointLight.position, vShadowNormal));
		    shadowValue = clamp(shadowValue, 0.0, 1.0);

		    shadow *= shadowValue;

	    }

    #endif

    #if ( NUM_DIR_LIGHTS > 0 )

        IncidentLight directLight;
        DirectionalLight directionalLight;

        #pragma unroll_loop
        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

            directionalLight = directionalLights[ i ];

            float shadowValue = getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] );
            shadowValue += (1.0 - step(0.002, dot(directionalLight.direction, vShadowNormal))) * clamp(length(vShadowNormal), 0.0, 1.0);
            shadowValue = clamp(shadowValue, 0.0, 1.0);
            shadow *= shadowValue;
        }

    #endif

    #endif

    return shadow;
}{@}shadow.vs{@}vShadowNormal = normalMatrix * normal;

vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
#chunk(shadowmap_vertex);{@}shadowparam.vs{@}#chunk(shadowmap_pars_vertex);

varying vec3 vShadowNormal;{@}transformUV.glsl{@}vec2 transformUV(vec2 uv, float a[9]) {

    // Convert UV to vec3 to apply matrices
	vec3 u = vec3(uv, 1.0);

    // Array consists of the following
    // 0 translate.x
    // 1 translate.y
    // 2 skew.x
    // 3 skew.y
    // 4 rotate
    // 5 scale.x
    // 6 scale.y
    // 7 origin.x
    // 8 origin.y

    // Origin before matrix
    mat3 mo1 = mat3(
        1, 0, -a[7],
        0, 1, -a[8],
        0, 0, 1);

    // Origin after matrix
    mat3 mo2 = mat3(
        1, 0, a[7],
        0, 1, a[8],
        0, 0, 1);

    // Translation matrix
    mat3 mt = mat3(
        1, 0, -a[0],
        0, 1, -a[1],
    	0, 0, 1);

    // Skew matrix
    mat3 mh = mat3(
        1, a[2], 0,
        a[3], 1, 0,
    	0, 0, 1);

    // Rotation matrix
    mat3 mr = mat3(
        cos(a[4]), sin(a[4]), 0,
        -sin(a[4]), cos(a[4]), 0,
    	0, 0, 1);

    // Scale matrix
    mat3 ms = mat3(
        1.0 / a[5], 0, 0,
        0, 1.0 / a[6], 0,
    	0, 0, 1);

	// apply translation
   	u = u * mt;

	// apply skew
   	u = u * mh;

    // apply rotation relative to origin
    u = u * mo1;
    u = u * mr;
    u = u * mo2;

    // apply scale relative to origin
    u = u * mo1;
    u = u * ms;
    u = u * mo2;

    // Return vec2 of new UVs
    return u.xy;
}

vec2 rotateUV(vec2 uv, float r) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = r;
    a[5] = 1.0;
    a[6] = 1.0;
    a[7] = 0.5;
    a[8] = 0.5;

    return transformUV(uv, a);
}

vec2 translateUV(vec2 uv, vec2 translate) {
    float a[9];
    a[0] = translate.x;
    a[1] = translate.y;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = 1.0;
    a[6] = 1.0;
    a[7] = 0.5;
    a[8] = 0.5;

    return transformUV(uv, a);
}

vec2 scaleUV(vec2 uv, vec2 scale) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = scale.x;
    a[6] = scale.y;
    a[7] = 0.5;
    a[8] = 0.5;

    return transformUV(uv, a);
}
vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = scale.x;
    a[6] = scale.y;
    a[7] = origin.x;
    a[8] = origin.x;

    return transformUV(uv, a);
}{@}FloatingParticles.glsl{@}#!ATTRIBUTES
attribute vec4 attribs;

#!UNIFORMS
uniform float uSize;
uniform sampler2D tPos;
uniform sampler2D tMap;
uniform vec3 uPosition;

#!VARYINGS

varying vec4 vAttribs;
varying vec4 vMPos;

#!SHADER: FloatingParticles.vs

void main() {
    vAttribs = attribs;
    vec3 pos = texture2D(tPos, position.xy).xyz;
    vMPos = modelViewMatrix * vec4(pos, 1.0);
    vec4 mVPos = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = uSize * attribs.x * (1000.0 / length(mVPos.xyz));
    gl_Position = projectionMatrix * mVPos;
}

#!SHADER: FloatingParticles.fs
void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    float alpha = texture2D(tMap, uv).g;
    alpha *= 0.4 * (1.0 - 0.8 * vAttribs.y);


    float dist = length(vMPos.xyz - uPosition);
    alpha *= smoothstep(10.0, 20.0, dist);


    #drawbuffer Color gl_FragColor = vec4(vec3(1.0), alpha * 0.4);
    #drawbuffer Mars gl_FragColor = vec4(vec3(1.0), alpha * 0.2);
}{@}FloatingParticlesFlow.fs{@}uniform sampler2D tOrigin;
uniform sampler2D tAttribs;
uniform mat4 uProjMatrix;
uniform mat3 uProjNormalMatrix;
uniform vec2 uProjResolution;
uniform sampler2D uFlowMap;

uniform float uTime;
uniform vec3 uCenterPosition;
uniform float uFlowSpeed;
uniform float uMaxRange;
uniform float uMaxHeight;

#require(range.glsl)

vec2 frag_coord(vec4 glPos) {
    return ((glPos.xyz / glPos.w) * 0.5 + 0.5).xy;
}

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

float when_lt(float x, float y) {
  return max(sign(y - x), 0.0);
}


void main() {
    vec2 uv = getUV();
    vec3 pos = getData(tInput, uv);
    vec3 origin = getData(tOrigin, uv);
    vec4 attribs = getData4(tAttribs, uv);


    // Convert pos into screenspace
    vec4 mvpPos = uProjMatrix * vec4(pos, 1.0);
    vec2 screenPos = frag_coord(mvpPos);

    // Get flowmap value
    vec2 flow = texture2D(uFlowMap, screenPos).xy * 2.0 - 1.0;
    flow.x *= smoothstep(0.0, 0.3, abs(flow.x));
    flow.y *= smoothstep(0.0, 0.3, abs(flow.y));
    flow.y *= -1.0;

    // Convert flowmap back into worldspace
    vec3 flowVel = uProjNormalMatrix * vec3(flow, 0.0) * uFlowSpeed;


    // Keep particles near rover
    vec3 dist = pos - uCenterPosition;
    float max = uMaxRange;
    pos.x += when_gt(dist.x, max) * max * -2.0;
    pos.x += when_lt(dist.x, -max) * max * 2.0;

    pos.z += when_gt(dist.z, max) * max * -2.0;
    pos.z += when_lt(dist.z, -max) * max * 2.0;

    float yMax = uMaxHeight;
    pos.y += when_gt(dist.y, yMax) * -yMax;
    pos.y += when_lt(dist.y, 0.0) * yMax;




    vec3 sway = vec3(0.0);
    sway.x = sin(uTime * attribs.x + attribs.y * 6.3) * 0.02;
    sway.z = sin(uTime * attribs.z + attribs.x * 6.3) * 0.02;

    pos += flowVel;

    pos.y -= 0.01 * attribs.x;
    pos += sway;

    gl_FragColor = vec4(pos, 1.0);
}{@}ShadowIcosahedron.glsl{@}#!ATTRIBUTES

#!UNIFORMS
uniform float uTime;

#!VARYINGS

#!SHADER: ShadowIcosahedron.vs

#require(simplex3d.glsl)
#require(shadowparam.vs)

void main() {
    //startCustomPos
    vec3 pos = position;
    pos *= 1.0 + snoise(pos * 2.3 + uTime) * 1.4;
    //endCustomPos

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    #require(shadow.vs)
}

#!SHADER: ShadowIcosahedron.fs

#require(shadow.fs)

void main() {
    gl_FragColor = vec4(getShadowValue());
}{@}ShadowTestPlane.glsl{@}#!ATTRIBUTES

#!UNIFORMS

#!VARYINGS

#!SHADER: ShadowTestPlane.vs

#require(shadowparam.vs)

void main() {
    vec3 pos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    #require(shadow.vs)
}

#!SHADER: ShadowTestPlane.fs

#require(shadow.fs)

void main() {
    gl_FragColor = vec4(getShadowValue());
}{@}Rock.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform sampler2D uBg;
uniform float uAlpha;
uniform float uTime;
uniform vec2 uResolution;

#!VARYINGS

varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNormal;

#!SHADER: Rock.vs

void main() {
    vUv = uv;
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: Rock.fs
#require(range.glsl)
#require(simplenoise.glsl)
#require(rgb2hsv.fs)

vec3 getOpenColor() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 bg = texture2D(uBg, uv).rgb;

    vec3 color = bg;
    float shading = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
    color *= (shading * 1.0 + 1.0);

    float noise = cnoise((vPos * 0.3) + uTime*0.25);
    color *= range(noise, -1.0, 1.0, shading, 1.5);
    color = mix(color, vec3(1.0), 0.05);

    return color;
}

void main() {
    vec3 tex = getOpenColor();

    float alpha = range(rgb2hsv(tex).z, 0.0, 1.0, 0.0, 0.5);

    gl_FragColor.rgb = tex;
    gl_FragColor.a = uAlpha*alpha;
}
{@}MarsRover.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform float uTime;
uniform float uTransition;
uniform vec3 uPosition;
uniform sampler2D uTexture;

#!VARYINGS

varying vec3 vNormal;
varying vec3 vMPos;
varying vec2 vUv;

#!SHADER: MarsRover.vs

void main() {
    vUv = uv;
    vMPos = (modelMatrix * vec4(position, 1.0)).xyz - uPosition;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: MarsRover.fs

void main() {
    vec3 normal = normalize(vNormal);

    vec3 color = normal;

    vec3 tex = texture2D(uTexture, vUv).rgb;
    color = tex;

    float shading = dot(normal, normalize(vec3(-0.5, 1.0, 1.0))) * 0.5 + 0.5;
    color *= 0.1 + 0.9 * shading;



    float progress = 1.0 - smoothstep(0.7, 0.0, uTransition);

    float shift = uTime * 0.6;
    float dotSize = 0.3;
    float a =
        (abs(0.5 * dotSize - mod(vMPos.x + sin(vMPos.z * 0.3) + shift, dotSize)) / (dotSize * 0.5)) *
        (abs(0.5 * dotSize - mod(vMPos.y + sin(vMPos.z * 0.4) + shift, dotSize)) / (dotSize * 0.5)) *
        (abs(0.5 * dotSize - mod(vMPos.z + sin(vMPos.x * 0.2) + shift, dotSize)) / (dotSize * 0.5));

    float range = smoothstep(0.0, 1.0, vMPos.y - 6.0 + progress * 7.0);
    if (a < range) discard;

    #drawbuffer Color gl_FragColor = vec4(color, 1.0);
    #drawbuffer Mars gl_FragColor = vec4(color, 1.0);
}
{@}OpenColor.glsl{@}vec3 getOpenColor(vec3 normal) {
    float ao = texture2D(uAO, vUv2).g;
    float shading = dot(normal, vLight) * 0.5 + 0.5;
    float tone = ao * 0.8;
    tone *= 0.2 + 1.0 * shading;

    vec3 outColor = mix(uColor, vec3(1.0), tone);

    return outColor;
}
{@}OpenRover.glsl{@}#!ATTRIBUTES

attribute vec2 uv2;

#!UNIFORMS

uniform sampler2D uTransparency;
uniform sampler2D uAO;
uniform float uTime;
uniform float uAlpha;
uniform float uTransition;
uniform float uSide;
uniform vec3 uPosition;
uniform vec3 uColor;

uniform float uColorSlider;
uniform vec3 uColor2;
uniform vec3 uColor3;

#!VARYINGS

varying vec3 vNormal;
varying vec3 vMPos;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vLight;

#!SHADER: OpenRover.vs

void main() {
    vUv = uv;
    vUv2 = uv2;
    vMPos = (modelMatrix * vec4(position, 1.0)).xyz - uPosition;
    vNormal = normalize(normalMatrix * normal);
    vLight = normalize(vec3(-0.2, 1.0, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: OpenRover.fs

#require(rgb2hsv.fs)
#require(OpenTransition.glsl)


vec3 getOpenColor(vec3 normal) {
    float ao = texture2D(uAO, vUv2).g;
    float shading = dot(normal, vLight) * 0.5 + 0.5;
    float tone = ao * 0.8;
    tone *= 0.2 + 1.0 * shading;

    vec3 c = uColor;
    c = mix(uColor2, c, min(1.0, uColorSlider + 1.0));
    c = mix(c, uColor3, max(0.0, uColorSlider));

    vec3 outColor = mix(c, vec3(1.0), tone);

    return outColor;
}


void main() {
    vec3 normal = normalize(vNormal);

    float alpha = texture2D(uTransparency, vUv).g;
    if (alpha < 0.01) discard;

    vec3 outColor = getOpenColor(normal);

    transition();

    #drawbuffer Color gl_FragColor = vec4(outColor, uAlpha);
    #drawbuffer Mars gl_FragColor = vec4(outColor, 1.0);
}
{@}OpenRoverScreen.glsl{@}#!ATTRIBUTES

#!UNIFORMS

uniform float uTime;
uniform float uTransition;
uniform vec3 uPosition;
uniform vec3 uBackground;
uniform sampler2D uSprite;
uniform sampler2D uGlow;
uniform vec2 uCells;
uniform float uIndex;

#!VARYINGS

varying vec2 vUv;
varying vec3 vMPos;

#!SHADER: OpenRoverScreen.vs

void main() {
    vMPos = (modelMatrix * vec4(position, 1.0)).xyz - uPosition;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: OpenRoverScreen.fs

#require(OpenTransition.glsl)

void main() {
    vec2 uv = vUv;
    uv.x = 1.0 - uv.x;

    // Had to to some tweaking as uIndex is often not accuate
    uv.x += floor(mod(uIndex, uCells.x - 0.1));
    uv.y += floor(floor(mod(uIndex, uCells.x * uCells.y - 0.1)) / uCells.x + 0.1);

    uv /= uCells;

    vec3 tex = texture2D(uSprite, uv).rgb;
    vec3 glow = texture2D(uGlow, uv).rgb;

    tex += 0.1;

    float r = 0.4;
    vec2 uv2 = vUv;
    float dist = length(mod(uv2 * vec2(32.0, 16.0), vec2(1.0)) - 0.5);
    float circle = smoothstep(r, r - 0.1, dist);
    tex *= circle;

    tex += uBackground;
    tex += glow * 0.5;

    float vignette = pow(max(smoothstep(0.4, 0.55, abs(vUv.x - 0.5)), smoothstep(0.3, 0.55, abs(vUv.y - 0.5))), 3.0);
    tex -= vignette * 0.1;

    transition();

    #drawbuffer Color gl_FragColor = vec4(tex, 1.0);
    #drawbuffer Mars gl_FragColor = vec4(tex, 1.0);
}
{@}OpenRoverWheels.glsl{@}#!ATTRIBUTES

attribute vec2 uv2;

#!UNIFORMS

uniform sampler2D uTread;
uniform sampler2D uAO;
uniform float uSide;
uniform float uTime;
uniform float uTransition;
uniform vec3 uPosition;
uniform vec3 uColor;
uniform vec3 uBulgePosition;

#!VARYINGS

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec4 vMVPos;
varying vec3 vMPos;
varying vec3 vLight;

#!SHADER: OpenRoverWheels.vs

void main() {
    vUv = uv;
    vUv2 = uv2;
    vMPos = (modelMatrix * vec4(position, 1.0)).xyz - uPosition;
    vNormal = normalize(normalMatrix * normal);
    vLight = normalize(vec3(-0.2, 1.0, 1.0));

    vec3 pos = position;

    float tyre = smoothstep(0.372, 0.6, length(pos.yz));

    float dist = length(vec3(vMPos - (uBulgePosition - uPosition)) * vec3(1.0, 2.0, 1.0));
    float strengthY = smoothstep(1.15, 0.0, dist) * tyre;
    float strengthScale = smoothstep(1.5, 0.0, dist) * tyre;

    pos *= 1.0 + strengthScale * 0.3;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    mPos.y += strengthY * 0.25;


    vMVPos = viewMatrix * mPos;
    gl_Position = projectionMatrix * vMVPos;
}

#!SHADER: OpenRoverWheels.fs

#require(normalmap.glsl)
#require(OpenTransition.glsl)
#require(OpenColor.glsl)

void main() {
    vec3 normal = unpackNormal(vMVPos.xyz, normalize(vNormal), uTread, 2.0 * uSide, 1.0, vUv);

    vec3 outColor = getOpenColor(normal);

    transition();

    #drawbuffer Color gl_FragColor = vec4(outColor, 1.0);
    #drawbuffer Mars gl_FragColor = vec4(outColor, 1.0);
}
{@}OpenTransition.glsl{@}void transition() {
    float progress = 1.0 - smoothstep(0.3, 1.0, uTransition);

    float shift = uTime * 0.6;
    float dotSize = 0.3;
    float a =
        (abs(0.5 * dotSize - mod(vMPos.x + sin(vMPos.z * 0.3) + shift, dotSize)) / (dotSize * 0.5)) *
        (abs(0.5 * dotSize - mod(vMPos.y + sin(vMPos.z * 0.4) + shift, dotSize)) / (dotSize * 0.5)) *
        (abs(0.5 * dotSize - mod(vMPos.z + sin(vMPos.x * 0.2) + shift, dotSize)) / (dotSize * 0.5));

    float range = smoothstep(0.0, 1.0, vMPos.y - 5.0 + progress * 6.0);
    if (a < range) discard;
}
{@}Terrain.glsl{@}#!ATTRIBUTES
attribute float quadrant;

#!UNIFORMS
uniform sampler2D uBgOpen;
uniform sampler2D uBgMars;
uniform sampler2D uGrid;
uniform sampler2D uDiffuse;
uniform sampler2D uNormal;
uniform float uTransition;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCenterPosition;

#!VARYINGS
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec4 vMPos;
varying vec4 vMVPos;

#!SHADER: Terrain.vs

#require(shadowparam.vs)
#require(conditionals.glsl)

void infiniteQuadrant(inout vec3 pos) {
    float size = 100.0;

    // X direction
    float xLimit = (size * 0.25) + (size * 0.5) * when_gt(mod(quadrant, 2.0), 0.5);
    float xNum = floor(uCenterPosition.x / size);
    pos.x += size * (xNum + when_gt(mod(uCenterPosition.x, size), xLimit));

    // Z direction
    float zLimit = (size * 0.25) + (size * 0.5) * when_gt(quadrant, 1.5);
    float zNum = floor(uCenterPosition.z / size);
    pos.z += size * (zNum + when_gt(mod(uCenterPosition.z, size), zLimit));
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;

    infiniteQuadrant(pos);

    vPos = pos;
    vMPos = modelMatrix * vec4(pos, 1.0);
    vMVPos = viewMatrix * vMPos;
    gl_Position = projectionMatrix * vMVPos;

    #require(shadow.vs)
}

#!SHADER: Terrain.fs
#require(normalmap.glsl)
#require(range.glsl)
#require(shadow.fs)

float snoise(vec2 v) {
    float t = v.x * 0.3;
    v.y *= 0.8;
    float noise = 0.0;
    float s = 0.5;
    noise += range(sin(v.x * 0.9 / s + t * 10.0) + sin(v.x * 2.4 / s + t * 15.0) + sin(v.x * -3.5 / s + t * 4.0) + sin(v.x * -2.5 / s + t * 7.1), -1.0, 1.0, -0.3, 0.3);
    noise += range(sin(v.y * -0.3 / s + t * 18.0) + sin(v.y * 1.6 / s + t * 18.0) + sin(v.y * 2.6 / s + t * 8.0) + sin(v.y * -2.6 / s + t * 4.5), -1.0, 1.0, -0.3, 0.3);
    return noise;
}

void applyFog(vec3 fog, inout vec3 tex, float near) {
    float dist = smoothstep(near, 40.0, length(vMPos.xyz - cameraPosition));
    tex = mix(tex, fog, dist);
}

vec3 getMarsColor() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 bg = texture2D(uBgMars, uv).rgb;

    float s = 4.0;
    vec3 normal = unpackNormal(vMVPos.xyz, normalize(vNormal), uNormal, 0.2, 1.0, vUv * s);
    vec3 color = texture2D(uDiffuse, vUv * s).rgb;
    float shading = dot(normal, normalize(vec3(0.0, 1.0, 0.0)));
    color += shading * shading * 0.5 - 0.4;

    applyFog(bg, color, 10.0);
    return color;
}

vec3 getOpenColor() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 bg = texture2D(uBgOpen, uv).rgb;

    float grid = texture2D(uGrid, vUv * 100.0).g;
    float noise = snoise((vPos.zx) + uTime*0.75);
    grid *= 0.65+noise*0.35;

    vec3 color = bg + grid;

    float shading = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
    color *= (shading * 0.1 + 0.9);

    applyFog(bg, color, 20.0);
    return color;
}

void main() {
    vec3 openColor = getOpenColor();
    vec3 marsColor = getMarsColor();

    float shadow = getShadowValue();

    float value = pow(smoothstep(0.15, 0.3,  abs(uTransition - 0.5)), 1.0);
    openColor *= (1.0 - 0.1*value) + 0.1 * shadow * value;
    marsColor *= (1.0 - 0.45*value) + 0.45 * shadow * value;

    #drawbuffer Color gl_FragColor = vec4(openColor, 0.7);
    #drawbuffer Mars gl_FragColor = vec4(marsColor, 1.0);
}{@}TerrainRocks.glsl{@}#!ATTRIBUTES
attribute float quadrant;

#!UNIFORMS
uniform sampler2D uBgOpen;
uniform sampler2D uBgMars;
uniform sampler2D uGrid;
uniform sampler2D uDiffuse;
uniform float uTransition;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCenterPosition;

#!VARYINGS
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec4 vMPos;
varying vec4 vMVPos;

#!SHADER: TerrainRocks.vs

#require(shadowparam.vs)
#require(conditionals.glsl)

void infiniteQuadrant(inout vec3 pos) {
    float size = 100.0;

    // X direction
    float xLimit = (size * 0.25) + (size * 0.5) * when_gt(mod(quadrant, 2.0), 0.5);
    float xNum = floor(uCenterPosition.x / size);
    pos.x += size * (xNum + when_gt(mod(uCenterPosition.x, size), xLimit));

    // Z direction
    float zLimit = (size * 0.25) + (size * 0.5) * when_gt(quadrant, 1.5);
    float zNum = floor(uCenterPosition.z / size);
    pos.z += size * (zNum + when_gt(mod(uCenterPosition.z, size), zLimit));
}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;

    infiniteQuadrant(pos);

    vPos = pos;
    vMPos = modelMatrix * vec4(pos, 1.0);
    vMVPos = viewMatrix * vMPos;
    gl_Position = projectionMatrix * vMVPos;

    #require(shadow.vs)
}

#!SHADER: TerrainRocks.fs
#require(normalmap.glsl)
#require(range.glsl)
#require(shadow.fs)
#require(simplenoise.glsl)
#require(rgb2hsv.fs)

void applyFog(vec3 fog, inout vec3 tex, float near) {
    float dist = smoothstep(near, 40.0, length(vMPos.xyz - cameraPosition));
    tex = mix(tex, fog, dist);
}

vec3 getMarsColor() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 bg = texture2D(uBgMars, uv).rgb;

    float s = 1.0;
    vec3 color = texture2D(uDiffuse, vUv * s).rgb;
    float shading = dot(normalize(vNormal), normalize(vec3(0.0, 1.0, 0.0)));
    color += shading * shading * 0.3 - 0.2;

    applyFog(bg, color, 10.0);
    return color;
}

vec3 getOpenColor() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 bg = texture2D(uBgOpen, uv).rgb;

    vec3 color = bg;
    float shading = dot(normalize(vNormal), normalize(vec3(1.0, 1.0, 1.0)));
    color *= (shading * 1.0 + 1.0);

    float noise = cnoise((vPos * 0.3) + uTime*0.25);
    color *= range(noise, -1.0, 1.0, shading, 1.5);
    color = mix(color, vec3(1.0), 0.05);

    applyFog(bg, color, 20.0);

    return color;
}

void main() {
    vec3 openColor = getOpenColor();
    vec3 marsColor = getMarsColor();

    float shadow = getShadowValue();

    float value = pow(smoothstep(0.15, 0.3,  abs(uTransition - 0.5)), 1.0);
    openColor *= (1.0 - 0.1*value) + 0.1 * shadow * value;
    marsColor *= (1.0 - 0.45*value) + 0.45 * shadow * value;


    float alpha = range(rgb2hsv(openColor).z, 0.0, 1.0, 0.0, 0.5);

    #drawbuffer Color gl_FragColor = vec4(openColor, alpha);
    #drawbuffer Mars gl_FragColor = vec4(marsColor, 1.0);
}{@}TerrainSKY.glsl{@}#!ATTRIBUTES
attribute vec3 center;

#!UNIFORMS
uniform vec3 uColor;
uniform sampler2D tSkyBlue;
uniform sampler2D tSkyMars;
uniform vec2 uResolution;

#!VARYINGS
varying vec3 vWorldPos;
varying vec3 vCenter;

#!SHADER: TerrainSKY.vs
void main() {
    vCenter = center;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: TerrainSKY.fs

 float edgeFactorTri() {
    vec3 d = fwidth(vCenter.xyz);
    vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vCenter.xyz);
    return min(min(a3.x, a3.y), a3.z);
 }

void applyFog(inout vec4 texel, sampler2D tMap) {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec4 sky = texture2D(tMap, uv);

    float dist = length(vWorldPos - cameraPosition);

    texel = mix(texel, sky, 0.5);
}

vec4 getBlueColor() {
    vec4 texel = vec4(uColor, 1.0);
    applyFog(texel, tSkyBlue);

    vec4 grid = vec4(vec3(edgeFactorTri()), 1.0);

    return texel;
}

vec4 getMarsColor() {
    // tSkyMars
    return vec4(1.0 - uColor, 1.0);
}

void main() {
    // set framebuffers
    #drawbuffer Color gl_FragColor = getBlueColor();
    #drawbuffer Sky gl_FragColor = getMarsColor();
}{@}CameraOverride.glsl{@}#!ATTRIBUTES

#!UNIFORMS

#!VARYINGS

#!SHADER: CameraOverride.vs
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

#!SHADER: CameraOverride.fs
void main() {
    #drawbuffer Color gl_FragColor = vec4(1.0);
    #drawbuffer Mars gl_FragColor = vec4(1.0);
}{@}BlendScenes.fs{@}uniform sampler2D tMars;
uniform float uTransition;
uniform float uTransition2;
uniform float uRGBStrength;
uniform float uSilhouette;

#require(rgbshift.fs)
#require(range.glsl)

void main() {
    #test Tests.rgbShift()
    vec4 open = getRGB(tDiffuse, vUv, 0.04, uRGBStrength * 0.001 * 0.7);
    vec4 mars = getRGB(tMars, vUv, 0.04, uRGBStrength * 0.001);
    #endtest

    #test !Tests.rgbShift()
    vec4 open = texture2D(tDiffuse, vUv);
    vec4 mars = texture2D(tMars, vUv);
    #endtest

    float falloff = 0.25; // % of screen width
    float p = mix(uTransition, uTransition2, abs(vUv.y - 0.3));
    p = p * (1.0 + 2.0 * falloff) - falloff;
    float alpha = 1.0 - smoothstep(p - falloff, p + falloff, vUv.x);

    gl_FragColor = mix(mars, open, mix(uTransition, alpha, 0.5));

    float dist = length(vUv - vec2(0.5));
    gl_FragColor.rgb *= range(dist, 0.0, 0.5, 1.0, uSilhouette);
}