// src/pages/robotx/Team.tsx

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  BriefcaseBusiness,
  Code2,
  Cpu,
  Plane,
  Radio,
  Settings2,
  ShieldCheck,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { ADVISOR, MEMBERS, TEAM, type Member } from "../../data/robotxData";
import groupPhoto from "../../assets/robotx/groupphoto.jpeg";


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
  md: { box: "h-16 w-16", text: "text-lg" },
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
    eyebrow: "Student team",
    title: "The people behind the system.",
    text: "AQUAHOLICS combines hardware, software, UAV, USV, communication, CAD and management capabilities into one integrated team.",
  },
  advisor: {
    eyebrow: "Faculty guidance",
    title: "Faculty Mentor",
    text: "Academic guidance supporting the team's RobotX 2026 development.",
  },
};

const VEHICLE_DOMAINS = ["USV", "UAV"];

const STORY_SYSTEMS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Waves, title: "USV", text: "DRAKEN Mark 1" },
  { icon: Plane, title: "UAV", text: "REVELATION" },
  { icon: Cpu, title: "Autonomy", text: "Perception · Navigation · Control" },
  { icon: Radio, title: "Communication", text: "RF Telemetry · MAVLink" },
];

/** Pick an icon from keywords in a member's role; falls back to a chip icon. */
const ROLE_ICONS: [keyword: string, icon: LucideIcon][] = [
  ["software", Code2],
  ["uav", Plane],
  ["usv", Waves],
  ["communication", Radio],
  ["management", BriefcaseBusiness],
  ["faculty", ShieldCheck],
  ["cad", Settings2],
];

const roleIcon = (role: string): LucideIcon => {
  const normalized = role.toLowerCase();
  return ROLE_ICONS.find(([keyword]) => normalized.includes(keyword))?.[1] ?? Cpu;
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
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

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
      {children}
    </span>
  );
}

/** Rounded icon tile with the cyan glow used on status cards. */
function IconTile({ icon: Icon, small = false }: { icon: LucideIcon; small?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1 ${
        small ? "h-10 w-10" : "h-12 w-12"
      }`}
      style={{
        background: "#00B4D815",
        border: "1px solid #00B4D830",
        boxShadow: "0 0 24px #00B4D820",
      }}
    >
      <Icon size={small ? 18 : 22} className="text-[#00B4D8]" />
    </div>
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
  const stats = [
    { icon: Users, value: MEMBERS.length, label: "Student members" },
    { icon: Waves, value: VEHICLE_DOMAINS.length, label: "Vehicle domains" },
    ...(ADVISOR ? [{ icon: ShieldCheck, value: 1, label: "Faculty mentor" }] : []),
  ];

  return (
    <PageShell
      eyebrow="ROBOTX 2026 · TEAM"
      title={`Meet ${TEAM.name}`}
      intro={`A multidisciplinary student team from ${TEAM.institution}, ${TEAM.location}, developing autonomous marine robotic systems for the Maritime RobotX Challenge 2026.`}
    >
      <div className="flex flex-col gap-24">
        {/* Group photo */}
        <section aria-labelledby="photo-heading">
          <Reveal>
            <GroupPhoto />
          </Reveal>
        </section>

        {/* Stats */}
        <section aria-label="Team at a glance">
          <ul className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <li key={stat.label}>
                <Reveal delay={index * 0.15} className="h-full">
                  <StatCard {...stat} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Members */}
        <section aria-labelledby="members-heading">
          <SectionHeader id="members-heading" {...HEADERS.members} />

          {MEMBERS.length === 0 ? (
            <EmptyState icon={Users} text="Team members coming soon." />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            <TeamStory />
          </Reveal>
        </section>
      </div>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// GROUP PHOTO
// ═════════════════════════════════════════════════════════════

function GroupPhoto() {
  return (
    <GlowFrame innerClassName="bg-[#0A0F1E]">
      <div className="relative min-h-[360px] md:aspect-[21/9] md:min-h-0">
        <img
          src={groupPhoto}
          alt="The AQUAHOLICS RobotX 2026 team together"
          loading="lazy"
          className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <Chip>
            <Users size={14} aria-hidden="true" />
            AQUAHOLICS
          </Chip>

          <h2
            id="photo-heading"
            className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl"
          >
            Building autonomy together.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            A multidisciplinary student team working across hardware, software,
            UAV, USV, communication, CAD and management.
          </p>
        </div>
      </div>
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// STAT CARD
// ═════════════════════════════════════════════════════════════

function StatCard({
  icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
}) {
  return (
    <GlowFrame size="md" mode="hover" innerClassName="p-6">
      <div className="relative flex items-center gap-4">
        <IconTile icon={icon} />

        <div>
          <p className="font-heading text-3xl font-extrabold text-white">
            {pad(value)}
          </p>

          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </GlowFrame>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");


// ═════════════════════════════════════════════════════════════
// AVATAR
// ═════════════════════════════════════════════════════════════

function Avatar({ member, size = "md" }: { member: Member; size?: AvatarSize }) {
  const { box, text } = AVATAR_SIZE[size];

  return (
    // Gradient ring that brightens when the card is hovered.
    <div className="relative shrink-0 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#00F5FF]/30 p-[2px] opacity-90 transition-opacity duration-300 group-hover:opacity-100">
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
  const Icon = roleIcon(member.role);

  return (
    <GlowFrame size="md" mode="hover" innerClassName="p-6">
      <div className="relative flex items-start gap-4">
        <Avatar member={member} />

        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold text-white">
            {member.name}
          </h3>

          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/[0.08] px-2.5 py-1 text-xs font-semibold text-[#00B4D8]">
            <Icon size={14} aria-hidden="true" />
            {member.role}
          </p>
        </div>
      </div>

      {member.bio && (
        <p className="relative mt-5 text-sm leading-relaxed text-slate-400">
          {member.bio}
        </p>
      )}
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
          <Chip>
            <ShieldCheck size={14} aria-hidden="true" />
            Faculty mentor
          </Chip>

          <h3 className="mt-4 font-heading text-2xl font-bold text-white lg:text-3xl">
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


// ═════════════════════════════════════════════════════════════
// TEAM STORY
// ═════════════════════════════════════════════════════════════

function TeamStory() {
  return (
    <GlowFrame glow innerClassName="p-8 lg:p-12">
      <RisingBubbles />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <Eyebrow>Our approach</Eyebrow>

          <h2
            id="story-heading"
            className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
          >
            One team, one system.
          </h2>

          <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

          <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
            AQUAHOLICS brings together students working across multiple
            engineering disciplines to develop an integrated autonomous
            maritime System of Systems for RobotX 2026.
          </p>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
            The team combines surface and aerial platforms with perception,
            navigation, communication and safety systems while maintaining
            independent vehicle-level control and fallback mechanisms.
          </p>
        </div>

        <ul className="grid gap-3">
          {STORY_SYSTEMS.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0A0F1E]/60 p-4"
            >
              <IconTile icon={item.icon} small />

              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </GlowFrame>
  );
}