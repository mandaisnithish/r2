// src/components/robotx/ui.tsx
// Shared building blocks for the RobotX dossier pages. Replaces the
// SectionHeader / Eyebrow / EmptyState / Reveal copies that each of the
// eight pages used to define for itself.

import type { ReactNode } from "react";
import TelemetryHeader, { type Readout } from "../ui/TelemetryHeader";
import CircuitDivider from "../ui/CircuitDivider";

/** Dossier cover for a RobotX page. */
export function DossierHero({
  code,
  section,
  title,
  intro,
  readouts,
  aside,
}: {
  code: string;
  section: string;
  title: ReactNode;
  intro?: ReactNode;
  readouts?: Readout[];
  aside?: ReactNode;
}) {
  return (
    <section className="pb-14 pt-12 sm:pb-20 sm:pt-16">
      <div className="grid-wrap grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <p className="mb-6 inline-flex items-center gap-3 border border-arc/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-stencil text-arc">
            <span className="h-1.5 w-1.5 bg-arc" />
            Dossier RX-26 · public release
          </p>
          <TelemetryHeader as="h1" size="l" index={code} code={section} title={title} lede={intro} readouts={readouts} />
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}

/** A dossier section: circuit divider + header + body. */
export function DossierSection({
  id,
  index,
  code,
  title,
  lede,
  divider = "left",
  label,
  children,
  aside,
}: {
  id?: string;
  index: string;
  code: string;
  title: ReactNode;
  lede?: ReactNode;
  divider?: "left" | "right" | "split" | false;
  label?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <>
      {divider && <CircuitDivider variant={divider} label={label ?? `RX BUS · ${code}`} />}
      <section id={id} className="scroll-mt-40 py-14 sm:py-20">
        <div className="grid-wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <TelemetryHeader className={aside ? "lg:col-span-8" : "lg:col-span-9"} index={index} code={code} title={title} size="m" lede={lede} />
            {aside && <div className="lg:col-span-4 lg:justify-self-end">{aside}</div>}
          </div>
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </section>
    </>
  );
}

/** Mono key/value list used by vehicle and system dossiers. */
export function SpecList({ rows, className = "" }: { rows: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={`divide-y divide-line border-y border-line ${className}`}>
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(7rem,40%)_1fr] gap-4 py-3">
          <dt className="stencil pt-0.5">{r.label}</dt>
          <dd className="font-mono text-[13px] text-bone">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
