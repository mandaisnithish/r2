// src/pages/Product.tsx
// Walrus, as an instrument dossier: reference photo, inspection bay
// (3D), features, build log, operating cycle, film, datasheet and
// use cases. Everything binds to the CMS product.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "../lib/queries";
import { EASE_HYDRO } from "../lib/motion";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import CircuitDivider from "../components/ui/CircuitDivider";
import RelayButton from "../components/ui/RelayButton";
import MediaSlot from "../components/ui/MediaSlot";
import VideoSlot from "../components/ui/VideoSlot";
import HudPanel from "../components/ui/HudPanel";
import BlueprintCard from "../components/ui/BlueprintCard";
import Reveal from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import LazyVesselViewer from "../components/three/LazyVesselViewer";
import type { ProductSpec } from "../types/product";

export default function ProductPage() {
  const { data: p } = useProduct();

  return (
    <>
      {/* ───────── hero ───────── */}
      <section className="relative pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="grid-wrap grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <TelemetryHeader
              as="h1"
              size="xl"
              index="AQH-WLR"
              code="PRODUCT"
              title={p.heroTitle || `Meet ${p.name}`}
              lede={p.heroSubtitle || p.tagline}
            />
            <p className="mt-6 max-w-lg border-l border-arc/60 pl-4 font-mono text-[12px] uppercase leading-relaxed tracking-stencil text-bone">{p.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <RelayButton to="/contact" size="lg">Request a demo</RelayButton>
              <RelayButton href="#film" variant="secondary" size="lg" arrow={false}>Watch it work</RelayButton>
            </div>
          </div>
          <Reveal side={1} className="lg:col-span-6 lg:-mr-10">
            <MediaSlot
              slotId="PRODUCT_REFERENCE"
              src={p.coverImageUrl}
              alt={`${p.name} seen from above: twin pontoons and the open electronics box`}
              aspect="4:3"
              brief="Top-down reference photo of Walrus with the lid off (pontoons, electronics box, conveyor), on a neutral floor."
              caption="Reference frame · the 3D model is drawn from this"
              priority
              tone="hydro"
            />
          </Reveal>
        </div>
      </section>

      {/* ───────── overview ───────── */}
      <CircuitDivider variant="left" label="BUS 01 · OVERVIEW" />
      <section className="py-16 sm:py-24">
        <div className="grid-wrap grid gap-10 lg:grid-cols-12">
          <p className="stencil lg:col-span-3">[SYS-01 // MISSION PROFILE]</p>
          <Reveal className="lg:col-span-8">
            <p className="font-display text-2xl font-medium leading-snug text-bone sm:text-[2rem]">{p.description}</p>
          </Reveal>
        </div>
      </section>

      {/* ───────── inspection ───────── */}
      <CircuitDivider variant="split" label="BUS 02 · INSPECTION" />
      <section className="py-16 sm:py-24">
        <div className="grid-wrap">
          <TelemetryHeader
            index="SYS-02"
            code="INSPECTION BAY"
            title="Every subsystem, on the bench."
            lede="Rotate the hull, peel back to the avionics, or switch on the hydro-flow layer. Pins read straight from the CMS spec sheet."
          />
          <LazyVesselViewer kind="walrus" fallbackSrc={p.coverImageUrl} fallbackSlot="PRODUCT_INSPECT_STATIC" className="mt-12" />
        </div>
      </section>

      {/* ───────── features ───────── */}
      {p.features.length > 0 && (
        <>
          <CircuitDivider variant="right" label="BUS 03 · CAPABILITIES" />
          <section className="py-16 sm:py-24">
            <div className="grid-wrap">
              <TelemetryHeader index="SYS-03" code="CAPABILITIES" title="What it does on the water." size="m" />
              <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                {p.features.map((f, i) => (
                  <Reveal key={f.id ?? f.title} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "sm:mt-14" : ""}>
                    <BlueprintCard index={`F-0${i + 1}`} icon={f.icon} title={f.title}>
                      {f.description}
                    </BlueprintCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ───────── build log ───────── */}
      {p.images.length > 0 && (
        <>
          <CircuitDivider variant="left" label="BUS 04 · BUILD LOG" />
          <section className="py-16 sm:py-24">
            <div className="grid-wrap">
              <TelemetryHeader index="SYS-04" code="BUILD LOG" title="From CAD to the lake." size="m" lede="The build, stage by stage, as the team photographed it." />
            </div>
            <div className="mt-12 overflow-x-auto pb-6 [scrollbar-width:thin]">
              <ol className="grid-wrap flex snap-x snap-mandatory gap-6">
                {p.images.map((img, i) => (
                  <li key={img.id ?? img.imageUrl} className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
                    <MediaSlot
                      slotId={`BUILD_0${i + 1}`}
                      src={img.imageUrl}
                      alt={img.caption || `Build stage ${i + 1}`}
                      aspect="4:3"
                      width={900}
                      brief="Build-stage photo for the gallery (Admin → Product → Images)."
                      stamp={`STAGE ${String(i + 1).padStart(2, "0")}`}
                    />
                    <p className="mt-4 flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-hydro">B-0{i + 1}</span>
                      <span className="text-[15px] text-bone">{img.caption}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </>
      )}

      {/* ───────── operating cycle ───────── */}
      {p.steps.length > 0 && (
        <>
          <CircuitDivider variant="split" label="BUS 05 · OPERATING CYCLE" />
          <section className="py-16 sm:py-24">
            <div className="grid-wrap">
              <TelemetryHeader index="SYS-05" code="OPERATING CYCLE" title="One patrol, end to end." size="m" />
              <ol className="relative mt-14 grid gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
                {p.steps.map((s, i) => (
                  <Reveal as="li" key={s.id ?? s.stepNumber} delay={i * 0.08} className="relative border-b border-line px-1 py-8 sm:border-r sm:px-6 lg:border-b-0">
                    <span aria-hidden="true" className="absolute -top-[5px] left-1 h-[9px] w-[9px] border border-hydro bg-abyss sm:left-6" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-stencil text-hydro">CYCLE {String(s.stepNumber).padStart(2, "0")}</span>
                      <Icon name={s.icon} size={18} className="text-fog" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-bone">{s.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-fog">{s.description}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>
        </>
      )}

      {/* ───────── film ───────── */}
      <section id="film" className="scroll-mt-24 py-16 sm:py-24">
        <div className="grid-wrap">
          <VideoSlot slotId="PRODUCT_DEMO" url={p.videoUrl} title={`${p.name} in the water`} brief="Demo film (YouTube link from Admin → Product → Core)." />
        </div>
      </section>

      {/* ───────── datasheet ───────── */}
      {p.specs.length > 0 && (
        <>
          <CircuitDivider variant="right" label="BUS 06 · DATASHEET" />
          <section className="py-16 sm:py-24">
            <div className="grid-wrap">
              <TelemetryHeader index="SYS-06" code="DATASHEET" title="Specifications." size="m" />
              <Datasheet specs={p.specs} />
            </div>
          </section>
        </>
      )}

      {/* ───────── use cases ───────── */}
      {p.useCases.length > 0 && (
        <>
          <CircuitDivider variant="left" label="BUS 07 · DEPLOYMENT" />
          <UseCases useCases={p.useCases} />
        </>
      )}

      {/* ───────── CTA ───────── */}
      <section className="py-24 sm:py-32">
        <div className="grid-wrap">
          <HudPanel tone="arc" serial="AQH-WLR-01 · ORDER CHANNEL" bodyClassName="p-6 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <h2 className="display-l text-bone lg:col-span-8">{p.ctaTitle || `Interested in ${p.name}?`}</h2>
              <div className="lg:col-span-4 lg:text-right">
                <RelayButton to="/contact" size="lg">{p.ctaButtonText || "Contact us"}</RelayButton>
              </div>
            </div>
          </HudPanel>
        </div>
      </section>
    </>
  );
}

function Datasheet({ specs }: { specs: ProductSpec[] }) {
  const groups = specs.reduce<Record<string, ProductSpec[]>>((acc, s) => {
    const k = s.category || "General";
    (acc[k] ??= []).push(s);
    return acc;
  }, {});
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {Object.entries(groups).map(([cat, rows], gi) => (
        <Reveal key={cat} delay={gi * 0.06}>
          <HudPanel serial={`DS-${String(gi + 1).padStart(2, "0")}`} label={cat} padded={false} className="h-full">
            <dl className="divide-y divide-line">
              {rows.map((r) => (
                <div key={r.id ?? r.label} className="px-4 py-4 sm:px-5">
                  <dt className="stencil">{r.label}</dt>
                  <dd className="mt-1.5 font-mono text-[15px] text-bone">{r.value}</dd>
                  {r.description && <p className="mt-1.5 text-[13px] leading-snug text-drift">{r.description}</p>}
                </div>
              ))}
            </dl>
          </HudPanel>
        </Reveal>
      ))}
    </div>
  );
}

function UseCases({ useCases }: { useCases: { id?: number; icon?: string; title: string; description: string; imageUrl?: string }[] }) {
  const [active, setActive] = useState(0);
  const uc = useCases[active] ?? useCases[0];
  return (
    <section className="py-16 sm:py-24">
      <div className="grid-wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TelemetryHeader index="SYS-07" code="DEPLOYMENT" title="Where it works." size="m" />
          <div role="tablist" aria-label="Use cases" className="mt-10 flex flex-col border-t border-line">
            {useCases.map((u, i) => {
              const on = i === active;
              return (
                <button
                  key={u.id ?? u.title}
                  role="tab"
                  aria-selected={on}
                  aria-controls="usecase-panel"
                  onClick={() => setActive(i)}
                  data-ping
                  className={`group/t flex items-center gap-4 border-b border-line py-5 text-left transition-colors ${on ? "text-bone" : "text-fog hover:text-bone"}`}
                >
                  <span className={`font-mono text-[11px] ${on ? "text-hydro" : "text-drift"}`}>U-0{i + 1}</span>
                  <Icon name={u.icon} size={18} className={on ? "text-hydro" : "text-drift"} />
                  <span className="font-display text-xl font-semibold">{u.title}</span>
                  <span aria-hidden="true" className={`ml-auto h-2 w-2 ${on ? "bg-hydro" : "border border-line-2"}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div id="usecase-panel" role="tabpanel" className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE_HYDRO }}>
              <MediaSlot
                slotId={`USECASE_0${active + 1}`}
                src={uc.imageUrl}
                alt={uc.title}
                aspect="16:9"
                brief={`Photo for the "${uc.title}" use case: the actual site type (river, municipal tank, fish farm).`}
              />
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-fog">{uc.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
