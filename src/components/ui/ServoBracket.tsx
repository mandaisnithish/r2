// src/components/ui/ServoBracket.tsx
// Four L-shaped corner brackets that "home in" with stepped, stepper-motor
// ticks the first time they enter the viewport (DESIGN_SYSTEM.md §6).

import { useRef } from "react";
import { useInView } from "framer-motion";

type Tone = "line" | "hydro" | "arc" | "bone";

const TONE: Record<Tone, string> = {
  line: "border-line-2",
  hydro: "border-hydro",
  arc: "border-arc",
  bone: "border-bone/70",
};

export default function ServoBracket({
  tone = "line",
  size = 12,
  inset = -1,
  className = "",
}: {
  tone?: Tone;
  size?: number;
  inset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const corners = [
    { pos: { top: inset, left: inset }, b: "border-t border-l", r: -90 },
    { pos: { top: inset, right: inset }, b: "border-t border-r", r: 90 },
    { pos: { bottom: inset, left: inset }, b: "border-b border-l", r: 90 },
    { pos: { bottom: inset, right: inset }, b: "border-b border-r", r: -90 },
  ];
  return (
    <span ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {corners.map((c, i) => (
        <span
          key={i}
          className={`absolute ${c.b} ${TONE[tone]} transition-transform duration-[540ms] ease-servo`}
          style={{
            ...c.pos,
            width: size,
            height: size,
            transform: inView ? "rotate(0deg) scale(1)" : `rotate(${c.r}deg) scale(0.4)`,
            transitionDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </span>
  );
}
