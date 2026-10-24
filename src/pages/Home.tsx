/* Author: Nithish Kaliannan Ananth */
// src/pages/Home.tsx
// The dive: canopy hero (Walrus + REVELATION float in the WebGL stage),
// the problem at the waterline, the countermeasure, an inspection bay,
// field footage, RobotX, and the telemetry core CTA at the bottom.

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContactInfo, useHomeContent, useHomeStats, useProduct } from "../lib/queries";
import { EASE_HYDRO } from "../lib/motion";
import { useNow, daysUntil } from "../lib/useNow";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import CircuitDivider from "../components/ui/CircuitDivider";
import RelayButton from "../components/ui/RelayButton";
import MediaSlot from "../components/ui/MediaSlot";
import VideoSlot from "../components/ui/VideoSlot";
import StatPlate from "../components/ui/StatPlate";
import HudPanel from "../components/ui/HudPanel";
import Reveal from "../components/ui/Reveal";
import LinkStatus from "../components/layout/LinkStatus";
import LazyVesselViewer from "../components/three/LazyVesselViewer";
import drakenImage from "../assets/robotx/DRAKEN Mark 1.jpeg";
import revelationImage from "../assets/robotx/REVELATION.jpeg";
import type { Stat } from "../types";

/** Highlights the brand name inside CMS headlines. */
function brand(text: string): ReactNode {
  const parts = text.split(/(aquaholics)/i);
  return parts.map((p, i) => (/^aquaholics$/i.test(p) ? <span key={i} className="text-hydro">{p}</span> : p));
}

function statValue(s: Stat) {
  return `${s.prefix ?? ""}${s.numericValue}${s.suffix ?? ""}`;
}

