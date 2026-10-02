import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Network, Plane, Waves, X, type LucideIcon } from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { VEHICLES } from "../../data/robotxData";
import type { Vehicle } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type VehicleSystem = Vehicle["systems"][number];
type VehicleSpec = Vehicle["specs"][number];

type FrameSize = "lg" | "md";


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

const HEADER_COPY = {
  vehicles: {
    eyebrow: "Autonomous platforms",
    title: "Built for different domains.",
    text: "DRAKEN Mark 1 operates on the water while REVELATION provides an aerial perspective. Their capabilities are being integrated into one coordinated autonomous system.",
  },
  architecture: {
    eyebrow: "System architecture",
    title: "One system. Multiple platforms.",
    text: "The vehicles retain their own onboard control and safety systems while exchanging mission and telemetry information as part of the larger System of Systems.",
  },
};

const LAYERS: {
  icon: LucideIcon;
  color: string;
  label: string;
  title: string;
  text: string;
}[] = [
  {
    icon: Plane,
    color: "#00B4D8",
    label: "REVELATION",
    title: "Air Domain",
    text: "REVELATION provides aerial observation, onboard computing, GPS navigation and mission support.",
  },
  {
    icon: Waves,
    color: "#00F5FF",
    label: "DRAKEN Mark 1",
    title: "Surface Domain",
    text: "DRAKEN Mark 1 performs surface navigation, perception, obstacle handling and mission execution.",
  },
  {
    icon: Network,
    color: "#00B4D8",
    label: "OCS",
    title: "Mission Layer",
    text: "OCS and the onboard autonomy systems coordinate vehicle behavior, commands, reporting and safety fallbacks.",
  },
];

const ARCHITECTURE_NODES = [
  {
    label: "Air platform",
    title: "REVELATION",
    text: "Aerial perception, flight control and mission support",
  },
  {
    label: "Data link",
    title: "USV ↔ UAV",
    text: "RF telemetry + MAVLink communication",
  },
  {
    label: "Surface platform",
    title: "DRAKEN Mark 1",
    text: "Surface navigation, perception and mission execution",
  },
];

