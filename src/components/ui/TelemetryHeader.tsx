// src/components/ui/TelemetryHeader.tsx
// Section header: `[SYS-03 // PROPULSION]` index with a hairline that runs
// to the grid edge and ends in a crosshair, then the headline, which gives
// one "voltage flicker" when it powers on (after the CircuitDivider pulse).

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

export type Readout = { label: string; value: ReactNode };

export default function TelemetryHeader({
  index,
  code,
  title,
  lede,
  readouts,
  as: Heading = "h2",
  size = "l",
  className = "",
  titleClassName = "",
}: {
  index: string;
  code: string;
  title: ReactNode;
  lede?: ReactNode;
  readouts?: Readout[];
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "l" | "m";
  className?: string;
  titleClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const sizeCls = size === "xl" ? "display-xl" : size === "m" ? "display-m" : "display-l";
  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-3">
        <span className="stencil whitespace-nowrap">
          [{index} <span className="text-line-2">//</span> {code}]
        </span>
        <span className="relative h-px flex-1 bg-line">
          <span
            className="absolute inset-y-0 left-0 bg-hydro/60 transition-[width] duration-[900ms] ease-hydro"
            style={{ width: inView ? "100%" : "0%" }}
          />
        </span>
        <span aria-hidden="true" className="font-mono text-sm leading-none text-line-2">+</span>
      </div>
      <Heading
        className={`${sizeCls} mt-5 text-bone ${inView ? "anim-flicker" : "opacity-0"} ${titleClassName}`}
        style={{ animationDelay: inView ? "380ms" : undefined }}
      >
        {title}
      </Heading>
      {lede && <div className="lede mt-5 max-w-[46rem]">{lede}</div>}
      {readouts && readouts.length > 0 && (
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          {readouts.map((r) => (
            <div key={r.label} className="min-w-[8rem]">
              <dt className="stencil">{r.label}</dt>
              <dd className="mt-1 font-mono text-sm text-bone tabular">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
