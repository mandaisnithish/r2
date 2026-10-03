import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CloudLightning,
  MapPin,
  Network,
  Radar,
  ShieldCheck,
  Target,
  Trophy,
  Waves,
  Wrench,
} from "lucide-react";

import { EVENT, TEAM, VEHICLES } from "../../data/robotxData";

/* =========================================================
   TYPES
========================================================= */

interface GlowCardProps {
  children: ReactNode;
  color?: string;
  delay?: number;
  innerBg?: string;
  radius?: string;
  className?: string;
  innerClass?: string;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}

interface Star {
  size: string;
  top: string;
  left: string;
  opacity: number;
  duration: number;
  delay: number;
}

/* =========================================================
   GLOW CARD
========================================================= */

function GlowCard({
  children,
  color = "#00B4D8",
  delay = 0,
  innerBg = "#0D1B2A",
  radius = "rounded-2xl",
  className = "",
  innerClass = "",
}: GlowCardProps) {
  return (
    <div
      className={`relative overflow-hidden p-[1.5px] ${radius} group ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50 motion-reduce:animate-none"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            ${color} 15%,
            transparent 30%,
            transparent 70%,
            #00F5FF 85%,
            transparent 100%
          )`,
          animationDelay: `${delay}s`,
        }}
      />

      <div
        className={`relative h-full overflow-hidden ${radius} ${innerClass}`}
        style={{ background: innerBg }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(
              circle at 50% 0%,
              ${color}14,
              transparent 70%
            )`,
          }}
        />

        <div className="relative h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REVEAL
========================================================= */

function Reveal({
  children,
  delay = 0,
  y = 30,
  x = 0,
  className = "",
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   HERO
========================================================= */

function RobotXHero() {
  const reduce = useReducedMotion();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      [...Array(35)].map(() => ({
        size: Math.random() > 0.7 ? "2px" : "1px",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const title = `${TEAM.name} at RobotX 2026`;
  const words = title.split(" ");

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0A0F1E]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#00B4D8]/8 blur-[120px]" />

        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-[#0077B6]/10 blur-[100px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: s.left,
              opacity: s.opacity,
            }}
            animate={
              reduce
                ? undefined
                : {
                    opacity: [s.opacity, 0.6, s.opacity],
                  }
            }
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
            }}
          />
        ))}
      </div>

      {!reduce && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {[
            { left: "8%", size: 4, delay: 0, dur: 7 },
            { left: "16%", size: 6, delay: 1.6, dur: 8 },
            { left: "90%", size: 5, delay: 0.8, dur: 7.5 },
            { left: "82%", size: 3, delay: 2.4, dur: 6.5 },
          ].map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#00B4D8]/30"
              style={{
                left: b.left,
                width: b.size,
                height: b.size,
                bottom: "8%",
              }}
              animate={{
                y: [0, -420],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: b.dur,
                repeat: Infinity,
                delay: b.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 14,
            delay: 0.1,
          }}
          className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,245,255,0.05))",
            border: "1px solid rgba(0,180,216,0.4)",
          }}
        >
          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.4, 0.8, 0.4],
                  }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "0 0 28px rgba(0,180,216,0.5)",
            }}
          />

          <Waves
            size={24}
            className="relative z-10 text-cyan-300"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 block w-fit rounded-full border border-[#00B4D8]/25 bg-[#00B4D8]/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#00B4D8]"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4D8]" />
            {EVENT.name}
          </span>
        </motion.span>

        <h1
          aria-label={title}
          className="mb-6 font-heading text-4xl font-black leading-tight sm:text-5xl md:text-7xl"
        >
          {words.map((word, wi) => {
            const secondHalf =
              wi >= Math.ceil(words.length / 2);

            return (
              <span
                key={wi}
                aria-hidden="true"
                className="mr-[0.3em] inline-block"
              >
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    className={`inline-block ${
                      secondHalf
                        ? "text-[#00B4D8]"
                        : "text-white"
                    }`}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        0.2 +
                        (wi * 6 + ci) * 0.025,
                      ease: "easeOut",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Aquaholics is representing {TEAM.institution} at the{" "}
          {EVENT.name}. We are developing a coordinated System of
          Systems for multi-domain autonomous maritime operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.7,
          }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    boxShadow: [
                      "0 0 0px rgba(0,180,216,0.4)",
                      "0 0 28px rgba(0,180,216,0.55)",
                      "0 0 0px rgba(0,180,216,0.4)",
                    ],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              borderRadius: "0.75rem",
            }}
          >
            <Link
              to="/robotx/system-vehicles"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#00B4D8] px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#0A0F1E] transition-all duration-300 hover:scale-[1.02] hover:bg-[#00F5FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore the System

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <Link
            to="/robotx/team"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00B4D8]/40 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#00F5FF] transition-all duration-300 hover:bg-[#00B4D8]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
          >
            Meet the Team
          </Link>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z"
            fill="#0D1B2A"
          />
        </svg>
      </div>
    </section>
  );
}

/* =========================================================
   EVENT INFORMATION
========================================================= */

function EventInfo() {
  const items = [
    {
      icon: Trophy,
      label: "Event",
      value: EVENT.name,
      color: "#00B4D8",
    },
    {
      icon: CalendarDays,
      label: "When",
      value: EVENT.dates,
      color: "#00F5FF",
    },
    {
      icon: MapPin,
      label: "Where",
      value: EVENT.venue,
      color: "#00B4D8",
    },
  ];

  return (
    <section className="bg-[#0D1B2A] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
        {items.map(
          ({ icon: Icon, label, value, color }, i) => (
            <Reveal
              key={label}
              delay={i * 0.12}
            >
              <GlowCard
                color={color}
                delay={i * 0.5}
                innerBg="#0A0F1E"
                innerClass="p-6"
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    boxShadow: `0 0 20px ${color}20`,
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color }}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color }}
                >
                  {label}
                </p>

                <p className="mt-2 font-heading text-lg font-bold leading-snug text-white sm:text-xl">
                  {value}
                </p>
              </GlowCard>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   COMPETITION INTRO
========================================================= */

function CompetitionIntro() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0A0F1E] px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/5 blur-[100px]"
      />

      {!reduce && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {[
            { left: "8%", size: 4, delay: 0, dur: 6 },
            { left: "14%", size: 6, delay: 1.4, dur: 7.5 },
            { left: "92%", size: 5, delay: 0.6, dur: 6.8 },
            { left: "86%", size: 4, delay: 2, dur: 7 },
          ].map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#00B4D8]/30"
              style={{
                left: b.left,
                width: b.size,
                height: b.size,
                bottom: "5%",
              }}
              animate={{
                y: [0, -380],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: b.dur,
                repeat: Infinity,
                delay: b.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal y={20}>
          <div className="relative mx-auto mb-8 h-16 w-16">
            <motion.div
              animate={
                reduce
                  ? undefined
                  : {
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.15, 1],
                    }
              }
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: "0 0 30px rgba(0,180,216,0.5)",
              }}
            />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00B4D8]/25 bg-[#00B4D8]/10">
              <CloudLightning
                size={28}
                className="text-[#00B4D8]"
                aria-hidden="true"
              />
            </div>
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
            Competition Overview
          </span>

          <h2 className="mt-4 mb-6 font-heading text-3xl font-bold text-white md:text-5xl">
            {EVENT.theme}
          </h2>

          <div
            aria-hidden="true"
            className="mx-auto mb-8 h-[2px] w-16 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00B4D8, transparent)",
            }}
          />

          <div className="mx-auto max-w-2xl space-y-4">
            <p className="text-lg leading-relaxed text-slate-400">
              RobotX 2026 is centered on a storm-response scenario
              in which autonomous systems work together across
              multiple domains to support maritime recovery and
              resilience.
            </p>

            <p className="text-lg leading-relaxed text-slate-400">
              Teams are required to demonstrate coordinated
              operation between uncrewed systems, combining
              information, capabilities and decision-making across
              the mission.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   ICON BOX
========================================================= */

function IconBox({
  icon: Icon,
  color,
  delay,
}: {
  icon: typeof Target;
  color: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={
        reduce
          ? undefined
          : {
              scale: [1, 1.06, 1],
            }
      }
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 24px ${color}20`,
      }}
    >
      <Icon
        size={24}
        style={{ color }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

/* =========================================================
   MISSION & SYSTEM
========================================================= */

function MissionSystem() {
  return (
    <section className="relative overflow-hidden bg-[#0D1B2A] px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#00B4D8]/6 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal
          y={20}
          className="mb-14 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
            The Challenge
          </span>

          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-5xl">
            Mission & System
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal y={40}>
            <GlowCard
              color="#00B4D8"
              innerBg="#0A0F1E"
              innerClass="p-8"
            >
              <IconBox
                icon={Target}
                color="#00B4D8"
                delay={0}
              />

              <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#00B4D8]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4D8]" />
                The Mission
              </span>

              <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                From Assessment to Recovery
              </h3>

              <p className="leading-relaxed text-slate-400">
                A major storm has impacted a coastal port
                facility. Autonomous vehicles are deployed to
                assess the affected area, gather information,
                support recovery operations and respond to
                changing conditions as part of one continuous
                mission.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  "Assess",
                  "Coordinate",
                  "Respond",
                ].map((phase, index) => (
                  <div
                    key={phase}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center"
                  >
                    <span className="font-mono text-xs text-[#00B4D8]">
                      0{index + 1}
                    </span>

                    <p className="mt-2 text-sm font-semibold text-white">
                      {phase}
                    </p>
                  </div>
                ))}
              </div>
            </GlowCard>
          </Reveal>

          <Reveal y={40} delay={0.15}>
            <GlowCard
              color="#00F5FF"
              delay={0.5}
              innerBg="#0A0F1E"
              innerClass="p-8"
            >
              <IconBox
                icon={Network}
                color="#00F5FF"
                delay={0.3}
              />

              <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#00F5FF]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00F5FF]" />
                System of Systems
              </span>

              <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                Coordinated Autonomous Vehicles
              </h3>

              <p className="mb-6 leading-relaxed text-slate-400">
                Our RobotX system brings together uncrewed
                vehicles across multiple domains to support
                coordinated mission execution.
              </p>

              <div className="space-y-3">
                {VEHICLES.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-block rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-3 py-1 text-xs font-semibold text-[#00F5FF]">
                        {v.domain}
                      </span>

                      <div>
                        <p className="font-semibold text-white">
                          {v.name}
                        </p>

                        {/* Intentionally use only fields confirmed
                            by the current vehicle data shape. */}
                        <p className="mt-1 text-sm text-slate-400">
                          {v.domain === "USV"
                            ? "Uncrewed Surface Vehicle"
                            : v.domain === "UAV"
                              ? "Uncrewed Aerial Vehicle"
                              : "Uncrewed Vehicle"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/robotx/system-vehicles"
                className="group/link mt-6 inline-flex items-center gap-2 font-semibold text-[#00B4D8] hover:text-[#00F5FF]"
              >
                Explore the System of Systems

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                />
              </Link>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MISSION FOCUS
========================================================= */

const FOCUS = [
  {
    icon: Radar,
    title: "Assessment & Discovery",
    text: "Gather information about the environment and identify hazards relevant to recovery operations.",
  },
  {
    icon: Wrench,
    title: "Recovery & Repair",
    text: "Support recovery activities through coordinated autonomous operations.",
  },
  {
    icon: ShieldCheck,
    title: "Environmental & Public Safety",
    text: "Provide surveying and data collection to support response coordination and situational awareness.",
  },
];

function MissionFocus() {
  return (
    <section className="relative overflow-hidden bg-[#0A0F1E] px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal
          y={20}
          className="mb-14 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
            Mission Focus
          </span>

          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-5xl">
            Multi-Domain Collaboration
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {FOCUS.map(
            ({ icon: Icon, title, text }, i) => (
              <Reveal
                key={title}
                delay={i * 0.12}
                y={40}
              >
                <GlowCard
                  delay={i * 0.5}
                  innerClass="p-7"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1"
                      style={{
                        background: "#00B4D815",
                        border: "1px solid #00B4D830",
                        boxShadow: "0 0 24px #00B4D820",
                      }}
                    >
                      <Icon
                        size={22}
                        className="text-[#00B4D8]"
                        aria-hidden="true"
                      />
                    </div>

                    <span className="font-heading text-3xl font-black text-[#00B4D8]/25">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mb-2 font-heading text-xl font-bold text-white">
                    {title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-400">
                    {text}
                  </p>
                </GlowCard>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CTA
========================================================= */

function RobotXCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#0D1B2A] px-6 py-24">
      <Reveal className="mx-auto max-w-3xl">
        <GlowCard
          radius="rounded-3xl"
          innerBg="#0A0F1E"
          innerClass="px-8 py-16 text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/10 blur-[80px]" />
          </div>

          {!reduce &&
            [
              { left: "15%", delay: 0, size: 3 },
              { left: "30%", delay: 1.2, size: 4 },
              { left: "70%", delay: 0.6, size: 3 },
              { left: "85%", delay: 2, size: 4 },
            ].map((p, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full bg-[#00B4D8]/30"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  bottom: "8%",
                }}
                animate={{
                  y: [0, -280],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeIn",
                }}
              />
            ))}

          <h2 className="relative z-10 mb-4 font-heading text-3xl font-bold text-white md:text-5xl">
            See the System in Action
          </h2>

          <p className="relative z-10 mb-8 text-slate-400">
            Dive into our vehicles, test results and build log
            to see how Aquaholics is preparing for RobotX 2026.
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/robotx/testing"
              className="group/btn inline-flex items-center gap-2 rounded-xl bg-[#00B4D8] px-8 py-4 text-base font-bold text-[#0A0F1E] transition-all duration-300 hover:scale-[1.02] hover:bg-[#00F5FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              View Testing

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </Link>

            <Link
              to="/robotx/design"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00B4D8]/40 px-8 py-4 text-base font-bold text-[#00F5FF] transition-all duration-300 hover:bg-[#00B4D8]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
            >
              Read the Build Log
            </Link>
          </div>
        </GlowCard>
      </Reveal>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Overview() {
  return (
    <>
      <RobotXHero />
      <EventInfo />
      <CompetitionIntro />
      <MissionSystem />
      <MissionFocus />
      <RobotXCTA />
    </>
  );
}