// src/lib/depth.ts
// Scroll = descent (DESIGN_SYSTEM.md §1, §5). One mapping shared by the
// DepthGauge HUD and the WebGL camera so they always agree.

export type DepthStop = { p: number; depth: number; label: string };

export const DEPTH_STOPS: DepthStop[] = [
  { p: 0, depth: 0, label: "Canopy · aerial" },
  { p: 0.18, depth: -1.5, label: "Hull & propulsion" },
  { p: 0.55, depth: -8, label: "Sensor array" },
  { p: 1, depth: -25, label: "Telemetry core" },
];

/** Depth in metres (≤ 0) for a page scroll progress 0..1. */
export function depthAt(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 1; i < DEPTH_STOPS.length; i++) {
    const a = DEPTH_STOPS[i - 1];
    const b = DEPTH_STOPS[i];
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p || 1);
      return a.depth + (b.depth - a.depth) * t;
    }
  }
  return DEPTH_STOPS[DEPTH_STOPS.length - 1].depth;
}

export function zoneAt(progress: number): DepthStop {
  let zone = DEPTH_STOPS[0];
  for (const s of DEPTH_STOPS) if (progress >= s.p - 0.001) zone = s;
  return zone;
}

/** Current page scroll progress, 0..1. */
export function scrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}
