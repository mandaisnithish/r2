import { Fragment, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FlaskConical,
  Plane,
  RefreshCw,
  Ship,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { TESTS } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type Test = (typeof TESTS)[number];

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";

type ValidationStatus = "validated" | "partial" | "ongoing";


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

const HEADERS = {
  time: {
    eyebrow: "Field time",
    title: "Time in Testing",
    text: "Our testing effort spans water operations, aerial operations, and simulation-based development.",
  },
  method: {
    eyebrow: "Methodology",
    title: "How We Test",
    text: "Each test validates a specific capability, exposes failure modes or limitations, and is repeated after the system is modified, before we move to more complex integrated scenarios.",
  },
  record: {
    eyebrow: "Test record",
    title: "Test Results",
    text: "Select a test to inspect its location, duration, and recorded outcome.",
  },
  validation: {
    eyebrow: "Validation status",
    title: "Current Validation",
    text: "Where each major capability stands today.",
  },
};

const TIME_ITEMS: {
  type: string;
  icon: LucideIcon;
  color: string;
  label: string;
  text: string;
}[] = [
  { type: "Water", icon: Ship, color: "#00B4D8", label: "Water", text: "USV testing" },
  { type: "Air", icon: Plane, color: "#00F5FF", label: "Air", text: "UAV testing" },
  { type: "Simulation", icon: Monitor, color: "#00B4D8", label: "Simulation", text: "Virtual validation" },
];

const TEST_STEPS = ["Prepare", "Execute", "Observe", "Improve", "Retest"];

const VALIDATION_STATUS: Record<
  ValidationStatus,
  { icon: LucideIcon; color: string; label: string }
> = {
  validated: { icon: CheckCircle2, color: "#00F5FF", label: "Validated" },
  partial: { icon: CircleDashed, color: "#F5B83D", label: "Partially validated" },
  ongoing: { icon: RefreshCw, color: "#00B4D8", label: "Testing ongoing" },
};

const VALIDATION_ITEMS: {
  status: ValidationStatus;
  title: string;
  text: string;
}[] = [
  {
    status: "validated",
    title: "AI Detection",
    text: "Vision-based detection has been tested.",
  },
  {
    status: "validated",
    title: "USV Manual Control",
    text: "Manual water operation has been tested.",
  },
  {
    status: "partial",
    title: "Autonomous Navigation",
    text: "Autonomous navigation remains under continued validation.",
  },
  {
    status: "ongoing",
    title: "USV–UAV Integration",
    text: "Inter-vehicle communication and coordinated operation are being tested.",
  },
];

const LOOP_AREAS = ["Mechanical", "Electrical", "Software", "Autonomy"];

/** Newest test first. */
const TEST_ROWS: Test[] = [...TESTS].sort((a, b) => b.date.localeCompare(a.date));

const totalMinutes = (type: string) =>
  TESTS.filter((t) => t.type === type).reduce((sum, t) => sum + t.minutes, 0);

const ALL_MINUTES = TESTS.reduce((sum, t) => sum + t.minutes, 0);

const pad = (n: number) => String(n).padStart(2, "0");

const fmt = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h) return `${h} h${m ? ` ${m} min` : ""}`;
  return `${m} min`;
};

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

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal>
      <GlowFrame innerClassName="flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0px rgba(0,180,216,0.3)",
                    "0 0 30px rgba(0,180,216,0.5)",
                    "0 0 0px rgba(0,180,216,0.3)",
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00B4D8]/30 bg-[#00B4D8]/10"
        >
          <Icon size={24} className="text-[#00B4D8]" />
        </motion.div>

        <p className="relative text-sm text-slate-500">{text}</p>
      </GlowFrame>
    </Reveal>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function TestingResults() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTest: Test | undefined = TEST_ROWS[selectedIndex];

  return (
    <PageShell
      eyebrow="VALIDATION & EVIDENCE"
      title="Testing & Results"
      intro="We test progressively — from individual capabilities to integrated system behavior — using every iteration to identify limitations and improve the platform."
    >
      <div className="flex flex-col gap-24">
        {/* Time in testing */}
        <section aria-labelledby="time-heading">
          <SectionHeader id="time-heading" {...HEADERS.time} />

          <ul className="grid gap-6 sm:grid-cols-3">
            {TIME_ITEMS.map((item, index) => (
              <li key={item.type}>
                <Reveal delay={index * 0.15} className="h-full">
                  <TimeCard {...item} index={index} minutes={totalMinutes(item.type)} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Methodology */}
        <section aria-labelledby="method-heading">
          <SectionHeader id="method-heading" {...HEADERS.method} />

          <ol className="grid gap-4 sm:grid-cols-5">
            {TEST_STEPS.map((step, index) => (
              <li key={step} className="relative">
                <Reveal delay={index * 0.1} className="h-full">
                  <GlowFrame size="md" mode="hover" innerClassName="p-5">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#00B4D8]/15 text-sm font-bold text-[#00B4D8]">
                      {pad(index + 1)}
                    </span>

                    <h3 className="relative mt-5 font-heading text-lg font-bold text-white">
                      {step}
                    </h3>
                  </GlowFrame>
                </Reveal>

                {index < TEST_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[18px] top-1/2 z-10 hidden -translate-y-1/2 text-[#00B4D8]/50 sm:block"
                  >
                    <ArrowRight size={16} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Test record */}
        <section aria-labelledby="record-heading">
          <SectionHeader id="record-heading" {...HEADERS.record} />

          {TEST_ROWS.length === 0 ? (
            <EmptyState icon={FlaskConical} text="Test results coming soon." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              {/* Selector */}
              <Reveal className="space-y-3">
                {TEST_ROWS.map((test, index) => (
                  <TestButton
                    key={`${test.date}-${index}`}
                    test={test}
                    number={pad(index + 1)}
                    active={selectedIndex === index}
                    onSelect={() => setSelectedIndex(index)}
                  />
                ))}
              </Reveal>

              {/* Selected test */}
              {selectedTest && (
                <Reveal delay={0.15} className="lg:sticky lg:top-24 lg:self-start">
                  <TestDetail
                    key={selectedIndex}
                    test={selectedTest}
                    position={pad(selectedIndex + 1)}
                    total={pad(TEST_ROWS.length)}
                  />
                </Reveal>
              )}
            </div>
          )}
        </section>

        {/* Validation status */}
        <section aria-labelledby="validation-heading">
          <SectionHeader id="validation-heading" {...HEADERS.validation} />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALIDATION_ITEMS.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 0.15} className="h-full">
                  <ValidationCard {...item} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Engineering loop */}
        <section aria-labelledby="loop-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Engineering loop</Eyebrow>

                <h2
                  id="loop-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  Test results become the next design decision.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  Testing is not the final step of development. Results from
                  each iteration feed directly back into the work of every
                  team below.
                </p>

                <ul
                  aria-label="Teams that use test results"
                  className="mt-8 flex flex-wrap items-center gap-3"
                >
                  {LOOP_AREAS.map((area, index) => (
                    <Fragment key={area}>
                      <li>
                        <Chip>{area}</Chip>
                      </li>

                      {index < LOOP_AREAS.length - 1 && (
                        <li aria-hidden="true" className="text-[#00B4D8]/50">
                          <ArrowRight size={16} />
                        </li>
                      )}
                    </Fragment>
                  ))}
                </ul>
              </div>
            </GlowFrame>
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// TIME CARD
// ═════════════════════════════════════════════════════════════

function TimeCard({
  icon: Icon,
  color,
  label,
  text,
  minutes,
  index,
}: (typeof TIME_ITEMS)[number] & { minutes: number; index: number }) {
  const reduceMotion = useReducedMotion();
  const share = ALL_MINUTES > 0 ? Math.round((minutes / ALL_MINUTES) * 100) : 0;

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

      <p className="relative font-heading text-3xl font-extrabold text-white">
        {fmt(minutes)}
      </p>

      <p className="relative mt-2 text-sm text-slate-400">{text}</p>

      {/* Share of total testing time */}
      <div className="relative mt-5">
        <div
          role="img"
          aria-label={`${share}% of total testing time`}
          className="h-1 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${share}%`, background: color }}
          />
        </div>

        <p className="mt-2 text-xs font-semibold tracking-widest text-slate-500">
          {share}% of total
        </p>
      </div>
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// TEST RECORD
// ═════════════════════════════════════════════════════════════

function TestButton({
  test,
  number,
  active,
  onSelect,
}: {
  test: Test;
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

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
              {test.type}
            </span>

            <time
              dateTime={test.date}
              className="text-xs font-semibold tracking-widest text-slate-500"
            >
              {formatDate(test.date)}
            </time>
          </div>

          <h3 className="mt-1.5 font-heading font-bold text-white">
            {test.objective}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{test.result}</p>
        </div>
      </div>
    </button>
  );
}

function TestDetail({
  test,
  position,
  total,
}: {
  test: Test;
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
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chip>{test.type}</Chip>

            <time
              dateTime={test.date}
              className="text-xs font-semibold tracking-widest text-slate-500"
            >
              {formatDate(test.date)}
            </time>
          </div>

          <span className="shrink-0 text-xs font-semibold tracking-widest text-slate-500">
            {position} / {total}
          </span>
        </div>

        <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">
          {test.objective}
        </h3>

        <div className="mb-8 mt-5 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <DetailItem label="Location" value={test.location} />
            <DetailItem label="Duration" value={fmt(test.minutes)} />
          </div>

          <DetailItem label="Recorded result" value={test.result} highlight />
        </div>
      </motion.div>
    </GlowFrame>
  );
}

function DetailItem({
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
        className={`leading-relaxed ${highlight ? "text-white" : "text-slate-300"}`}
      >
        {value}
      </p>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// VALIDATION CARD
// ═════════════════════════════════════════════════════════════

function ValidationCard({
  status,
  title,
  text,
}: {
  status: ValidationStatus;
  title: string;
  text: string;
}) {
  const { icon: Icon, color, label } = VALIDATION_STATUS[status];

  return (
    <GlowFrame size="md" mode="hover" innerClassName="p-6">
      {/* Status is shown by icon and label, not colour alone. */}
      <div className="relative mb-5 flex items-center justify-between gap-3">
        <Eyebrow color={color}>{label}</Eyebrow>

        <Icon size={18} style={{ color }} aria-hidden="true" />
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