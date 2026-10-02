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
import { EVENT, STRATEGY, TEAM, VEHICLES } from "../../data/robotxData";

interface GlowCardProps {
  children: ReactNode;
  color?: string;
  delay?: number;
  innerBg?: string;
  radius?: string;
  className?: string;
  innerClass?: string;
}

// Card with the site's rotating conic-gradient glow border + hover radial glow.
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
    <div className={`relative p-[1.5px] ${radius} overflow-hidden group ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] motion-reduce:animate-none opacity-50"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${color} 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)`,
          animationDelay: `${delay}s`,
        }}
      />
      <div className={`relative ${radius} h-full overflow-hidden ${innerClass}`} style={{ background: innerBg }}>
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}14, transparent 70%)` }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}

// Fades + slides content in once when it scrolls into view.
function Reveal({ children, delay = 0, y = 30, x = 0, className = "" }: RevealProps) {
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

interface Star {
  size: string;
  top: string;
  left: string;
  opacity: number;
  duration: number;
  delay: number;
}

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
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00B4D8]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-[#0077B6]/10 blur-[100px]" />
      </div>

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity }}
            animate={reduce ? undefined : { opacity: [s.opacity, 0.6, s.opacity] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>

      {/* Rising bubbles — the same water motif used across the site */}
      {!reduce && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[
            { left: "8%", size: 4, delay: 0, dur: 7 },
            { left: "16%", size: 6, delay: 1.6, dur: 8 },
            { left: "90%", size: 5, delay: 0.8, dur: 7.5 },
            { left: "82%", size: 3, delay: 2.4, dur: 6.5 },
          ].map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#00B4D8]/30"
              style={{ left: b.left, width: b.size, height: b.size, bottom: "8%" }}
              animate={{ y: [0, -420], opacity: [0, 0.7, 0] }}
              transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: "easeIn" }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center px-6 py-20 max-w-4xl mx-auto">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 relative"
          style={{
            background: "linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,245,255,0.05))",
            border: "1px solid rgba(0,180,216,0.4)",
          }}
        >
          <motion.div
            animate={reduce ? undefined : { opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 28px rgba(0,180,216,0.5)" }}
          />
          <Waves size={24} className="text-cyan-300 relative z-10" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="block w-fit mx-auto text-[10px] font-black tracking-[0.25em] text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/25 rounded-full px-5 py-2 mb-8"
        >
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
            {EVENT.name}
          </span>
        </motion.span>

        <h1 aria-label={title} className="font-heading font-black text-4xl sm:text-5xl md:text-7xl leading-tight mb-6">
          {words.map((word, wi) => {
            const secondHalf = wi >= Math.ceil(words.length / 2);
            return (
              <span key={wi} aria-hidden="true" className="inline-block mr-[0.3em]">
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    className={`inline-block ${secondHalf ? "text-[#00B4D8]" : "text-white"}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + (wi * 6 + ci) * 0.025, ease: "easeOut" }}
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Aquaholics is representing {TEAM.institution} at the {EVENT.name}. We are developing a coordinated System of
          Systems for multi-domain autonomous maritime operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
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
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ borderRadius: "0.75rem" }}
          >
            <Link
              to="/robotx/system-vehicles"
              className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold text-xs tracking-[0.12em] uppercase px-7 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore the System
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <Link
            to="/robotx/team"
            className="inline-flex items-center gap-2 border border-[#00B4D8]/40 text-[#00F5FF] hover:bg-[#00B4D8]/10 font-bold text-xs tracking-[0.12em] uppercase px-7 py-4 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
          >
            Meet the Team
          </Link>
        </motion.div>
      </div>

      {/* Wave divider into the next section */}
      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#0D1B2A" />
        </svg>
      </div>
    </section>
  );
}

