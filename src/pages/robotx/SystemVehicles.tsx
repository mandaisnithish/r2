// src/pages/robotx/SystemVehicles.tsx

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Bot,
  Cpu,
  Plane,
  Radio,
  ShieldCheck,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import {
  AI,
  AUTONOMY,
  SAFETY,
  SYSTEM_OF_SYSTEMS,
  VEHICLES,
  type Vehicle,
  type VehicleDomain,
} from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";

type LabelledValue = [label: string, value: string | undefined];


// ═════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════

const GLOW_BORDER =
  "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)";

// Full class strings so Tailwind can detect them at build time.
const FRAME_RADIUS: Record<FrameSize, { outer: string; inner: string }> = {
  lg: { outer: "rounded-3xl", inner: "rounded-[calc(1.5rem-1.5px)]" },
  md: { outer: "rounded-2xl", inner: "rounded-[calc(1rem-1.5px)]" },
};

const BORDER_MODE: Record<FrameMode, { rest: string; active: string; motion: string }> = {
  always: {
    rest: "opacity-50",
    active: "opacity-90",
    motion: "animate-[spin_8s_linear_infinite]",
  },
  // Lightweight variant for repeated cards: the border only appears and spins on hover.
  hover: {
    rest: "opacity-0 group-hover:opacity-60",
    active: "opacity-60",
    motion: "group-hover:animate-[spin_8s_linear_infinite]",
  },
};

const BUBBLES = [
  { left: "15%", size: 3, delay: 0 },
  { left: "30%", size: 4, delay: 1.2 },
  { left: "70%", size: 3, delay: 0.6 },
  { left: "85%", size: 4, delay: 2 },
];

const DOMAIN_ICONS: Record<VehicleDomain, LucideIcon> = {
  USV: Waves,
  UAV: Plane,
  UUV: Bot,
};

const COMMUNICATION_FIELDS = [
  ["Protocol", "protocol"],
  ["Telemetry", "telemetry"],
  ["Frequency", "frequency"],
  ["Modulation", "modulation"],
  ["Status", "status"],
] as const;

const AUTONOMY_FIELDS = [
  ["Perception", "perception"],
  ["Navigation", "navigation"],
  ["Computing", "computing"],
  ["Control", "control"],
] as const;

