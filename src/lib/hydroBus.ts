/* Author: Nithish Kaliannan Ananth */
// src/lib/hydroBus.ts
// Tiny pub/sub that lets DOM interactions talk to the WebGL water:
// a sonar ping or a route change in the page becomes a ripple in the
// shader. Coordinates are viewport-normalised (0..1, origin top-left).

export type HydroEvent =
  | { type: "ripple"; x: number; y: number; strength: number }
  | { type: "route"; path: string };

type Listener = (e: HydroEvent) => void;

const listeners = new Set<Listener>();

export const hydroBus = {
  emit(e: HydroEvent) {
    listeners.forEach((fn) => fn(e));
  },
  on(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

/** Convenience: ripple from a pointer event in client pixels. */
export function rippleAt(clientX: number, clientY: number, strength = 1) {
  if (typeof window === "undefined") return;
  hydroBus.emit({
    type: "ripple",
    x: clientX / window.innerWidth,
    y: clientY / window.innerHeight,
    strength,
  });
}
