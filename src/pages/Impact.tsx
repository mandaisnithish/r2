// src/pages/Impact.tsx
// The field record: totals from /timeline/stats and a filterable mission
// log of every milestone, competition, publication, patent, grant and
// recognition in the CMS.

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTimeline, useTimelineStats } from "../lib/queries";
import { EASE_HYDRO } from "../lib/motion";
import { inr, inrShort, stencilDate } from "../lib/format";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import CircuitDivider from "../components/ui/CircuitDivider";
import StatPlate from "../components/ui/StatPlate";
import RelayButton from "../components/ui/RelayButton";
import MediaSlot from "../components/ui/MediaSlot";
import Reveal from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { TimelineCategory, TimelineEvent } from "../api/timelineapi";

const CATEGORY: Record<TimelineCategory, { label: string; icon: string; tone: string }> = {
  COMPETITION: { label: "Competition", icon: "trophy", tone: "text-hydro border-hydro/50" },
  FUNDING: { label: "Funding", icon: "banknote", tone: "text-arc border-arc/50" },
  MILESTONE: { label: "Milestone", icon: "milestone", tone: "text-bone border-line-2" },
  PUBLICATION: { label: "Publication", icon: "publication", tone: "text-bone border-line-2" },
  PATENT: { label: "Patent", icon: "patent", tone: "text-arc border-arc/50" },
  RECOGNITION: { label: "Recognition", icon: "award", tone: "text-hydro border-hydro/50" },
};

type Filter = TimelineCategory | "ALL";

export default function Impact() {
  const { data: events } = useTimeline();
  const { data: stats } = useTimelineStats();
  const [filter, setFilter] = useState<Filter>("ALL");

  const counts = useMemo(() => {
    const c: Partial<Record<TimelineCategory, number>> = {};
    events.forEach((e) => (c[e.category] = (c[e.category] ?? 0) + 1));
    return c;
  }, [events]);

  const shown = filter === "ALL" ? events : events.filter((e) => e.category === filter);
  const byYear = shown.reduce<[string, TimelineEvent[]][]>((acc, e) => {
    const y = e.date.slice(0, 4);
    const last = acc[acc.length - 1];
    if (last && last[0] === y) last[1].push(e);
    else acc.push([y, [e]]);
    return acc;
  }, []);

  const filters: Filter[] = ["ALL", ...(Object.keys(CATEGORY) as TimelineCategory[]).filter((k) => counts[k])];

  return (
    <>
      <section className="pb-16 pt-14 sm:pb-20 sm:pt-24">
        <div className="grid-wrap">
          <TelemetryHeader
            as="h1"
            size="xl"
            index="LOG-00"
            code="FIELD RECORD"
            title="Impact & achievements."
            lede="Every milestone, competition win, publication and recognition that defines our mission to clean the world's water."
          />
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <Reveal><StatPlate code="LOG-01 · ENTERED" value={stats.totalCompetitionsCount} unit="competitions" label="Competitions the team has taken Walrus into." tone="hydro" /></Reveal>
            <Reveal delay={0.08}><StatPlate code="LOG-02 · PRIZES" value={inrShort(stats.totalCompetitionPrize)} label={`${inr(stats.totalCompetitionPrize)} in competition prize money.`} /></Reveal>
            <Reveal delay={0.16}><StatPlate code="LOG-03 · FUNDING" value={inrShort(stats.totalFunding)} label={`${inr(stats.totalFunding)} in grants and funding secured.`} tone="arc" /></Reveal>
          </div>
        </div>
      </section>

      <CircuitDivider variant="left" label="BUS 01 · MISSION LOG" />

      <section className="py-16 sm:py-24">
        <div className="grid-wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <TelemetryHeader index="SYS-01" code="MISSION LOG" title="The record, newest first." size="m" />
            <div role="radiogroup" aria-label="Filter the log" className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const on = filter === f;
                const n = f === "ALL" ? events.length : counts[f];
                return (
                  <button
                    key={f}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFilter(f)}
                    data-ping
                    className={`flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-stencil transition-colors ${
                      on ? "border-hydro bg-hydro/10 text-bone" : "border-line-2 text-drift hover:text-bone"
                    }`}
                  >
                    {f === "ALL" ? "All" : CATEGORY[f].label}
                    <span className={on ? "text-hydro" : "text-line-2"}>{String(n).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mt-14">
            <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line sm:left-[calc(9rem+7px)]" />
            <AnimatePresence mode="popLayout" initial={false}>
              {byYear.map(([year, items]) => (
                <motion.div key={`${filter}-${year}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="relative mb-6 mt-4 flex items-center gap-4 pl-8 sm:pl-0">
                    <span className="font-display text-4xl font-semibold text-bone sm:w-36">{year}</span>
                    <span className="stencil">{items.length} {items.length === 1 ? "entry" : "entries"}</span>
                  </div>
                  <ol className="space-y-2">
                    {items.map((e) => (
                      <LogEntry key={e.id} event={e} />
                    ))}
                  </ol>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="grid-wrap flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display-m max-w-2xl text-bone">Want to be in the next entry?</h2>
          <RelayButton to="/contact" size="lg">Partner with us</RelayButton>
        </div>
      </section>
    </>
  );
}

function LogEntry({ event: e }: { event: TimelineEvent }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORY[e.category] ?? CATEGORY.MILESTONE;
  const result = [e.result, e.position].filter(Boolean).join(" · ");
  const long = (e.description?.length ?? 0) > 180;

  return (
    <motion.li layout="position" className="relative grid gap-3 pb-8 pl-8 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:pl-0">
      <span aria-hidden="true" className={`absolute left-[3px] top-[5px] h-[9px] w-[9px] border bg-abyss sm:left-[calc(9rem+3px)] ${cat.tone}`} />
      <div className="font-mono text-[11px] tracking-stencil text-drift sm:pt-0.5">{stencilDate(e.date)}</div>
      <div className="sm:pl-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-stencil ${cat.tone}`}>
            <Icon name={cat.icon} size={12} />
            {cat.label}
          </span>
          {e.organization && <span className="text-[13px] text-drift">{e.organization}</span>}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-bone sm:text-2xl">{e.title}</h3>
        {(result || e.prizeAmount) && (
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[13px]">
            {result && <span className="text-hydro">{result}</span>}
            {e.prizeAmount ? <span className="text-arc">{inr(e.prizeAmount)}</span> : null}
          </p>
        )}
        {e.description && (
          <div className="mt-3 max-w-3xl">
            <p className={`text-[15px] leading-relaxed text-fog ${!open && long ? "line-clamp-3" : ""}`}>{e.description}</p>
            {long && (
              <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-2 font-mono text-[11px] uppercase tracking-stencil text-drift hover:text-bone">
                {open ? "Collapse" : "Full entry"}
              </button>
            )}
          </div>
        )}
        {e.extraInfo && <p className="mt-2 text-[13px] text-drift">{e.extraInfo}</p>}
        {e.imageUrl && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE_HYDRO }} className="mt-5 max-w-xl">
            <MediaSlot slotId={`LOG_${e.id}`} src={e.imageUrl} alt={e.title} aspect="16:9" width={1000} brief="Photo from this event." />
          </motion.div>
        )}
        {e.link && (
          <a href={e.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-stencil text-hydro hover:text-bone">
            Source <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.li>
  );
}
