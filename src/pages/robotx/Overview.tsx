/* Author: Nithish Kaliannan Ananth */
// src/pages/robotx/Overview.tsx
// Dossier cover. DRAKEN Mark 1 and REVELATION float in the WebGL stage
// behind the hero; below: the storm-response brief, the system of
// systems, focus areas, approach and principles — all from robotxData.

import {
  COMPETITION, DESIGN_PRINCIPLES, EVENT, MISSION_BRIEF, OVERVIEW,
  SYSTEM_OF_SYSTEMS, WEBSITE_STATS,
} from "../../data/robotxData";
import { DossierSection } from "../../components/robotx/ui";
import TelemetryHeader from "../../components/ui/TelemetryHeader";
import RelayButton from "../../components/ui/RelayButton";
import HudPanel from "../../components/ui/HudPanel";
import BlueprintCard from "../../components/ui/BlueprintCard";
import StatPlate from "../../components/ui/StatPlate";
import Reveal from "../../components/ui/Reveal";
import SonarBadge from "../../components/ui/SonarBadge";
import { daysUntil, useNow } from "../../lib/useNow";

const FOCUS_ICON: Record<string, string> = { surface: "pontoon", aerial: "quad", perception: "scan", integration: "radio" };

export default function RobotXOverview() {
  const now = useNow();
  const days = daysUntil(now, "2026-11-08");

  return (
    <>
      {/* ───────── cover ───────── */}
      <section className="flex min-h-[calc(100svh-11rem)] flex-col justify-center pb-16 pt-10">
        <div className="grid-wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-6 inline-flex items-center gap-3 border border-arc/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-stencil text-arc">
              <span className="h-1.5 w-1.5 bg-arc" />
              {OVERVIEW.eyebrow}
            </p>
            <TelemetryHeader
              as="h1"
              size="l"
              index="RX-26"
              code={EVENT.theme.toUpperCase()}
              title={OVERVIEW.title}
              lede={OVERVIEW.intro}
              readouts={[
                { label: "Event", value: EVENT.name },
                { label: "Venue", value: EVENT.venue },
                { label: "Window", value: EVENT.dates },
                { label: "T-minus", value: <span className="text-arc">{days > 0 ? `${days} days` : "Event week"}</span> },
              ]}
            />
            <div className="mt-10 flex flex-wrap gap-3">
              <RelayButton to="/robotx/system-vehicles" size="lg">Inspect the vehicles</RelayButton>
              <RelayButton to="/robotx/testing" variant="secondary" size="lg">Test record</RelayButton>
            </div>
          </div>
          {/* WebGL stage: DRAKEN Mark 1 on the water, REVELATION above it */}
          <div aria-hidden="true" className="hidden lg:col-span-5 lg:block" />
        </div>
      </section>

      {/* ───────── mission brief ───────── */}
      <DossierSection index="RX-01" code="MISSION BRIEF" title="From assessment to recovery." lede={MISSION_BRIEF.summary} divider="left">
        <div className="grid gap-6 lg:grid-cols-12">
          <HudPanel tone="arc" serial="SCENARIO · STORM RESPONSE" className="lg:col-span-7" bodyClassName="p-6 sm:p-8">
            <p className="font-display text-xl font-medium leading-snug text-bone sm:text-2xl">{MISSION_BRIEF.scenario}</p>
            <ol className="mt-8 grid grid-cols-3 border-t border-line">
              {MISSION_BRIEF.phases.map((ph, i) => (
                <li key={ph} className="border-r border-line px-1 pt-4 last:border-r-0 sm:px-4">
                  <span className="font-mono text-[10px] text-arc">PHASE 0{i + 1}</span>
                  <span className="mt-1 block font-display text-lg font-semibold text-bone">{ph}</span>
                </li>
              ))}
            </ol>
          </HudPanel>
          <ul className="flex flex-col gap-4 lg:col-span-5">
            {MISSION_BRIEF.objectives.map((o, i) => (
              <Reveal as="li" key={o.id} delay={i * 0.08}>
                <BlueprintCard index={`OBJ-0${i + 1}`} title={o.title}>{o.text}</BlueprintCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </DossierSection>

      {/* ───────── system of systems ───────── */}
      <DossierSection
        index="RX-02"
        code="SYSTEM OF SYSTEMS"
        title={SYSTEM_OF_SYSTEMS.title}
        lede={SYSTEM_OF_SYSTEMS.summary}
        divider="right"
        aside={<SonarBadge status="ongoing" label={SYSTEM_OF_SYSTEMS.communication.status} />}
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <Topology className="lg:col-span-7" />
          <div className="lg:col-span-5">
            <HudPanel serial="LINK BUDGET" padded={false}>
              <dl className="divide-y divide-line">
                {[
                  ["Protocol", SYSTEM_OF_SYSTEMS.communication.protocol],
                  ["Telemetry", SYSTEM_OF_SYSTEMS.communication.telemetry],
                  ["Band", SYSTEM_OF_SYSTEMS.communication.frequency],
                  ["Modulation", SYSTEM_OF_SYSTEMS.communication.modulation],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 px-5 py-3">
                    <dt className="stencil">{k}</dt>
                    <dd className="font-mono text-[13px] text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
            </HudPanel>
            <p className="mt-6 border-l border-arc/60 pl-4 text-[15px] leading-relaxed text-fog">{SYSTEM_OF_SYSTEMS.principle}</p>
          </div>
        </div>
      </DossierSection>

      {/* ───────── focus areas ───────── */}
      <DossierSection index="RX-03" code="FOCUS AREAS" title="What we are building." lede={OVERVIEW.description} divider="split">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW.focusAreas.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.06} className={i % 2 === 1 ? "lg:mt-10" : ""}>
              <BlueprintCard index={`FA-0${i + 1}`} icon={FOCUS_ICON[f.id] ?? "sonar"} title={f.title}>{f.description}</BlueprintCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {WEBSITE_STATS.map((s, i) => (
            <StatPlate key={s.label} code={`RX-STAT-0${i + 1}`} value={s.value} label={`${s.label} · ${s.description}`} tone={i === 2 ? "arc" : "bone"} />
          ))}
        </div>
      </DossierSection>

      {/* ───────── approach ───────── */}
      <DossierSection index="RX-04" code="APPROACH" title={COMPETITION.title} lede={COMPETITION.strategy} divider="left">
        <div className="grid gap-10 lg:grid-cols-12">
          <ol className="divide-y divide-line border-y border-line lg:col-span-7">
            {COMPETITION.priorities.map((p, i) => (
              <li key={p} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 py-4">
                <span className="font-mono text-[11px] text-arc">P-0{i + 1}</span>
                <span className="text-[16px] text-bone">{p}</span>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-5">
            <HudPanel tone="arc" serial="CURRENT FOCUS" status="ongoing" statusLabel="In progress">
              <p className="text-[16px] leading-relaxed text-bone">{COMPETITION.currentFocus}</p>
            </HudPanel>
            <p className="mt-6 text-[15px] leading-relaxed text-fog">{OVERVIEW.competitionApproach}</p>
          </div>
        </div>
      </DossierSection>

      {/* ───────── principles ───────── */}
      <DossierSection index="RX-05" code="DESIGN PRINCIPLES" title="How the system is put together." divider="right">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {DESIGN_PRINCIPLES.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.06}>
              <BlueprintCard index={`DP-0${i + 1}`} title={d.title}>{d.description}</BlueprintCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <RelayButton to="/robotx/design">Design & development log</RelayButton>
          <RelayButton to="/robotx/team" variant="secondary">Meet the team</RelayButton>
        </div>
      </DossierSection>
    </>
  );
}

/** Compact three-node topology: OCS ⇄ USV, OCS ⇄ UAV, USV ⇄ UAV. */
function Topology({ className = "" }: { className?: string }) {
  const nodes = SYSTEM_OF_SYSTEMS.domains;
  const pos: Record<string, [number, number]> = { command: [300, 54], surface: [110, 250], air: [490, 250] };
  const byName: Record<string, string> = Object.fromEntries(nodes.map((n) => [n.vehicle, n.id]));
  return (
    <HudPanel serial="TOPOLOGY · MAVLINK MESH" className={className} padded={false}>
      <svg viewBox="0 0 600 320" className="block w-full" role="img" aria-label="Command station linked to the surface vessel and the aerial vehicle, which also link to each other">
        <g fill="none" strokeWidth="1">
          {SYSTEM_OF_SYSTEMS.links.map((l) => {
            const a = pos[byName[l.from]];
            const b = pos[byName[l.to]];
            if (!a || !b) return null;
            const mx = (a[0] + b[0]) / 2;
            const my = (a[1] + b[1]) / 2;
            return (
              <g key={`${l.from}-${l.to}`}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2A3A47" />
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FFB800" strokeDasharray="4 10" strokeOpacity="0.8">
                  <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1.4s" repeatCount="3" />
                </line>
                <text x={mx} y={my - 8} textAnchor="middle" className="fill-[#7D8E9E] font-mono text-[10px] uppercase">
                  {l.label}
                </text>
              </g>
            );
          })}
        </g>
        {nodes.map((n) => {
          const [x, y] = pos[n.id];
          return (
            <g key={n.id} transform={`translate(${x} ${y})`}>
              <rect x={-74} y={-26} width={148} height={52} fill="#0D151C" stroke={n.id === "command" ? "#FFB800" : "#00E5FF"} strokeOpacity="0.7" />
              <text y={-6} textAnchor="middle" className="fill-[#E2E8F0] font-mono text-[11px] uppercase">{n.vehicle}</text>
              <text y={12} textAnchor="middle" className="fill-[#7D8E9E] font-mono text-[10px] uppercase">{n.domain} · {n.name}</text>
            </g>
          );
        })}
      </svg>
    </HudPanel>
  );
}
