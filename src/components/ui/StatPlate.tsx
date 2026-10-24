// src/components/ui/StatPlate.tsx
// A big stencilled reading (no count-up from zero: the real value is in
// the markup; it only slides up from behind a mask once).

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_HYDRO } from "../../lib/motion";

export default function StatPlate({
  value,
  unit,
  label,
  code,
  tone = "bone",
  className = "",
}: {
  value: ReactNode;
  unit?: ReactNode;
  label: ReactNode;
  code?: string;
  tone?: "bone" | "hydro" | "arc";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const color = tone === "hydro" ? "text-hydro" : tone === "arc" ? "text-arc" : "text-bone";
  return (
    <div ref={ref} className={`relative border-l border-line pl-5 ${className}`}>
      <span aria-hidden="true" className="absolute left-[-1px] top-0 h-6 w-px bg-hydro" />
      {code && <span className="stencil">{code}</span>}
      <div className="mt-2 overflow-hidden">
        <motion.p
          className={`font-display text-5xl font-semibold leading-none tabular sm:text-6xl ${color}`}
          initial={{ y: "105%" }}
          animate={inView ? { y: "0%" } : {}}
          transition={{ duration: 0.8, ease: EASE_HYDRO }}
        >
          {value}
          {unit && <span className="ml-1 font-mono text-base font-normal text-drift sm:text-lg">{unit}</span>}
        </motion.p>
      </div>
      <p className="mt-3 max-w-[18rem] text-[14px] leading-snug text-fog">{label}</p>
    </div>
  );
}