const BUBBLES = [
  { left: "15%", size: 3, delay: 0 },
  { left: "30%", size: 4, delay: 1.2 },
  { left: "70%", size: 3, delay: 0.6 },
  { left: "85%", size: 4, delay: 2 },
];


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
  active = false,
  glow = false,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  size?: FrameSize;
  active?: boolean;
  glow?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { outer, inner } = FRAME_RADIUS[size];

  return (
    <div
      className={`group relative h-full overflow-hidden p-[1.5px] ${outer} ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-[-50%] transition-opacity duration-500 ${
          active ? "opacity-90" : "opacity-50"
        } ${reduceMotion ? "" : "animate-[spin_8s_linear_infinite]"}`}
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
  id,
  eyebrow,
  title,
  text,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
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

      <p className="max-w-2xl text-lg leading-relaxed text-slate-400">{text}</p>
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


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function SystemVehicles() {
  const [selectedId, setSelectedId] = useState<Vehicle["id"] | null>(null);
  const selectedVehicle = VEHICLES.find((v) => v.id === selectedId) ?? null;

  return (
    <PageShell
      eyebrow="The platforms"
      title="System & Vehicles"
      intro="Two autonomous platforms. One coordinated mission."
    >
      <div className="flex flex-col gap-24">
        {/* Vehicle selector */}
        <section aria-labelledby="vehicles-heading">
          <SectionHeader id="vehicles-heading" {...HEADER_COPY.vehicles} />

          <div className="grid gap-6 lg:grid-cols-2">
            {VEHICLES.map((vehicle, index) => (
              <Reveal key={vehicle.id} delay={index * 0.15} className="h-full">
                <VehicleCard
                  vehicle={vehicle}
                  number={String(index + 1).padStart(2, "0")}
                  selected={selectedId === vehicle.id}
                  onSelect={() => setSelectedId(vehicle.id)}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Selected vehicle detail */}
        {selectedVehicle && (
          <VehicleDetail
            key={selectedVehicle.id}
            vehicle={selectedVehicle}
            onClose={() => setSelectedId(null)}
          />
        )}

        {/* System of systems */}
        <section aria-labelledby="sos-heading">
          <SectionHeader id="sos-heading" {...HEADER_COPY.architecture} />

          <Reveal>
            <SystemArchitecture />
          </Reveal>
        </section>

        {/* Engineering layers */}
        <section aria-label="Engineering layers">
          <div className="grid gap-6 md:grid-cols-3">
            {LAYERS.map((layer, index) => (
              <Reveal key={layer.title} delay={index * 0.15} className="h-full">
                <LayerCard {...layer} index={index} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Design principle */}
        <section aria-labelledby="principle-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 sm:p-12">
              <RisingBubbles />

              <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <Eyebrow>Engineering principle</Eyebrow>

                  <h2
                    id="principle-heading"
                    className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl"
                  >
                    Independent when needed.
                    <br />
                    Coordinated when it matters.
                  </h2>
                </div>

                <p className="text-lg leading-relaxed text-slate-400">
                  Each vehicle maintains its own control, perception and safety
                  mechanisms. Cross-domain communication then allows
                  information from one platform to support decisions and
                  actions on another platform. This approach allows the system
                  to remain functional even when a communication or autonomy
                  subsystem requires a fallback.
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

function VehicleCard({
  vehicle,
  number,
  selected,
  onSelect,
}: {
  vehicle: Vehicle;
  number: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <GlowFrame active={selected} innerClassName="flex flex-col">
      {/* Visual */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#0A0F1E]">
        {vehicle.photo ? (
          <img
            src={vehicle.photo}
            alt={vehicle.name}
            loading="lazy"
            className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <VehiclePlaceholder vehicle={vehicle} />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0F1E]/60 to-transparent" />

        <div className="absolute left-5 top-5">
          <DomainBadge domain={vehicle.domain} />
        </div>

        <span className="absolute right-5 top-5 text-xs font-semibold tracking-widest text-white/50">
          {number}
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <Eyebrow>{vehicle.tagline}</Eyebrow>

        <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
          {vehicle.name}
        </h3>

        <p className="mt-4 flex-1 leading-relaxed text-slate-400">
          {vehicle.summary}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {vehicle.status}
          </span>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B4D8] transition-transform duration-300 group-hover:translate-x-1">
            {selected ? "Viewing" : "Explore"}
            <ArrowRight size={16} />
          </span>
        </div>
      </div>

      {/* Whole card is the click target */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`View ${vehicle.name} details`}
        className="absolute inset-0 z-20 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00F5FF]"
      />
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// DOMAIN BADGE
// ═════════════════════════════════════════════════════════════

function DomainBadge({ domain }: { domain: Vehicle["domain"] }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/30 bg-[#0A0F1E]/70 px-3 py-1.5 text-xs font-bold tracking-widest text-white backdrop-blur-md">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4D8]"
      />
      {domain}
    </span>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE PLACEHOLDER
// ═════════════════════════════════════════════════════════════

function VehiclePlaceholder({ vehicle }: { vehicle: Vehicle }) {
  const reduceMotion = useReducedMotion();
  const isUSV = vehicle.domain === "USV";

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0A0F1E]">
      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Pulsing glow */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/15 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.1, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isUSV ? (
          <div className="relative h-24 w-64 rounded-[45%] border border-[#00B4D8]/50 bg-[#00B4D8]/10 shadow-[0_0_60px_rgba(0,180,216,0.15)]">
            <div className="absolute left-1/2 top-1/2 h-12 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-white/[0.04]" />
            <div className="absolute -bottom-4 left-8 h-8 w-8 rounded-full border border-white/15 bg-[#0A0F1E]" />
            <div className="absolute -bottom-4 right-8 h-8 w-8 rounded-full border border-white/15 bg-[#0A0F1E]" />
          </div>
        ) : (
          <div className="relative h-36 w-36">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00B4D8]/60 bg-[#00B4D8]/10" />
            <div className="absolute left-1/2 top-0 h-14 w-1 -translate-x-1/2 rounded-full bg-white/20" />
            <div className="absolute bottom-0 left-1/2 h-14 w-1 -translate-x-1/2 rounded-full bg-white/20" />
            <div className="absolute left-0 top-1/2 h-1 w-14 -translate-y-1/2 rounded-full bg-white/20" />
            <div className="absolute right-0 top-1/2 h-1 w-14 -translate-y-1/2 rounded-full bg-white/20" />
          </div>
        )}
      </div>

      <span className="absolute bottom-5 left-5 text-xs uppercase tracking-widest text-white/40">
        {vehicle.domain} / Aquaholics
      </span>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE DETAIL
// ═════════════════════════════════════════════════════════════

function VehicleDetail({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Bring the panel into view when opened, and let Escape close it.
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, reduceMotion]);

  return (
    <motion.section
      ref={ref}
      aria-labelledby="vehicle-detail-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <GlowFrame active>
        {/* Header */}
        <div className="relative flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <DomainBadge domain={vehicle.domain} />
              <Eyebrow>Detailed platform view</Eyebrow>
            </div>

            <h2
              id="vehicle-detail-heading"
              className="mt-4 font-heading text-3xl font-bold text-white md:text-5xl"
            >
              {vehicle.name}
            </h2>

            <div className="my-5 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

            <p className="text-slate-400">{vehicle.tagline}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-[#00B4D8]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] sm:self-auto"
          >
            Close <X size={14} />
          </button>
        </div>

        {/* Systems + specs */}
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Platform systems</Eyebrow>

            <div className="mt-5 space-y-3">
              {vehicle.systems.map((system: VehicleSystem) => (
                <div
                  key={system.title}
                  className="rounded-2xl border border-white/10 bg-[#0A0F1E]/60 p-4 transition-colors duration-300 hover:border-[#00B4D8]/30"
                >
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                    {system.title}
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {system.items.map((item: string) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-slate-400"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00B4D8]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Eyebrow>Specifications</Eyebrow>

            <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0A0F1E]/60">
              {vehicle.specs.map((spec: VehicleSpec) => (
                <div
                  key={spec.label}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_1.2fr]"
                >
                  <span className="text-sm text-slate-500">{spec.label}</span>
                  <span className="text-sm font-medium text-slate-200">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="relative border-t border-white/10 p-6 sm:p-8">
          <Eyebrow>Safety & fallback</Eyebrow>

          <ul className="mt-5 flex flex-wrap gap-3">
            {vehicle.safety.map((item: string) => (
              <li
                key={item}
                className="rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/[0.06] px-4 py-2 text-sm text-slate-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </GlowFrame>
    </motion.section>
  );
}


// ═════════════════════════════════════════════════════════════
// SYSTEM ARCHITECTURE
// ═════════════════════════════════════════════════════════════

function SystemArchitecture() {
  return (
    <GlowFrame glow innerClassName="p-5 sm:p-8">
      <div className="relative grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {ARCHITECTURE_NODES.map((node, index) => (
          <ArchitectureNode
            key={node.title}
            {...node}
            showArrow={index < ARCHITECTURE_NODES.length - 1}
          />
        ))}
      </div>

      {/* Mission layer */}
      <div className="relative mt-6 flex flex-col items-center">
        <div
          aria-hidden="true"
          className="hidden h-8 w-px bg-gradient-to-b from-[#00B4D8]/60 to-white/10 md:block"
        />

        <div className="w-full rounded-2xl border border-[#00B4D8]/25 bg-[#00B4D8]/[0.04] p-5 text-center">
          <Eyebrow>Mission interface</Eyebrow>

          <h3 className="mt-2 font-heading text-xl font-bold text-white">
            OCS / RoboCommand
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            System-level commands and reporting interface supporting the
            coordinated autonomous system.
          </p>
        </div>
      </div>
    </GlowFrame>
  );
}

function ArchitectureNode({
  label,
  title,
  text,
  showArrow,
}: {
  label: string;
  title: string;
  text: string;
  showArrow: boolean;
}) {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#0A0F1E]/70 p-5 text-center transition-colors duration-300 hover:border-[#00B4D8]/30">
        <Eyebrow>{label}</Eyebrow>

        <h3 className="mt-2 font-heading text-lg font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
      </div>

      {showArrow && <FlowArrow />}
    </>
  );
}

/** Vertical connector on mobile, animated arrow on desktop. */
function FlowArrow() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div
        aria-hidden="true"
        className="mx-auto h-8 w-px bg-gradient-to-b from-[#00B4D8]/60 to-white/10 md:hidden"
      />

      <motion.div
        aria-hidden="true"
        className="hidden items-center justify-center text-[#00B4D8]/70 md:flex"
        animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight size={20} />
      </motion.div>
    </>
  );
}


// ═════════════════════════════════════════════════════════════
// LAYER CARD
// ═════════════════════════════════════════════════════════════

function LayerCard({
  icon: Icon,
  color,
  label,
  title,
  text,
  index,
}: (typeof LAYERS)[number] & { index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <GlowFrame innerClassName="p-8">
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
        className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 24px ${color}20`,
        }}
      >
        <Icon size={24} style={{ color }} />
      </motion.div>

      <span
        className="relative mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{ color }}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: color }}
        />
        {label}
      </span>

      <h3 className="relative mb-4 font-heading text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="relative leading-relaxed text-slate-400">{text}</p>
    </GlowFrame>
  );
}