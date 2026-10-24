/* Author: Nithish Kaliannan Ananth */
// src/pages/robotx/DesignDevelopment.tsx
// Engineering journey: decision records (problem → options → decision →
// rationale), the build log, and where each subsystem stands today.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { BUILD_LOG, DECISIONS, DEV_PROCESS, DEV_STATUS, DESIGN_PRINCIPLES } from "../../data/robotxData";
import { DossierHero, DossierSection } from "../../components/robotx/ui";
import HudPanel from "../../components/ui/HudPanel";
import SonarBadge from "../../components/ui/SonarBadge";
import MediaSlot from "../../components/ui/MediaSlot";
import Reveal from "../../components/ui/Reveal";
import { EASE_HYDRO } from "../../lib/motion";
import { stencilDate } from "../../lib/format";

export default function RobotXDesign() {
  const [open, setOpen] = useState<number | null>(0);
  const log = [...BUILD_LOG].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <DossierHero
        code="RX-ENG"
        section="DESIGN & DEVELOPMENT"
        title="Build. Test. Learn. Integrate."
        intro="From early design decisions to autonomous system integration — this is how we built the AQUAHOLICS RobotX platform."
        aside={
          <ol className="flex flex-wrap items-center gap-2">
            {DEV_PROCESS.map((p, i) => (
              <li key={p} className="flex items-center gap-2">
                <span className="border border-line-2 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-stencil text-bone">{p}</span>
                {i < DEV_PROCESS.length - 1 && <span aria-hidden="true" className="font-mono text-arc">→</span>}
              </li>
            ))}
            <li aria-hidden="true" className="font-mono text-[11px] text-drift">↺ repeat</li>
          </ol>
        }
      />

      <DossierSection
        index="RX-ENG-01"
        code="DECISION RECORDS"
        title="Why it’s built this way."
        lede="Every major subsystem was selected by comparing the problem, available alternatives, implementation constraints and expected mission requirements."
        divider="left"
      >
        <ul className="divide-y divide-line border-y border-line">
          {DECISIONS.map((d, i) => {
            const on = open === i;
            return (
              <li key={d.title}>
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  aria-controls={`adr-${i}`}
                  data-ping
                  className="grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5 text-left"
                >
                  <span className={`font-mono text-[11px] ${on ? "text-arc" : "text-drift"}`}>ADR-0{i + 1}</span>
                  <span className="font-display text-xl font-semibold text-bone">{d.title}</span>
                  <span className={`grid h-8 w-8 place-items-center border ${on ? "border-arc text-arc" : "border-line-2 text-fog"}`}>
                    {on ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`adr-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_HYDRO }}
                      className="overflow-hidden"
                    >
                      <dl className="grid gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-4 sm:pl-[5.5rem]">
                        {([["Problem", d.problem], ["Options", d.options], ["Decision", d.decision], ["Rationale", d.rationale]] as const).map(([k, v]) => (
                          <div key={k}>
                            <dt className={`stencil ${k === "Decision" ? "text-arc" : ""}`}>{k}</dt>
                            <dd className={`mt-2 text-[14px] leading-relaxed ${k === "Decision" ? "text-bone" : "text-fog"}`}>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </DossierSection>

      <DossierSection index="RX-ENG-02" code="BUILD LOG" title="The record so far." lede="A chronological record of the major milestones, iterations and integration steps." divider="right">
        <ol className="relative border-l border-line pl-8">
          {log.map((p, i) => (
            <Reveal as="li" key={p.date + p.title} delay={i * 0.04} className="relative pb-10 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[37px] top-1 h-[9px] w-[9px] border border-arc bg-abyss" />
              <p className="font-mono text-[11px] tracking-stencil text-drift">{stencilDate(p.date)}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-bone">{p.title}</h3>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-fog">{p.body}</p>
              {p.photo && (
                <div className="mt-4 max-w-lg">
                  <MediaSlot slotId={`RX_BUILD_${i + 1}`} src={p.photo} alt={p.title} aspect="16:9" brief="Build-log photo." />
                </div>
              )}
            </Reveal>
          ))}
        </ol>
      </DossierSection>

      <DossierSection index="RX-ENG-03" code="CURRENT STATE" title="Where each subsystem stands." divider="split">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DEV_STATUS.map((s) => (
            <HudPanel key={s.id} serial={s.label} status={s.status} statusLabel={s.status === "partial" ? "Partial" : "Ongoing"}>
              <h3 className="font-display text-xl font-semibold text-bone">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-fog">{s.text}</p>
            </HudPanel>
          ))}
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESIGN_PRINCIPLES.map((d) => (
            <div key={d.id} className="border-l border-line pl-4">
              <SonarBadge status="validated" label={d.title} />
              <p className="mt-2 text-[13px] leading-relaxed text-fog">{d.description}</p>
            </div>
          ))}
        </div>
      </DossierSection>
    </>
  );
}
