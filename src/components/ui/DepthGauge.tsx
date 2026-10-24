// src/components/ui/DepthGauge.tsx
// Fixed depth gauge on the viewport edge: scrolling the page is a dive
// from the canopy (0.0 m) to the telemetry core (−25.0 m). Damped needle,
// mono readout, zone labels. Hidden below 1024 px.

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { DEPTH_STOPS, depthAt, zoneAt } from "../../lib/depth";

const TICKS = Array.from({ length: 41 }, (_, i) => i / 40);

export default function DepthGauge() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const top = useTransform(smooth, (p) => `${p * 100}%`);
  const reading = useTransform(smooth, (p) => `${depthAt(p).toFixed(2)} m`);
  const [zone, setZone] = useState(DEPTH_STOPS[0].label);
  useMotionValueEvent(smooth, "change", (p) => {
    const z = zoneAt(p).label;
    setZone((prev) => (prev === z ? prev : z));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-[52vh] -translate-y-1/2 lg:block xl:right-7"
    >
      <div className="relative h-full w-8">
        {/* scale */}
        <span className="absolute right-0 top-0 h-full w-px bg-line-2" />
        {TICKS.map((t) => (
          <span
            key={t}
            className={`absolute right-0 h-px ${Math.round(t * 40) % 5 === 0 ? "w-3 bg-line-2" : "w-1.5 bg-line"}`}
            style={{ top: `${t * 100}%` }}
          />
        ))}
        {DEPTH_STOPS.map((s) => (
          <span
            key={s.label}
            className="absolute right-4 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-stencil text-drift/80"
            style={{ top: `${s.p * 100}%` }}
          >
            {s.depth.toFixed(1)}
          </span>
        ))}
        {/* needle */}
        <motion.span className="absolute right-[-4px] h-0 w-0" style={{ top }}>
          <span className="absolute right-0 top-[-5px] h-[10px] w-[10px] border border-hydro bg-abyss" />
          <span className="absolute right-[10px] top-[-1px] h-px w-3 bg-hydro" />
        </motion.span>
        {/* readout, parked under the scale so it never sits on content */}
        <span className="absolute right-0 top-[calc(100%+14px)] whitespace-nowrap text-right">
          <motion.span className="block font-mono text-[11px] text-hydro tabular">{reading}</motion.span>
          <span className="block font-mono text-[9px] uppercase tracking-stencil text-drift">{zone}</span>
        </span>
      </div>
    </div>
  );
}
