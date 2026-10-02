import { Fragment, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Eye, Network, Plane, Ship, type LucideIcon } from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { BUILD_LOG, DECISIONS } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type Decision = (typeof DECISIONS)[number];
type BuildPost = (typeof BUILD_LOG)[number];

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";


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
  // Lightweight variant for long lists: the border only appears and spins on hover.
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

const HEADERS = {
  decisions: {
    eyebrow: "Design thinking",
    title: "Engineering Decisions",
    text: "Every major subsystem was selected by comparing the problem, available alternatives, implementation constraints, and expected mission requirements.",
  },
  journey: {
    eyebrow: "Build history",
    title: "Development Journey",
    text: "A chronological record of the major milestones, iterations, and integration steps during development.",
  },
  status: {
    eyebrow: "Current state",
    title: "Where We Are Now",
  },
};

const STATUS_ITEMS: {
  icon: LucideIcon;
  color: string;
  label: string;
  title: string;
  text: string;
}[] = [
  {
    icon: Ship,
    color: "#00B4D8",
    label: "USV",
    title: "DRAKEN Mark 1",
    text: "Manual operation established; autonomous navigation under development.",
  },
  {
    icon: Plane,
    color: "#00F5FF",
    label: "UAV",
    title: "REVELATION",
    text: "Flight platform completed; autonomous flight testing in progress.",
  },
  {
    icon: Eye,
    color: "#00B4D8",
    label: "Perception",
    title: "Autonomy",
    text: "Vision-based perception and autonomous behaviors are being integrated.",
  },
  {
    icon: Network,
    color: "#00F5FF",
    label: "Systems",
    title: "Integration",
    text: "USV–UAV communication and coordinated system testing are ongoing.",
  },
];

const PROCESS_STEPS = ["Design", "Build", "Test", "Iterate", "Integrate"];

const BUILD_POSTS: BuildPost[] = [...BUILD_LOG].sort((a, b) =>
  b.date.localeCompare(a.date)
);