const HEADERS = {
  vehicles: {
    eyebrow: "Vehicle platforms",
    title: VEHICLES.map((v) => v.name).join(" & "),
    text: "The current RobotX system is built around two vehicle domains: an uncrewed surface vessel and an uncrewed aerial vehicle.",
  },
  architecture: {
    eyebrow: "System architecture",
    title: SYSTEM_OF_SYSTEMS.title,
    text: SYSTEM_OF_SYSTEMS.summary,
  },
  autonomy: {
    eyebrow: "Autonomy stack",
    title: "From perception to vehicle action",
    text: "The autonomy architecture separates perception, state estimation, decision-making, navigation and low-level control.",
  },
  ai: {
    eyebrow: "AI & perception",
    title: "Onboard computer vision",
    // Built from the data so the copy cannot drift from the real model name.
    text: `The current perception pipeline combines ${AI.model} with ${AI.framework} for vision-based environmental interpretation.`,
  },
  safety: {
    eyebrow: "Safety",
    title: "Independent safety and fallback mechanisms",
    text: "Vehicle-level safety mechanisms remain available as autonomy and system integration are developed.",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Drop entries with no value so empty fields never render. */
const present = (entries: LabelledValue[]) =>
  entries.filter((entry): entry is [string, string] => Boolean(entry[1]));


// ═════════════════════════════════════════════════════════════
// SHARED BUILDING BLOCKS
// ═════════════════════════════════════════════════════════════

/** Fade-and-rise entrance that triggers once when scrolled into view. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small uppercase label with a pulsing dot. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4D8]"
      />
      {children}
    </span>
  );
}

/** Card with the rotating conic-gradient glow border and radial hover glow. */
function GlowFrame({
  children,
  size = "lg",
  mode = "always",
  active = false,
  glow = false,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  size?: FrameSize;
  mode?: FrameMode;
  active?: boolean;
  glow?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { outer, inner } = FRAME_RADIUS[size];
  const border = BORDER_MODE[mode];

  return (
    <div
      className={`group relative h-full overflow-hidden p-[1.5px] ${outer} ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-[-50%] transition-opacity duration-500 ${
          active ? border.active : border.rest
        } ${reduceMotion ? "" : border.motion}`}
        style={{ background: GLOW_BORDER }}
      />

      <div
        className={`relative h-full overflow-hidden bg-[#0D1B2A] ${inner} ${innerClassName}`}
      >
        {glow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/10 blur-[80px]"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #00B4D814, transparent 70%)",
          }}
        />

        {children}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  id: string;
}) {
  return (
    <Reveal className="mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>

      <h2
        id={id}
        className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
      >
        {title}
      </h2>

      <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

      {text && (
        <p className="max-w-3xl text-lg leading-relaxed text-slate-400">{text}</p>
      )}
    </Reveal>
  );
}

function RisingBubbles() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <>
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-[#00B4D8]/30"
          style={{ left: b.left, width: b.size, height: b.size, bottom: "8%" }}
          animate={{ y: [0, -280], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
      {children}
    </span>
  );
}

/** Rounded icon tile with the cyan glow used on status cards. */
function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
      style={{
        background: "#00B4D815",
        border: "1px solid #00B4D830",
        boxShadow: "0 0 24px #00B4D820",
      }}
    >
      <Icon size={22} className="text-[#00B4D8]" />
    </div>
  );
}

/** Small label-over-value tile used for specs and facts. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0A0F1E]/60 p-3">
      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-200">
        {value}
      </dd>
    </div>
  );
}

/** Highlighted status box, matching the "Our decision" block on the Design page. */
function StatusNote({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[#00B4D8]/25 bg-[#00B4D8]/[0.06] p-4">
      <p className="mb-1.5">
        <Eyebrow>Status</Eyebrow>
      </p>

      <p className="leading-relaxed text-white">{text}</p>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function SystemVehicles() {
  return (
    <PageShell
      eyebrow="ROBOTX 2026"
      title="System & Vehicles"
      intro="The AQUAHOLICS RobotX platform combines a custom USV, an aerial vehicle and an integrated autonomy and communication architecture."
    >
      <div className="flex flex-col gap-24">
        {/* Vehicles */}
        <section aria-labelledby="vehicles-heading">
          <SectionHeader id="vehicles-heading" {...HEADERS.vehicles} />

          <div className="flex flex-col gap-8">
            {VEHICLES.map((vehicle) => (
              <Reveal key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* System of systems */}
        <section aria-labelledby="architecture-heading">
          <SectionHeader id="architecture-heading" {...HEADERS.architecture} />

          <SystemOfSystems />
        </section>

        {/* Autonomy */}
        <section aria-labelledby="autonomy-heading">
          <SectionHeader id="autonomy-heading" {...HEADERS.autonomy} />

          <AutonomyStack />
        </section>

        {/* AI */}
        <section aria-labelledby="ai-heading">
          <SectionHeader id="ai-heading" {...HEADERS.ai} />

          <Reveal>
            <PerceptionCard />
          </Reveal>
        </section>

        {/* Safety */}
        <section aria-labelledby="safety-heading">
          <SectionHeader id="safety-heading" {...HEADERS.safety} />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY.map((item, index) => (
              <li key={item.id}>
                <Reveal delay={(index % 3) * 0.1} className="h-full">
                  <GlowFrame size="md" mode="hover" innerClassName="p-6">
                    <div className="relative mb-5">
                      <IconTile icon={ShieldCheck} />
                    </div>

                    <h3 className="relative font-heading text-xl font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </GlowFrame>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Design principle */}
        <section aria-labelledby="principle-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Design principle</Eyebrow>

                <h2
                  id="principle-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  Independent by design.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  {SYSTEM_OF_SYSTEMS.principle}
                </p>
              </div>
            </GlowFrame>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE CARD
// ═════════════════════════════════════════════════════════════

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const DomainIcon = DOMAIN_ICONS[vehicle.domain] ?? Bot;

  const extras = present([
    ["Dimensions", vehicle.dimensions],
    ["Material", vehicle.material],
    ["Hull", vehicle.hull],
  ]);

  const summary = present([
    ["Autonomy", vehicle.autonomy],
    ["Communication", vehicle.communication],
    ["Power", vehicle.power],
    ["Payload", vehicle.payload],
  ]);

  return (
    <GlowFrame>
      {/* Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-[#00B4D8]/[0.08] to-transparent p-7 lg:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <DomainIcon size={18} aria-hidden="true" className="text-[#00B4D8]" />
              <Eyebrow>{vehicle.domain}</Eyebrow>
            </div>

            <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">{vehicle.type}</p>
          </div>

          {vehicle.status && <Chip>{vehicle.status}</Chip>}
        </div>

        <div className="mb-5 mt-5 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

        <p className="max-w-3xl leading-relaxed text-slate-300">
          {vehicle.description}
        </p>
      </div>

      {vehicle.image && (
        <div className="relative border-b border-white/10 bg-[#0A0F1E]">
          <img
            src={vehicle.image}
            alt={`${vehicle.name}, ${vehicle.type}`}
            loading="lazy"
            className="max-h-[420px] w-full select-none object-cover"
          />
        </div>
      )}

      {/* Specs and systems */}
      <div className="relative grid gap-8 p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-9">
        <div>
          <h4 className="mb-4 flex items-center gap-2 font-heading font-bold text-white">
            <Cpu size={16} aria-hidden="true" className="text-[#00B4D8]" />
            Specifications
          </h4>

          <dl className="grid gap-3 sm:grid-cols-2">
            {vehicle.specs.map((spec) => (
              <Fact
                key={`${vehicle.id}-${spec.label}`}
                label={spec.label}
                value={spec.value}
              />
            ))}
          </dl>

          {extras.length > 0 && (
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
              {extras.map(([label, value]) => (
                <Fact key={label} label={label} value={value} />
              ))}
            </dl>
          )}
        </div>

        <div>
          <h4 className="mb-4 flex items-center gap-2 font-heading font-bold text-white">
            <Bot size={16} aria-hidden="true" className="text-[#00B4D8]" />
            Systems
          </h4>

          <ul className="space-y-3">
            {vehicle.systems.map((system) => (
              <li
                key={`${vehicle.id}-${system.name}`}
                className="rounded-xl border border-white/10 bg-[#0A0F1E]/60 p-4"
              >
                <p className="text-sm font-semibold text-white">{system.name}</p>

                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {system.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary row; only rendered when the vehicle has any of these fields. */}
      {summary.length > 0 && (
        <dl className="relative grid gap-5 border-t border-white/10 bg-[#0A0F1E]/40 p-7 sm:grid-cols-2 lg:grid-cols-4 lg:p-9">
          {summary.map(([label, value]) => (
            <div key={label}>
              <dt className="mb-1.5">
                <Eyebrow>{label}</Eyebrow>
              </dt>

              <dd className="text-sm leading-relaxed text-slate-300">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// SYSTEM OF SYSTEMS
// ═════════════════════════════════════════════════════════════

function SystemOfSystems() {
  const { domains, communication, links } = SYSTEM_OF_SYSTEMS;

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-6 lg:grid-cols-3">
        {domains.map((domain, index) => (
          <li key={domain.id}>
            <Reveal delay={index * 0.15} className="h-full">
              <GlowFrame size="md" mode="hover" innerClassName="p-6">
                <div className="relative mb-5 flex items-center justify-between">
                  <Chip>{domain.domain}</Chip>

                  <span className="text-xs font-semibold tracking-widest text-slate-500">
                    {pad(index + 1)}
                  </span>
                </div>

                <h3 className="relative font-heading text-xl font-bold text-white">
                  {domain.name}
                </h3>

                <p className="relative mt-1 text-sm font-semibold text-[#00B4D8]">
                  {domain.vehicle}
                </p>

                <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                  {domain.description}
                </p>
              </GlowFrame>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal>
        <GlowFrame innerClassName="p-7 lg:p-9">
          <div className="relative">
            <div className="mb-6 flex items-center gap-4">
              <IconTile icon={Radio} />

              <h3 className="font-heading text-xl font-bold text-white lg:text-2xl">
                Communication architecture
              </h3>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {COMMUNICATION_FIELDS.map(([label, key]) => (
                <Fact key={key} label={label} value={communication[key]} />
              ))}
            </dl>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="mb-4">
                <Eyebrow>Links</Eyebrow>
              </p>

              <ul className="space-y-3">
                {links.map((link) => {
                  const LinkIcon =
                    link.direction === "bidirectional" ? ArrowLeftRight : ArrowRight;

                  return (
                    <li
                      key={`${link.from}-${link.to}`}
                      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0A0F1E]/60 p-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <span className="font-semibold text-white">{link.from}</span>

                      <LinkIcon
                        size={16}
                        aria-hidden="true"
                        className="hidden shrink-0 text-[#00B4D8] sm:block"
                      />

                      <span className="text-sm text-slate-400">{link.label}</span>

                      <span className="text-sm font-semibold text-[#00B4D8] sm:ml-auto">
                        {link.to}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </GlowFrame>
      </Reveal>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// AUTONOMY
// ═════════════════════════════════════════════════════════════

function AutonomyStack() {
  return (
    <div className="flex flex-col gap-8">
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AUTONOMY.stages.map((stage, index) => (
          <li key={stage.id}>
            <Reveal delay={(index % 3) * 0.1} className="h-full">
              <GlowFrame size="md" mode="hover" innerClassName="p-6">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#00B4D8]/15 text-sm font-bold text-[#00B4D8]">
                  {pad(index + 1)}
                </span>

                <h3 className="relative mt-5 font-heading text-xl font-bold text-white">
                  {stage.title}
                </h3>

                <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                  {stage.description}
                </p>
              </GlowFrame>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <AutonomyCard title="USV Autonomy" icon={Waves} data={AUTONOMY.usv} />
        </Reveal>

        <Reveal delay={0.15} className="h-full">
          <AutonomyCard title="UAV Autonomy" icon={Plane} data={AUTONOMY.uav} />
        </Reveal>
      </div>
    </div>
  );
}

function AutonomyCard({
  title,
  icon,
  data,
}: {
  title: string;
  icon: LucideIcon;
  data: typeof AUTONOMY.usv | typeof AUTONOMY.uav;
}) {
  return (
    <GlowFrame mode="hover" innerClassName="p-7 lg:p-9">
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          <IconTile icon={icon} />

          <h3 className="font-heading text-xl font-bold text-white lg:text-2xl">
            {title}
          </h3>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          {AUTONOMY_FIELDS.map(([label, key]) => (
            <Fact key={key} label={label} value={data[key]} />
          ))}
        </dl>

        <div className="mt-6">
          <StatusNote text={data.status} />
        </div>
      </div>
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// PERCEPTION
// ═════════════════════════════════════════════════════════════

function PerceptionCard() {
  return (
    <GlowFrame glow innerClassName="p-7 lg:p-9">
      <div className="relative">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Model" value={AI.model} />
          <Fact label="Framework" value={AI.framework} />
          <Fact
            label="Dataset"
            value={`~${AI.dataset.approximateImages.toLocaleString("en-GB")} images`}
          />
          <Fact label="Classes" value={String(AI.dataset.classes)} />
        </dl>

        <dl className="mt-6">
          <Fact label="Training platform" value={AI.dataset.trainingPlatform} />
        </dl>

        <p className="mt-6 max-w-3xl leading-relaxed text-slate-400">
          {AI.deployment}
        </p>

        <div className="mt-6">
          <Chip>{AI.status}</Chip>
        </div>
      </div>
    </GlowFrame>
  );
}