function EventInfo() {
  const items = [
    { icon: Trophy, label: "Event", value: EVENT.name, color: "#00B4D8" },
    { icon: CalendarDays, label: "When", value: EVENT.dates, color: "#00F5FF" },
    { icon: MapPin, label: "Where", value: EVENT.venue, color: "#00B4D8" },
  ];

  return (
    <section className="bg-[#0D1B2A] py-16 px-6">
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, color }, i) => (
          <Reveal key={label} delay={i * 0.12}>
            <GlowCard color={color} delay={i * 0.5} innerBg="#0A0F1E" innerClass="p-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 20px ${color}20` }}
              >
                <Icon size={20} style={{ color }} aria-hidden="true" />
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color }}>
                {label}
              </p>
              <p className="mt-2 font-heading text-lg sm:text-xl font-bold text-white leading-snug">{value}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CompetitionIntro() {
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/5 blur-[100px] pointer-events-none"
      />

      {/* Drifting bubbles either side of the centred content */}
      {!reduce && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[
            { left: "8%", size: 4, delay: 0, dur: 6 },
            { left: "14%", size: 6, delay: 1.4, dur: 7.5 },
            { left: "92%", size: 5, delay: 0.6, dur: 6.8 },
            { left: "86%", size: 4, delay: 2, dur: 7 },
          ].map((b, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#00B4D8]/30"
              style={{ left: b.left, width: b.size, height: b.size, bottom: "5%" }}
              animate={{ y: [0, -380], opacity: [0, 0.7, 0] }}
              transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: "easeIn" }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Reveal y={20}>
          <div className="relative w-16 h-16 mx-auto mb-8">
            <motion.div
              animate={reduce ? undefined : { opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "0 0 30px rgba(0,180,216,0.5)" }}
            />
            <div className="relative w-16 h-16 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/25 flex items-center justify-center">
              <CloudLightning size={28} className="text-[#00B4D8]" aria-hidden="true" />
            </div>
          </div>

          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">Competition Overview</span>

          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-6">{EVENT.theme}</h2>

          <div
            aria-hidden="true"
            className="w-16 h-[2px] mx-auto mb-8 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #00B4D8, transparent)" }}
          />

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-slate-400 text-lg leading-relaxed">
              RobotX 2026 is centered on a storm-response scenario in which autonomous systems work together across
              multiple domains to support maritime recovery and resilience.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Teams are required to demonstrate coordinated operation between uncrewed systems, combining information,
              capabilities and decision-making across the mission.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IconBox({ icon: Icon, color, delay }: { icon: typeof Target; color: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1"
      style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 24px ${color}20` }}
    >
      <Icon size={24} style={{ color }} aria-hidden="true" />
    </motion.div>
  );
}

function MissionSystem() {
  return (
    <section className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        <Reveal y={20} className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">The Challenge</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">Mission & System</h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mission */}
          <Reveal y={40}>
            <GlowCard color="#00B4D8" innerBg="#0A0F1E" innerClass="p-8">
              <IconBox icon={Target} color="#00B4D8" delay={0} />
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-[#00B4D8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
                The Mission
              </span>
              <h3 className="font-heading font-bold text-2xl text-white mb-4">From Assessment to Recovery</h3>
              <p className="text-slate-400 leading-relaxed">
                A major storm has impacted a coastal port facility. Autonomous vehicles are deployed to assess the
                affected area, gather information, support recovery operations and respond to changing conditions as
                part of one continuous mission.
              </p>
              <ul className="mt-6 space-y-3">
                {STRATEGY.map((t) => (
                  <li key={t.id} className="flex gap-3 text-slate-300">
                    <span aria-hidden="true" className="text-[#00B4D8] mt-0.5">▸</span>
                    <span>{t.title}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </Reveal>

          {/* System of Systems */}
          <Reveal y={40} delay={0.15}>
            <GlowCard color="#00F5FF" delay={0.5} innerBg="#0A0F1E" innerClass="p-8">
              <IconBox icon={Network} color="#00F5FF" delay={0.3} />
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-[#00F5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
                System of Systems
              </span>
              <h3 className="font-heading font-bold text-2xl text-white mb-4">Coordinated Autonomous Vehicles</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Our RobotX system brings together uncrewed vehicles across multiple domains to support coordinated
                mission execution.
              </p>

              <div className="space-y-3">
                {VEHICLES.map((v) => (
                  <div key={v.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-block rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-3 py-1 text-xs font-semibold text-[#00F5FF]">
                        {v.domain}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{v.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{v.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/robotx/system-vehicles"
                className="mt-6 inline-flex items-center gap-2 text-[#00B4D8] hover:text-[#00F5FF] font-semibold group/link"
              >
                Explore the System of Systems
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

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
    <section className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        <Reveal y={20} className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">Mission Focus</span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">Multi-Domain Collaboration</h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {FOCUS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.12} y={40}>
              <GlowCard delay={i * 0.5} innerClass="p-7">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ background: "#00B4D815", border: "1px solid #00B4D830", boxShadow: "0 0 24px #00B4D820" }}
                  >
                    <Icon size={22} className="text-[#00B4D8]" aria-hidden="true" />
                  </div>
                  <span className="font-heading font-black text-3xl text-[#00B4D8]/25">0{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RobotXCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#0D1B2A] py-24 px-6">
      <Reveal className="max-w-3xl mx-auto">
        <GlowCard radius="rounded-3xl" innerBg="#0A0F1E" innerClass="px-8 py-16 text-center" className="opacity-100">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#00B4D8]/10 blur-[80px]" />
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
                className="absolute rounded-full bg-[#00B4D8]/30 pointer-events-none"
                style={{ left: p.left, width: p.size, height: p.size, bottom: "8%" }}
                animate={{ y: [0, -280], opacity: [0, 0.8, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeIn" }}
              />
            ))}

          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4 relative z-10">
            See the System in Action
          </h2>
          <p className="text-slate-400 mb-8 relative z-10">
            Dive into our vehicles, test results and build log to see how Aquaholics is preparing for RobotX 2026.
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/robotx/testing"
              className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base hover:scale-[1.02] group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              View Testing
              <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
            <Link
              to="/robotx/design"
              className="inline-flex items-center gap-2 border border-[#00B4D8]/40 text-[#00F5FF] hover:bg-[#00B4D8]/10 font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]"
            >
              Read the Build Log
            </Link>
          </div>
        </GlowCard>
      </Reveal>
    </section>
  );
}

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