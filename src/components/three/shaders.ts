// src/components/three/shaders.ts
// GLSL for the Hydro-Field (DESIGN_SYSTEM.md §5). WebGL2 only (three r163+).

/* ------------------------------------------------------------------ */
/* Water surface: summed directional waves + ripple ring buffer +     */
/* cursor wake. Fragment bands height into bathymetric contour lines. */
/* ------------------------------------------------------------------ */

export const waterVertex = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRipples[4];   // xy = world xz, z = start time, w = strength
  uniform vec2 uPointer;      // world xz under the cursor
  uniform float uWake;        // 0..1, eases with pointer motion
  uniform float uAmp;         // global swell multiplier
  varying float vH;
  varying vec3 vWorld;

  float wave(vec2 p, vec2 dir, float freq, float speed, float amp) {
    return sin(dot(p, normalize(dir)) * freq + uTime * speed) * amp;
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xz;
    float h = 0.0;
    h += wave(p, vec2(1.0, 0.3), 0.32, 0.8, 0.20);
    h += wave(p, vec2(-0.4, 1.0), 0.55, 1.15, 0.10);
    h += wave(p, vec2(0.7, -0.8), 1.25, 1.7, 0.045);
    h += wave(p, vec2(-1.0, -0.2), 2.4, 2.4, 0.018);
    h *= uAmp;

    for (int i = 0; i < 4; i++) {
      vec4 r = uRipples[i];
      float age = uTime - r.z;
      if (age > 0.0 && age < 7.0) {
        float d = distance(p, r.xy);
        float front = age * 2.6;
        float env = exp(-abs(d - front) * 1.4) * exp(-age * 0.62) * r.w;
        h += sin((d - front) * 5.5) * 0.24 * env;
      }
    }

    float dw = distance(p, uPointer);
    h += sin(dw * 4.5 - uTime * 4.0) * 0.07 * exp(-dw * 0.85) * uWake;

    pos.y += h;
    vH = h;
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const waterFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uCrest;
  uniform vec3 uLine;
  uniform vec3 uHydro;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  varying float vH;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float facing = abs(dot(n, viewDir));
    float fres = pow(1.0 - facing, 3.0);

    // bathymetric contour lines banded on wave height
    float k = vH * 11.0;
    float c = abs(fract(k) - 0.5);
    float band = 1.0 - smoothstep(0.0, fwidth(k) * 1.6, abs(c - 0.5));

    // faint survey grid every 2 m
    vec2 gp = vWorld.xz / 2.0;
    vec2 g = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
    float grid = 1.0 - min(min(g.x, g.y), 1.0);

    vec3 col;
    if (gl_FrontFacing) {
      col = mix(uDeep, uCrest, smoothstep(-0.18, 0.28, vH));
      col += uHydro * fres * 0.14;
      col = mix(col, mix(uLine, uHydro, smoothstep(0.05, 0.32, vH)), band * 0.55);
      col += uLine * grid * 0.35;
    } else {
      // seen from below: the bright ceiling of the water, a hint of caustics
      float caus = noise(vWorld.xz * 1.6 + uTime * 0.35) * noise(vWorld.xz * 2.3 - uTime * 0.27);
      col = mix(vec3(0.02, 0.12, 0.15), vec3(0.04, 0.33, 0.38), smoothstep(-0.2, 0.3, vH));
      col += uHydro * pow(caus, 2.0) * 0.55;
      col = mix(col, uHydro * 0.45, band * 0.35);
    }

    float dist = length(cameraPosition - vWorld);
    float fogF = smoothstep(uFogNear, uFogFar, dist);
    gl_FragColor = vec4(mix(col, uFog, fogF), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Seabed: fbm terrain rendered as a sonar bathymetry survey.         */
/* ------------------------------------------------------------------ */

const noiseLib = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

export const seabedVertex = /* glsl */ `
  ${noiseLib}
  varying float vElev;
  varying vec3 vWorld;
  void main() {
    vec3 pos = position;
    float e = fbm(pos.xz * 0.06) * 7.0 + fbm(pos.xz * 0.21) * 1.2;
    // a shallow channel where the river once ran
    e -= exp(-pow((pos.x + sin(pos.z * 0.08) * 6.0) * 0.12, 2.0)) * 2.4;
    pos.y += e;
    vElev = e;
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const seabedFragment = /* glsl */ `
  ${noiseLib}
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uLine;
  uniform vec3 uHydro;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec4 uPing;   // xy world xz, z start time, w strength
  varying float vElev;
  varying vec3 vWorld;
  void main() {
    // contour every 0.5 m, index contour every 2.5 m
    float k = vElev * 2.0;
    float minor = 1.0 - smoothstep(0.0, fwidth(k) * 1.3, min(fract(k), 1.0 - fract(k)));
    float k2 = vElev * 0.4;
    float major = 1.0 - smoothstep(0.0, fwidth(k2) * 1.5, min(fract(k2), 1.0 - fract(k2)));

    vec3 col = uBase * (0.6 + vElev * 0.06);
    col = mix(col, uLine, minor * 0.6);
    col = mix(col, uHydro * 0.55, major * 0.5);

    float caus = noise(vWorld.xz * 0.9 + uTime * 0.25) * noise(vWorld.xz * 1.4 - uTime * 0.2);
    col += uHydro * pow(caus, 3.0) * 0.25;

    // sonar ping sweeping outward across the survey
    float age = uTime - uPing.z;
    if (age > 0.0 && age < 4.0) {
      float d = distance(vWorld.xz, uPing.xy);
      float ring = exp(-abs(d - age * 9.0) * 0.9) * exp(-age * 0.9) * uPing.w;
      col += uHydro * ring * 0.9;
    }

    float fogF = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld));
    gl_FragColor = vec4(mix(col, uFog, fogF), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Bubbles: points rising through the water column.                    */
/* ------------------------------------------------------------------ */

export const bubbleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uTop;
  uniform float uBottom;
  uniform float uDrift;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float span = uTop - uBottom;
    p.y = uBottom + mod(p.y - uBottom + uTime * aSpeed, span);
    p.x += sin(uTime * 0.7 + aSeed * 6.28) * 0.25 + uDrift * (p.y - uBottom) * 0.04;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.0 + aSeed * 3.0) * (12.0 / -mv.z);
    vAlpha = smoothstep(uBottom, uBottom + 2.0, p.y) * (1.0 - smoothstep(uTop - 1.0, uTop, p.y));
    gl_Position = projectionMatrix * mv;
  }
`;

export const bubbleFragment = /* glsl */ `
  uniform vec3 uHydro;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    float ring = smoothstep(0.5, 0.38, r) * smoothstep(0.18, 0.32, r);
    if (ring < 0.01) discard;
    gl_FragColor = vec4(uHydro, ring * vAlpha * 0.55);
  }
`;
