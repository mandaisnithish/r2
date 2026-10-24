// src/components/ui/SonarPingLayer.tsx
// Global sonar ping: clicking anything marked `data-ping` emits concentric
// bathymetric rings at the pointer, brightens the blueprint grid around
// it, and sends a ripple into the WebGL water (via hydroBus). One
// delegated listener for the whole app.

import { useEffect, useRef, useState } from "react";
import { rippleAt } from "../../lib/hydroBus";

type Ping = { id: number; x: number; y: number };

export default function SonarPingLayer({ reduced }: { reduced: boolean }) {
  const [pings, setPings] = useState<Ping[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    if (reduced) return;
    const grid = document.querySelector<HTMLElement>(".blueprint");
    let raf = 0;

    const onPointerDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("[data-ping]");
      if (!target) return;
      const id = nextId.current++;
      setPings((p) => [...p.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setPings((p) => p.filter((q) => q.id !== id)), 1100);
      // Buttons already ripple themselves; cards and tabs ripple here.
      if (!target.matches("button, a")) rippleAt(e.clientX, e.clientY, 0.7);

      if (grid) {
        cancelAnimationFrame(raf);
        const start = performance.now();
        grid.style.setProperty("--ping-x", `${e.clientX}px`);
        grid.style.setProperty("--ping-y", `${e.clientY}px`);
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 900);
          const r = 40 + 360 * (1 - Math.pow(1 - t, 3));
          grid.style.setProperty("--ping-r", `${(1 - t) * r}px`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      {pings.map((p) => (
        <span key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hydro/70"
              style={{ animation: `ring-out 900ms cubic-bezier(.22,.9,.24,1) ${i * 110}ms both` }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
