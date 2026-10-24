/* Author: Nithish Kaliannan Ananth */
// src/lib/quality.ts
// Decides how much WebGL a device gets (DESIGN_SYSTEM.md §5).
//   high: full water mesh, bubbles, DPR up to 2
//   low:  reduced mesh, no bubbles, DPR 1
//   off:  no WebGL available -> static CSS poster

import { useSyncExternalStore } from "react";

export type QualityTier = "high" | "low" | "off";

export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

let cachedTier: QualityTier | null = null;

export function detectTier(): QualityTier {
  if (cachedTier) return cachedTier;
  if (!hasWebGL()) return (cachedTier = "off");
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  const narrow = window.matchMedia("(max-width: 820px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  cachedTier = narrow || coarse || cores <= 4 || memory <= 4 ? "low" : "high";
  return cachedTier;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** Live `prefers-reduced-motion` flag. */
export function useReducedMotionPref(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );
}
