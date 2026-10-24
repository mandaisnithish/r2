/* Author: Nithish Kaliannan Ananth */
// src/components/ui/CircuitDivider.tsx
// Section divider drawn as PCB traces. The first time it scrolls into
// view, a charge pulse travels the trace and lands on a pad, "powering"
// the section below (whose TelemetryHeader then flickers on).

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_HYDRO } from "../../lib/motion";

type Variant = "left" | "right" | "split";

// Traces are drawn on a 1200×64 board; the SVG stretches horizontally and
// non-scaling strokes keep the copper 1 px.
const TRACES: Record<Variant, { d: string; pad: [number, number] }[]> = {
  left: [
    { d: "M0 20 H260 L284 44 H520", pad: [520, 44] },
    { d: "M0 28 H236 L268 60 H360", pad: [360, 60] },
  ],
  right: [
    { d: "M1200 20 H940 L916 44 H680", pad: [680, 44] },
    { d: "M1200 28 H964 L932 60 H840", pad: [840, 60] },
  ],
  split: [
    { d: "M0 24 H420 L444 48 H600", pad: [600, 48] },
    { d: "M1200 24 H780 L756 48 H600", pad: [600, 48] },
  ],
};

export default function CircuitDivider({
  variant = "left",
  label,
  className = "",
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const traces = TRACES[variant];
  const padX = traces[0].pad[0] / 1200;

  return (
    <div ref={ref} aria-hidden="true" className={`grid-wrap relative ${className}`}>
      <div className="relative h-16">
        <svg viewBox="0 0 1200 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {traces.map((t, i) => (
            <g key={i}>
              <path d={t.d} fill="none" stroke="#1B2833" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <motion.path
                d={t.d}
                fill="none"
                stroke="#2A3A47"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.9, ease: EASE_HYDRO, delay: i * 0.08 }}
              />
              {/* the charge: a short bright segment running the trace once */}
              <motion.path
                d={t.d}
                fill="none"
                stroke={i === 0 ? "#38C6D9" : "#E5A93B"}
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0.08, pathOffset: 0, opacity: 0 }}
                animate={inView ? { pathOffset: 0.92, opacity: [0, 1, 1, 0] } : {}}
                transition={{
                  pathOffset: { duration: 1.1, ease: [0.45, 0, 0.55, 1], delay: 0.5 + i * 0.15 },
                  opacity: { duration: 1.1, times: [0, 0.1, 0.85, 1], delay: 0.5 + i * 0.15 },
                }}
              />
            </g>
          ))}
        </svg>
        {/* solder pad + label, positioned in HTML so they never distort */}
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `${padX * 100}%`, top: `${(traces[0].pad[1] / 64) * 100}%` }}
        >
          <span
            className={`block h-2.5 w-2.5 -translate-y-1/2 border transition-colors duration-300 ${
              inView ? "border-hydro bg-hydro/20" : "border-line-2 bg-abyss"
            }`}
            style={{ transitionDelay: inView ? "1.4s" : "0s" }}
          />
          {label && (
            <span className="stencil absolute left-4 top-[-7px] whitespace-nowrap text-[10px]">{label}</span>
          )}
        </span>
      </div>
    </div>
  );
}
