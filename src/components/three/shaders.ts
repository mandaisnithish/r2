/* Author: Nithish Kaliannan Ananth */
// src/components/three/shaders.ts
// Realistic physical underwater & ocean surface GLSL shaders:
// - Multi-octave swell + capillary micro-ripples, Schlick Fresnel, subsurface
//   scattering, sun glints, and underwater Snell's window + Voronoi caustics.
// - Sculpted sand-ripple seabed with dual-layer shimmering sunlight caustics.
// - Volumetric god-ray sun shafts streaming down from the surface.
// - Glassy refracting air bubbles + suspended marine snow particles.

const noiseLib = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.04;
      a *= 0.5;
    }
    return v;
  }
  // Cellular / Voronoi caustic network simulating refracted sunlight
  float causticPattern(vec2 uv, float t) {
    vec2 p1 = uv * 1.35 + vec2(t * 0.28, -t * 0.21);
    vec2 p2 = uv * 1.95 + vec2(-t * 0.24, t * 0.31);
    float n1 = abs(noise(p1) - 0.5) * 2.0;
    float n2 = abs(noise(p2) - 0.5) * 2.0;
    float c1 = 1.0 - smoothstep(0.0, 0.28, n1);
    float c2 = 1.0 - smoothstep(0.0, 0.28, n2);
    return pow(clamp(c1 * 0.65 + c2 * 0.65, 0.0, 1.0), 1.85);
  }
