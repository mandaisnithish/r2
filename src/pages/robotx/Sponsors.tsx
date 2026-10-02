import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ExternalLink, Handshake, type LucideIcon } from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { SPONSORS } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type Sponsor = (typeof SPONSORS)[number];

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";

type SponsorGroup = { tier: string; sponsors: Sponsor[] };


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
  // Lightweight variant for large grids: the border only appears and spins on hover.
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
  sponsors: {
    eyebrow: "Our partners",
    title: "Backed by",
    text: "Every organisation below helped us design, build, and test our platforms. Select a sponsor to visit their website.",
  },
};

// The first tier is shown larger; every later tier uses the compact grid.
const GRID_BY_RANK = {
  top: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  rest: "grid-cols-2 lg:grid-cols-4",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Group sponsors by tier, keeping the order tiers first appear in the data. */
function groupByTier(sponsors: readonly Sponsor[]): SponsorGroup[] {
  const groups = new Map<string, Sponsor[]>();

  for (const sponsor of sponsors) {
    const tier = sponsor.tier?.trim() ?? "";
    groups.set(tier, [...(groups.get(tier) ?? []), sponsor]);
  }

  return Array.from(groups, ([tier, items]) => ({ tier, sponsors: items }));
}

const SPONSOR_GROUPS = groupByTier(SPONSORS);


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
  text: string;
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

export default function Sponsors() {
  const hasTiers = SPONSOR_GROUPS.some((group) => group.tier);

  return (
    <PageShell
      eyebrow="THANK YOU"
      title="Sponsors"
      intro="Our work is possible because of the organisations that back us."
    >
      <div className="flex flex-col gap-24">
        {/* Sponsors */}
        <section aria-labelledby="sponsors-heading">
          <SectionHeader id="sponsors-heading" {...HEADERS.sponsors} />

          {SPONSORS.length === 0 ? (
            <EmptyState icon={Handshake} text="Sponsor list coming soon." />
          ) : (
            <div className="flex flex-col gap-14">
              {SPONSOR_GROUPS.map((group, groupIndex) => (
                <SponsorTier
                  key={group.tier || "all"}
                  group={group}
                  headingId={`tier-${groupIndex}-heading`}
                  showHeading={hasTiers}
                  prominent={groupIndex === 0 && SPONSOR_GROUPS.length > 1}
                />
              ))}
            </div>
          )}
        </section>

        {/* Thank-you note */}
        <section aria-labelledby="thanks-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>With gratitude</Eyebrow>

                <h2
                  id="thanks-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  Built together.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  Funding, equipment, workshop space, and advice from our
                  sponsors turn early ideas into vehicles that can compete.
                  Thank you for backing the team behind AQUAHOLICS RobotX 2026.
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
// SPONSOR TIER
// ═════════════════════════════════════════════════════════════

function SponsorTier({
  group,
  headingId,
  showHeading,
  prominent,
}: {
  group: SponsorGroup;
  headingId: string;
  showHeading: boolean;
  prominent: boolean;
}) {
  const grid = prominent ? GRID_BY_RANK.top : GRID_BY_RANK.rest;
  const label = group.tier || "Supporters";

  return (
    <div role="group" aria-labelledby={showHeading ? headingId : undefined}>
      {showHeading && (
        <Reveal className="mb-6 flex items-center gap-4">
          <h3
            id={headingId}
            className="font-heading text-xl font-bold text-white md:text-2xl"
          >
            {label}
          </h3>

          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />

          <span className="text-xs font-semibold tracking-widest text-slate-500">
            {pad(group.sponsors.length)}
          </span>
        </Reveal>
      )}

      <ul className={`grid auto-rows-fr gap-4 md:gap-5 ${grid}`}>
        {group.sponsors.map((sponsor, index) => (
          <li key={sponsor.name}>
            <Reveal delay={(index % 4) * 0.1} className="h-full">
              <SponsorCard sponsor={sponsor} prominent={prominent} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// SPONSOR CARD
// ═════════════════════════════════════════════════════════════

function SponsorCard({
  sponsor,
  prominent,
}: {
  sponsor: Sponsor;
  prominent: boolean;
}) {
  const card = (
    <GlowFrame
      size="md"
      mode="hover"
      innerClassName={`flex flex-col items-center justify-center gap-4 text-center ${
        prominent ? "p-7" : "p-5"
      }`}
    >
      {sponsor.logo ? (
        <>
          {/* Light plate so dark or transparent logos stay readable on the navy card. */}
          <div
            className={`relative flex w-full items-center justify-center rounded-xl bg-white/95 px-5 ${
              prominent ? "h-28" : "h-20"
            }`}
          >
            <img
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              loading="lazy"
              className="max-h-[70%] w-auto max-w-full select-none object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <span className="relative text-sm font-medium text-slate-300">
            {sponsor.name}
          </span>
        </>
      ) : (
        <span
          className={`relative font-heading font-bold text-white ${
            prominent ? "text-2xl" : "text-xl"
          }`}
        >
          {sponsor.name}
        </span>
      )}

      {sponsor.url && (
        <span
          aria-hidden="true"
          className="relative inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
        >
          Visit website <ExternalLink size={12} />
        </span>
      )}
    </GlowFrame>
  );

  if (!sponsor.url) return card;

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (opens in a new tab)`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
    >
      {card}
    </a>
  );
}