export default function Home() {
  const { data: c } = useHomeContent();
  const { data: stats } = useHomeStats();
  const { data: product } = useProduct();
  const { data: contact } = useContactInfo();

  const spec = (label: string) => product.specs.find((s) => s.label.toLowerCase().includes(label))?.value;

  return (
    <>
      <Hero title={c.heroTitle} subtitle={c.heroSubtitle} button={c.heroButtonText} />

      {/* ───────── −1.5 m · the problem ───────── */}
      <CircuitDivider variant="left" label="BUS 01 · CONTAMINATION" />
      <section aria-labelledby="problem" className="relative py-20 sm:py-28">
        <div className="grid-wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal side={-1} className="lg:col-span-7 lg:-ml-10">
            <MediaSlot
              slotId="HOME_PROBLEM"
              src={c.problemImageUrl}
              alt="A boatman pushing through a river choked with plastic waste"
              aspect="4:3"
              brief="Wide shot of a polluted river or lake in Tamil Nadu: plastic mats, weeds, a person cleaning by hand for scale."
              caption="Field record · manual cleanup"
              imgClassName="grayscale-[35%]"
            />
          </Reveal>
          <div className="lg:col-span-5 lg:pt-10">
            <TelemetryHeader index="SYS-01" code="CONTAMINATION" title={<span id="problem">{c.problemTitle}</span>} size="m" lede={c.problemText} />
          </div>
        </div>
        <div className="grid-wrap mt-16 grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <StatPlate code={`READ-0${i + 1}`} value={statValue(s)} label={s.label} tone={i === 0 ? "hydro" : "bone"} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── the countermeasure ───────── */}
      <CircuitDivider variant="right" label="BUS 02 · COUNTERMEASURE" />
      <section aria-labelledby="solution" className="relative py-20 sm:py-28">
        <div className="grid-wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <TelemetryHeader index="SYS-02" code="COUNTERMEASURE" title={<span id="solution">{c.solutionTitle}</span>} size="m" lede={c.solutionText} />
            <div className="mt-10 flex flex-wrap gap-3">
              <RelayButton to="/product">Meet {product.name}</RelayButton>
              <RelayButton to="/impact" variant="ghost">Track record</RelayButton>
            </div>
          </div>
          <Reveal side={1} className="lg:col-span-7 lg:-mr-10">
            <MediaSlot
              slotId="HOME_SOLUTION"
              src={c.solutionImageUrl}
              alt={`${product.name} working on the surface of a lake`}
              aspect="16:9"
              brief="Walrus on open water, three-quarter view from the bank, conveyor visible, early-morning light."
              caption={`${product.name} · field trial`}
              tone="hydro"
            />
            <HudPanel className="mt-6" serial="AQH-WLR-01 · SPEC EXTRACT" padded={false}>
              <dl className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
                {[
                  ["Conveyor", spec("operating speed") ?? "30 RPM"],
                  ["Collection", spec("collection rate") ?? "12–25 L/hour"],
                  ["Draft", spec("floating depth") ?? "Up to 20 cm"],
                  ["Debris", spec("debris") ?? "Up to 4 kg"],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-4">
                    <dt className="stencil">{k}</dt>
                    <dd className="mt-1 font-mono text-sm text-bone tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            </HudPanel>
          </Reveal>
        </div>
      </section>

      {/* ───────── −8 m · inspection bay ───────── */}
      <CircuitDivider variant="split" label="BUS 03 · INSPECTION" />
      <section aria-labelledby="inspect" className="relative py-20 sm:py-28">
        <div className="grid-wrap">
          <TelemetryHeader
            index="SYS-03"
            code="INSPECTION"
            title={<span id="inspect">Take {product.name} apart.</span>}
            lede="Drag to turn it. Switch to avionics to see the electronics box, or hydro-flow to see how water moves past the pontoons. Every number here comes from the spec sheet."
          />
          <LazyVesselViewer kind="walrus" fallbackSrc={product.coverImageUrl} fallbackSlot="HOME_INSPECT_STATIC" className="mt-12" />
        </div>
      </section>

      {/* ───────── field footage ───────── */}
      <CircuitDivider variant="left" label="BUS 04 · FIELD LOG" />
      <section aria-labelledby="footage" className="relative py-20 sm:py-28">
        <div className="grid-wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TelemetryHeader index="SYS-04" code="FIELD LOG" title={<span id="footage">See it come to life.</span>} size="m" lede="Real water, real debris, no render farm." />
          </div>
          <div className="lg:col-span-8">
            <VideoSlot slotId="HOME_DEMO" url={product.videoUrl} title={`${product.name} in the water`} brief="Demo film of Walrus collecting floating waste (YouTube link from Admin → Product)." />
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <MediaSlot
              slotId="HOME_DRONE_REEL"
              kind="video"
              alt="Aerial drone footage of Walrus on a lake"
              aspect="21:9"
              resolution="2560×1080"
              brief="Silent 10–20 s top-down drone loop of Walrus crossing a lake, MP4/H.264 under 8 MB. Drop the file URL into this slot."
            />
          </div>
        </div>
      </section>

      {/* ───────── RobotX ───────── */}
      <CircuitDivider variant="right" label="BUS 05 · MULTI-DOMAIN" />
      <RobotXTeaser />

      {/* ───────── −25 m · telemetry core ───────── */}
      <section aria-labelledby="cta" className="relative py-24 sm:py-36">
        <div className="grid-wrap">
          <HudPanel tone="hydro" serial="CORE · −25.0 m" status="live" statusLabel="Open channel" bodyClassName="p-6 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <h2 id="cta" className="display-l text-bone lg:col-span-8">{brand(c.ctaTitle ?? "Ready to see cleaner water in action?")}</h2>
              <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
                <RelayButton to="/contact" size="lg">{c.ctaButtonText ?? "Request a demo"}</RelayButton>
                <a href={`mailto:${contact.email}`} className="font-mono text-sm text-fog transition-colors hover:text-hydro">{contact.email}</a>
              </div>
            </div>
          </HudPanel>
        </div>
      </section>
    </>
  );
}

function Hero({ title, subtitle, button }: { title: string; subtitle?: string; button?: string }) {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col">
      <div className="grid-wrap grid flex-1 items-center gap-10 pb-10 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p
            className="stencil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            [AQH-00 <span className="text-line-2">//</span> HYDRO-CLEAN] · Chennai, IN
          </motion.p>
          <h1 className="display-xl mt-6 text-bone anim-flicker" style={{ animationDelay: "0.25s" }}>
            {brand(title)}
          </h1>
          {subtitle && (
            <motion.p
              className="lede mt-7 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_HYDRO, delay: 0.45 }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_HYDRO, delay: 0.6 }}
          >
            <RelayButton to="/product" size="lg">{button || "See how it works"}</RelayButton>
            <RelayButton to="/robotx" variant="secondary" size="lg">RobotX 2026 dossier</RelayButton>
          </motion.div>
        </div>
        {/* the WebGL stage floats Walrus and REVELATION in this space */}
        <div aria-hidden="true" className="hidden h-full lg:col-span-5 lg:block" />
      </div>

      <div className="grid-wrap flex items-end justify-between gap-6 pb-8">
        <dl className="hidden gap-8 sm:flex">
          {[
            ["Depth", "0.0 m · canopy"],
            ["Vessel", "Walrus · AQH-WLR-01"],
            ["Escort", "REVELATION · UAV"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="stencil">{k}</dt>
              <dd className="mt-1 font-mono text-xs text-bone">{v}</dd>
            </div>
          ))}
          <div>
            <dt className="stencil">Link</dt>
            <dd className="mt-1"><LinkStatus /></dd>
          </div>
        </dl>
        <a href="#problem" className="group/d ml-auto flex items-center gap-3 font-mono text-[11px] uppercase tracking-stencil text-drift transition-colors hover:text-bone">
          Descend
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-hydro [animation:sonar-scan_1.6s_cubic-bezier(.22,.9,.24,1)_3_both]" />
          </span>
        </a>
      </div>
    </section>
  );
}

function RobotXTeaser() {
  const now = useNow();
  const days = daysUntil(now, "2026-11-08");
  return (
    <section aria-labelledby="robotx" className="relative py-20 sm:py-28">
      <div className="grid-wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TelemetryHeader
            index="SYS-05"
            code="MULTI-DOMAIN"
            title={<span id="robotx">A boat and a drone that work as one.</span>}
            size="m"
            lede="Our Maritime RobotX Challenge 2026 entry pairs DRAKEN Mark 1, a custom surface vessel, with REVELATION, an S500 drone. Storm-response scenario, Marina Bay, Singapore."
            readouts={[
              { label: "Event", value: "Week of 8 Nov 2026" },
              { label: "T-minus", value: days > 0 ? `${days} days` : "Event week" },
            ]}
          />
          <div className="mt-10">
            <RelayButton to="/robotx">Open the dossier</RelayButton>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {[
            { to: "/robotx/system-vehicles", src: drakenImage, slot: "RX_DRAKEN", name: "DRAKEN Mark 1", kind: "USV · surface", focus: "50% 60%" },
            { to: "/robotx/system-vehicles", src: revelationImage, slot: "RX_REVELATION", name: "REVELATION", kind: "UAV · aerial", focus: "50% 50%" },
          ].map((v, i) => (
            <Reveal key={v.name} delay={i * 0.1} className={i === 1 ? "sm:mt-16" : ""}>
              <Link to={v.to} className="group/v block" data-ping>
                <MediaSlot slotId={v.slot} src={v.src} alt={`${v.name} on the test bench`} aspect="4:5" focus={v.focus} brief={`Photo of ${v.name}.`} />
                <span className="mt-4 flex items-center justify-between">
                  <span>
                    <span className="block font-display text-xl font-semibold text-bone">{v.name}</span>
                    <span className="stencil">{v.kind}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-drift transition-colors group-hover/v:text-hydro" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