`;

export const waterVertex = /* glsl */ `
  uniform float uTime;
  uniform vec4 uRipples[4];   // xy = world xz, z = start time, w = strength
  uniform vec2 uPointer;      // world xz under the cursor
  uniform float uWake;        // 0..1, eases with pointer motion
  uniform float uAmp;         // global swell multiplier
  varying float vH;
  varying float vFoam;
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

    float rippleFoam = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 r = uRipples[i];
      float age = uTime - r.z;
      if (age > 0.0 && age < 7.0) {
        float d = distance(p, r.xy);
        float front = age * 2.6;
        float env = exp(-abs(d - front) * 1.4) * exp(-age * 0.62) * r.w;
        float rw = sin((d - front) * 5.5) * 0.24 * env;
        h += rw;
        rippleFoam += env * 0.55;
      }
    }

    float dw = distance(p, uPointer);
    float wakeEnv = exp(-dw * 0.85) * uWake;
    h += sin(dw * 4.5 - uTime * 4.0) * 0.07 * wakeEnv;

    pos.y += h;
    vH = h;
    vFoam = clamp(smoothstep(0.19, 0.32, h) * 0.45 + rippleFoam + wakeEnv * 0.25, 0.0, 1.0);
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const waterFragment = /* glsl */ `
  ${noiseLib}
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uCrest;
  uniform vec3 uLine;
  uniform vec3 uHydro;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  varying float vH;
  varying float vFoam;
  varying vec3 vWorld;

  void main() {
    // Base geometric normal from screen-space derivatives + fine capillary wave detail
    vec3 geomN = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    vec2 uv = vWorld.xz;
    float micro1 = fbm(uv * 1.85 + vec2(uTime * 0.32, -uTime * 0.24));
    float micro2 = fbm(uv * 3.90 + vec2(-uTime * 0.41, uTime * 0.29));
    vec3 detailN = normalize(vec3(
      (micro1 - 0.5) * 0.26 + (micro2 - 0.5) * 0.14,
      1.0,
      (micro2 - 0.5) * 0.26 - (micro1 - 0.5) * 0.14
    ));
    vec3 n = normalize(mix(geomN, detailN, 0.48));

    vec3 viewDir = normalize(cameraPosition - vWorld);
    float NoV = clamp(abs(dot(n, viewDir)), 0.001, 1.0);
    // Schlick Fresnel for water (F0 = 0.02)
    float fresnel = 0.02 + 0.98 * pow(1.0 - NoV, 4.5);

    vec3 sunDir = normalize(vec3(0.38, 0.86, 0.34));
    vec3 halfVec = normalize(sunDir + viewDir);
    float spec = pow(max(dot(n, halfVec), 0.0), 96.0);
    float shimmer = pow(max(dot(n, halfVec), 0.0), 18.0);

    vec3 col;
    if (gl_FrontFacing) {
      // Looking at the water from above: deep pelagic blue in troughs,
      // turquoise subsurface scatter through wave crests, sky reflection & sun glints.
      float sss = smoothstep(-0.18, 0.28, vH);
      vec3 bodyCol = mix(uDeep, uCrest, sss);
      // Subsurface turquoise glow where sunlight passes through thin wave crests
      bodyCol += uHydro * pow(sss, 1.8) * 0.22;

      vec3 skyReflect = mix(vec3(0.08, 0.24, 0.33), vec3(0.52, 0.78, 0.88), fresnel);
      col = mix(bodyCol, skyReflect, fresnel * 0.72);

      // Sun glints & seafoam on crests/ripples
      col += vec3(0.95, 0.98, 1.0) * spec * 1.15;
      col += uHydro * shimmer * 0.18;
      float foamTex = fbm(uv * 4.5 + uTime * 0.15);
      col = mix(col, vec3(0.84, 0.94, 0.97), vFoam * smoothstep(0.32, 0.68, foamTex) * 0.65);
    } else {
      // Looking UP at the water surface from underwater:
      // Snell's window overhead (bright refracted daylight + dancing caustics)
      // transitioning into silvery-teal Total Internal Reflection at shallow angles.
      float snell = smoothstep(0.22, 0.76, NoV);
      float caus = causticPattern(uv * 0.55, uTime);
      vec3 skyWindow = mix(vec3(0.11, 0.39, 0.49), vec3(0.58, 0.88, 0.95), snell);
      skyWindow += vec3(0.82, 0.96, 1.0) * caus * (0.45 + 0.55 * snell);
      vec3 tirMirror = mix(vec3(0.02, 0.10, 0.15), vec3(0.07, 0.25, 0.33), micro1);
      col = mix(tirMirror, skyWindow, snell);
      col += vec3(0.92, 0.98, 1.0) * spec * 0.65;
    }

    float dist = length(cameraPosition - vWorld);
    float fogF = smoothstep(uFogNear, uFogFar, dist);
    gl_FragColor = vec4(mix(col, uFog, fogF), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Seabed: sculpted sandy & rocky ocean floor with natural caustics.  */
/* ------------------------------------------------------------------ */

export const seabedVertex = /* glsl */ `
  ${noiseLib}
  varying float vElev;
  varying vec3 vWorld;
  void main() {
    vec3 pos = position;
    float e = fbm(pos.xz * 0.055) * 6.5 + fbm(pos.xz * 0.19) * 1.35;
    // Subtle current-carved sand dunes & river channel
    float ripples = sin(pos.x * 1.8 + fbm(pos.xz * 0.35) * 3.2) * 0.14;
    e += ripples;
    e -= exp(-pow((pos.x + sin(pos.z * 0.08) * 6.0) * 0.12, 2.0)) * 2.2;
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
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    vec3 sunDir = normalize(vec3(0.3, 0.92, 0.25));
    float diff = clamp(dot(n, sunDir), 0.15, 1.0);

    // Fine sand grain & current ripple micro-texture
    float grain = fbm(vWorld.xz * 2.6);
    float sandRipple = 0.5 + 0.5 * sin(vWorld.x * 4.5 + grain * 4.0);
    vec3 sandCol = mix(uBase, uLine, clamp(vElev * 0.12 + grain * 0.35, 0.0, 1.0));
    sandCol *= (0.72 + 0.28 * diff) * (0.92 + 0.08 * sandRipple);

    // Projected underwater sunlight caustics dancing on the sand
    float caus = causticPattern(vWorld.xz * 0.42, uTime);
    float slopeMask = clamp(n.y * 1.1, 0.2, 1.0);
    sandCol += uHydro * caus * slopeMask * 0.42;

    // Gentle acoustic sonar pulse on route changes
    float age = uTime - uPing.z;
    if (age > 0.0 && age < 4.5) {
      float d = distance(vWorld.xz, uPing.xy);
      float ring = exp(-abs(d - age * 8.5) * 0.85) * exp(-age * 0.85) * uPing.w;
      sandCol += uHydro * ring * 0.45;
    }

    float fogF = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld));
    gl_FragColor = vec4(mix(sandCol, uFog, fogF), 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Bubbles & Marine Snow: glassy air bubbles + organic particulates.  */
/* ------------------------------------------------------------------ */

export const bubbleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uTop;
  uniform float uBottom;
  uniform float uDrift;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec3 p = position;
    float span = uTop - uBottom;
    // Half of particles are slow-drifting marine snow; half are rising air bubbles
    float isBubble = step(0.45, aSeed);
    float speed = mix(aSpeed * 0.18, aSpeed * 1.15, isBubble);
    p.y = uBottom + mod(p.y - uBottom + uTime * speed, span);
    p.x += sin(uTime * (0.5 + aSeed) + aSeed * 6.28) * (0.18 + isBubble * 0.18) + uDrift * (p.y - uBottom) * 0.035;
    p.z += cos(uTime * 0.45 + aSeed * 9.42) * 0.14;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float baseSize = mix(1.4 + aSeed * 1.6, 2.8 + fract(aSeed * 7.3) * 4.2, isBubble);
    gl_PointSize = clamp(baseSize * (11.0 / max(-mv.z, 1.5)), 1.0, 22.0);
    float depthFade = smoothstep(-32.0, -4.0, mv.z);
    vAlpha = depthFade * smoothstep(uBottom, uBottom + 2.5, p.y) * (1.0 - smoothstep(uTop - 1.2, uTop, p.y));
    vSeed = aSeed;
    gl_Position = projectionMatrix * mv;
  }