const pad = (n: number) => String(n).padStart(2, "0");

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });


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
function Eyebrow({
  children,
  color = "#00B4D8",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
      style={{ color }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: color }}
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
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">{text}</p>
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
    <span className="inline-flex items-center rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
      {children}
    </span>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function DesignDevelopment() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDecision: Decision | undefined = DECISIONS[selectedIndex];

  return (
    <PageShell
      eyebrow="ENGINEERING JOURNEY"
      title="Design & Development"
      intro="From early design decisions to autonomous system integration — this is how we built the AQUAHOLICS RobotX platform."
    >
      <div className="flex flex-col gap-24">
        {/* Engineering decisions */}
        <section aria-labelledby="decisions-heading">
          <SectionHeader id="decisions-heading" {...HEADERS.decisions} />

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Selector */}
            <Reveal className="space-y-3">
              {DECISIONS.map((decision, index) => (
                <DecisionButton
                  key={decision.title}
                  decision={decision}
                  number={pad(index + 1)}
                  active={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                />
              ))}
            </Reveal>

            {/* Selected decision */}
            {selectedDecision && (
              <Reveal delay={0.15}>
                <DecisionDetail
                  key={selectedIndex}
                  decision={selectedDecision}
                  position={pad(selectedIndex + 1)}
                  total={pad(DECISIONS.length)}
                />
              </Reveal>
            )}
          </div>
        </section>

        {/* Development journey */}
        <section aria-labelledby="journey-heading">
          <SectionHeader id="journey-heading" {...HEADERS.journey} />

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[11px] top-0 hidden h-full w-px bg-gradient-to-b from-[#00B4D8]/60 via-white/10 to-transparent md:block"
            />

            <ol className="space-y-10">
              {BUILD_POSTS.map((post, index) => (
                <li key={`${post.date}-${post.title}`}>
                  <Reveal>
                    <TimelineEntry
                      post={post}
                      buildNumber={pad(BUILD_POSTS.length - index)}
                      latest={index === 0}
                    />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Current status */}
        <section aria-labelledby="status-heading">
          <SectionHeader id="status-heading" {...HEADERS.status} />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS_ITEMS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.15} className="h-full">
                <StatusCard {...item} index={index} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Engineering philosophy */}
        <section aria-labelledby="approach-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Our approach</Eyebrow>

                <h2
                  id="approach-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  Build. Test. Learn. Integrate.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  We develop the system progressively — validating individual
                  subsystems first, then combining them into increasingly
                  complex autonomous behaviors. Each iteration is used to
                  identify limitations, refine the design, and move closer to
                  reliable multi-vehicle operation.
                </p>

                <ol
                  aria-label="Development process"
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  {PROCESS_STEPS.map((step, index) => (
                    <Fragment key={step}>
                      <li>
                        <Chip>{step}</Chip>
                      </li>

                      {index < PROCESS_STEPS.length - 1 && (
                        <li aria-hidden="true" className="text-[#00B4D8]/50">
                          <ArrowRight size={16} />
                        </li>
                      )}
                    </Fragment>
                  ))}
                </ol>
              </div>
            </GlowFrame>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// DECISIONS
// ═════════════════════════════════════════════════════════════

function DecisionButton({
  decision,
  number,
  active,
  onSelect,
}: {
  decision: Decision;
  number: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] ${
        active
          ? "border-[#00B4D8]/60 bg-[#00B4D8]/10 shadow-[0_0_24px_rgba(0,180,216,0.12)]"
          : "border-white/10 bg-[#0D1B2A] hover:border-[#00B4D8]/30"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #00B4D814, transparent 70%)",
        }}
      />

      <div className="relative flex items-start gap-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
            active ? "bg-[#00B4D8] text-[#0A0F1E]" : "bg-white/10 text-slate-400"
          }`}
        >
          {number}
        </span>

        <div>
          <h3 className="font-heading font-bold text-white">{decision.title}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {decision.problem}
          </p>
        </div>
      </div>
    </button>
  );
}

function DecisionDetail({
  decision,
  position,
  total,
}: {
  decision: Decision;
  position: string;
  total: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <GlowFrame active innerClassName="p-7 lg:p-9">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="mb-6 flex items-center justify-between">
          <Eyebrow>Engineering decision</Eyebrow>

          <span className="text-xs font-semibold tracking-widest text-slate-500">
            {position} / {total}
          </span>
        </div>

        <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">
          {decision.title}
        </h3>

        <div className="mb-8 mt-5 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

        <div className="space-y-6">
          <DecisionItem label="The problem" value={decision.problem} />
          <DecisionItem label="Options considered" value={decision.options} />
          <DecisionItem label="Our decision" value={decision.decision} highlight />
          <DecisionItem label="Why" value={decision.rationale} />
        </div>
      </motion.div>
    </GlowFrame>
  );
}

function DecisionItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl border border-[#00B4D8]/25 bg-[#00B4D8]/[0.06] p-4"
          : ""
      }
    >
      <p className="mb-1.5">
        <Eyebrow>{label}</Eyebrow>
      </p>

      <p
        className={`leading-relaxed ${
          highlight ? "text-white" : "text-slate-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// TIMELINE
// ═════════════════════════════════════════════════════════════

function TimelineEntry({
  post,
  buildNumber,
  latest,
}: {
  post: BuildPost;
  buildNumber: string;
  latest: boolean;
}) {
  return (
    <article className="relative md:pl-12">
      {/* Marker */}
      <div className="absolute left-0 top-1 hidden md:flex" aria-hidden="true">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#00B4D8]/50 bg-[#0A0F1E]">
          <span
            className={`h-2 w-2 rounded-full bg-[#00B4D8] ${
              latest ? "animate-pulse" : ""
            }`}
          />
        </span>
      </div>

      <GlowFrame mode="hover" active={latest} innerClassName="p-6 lg:p-7">
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <time
                  dateTime={post.date}
                  className="text-xs font-semibold uppercase tracking-widest text-[#00B4D8]"
                >
                  {formatDate(post.date)}
                </time>

                {latest && <Chip>Latest</Chip>}
              </div>

              <h3 className="mt-2 font-heading text-xl font-bold text-white lg:text-2xl">
                {post.title}
              </h3>
            </div>

            <span className="hidden text-xs font-semibold uppercase tracking-widest text-slate-600 sm:block">
              Build {buildNumber}
            </span>
          </div>

          <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">
            {post.body}
          </p>

          {post.photo && (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1E]">
              <img
                src={post.photo}
                alt={post.title}
                loading="lazy"
                className="max-h-[420px] w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      </GlowFrame>
    </article>
  );
}


// ═════════════════════════════════════════════════════════════
// STATUS CARD
// ═════════════════════════════════════════════════════════════

function StatusCard({
  icon: Icon,
  color,
  label,
  title,
  text,
  index,
}: (typeof STATUS_ITEMS)[number] & { index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <GlowFrame size="md" innerClassName="p-6">
      <motion.div
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
        className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 24px ${color}20`,
        }}
      >
        <Icon size={22} style={{ color }} />
      </motion.div>

      <div className="relative mb-2">
        <Eyebrow color={color}>{label}</Eyebrow>
      </div>

      <h3 className="relative font-heading text-xl font-bold text-white">
        {title}
      </h3>

      <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
        {text}
      </p>
    </GlowFrame>
  );
}