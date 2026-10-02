import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Users, type LucideIcon } from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { ADVISOR, MEMBERS, TEAM, type Member } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";
type AvatarSize = "md" | "lg";


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

const AVATAR_SIZE: Record<AvatarSize, { box: string; text: string }> = {
  md: { box: "h-20 w-20", text: "text-xl" },
  lg: { box: "h-28 w-28", text: "text-3xl" },
};

const BUBBLES = [
  { left: "15%", size: 3, delay: 0 },
  { left: "30%", size: 4, delay: 1.2 },
  { left: "70%", size: 3, delay: 0.6 },
  { left: "85%", size: 4, delay: 2 },
];

const HEADERS = {
  members: {
    eyebrow: "Engineers",
    title: "Team Members",
    text: "The students who designed, built, and tested the platform.",
  },
  advisor: {
    eyebrow: "Guidance",
    title: "Faculty Advisor",
  },
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


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

export default function Team() {
  return (
    <PageShell
      eyebrow="WHO WE ARE"
      title={`Team ${TEAM.name}`}
      intro={`Student engineers from the ${TEAM.institution}, ${TEAM.location}.`}
    >
      <div className="flex flex-col gap-24">
        {/* Members */}
        <section aria-labelledby="members-heading">
          <SectionHeader id="members-heading" {...HEADERS.members} />

          {MEMBERS.length === 0 ? (
            <EmptyState icon={Users} text="Team members coming soon." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MEMBERS.map((member, index) => (
                <li key={`${member.name}-${index}`}>
                  <Reveal delay={(index % 3) * 0.1} className="h-full">
                    <MemberCard member={member} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Advisor */}
        {ADVISOR && (
          <section aria-labelledby="advisor-heading">
            <SectionHeader id="advisor-heading" {...HEADERS.advisor} />

            <Reveal>
              <AdvisorCard member={ADVISOR} />
            </Reveal>
          </section>
        )}

        {/* Team story */}
        <section aria-labelledby="story-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Student-built</Eyebrow>

                <h2
                  id="story-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  One team, one system.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  Every vehicle, circuit, and line of code on this site was
                  produced by students at the {TEAM.institution} working
                  together across disciplines.
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
// AVATAR
// ═════════════════════════════════════════════════════════════

function Avatar({ member, size = "md" }: { member: Member; size?: AvatarSize }) {
  const { box, text } = AVATAR_SIZE[size];

  return (
    // Gradient ring that brightens when the card is hovered.
    <div
      className={`relative shrink-0 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#00F5FF]/30 p-[2px] opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
    >
      {member.photo ? (
        <img
          src={member.photo}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          className={`${box} select-none rounded-full border-2 border-[#0D1B2A] object-cover`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${box} ${text} flex items-center justify-center rounded-full border-2 border-[#0D1B2A] bg-gradient-to-br from-[#00B4D8] to-[#0077B6] font-heading font-bold text-white`}
        >
          {initialsOf(member.name)}
        </div>
      )}
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// MEMBER CARD
// ═════════════════════════════════════════════════════════════

function MemberCard({ member }: { member: Member }) {
  return (
    <GlowFrame size="md" mode="hover" innerClassName="p-6">
      <div className="relative flex flex-col gap-5">
        <Avatar member={member} />

        <div>
          <h3 className="font-heading text-xl font-bold text-white">
            {member.name}
          </h3>

          <p className="mt-1 text-sm font-semibold text-[#00B4D8]">
            {member.role}
          </p>

          {member.bio && (
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {member.bio}
            </p>
          )}
        </div>
      </div>
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// ADVISOR CARD
// ═════════════════════════════════════════════════════════════

function AdvisorCard({ member }: { member: Member }) {
  return (
    <GlowFrame glow innerClassName="p-7 lg:p-9">
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar member={member} size="lg" />

        <div className="max-w-2xl">
          <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">
            {member.name}
          </h3>

          <div className="mb-4 mt-4 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

          <p className="font-semibold text-[#00B4D8]">{member.role}</p>

          {member.bio && (
            <p className="mt-3 leading-relaxed text-slate-400">{member.bio}</p>
          )}
        </div>
      </div>
    </GlowFrame>
  );
}