`;

export const bubbleFragment = /* glsl */ `
  uniform vec3 uHydro;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;

    if (vSeed < 0.45) {
      // Soft out-of-focus marine snow speck catching sunlight
      float snow = exp(-r * r * 14.0);
      gl_FragColor = vec4(mix(uHydro, vec3(0.88, 0.96, 0.98), 0.6), snow * vAlpha * 0.38);
    } else {
      // Realistic spherical air bubble with Fresnel rim + upper-left sun specular glint
      float z = sqrt(max(0.0, 0.25 - r * r));
      vec3 normal = normalize(vec3(c.x, -c.y, z));
      float fresnel = pow(1.0 - normal.z, 2.4);
      float spec = pow(max(0.0, dot(normal, normalize(vec3(-0.45, 0.55, 0.7)))), 24.0);
      float alpha = clamp(fresnel * 0.75 + spec * 0.95, 0.0, 1.0) * smoothstep(0.5, 0.42, r);
      vec3 col = mix(uHydro, vec3(0.95, 0.99, 1.0), clamp(spec * 1.3 + 0.25, 0.0, 1.0));
      gl_FragColor = vec4(col, alpha * vAlpha * 0.68);
    }
  }
`;

/* ------------------------------------------------------------------ */
/* Volumetric God Rays: sunlit shafts streaming down from surface.    */
/* ------------------------------------------------------------------ */

export const godRayVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const godRayFragment = /* glsl */ `
  ${noiseLib}
  uniform float uTime;
  uniform vec3 uSunColor;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    // Vertical fade from water surface (vUv.y = 1) down into the depths (vUv.y = 0)
    float vertFade = pow(vUv.y, 1.65) * smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
    // Horizontal edge softness
    float edgeFade = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
    // Shimmering rays modulated by surface waves overhead
    float ray1 = noise(vec2(vUv.x * 7.5 + uTime * 0.18, vUv.y * 0.6 - uTime * 0.12));
    float ray2 = noise(vec2(vUv.x * 13.0 - uTime * 0.22, vUv.y * 0.9 - uTime * 0.08));
    float streaks = pow(clamp(ray1 * 0.6 + ray2 * 0.55, 0.0, 1.0), 2.2);
    float distFade = smoothstep(38.0, 6.0, length(cameraPosition - vWorld));
    float alpha = vertFade * edgeFade * streaks * distFade * uIntensity;
    gl_FragColor = vec4(uSunColor, alpha);
  }
`;
