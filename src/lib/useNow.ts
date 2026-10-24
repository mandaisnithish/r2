// src/lib/useNow.ts
// Minute-resolution clock as an external store, so countdowns and
// timestamps stay pure during render and tick once a minute.

import { useSyncExternalStore } from "react";

let listeners = new Set<() => void>();
let timer: number | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (timer === null) timer = window.setInterval(() => listeners.forEach((l) => l()), 60_000);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
      listeners = new Set();
    }
  };
}

const snapshot = () => Math.floor(Date.now() / 60_000) * 60_000;

/** Current time (ms), refreshed every minute. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Whole days until `iso` (local midnight), never negative. */
export function daysUntil(now: number, iso: string): number {
  const target = new Date(`${iso}T00:00:00+05:30`).getTime();
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}
