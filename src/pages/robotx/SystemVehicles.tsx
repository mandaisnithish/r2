/* Author: Nithish Kaliannan Ananth */
// src/pages/robotx/SystemVehicles.tsx
// Vehicle dossiers with live 3D inspection, then the autonomy chain,
// perception stack, safety interlocks and system layers.

import { AI, AUTONOMY, SAFETY, SYSTEM_LAYERS, VEHICLES, type Vehicle } from "../../data/robotxData";
import { DossierHero, DossierSection, SpecList } from "../../components/robotx/ui";
import MediaSlot from "../../components/ui/MediaSlot";
import HudPanel from "../../components/ui/HudPanel";
import SonarBadge from "../../components/ui/SonarBadge";
import Reveal from "../../components/ui/Reveal";
import LazyVesselViewer from "../../components/three/LazyVesselViewer";
import drakenImage from "../../assets/robotx/DRAKEN Mark 1.jpeg";
import revelationImage from "../../assets/robotx/REVELATION.jpeg";

const PHOTO: Record<string, string> = { "draken-mark-1": drakenImage, revelation: revelationImage };
const KIND: Record<string, "draken" | "revelation"> = { "draken-mark-1": "draken", revelation: "revelation" };
const SERIAL: Record<string, string> = { "draken-mark-1": "AQH-USV-01", revelation: "AQH-UAV-01" };

export default function RobotXSystemVehicles() {
  return (
    <>
      <DossierHero
        code="RX-SYS"
        section="SYSTEM & VEHICLES"
        title="One system, two domains."
        intro="A custom surface vessel and an S500 aerial platform, sharing telemetry over MAVLink while each keeps its own control and safety fallbacks."
        readouts={VEHICLES.map((v) => ({ label: v.domain, value: v.name }))}
      />

      {VEHICLES.map((v, i) => (
        <VehicleDossier key={v.id} vehicle={v} index={i} />
      ))}

      {/* ───────── autonomy chain ───────── */}
      <DossierSection index="RX-SYS-03" code="AUTONOMY STACK" title="Sense, decide, act." lede="The chain every autonomous behaviour runs through, on both vehicles." divider="split">
        <ol className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-6">
          {AUTONOMY.stages.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.05} className="relative border-b border-r border-line p-5">
              <span className="font-mono text-[10px] text-arc">S-0{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-bone">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fog">{s.description}</p>
              {i < AUTONOMY.stages.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[5px] top-6 hidden h-[9px] w-[9px] rotate-45 border-r border-t border-arc bg-abyss lg:block" />
              )}
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {([["USV · DRAKEN Mark 1", AUTONOMY.usv], ["UAV · REVELATION", AUTONOMY.uav]] as const).map(([label, d]) => (
            <HudPanel key={label} serial={label} status={/progress|validation/i.test(d.status) ? "ongoing" : "validated"} statusLabel={d.status} padded={false}>
              <div className="p-5">
                <SpecList rows={[
                  { label: "Perception", value: d.perception },
                  { label: "Navigation", value: d.navigation },
                  { label: "Computing", value: d.computing },
                  { label: "Control", value: d.control },
                ]} />
              </div>
            </HudPanel>
          ))}
        </div>
      </DossierSection>

      {/* ───────── perception ───────── */}
      <DossierSection index="RX-SYS-04" code="AI & PERCEPTION" title={`${AI.model} on the edge.`} lede={AI.deployment} divider="left" aside={<SonarBadge status="partial" label={AI.status} />}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Model", AI.model],
            ["Framework", AI.framework],
            ["Dataset", `≈${AI.dataset.approximateImages.toLocaleString("en-IN")} images · ${AI.dataset.classes} classes`],
            ["Trained on", AI.dataset.trainingPlatform],
          ].map(([k, v]) => (
            <HudPanel key={k} serial={k}>
              <p className="font-mono text-[15px] text-bone">{v}</p>
            </HudPanel>
          ))}
        </div>
      </DossierSection>

      {/* ───────── safety ───────── */}
      <DossierSection index="RX-SYS-05" code="SAFETY INTERLOCKS" title="Fail safe, then fail operational." divider="right">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SAFETY.map((s, i) => (
            <li key={s.id} className="bg-abyss p-5">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] ${i === 0 ? "text-rust" : "text-arc"}`}>INT-0{i + 1}</span>
                <span aria-hidden="true" className={`h-2 w-2 ${i === 0 ? "bg-rust" : "border border-arc"}`} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-bone">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fog">{s.description}</p>
            </li>
          ))}
        </ul>
      </DossierSection>

      {/* ───────── layers ───────── */}
      <DossierSection index="RX-SYS-06" code="SYSTEM LAYERS" title="From mission to metal." divider="split">
        <ol className="space-y-2">
          {SYSTEM_LAYERS.map((l, i) => (
            <Reveal as="li" key={l.id} delay={i * 0.04}>
              <div
                className="grid items-baseline gap-2 border border-line bg-hull/70 px-5 py-4 sm:grid-cols-[4rem_14rem_1fr]"
                style={{ marginLeft: `${i * 1.2}%`, marginRight: `${(SYSTEM_LAYERS.length - 1 - i) * 1.2}%` }}
              >
                <span className="font-mono text-[10px] text-arc">L-0{SYSTEM_LAYERS.length - i}</span>
                <span className="font-display text-lg font-semibold text-bone">{l.title}</span>
                <span className="text-[14px] text-fog">{l.description}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </DossierSection>
    </>
  );
}

function VehicleDossier({ vehicle: v, index }: { vehicle: Vehicle; index: number }) {
  const kind = KIND[v.id];
  return (
    <DossierSection
      id={v.id}
      index={`RX-SYS-0${index + 1}`}
      code={`${v.domain} · ${v.type.toUpperCase()}`}
      title={v.name}
      lede={v.description}
      divider={index % 2 ? "right" : "left"}
      aside={v.status ? <SonarBadge status="ongoing" label={v.status} /> : undefined}
    >
      {kind && <LazyVesselViewer kind={kind} fallbackSrc={PHOTO[v.id]} fallbackSlot={`RX_${kind.toUpperCase()}_STATIC`} />}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <MediaSlot
            slotId={`RX_${(kind ?? v.id).toUpperCase()}_PHOTO`}
            src={PHOTO[v.id]}
            alt={`${v.name} on the bench`}
            aspect="4:5"
            brief={`Field photo of ${v.name} (replace with a water/flight shot when available).`}
            stamp={SERIAL[v.id]}
          />
        </div>
        <div className="lg:col-span-4">
          <p className="stencil mb-3">Specification</p>
          <SpecList rows={[
            ...(v.dimensions ? [{ label: "Envelope", value: v.dimensions }] : []),
            ...(v.hull ? [{ label: "Hull", value: v.hull }] : []),
            ...(v.material ? [{ label: "Build", value: v.material }] : []),
            ...v.specs.map((s) => ({ label: s.label, value: s.value })),
          ]} />
        </div>
        <div className="lg:col-span-4">
          <p className="stencil mb-3">Subsystems</p>
          <ul className="divide-y divide-line border-y border-line">
            {v.systems.map((s) => (
              <li key={s.name} className="py-3">
                <p className="text-[15px] text-bone">{s.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-fog">{s.description}</p>
              </li>
            ))}
          </ul>
          {v.autonomy && <p className="mt-5 border-l border-arc/60 pl-4 text-[14px] leading-relaxed text-fog">{v.autonomy}</p>}
        </div>
      </div>
    </DossierSection>
  );
}
