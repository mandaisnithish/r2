// src/components/layout/HydroRouteTransition.tsx
// Route change = a dark-teal wave sweeps up under the instrument strip,
// trailing bubbles, while the old page sinks out and the new one settles
// in (DESIGN_SYSTEM.md §6). Reduced motion: a short crossfade only.

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_HYDRO } from "../../lib/motion";

const BUBBLES = [
  [8, 22, 5], [17, 48, 3], [26, 12, 4], [33, 70, 6], [41, 35, 3], [52, 58, 5],
  [61, 18, 4], [69, 76, 3], [77, 40, 6], [86, 64, 4], [93, 28, 3], [12, 84, 4],
] as const;

function WaveWipe() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
      style={{ height: "calc(140vh + 120px)" }}
      initial={{ y: "100vh" }}
      animate={{ y: "-150vh" }}
      transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[120px] w-full">
        <path
          d="M0 70 C 180 20, 360 110, 540 62 S 900 18, 1080 66 S 1320 104, 1440 58 V120 H0 Z"
          fill="#071C24"
        />
        <path
          d="M0 70 C 180 20, 360 110, 540 62 S 900 18, 1080 66 S 1320 104, 1440 58"
          fill="none"
          stroke="#00E5FF"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative h-[140vh] bg-[#071C24]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,229,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {BUBBLES.map(([x, y, r], i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-hydro/50"
            style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2 }}
            initial={{ y: 0, opacity: 0.9 }}
            animate={{ y: -90 - r * 12, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.02 }}
          />
        ))}
        <div className="absolute left-1/2 top-[18vh] -translate-x-1/2 font-mono text-[11px] uppercase tracking-stencil text-hydro/80">
          Displacing · rerouting
        </div>
      </div>
    </motion.div>
  );
}

export default function HydroRouteTransition({
  routeKey,
  reduced,
  children,
}: {
  routeKey: string;
  reduced: boolean;
  children: ReactNode;
}) {
  // Count route changes (not the first render) to replay the wave.
  const [prev, setPrev] = useState(routeKey);
  const [wave, setWave] = useState(0);
  if (prev !== routeKey) {
    setPrev(routeKey);
    setWave((w) => w + 1);
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })}>
        <motion.div
          key={routeKey}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0, transition: { duration: reduced ? 0.15 : 0.6, ease: EASE_HYDRO, delay: reduced ? 0 : 0.08 } }}
          exit={reduced ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, y: -14, transition: { duration: 0.42, ease: [0.4, 0, 1, 1] } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {!reduced && wave > 0 && <WaveWipe key={wave} />}
    </>
  );
}
