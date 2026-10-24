/* Author: Nithish Kaliannan Ananth */
// src/components/three/waves.ts
// CPU mirror of the swell in waterVertex (without ripples/wake) so floating
// objects sit on the same surface the shader draws. Keep in sync with
// shaders.ts → waterVertex.

export const hydroClock = { t: 0 };

/** Fog state written by the camera rig each frame (depth-dependent) and
 *  read by the shader materials, which do their own fog. */
export const hydroEnv = { fog: "#07131B", near: 8, far: 46, seabedFog: "#03080B" };

function wave(x: number, z: number, dx: number, dz: number, freq: number, speed: number, amp: number, t: number) {
  const len = Math.hypot(dx, dz);
  return Math.sin(((x * dx + z * dz) / len) * freq + t * speed) * amp;
}

export function swellHeight(x: number, z: number, t = hydroClock.t, amp = 1): number {
  return (
    (wave(x, z, 1, 0.3, 0.32, 0.8, 0.2, t) +
      wave(x, z, -0.4, 1, 0.55, 1.15, 0.1, t) +
      wave(x, z, 0.7, -0.8, 1.25, 1.7, 0.045, t) +
      wave(x, z, -1, -0.2, 2.4, 2.4, 0.018, t)) *
    amp
  );
}

/** Deterministic PRNG so geometry is stable between renders (and lint-pure). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
