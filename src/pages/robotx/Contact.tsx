import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { TEAM } from "../../data/robotxData";

// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";

// ═════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════

const GLOW_BORDER =
  "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)";

const FRAME_RADIUS: Record<
  FrameSize,
  { outer: string; inner: string }
> = {
  lg: {
    outer: "rounded-3xl",
    inner: "rounded-[calc(1.5rem-1.5px)]",
  },
  md: {
    outer: "rounded-2xl",
    inner: "rounded-[calc(1rem-1.5px)]",
  },
};

const BORDER_MODE: Record<
  FrameMode,
  {
    rest: string;
    active: string;
    motion: string;
  }
> = {
  always: {
    rest: "opacity-50",
    active: "opacity-90",
    motion: "animate-[spin_8s_linear_infinite]",
  },
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
  reach: {
    eyebrow: "Get in touch",
    title: "Reach Us",
    text: "Email is the fastest way to get a reply from the team.",
  },
  links: {
    eyebrow: "Follow along",
    title: "Find Us Online",
    text: "Updates, build progress, and team news.",
  },
};

const AUDIENCES = [
  "Sponsors",
  "Organisers",
  "Mentors",
  "Fellow teams",
];

const BUTTON_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#00B4D8] px-5 py-2.5 text-sm font-bold text-[#0A0F1E] transition hover:bg-[#00F5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B2A]";

const BUTTON_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-[#0D1B2A] px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#00B4D8] hover:text-[#00B4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF]";

const telHref = (phone: string) =>
  `tel:${phone.replace(/[^\d+]/g, "")}`;

// ═════════════════════════════════════════════════════════════
// SHARED BUILDING BLOCKS
// ═════════════════════════════════════════════════════════════

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
  const inView = useInView(ref, {
    once: true,
    margin: "-80px",
  });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 40,
            }
      }
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
        style={{
          background: GLOW_BORDER,
        }}
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
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
          {text}
        </p>
      )}
    </Reveal>
  );
}

function RisingBubbles() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return null;
  }

  return (
    <>
      {BUBBLES.map((bubble, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-[#00B4D8]/30"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            bottom: "8%",
          }}
          animate={{
            y: [0, -280],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: bubble.delay,
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
      <Icon
        size={22}
        className="text-[#00B4D8]"
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function Contact() {
  const links = TEAM.links ?? [];

  return (
    <PageShell
      eyebrow="GET IN TOUCH"
      title="Contact"
      intro="Sponsors, organisers, mentors and fellow teams — we would love to hear from you."
    >
      <div className="flex flex-col gap-24">
        {/* Reach us */}
        <section aria-labelledby="reach-heading">
          <SectionHeader
            id="reach-heading"
            {...HEADERS.reach}
          />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal className="h-full">
              <ReachCard />
            </Reveal>

            <Reveal
              delay={0.15}
              className="h-full"
            >
              <TeamCard />
            </Reveal>
          </div>
        </section>

        {/* Online links */}
        {links.length > 0 && (
          <section aria-labelledby="links-heading">
            <SectionHeader
              id="links-heading"
              {...HEADERS.links}
            />

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((link, index) => (
                <li key={link.url}>
                  <Reveal
                    delay={(index % 3) * 0.1}
                    className="h-full"
                  >
                    <LinkCard
                      label={link.label}
                      url={link.url}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Audience note */}
        <section aria-labelledby="welcome-heading">
          <Reveal>
            <GlowFrame
              glow
              innerClassName="p-8 lg:p-12"
            >
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Open door</Eyebrow>

                <h2
                  id="welcome-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  We would love to hear from you.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  Whether you want to support the project, invite us to an
                  event, share advice, or compare notes on your own platform,
                  send us a message.
                </p>

                <ul
                  aria-label="Who we welcome messages from"
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {AUDIENCES.map((audience) => (
                    <li key={audience}>
                      <Chip>{audience}</Chip>
                    </li>
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
// REACH CARD
// ═════════════════════════════════════════════════════════════

function ReachCard() {
  const [copied, setCopied] = useState(false);

  // IMPORTANT:
  // useRef requires an initial value in the current React typings.
  // null is used until a timeout is created.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(TEAM.email);

      setCopied(true);

      if (timer.current !== null) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setCopied(false);
        timer.current = null;
      }, 2000);
    } catch {
      // Clipboard can be blocked; the address stays visible and selectable.
    }
  };

  return (
    <GlowFrame
      glow
      active
      innerClassName="p-7 lg:p-9"
    >
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          <IconTile icon={Mail} />
          <Eyebrow>Email</Eyebrow>
        </div>

        <a
          href={`mailto:${TEAM.email}`}
          className="break-all font-heading text-2xl font-bold text-white transition hover:text-[#00F5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] lg:text-3xl"
        >
          {TEAM.email}
        </a>

        <div className="mb-6 mt-5 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${TEAM.email}`}
            className={BUTTON_PRIMARY}
          >
            <Mail
              size={16}
              aria-hidden="true"
            />
            Send an email
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className={BUTTON_SECONDARY}
          >
            {copied ? (
              <Check
                size={16}
                aria-hidden="true"
              />
            ) : (
              <Copy
                size={16}
                aria-hidden="true"
              />
            )}

            {copied ? "Copied" : "Copy address"}
          </button>

          <span
            role="status"
            className="sr-only"
          >
            {copied
              ? "Email address copied to clipboard"
              : ""}
          </span>
        </div>

        {TEAM.phone && (
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
            <Phone
              size={16}
              aria-hidden="true"
              className="text-[#00B4D8]"
            />

            <a
              href={telHref(TEAM.phone)}
              className="text-slate-300 transition hover:text-[#00F5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF]"
            >
              {TEAM.phone}
            </a>
          </div>
        )}
      </div>
    </GlowFrame>
  );
}

// ═════════════════════════════════════════════════════════════
// TEAM CARD
// ═════════════════════════════════════════════════════════════

function TeamCard() {
  return (
    <GlowFrame innerClassName="p-7 lg:p-9">
      <div className="relative">
        <div className="mb-6">
          <Eyebrow>Team</Eyebrow>
        </div>

        <h3 className="font-heading text-2xl font-bold text-white">
          {TEAM.name}
        </h3>

        <div className="mb-6 mt-4 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start gap-3">
            <GraduationCap
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[#00B4D8]"
            />

            <span>{TEAM.institution}</span>
          </li>

          <li className="flex items-start gap-3">
            <MapPin
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[#00B4D8]"
            />

            <span>{TEAM.location}</span>
          </li>
        </ul>
      </div>
    </GlowFrame>
  );
}

// ═════════════════════════════════════════════════════════════
// LINK CARD
// ═════════════════════════════════════════════════════════════

function LinkCard({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E]"
    >
      <GlowFrame
        size="md"
        mode="hover"
        innerClassName="p-6"
      >
        <div className="relative flex items-center justify-between gap-4">
          <span className="font-heading text-lg font-bold text-white">
            {label}
          </span>

          <ExternalLink
            size={18}
            aria-hidden="true"
            className="shrink-0 text-[#00B4D8] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </GlowFrame>
    </a>
  );
}