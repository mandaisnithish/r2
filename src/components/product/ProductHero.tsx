// src/components/product/ProductHero.tsx
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  heroTitle: string;
  heroSubtitle?: string;
  eyebrow?: string;
}

const CORE_X = 720;
const CORE_Y = 140;

// 6 traces, perfectly mirrored left/right, with smooth rounded corners
// (arcs) at each bend instead of sharp right angles — reads as a
// deliberate, elegant PCB layout rather than a dense maze.
const TRACES = [
  {
    d: `M 40,60 L 210,60 Q 230,60 230,80 L 230,170 Q 230,190 250,190 L ${CORE_X - 90},190 Q ${CORE_X - 70},190 ${CORE_X - 60},170 L ${CORE_X - 30},155`,
    delay: 0, dur: 3.2, color: "#00F5FF",
  },
  {
    d: `M 1400,60 L 1230,60 Q 1210,60 1210,80 L 1210,170 Q 1210,190 1190,190 L ${CORE_X + 90},190 Q ${CORE_X + 70},190 ${CORE_X + 60},170 L ${CORE_X + 30},155`,
    delay: 0.8, dur: 3.2, color: "#00F5FF",
  },
  {
    d: `M 100,340 L 290,340 Q 310,340 310,320 L 310,240 Q 310,220 330,220 L ${CORE_X - 100},220 Q ${CORE_X - 80},220 ${CORE_X - 65},205 L ${CORE_X - 25},170`,
    delay: 1.6, dur: 3.6, color: "#5EEAD4",
  },
  {
    d: `M 1340,340 L 1150,340 Q 1130,340 1130,320 L 1130,240 Q 1130,220 1110,220 L ${CORE_X + 100},220 Q ${CORE_X + 80},220 ${CORE_X + 65},205 L ${CORE_X + 25},170`,
    delay: 2.4, dur: 3.6, color: "#5EEAD4",
  },
  {
    d: `M 430,10 L 430,90 Q 430,110 450,110 L ${CORE_X - 60},110 Q ${CORE_X - 45},110 ${CORE_X - 35},125 L ${CORE_X - 15},148`,
    delay: 3.2, dur: 2.8, color: "#7DD3FC",
  },
  {
    d: `M 1010,10 L 1010,90 Q 1010,110 990,110 L ${CORE_X + 60},110 Q ${CORE_X + 45},110 ${CORE_X + 35},125 L ${CORE_X + 15},148`,
    delay: 4, dur: 2.8, color: "#7DD3FC",
  },
];

const NODE_POINTS = [
  { x: 230, y: 80 }, { x: 1210, y: 80 },
  { x: 310, y: 320 }, { x: 1130, y: 320 },
  { x: 430, y: 90 }, { x: 1010, y: 90 },
];

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

export default function ProductHero({ heroTitle, heroSubtitle, eyebrow = "Our Product" }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00B4D8]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-[#0077B6]/10 blur-[100px]" />
      </div>

      {/* Circuit layer — shown on all screen sizes. Uses preserveAspectRatio
          "xMidYMid slice" instead of "none": this scales the 1440x500
          artwork UNIFORMLY (same ratio horizontally and vertically) to
          fill the container, cropping whatever spills past the edges
          on narrow screens, rather than squashing it non-uniformly —
          which is what was turning the smooth curves into broken boxy
          lines on mobile. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
            </radialGradient>
            {TRACES.map((t, i) => (
              <linearGradient key={`grad-${i}`} id={`streakGrad-${i}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={t.color} stopOpacity="0" />
                <stop offset="85%" stopColor={t.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={t.color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>

          {/* Static base lines — thin, calm, always visible */}
          {TRACES.map((trace, i) => (
            <motion.path
              key={`trace-${i}`}
              d={trace.d}
              fill="none"
              stroke={trace.color}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.2"
              initial={{ pathLength: 0 }}
              animate={ready ? { pathLength: 1 } : {}}
              transition={{ duration: 1.1, delay: i * 0.1, ease: "easeOut" }}
            />
          ))}

          {/* Core glow + two clean concentric rings, counter-rotating */}
          <circle cx={CORE_X} cy={CORE_Y} r="120" fill="url(#coreGlow)" />
          <motion.circle
            cx={CORE_X} cy={CORE_Y} r="100"
            fill="none" stroke="#00B4D8" strokeWidth="0.75" opacity="0.25"
            strokeDasharray="2 6"
            style={{ transformOrigin: `${CORE_X}px ${CORE_Y}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.polygon
            points={hexPoints(CORE_X, CORE_Y, 62)}
            fill="none" stroke="#00F5FF" strokeWidth="1" opacity="0.3"
            style={{ transformOrigin: `${CORE_X}px ${CORE_Y}px` }}
            animate={{ rotate: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          />

          {/* Traveling light streaks — smooth gradient-tailed segments
              riding each path, using a moving gradient stroke for a
              soft fade instead of a hard dash cutoff */}
          {TRACES.map((trace, i) => (
            <motion.path
              key={`streak-${i}`}
              d={trace.d}
              fill="none"
              stroke={trace.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 3000"
              opacity="0"
              style={{ filter: `drop-shadow(0 0 3px ${trace.color})` }}
            >
              <animate attributeName="stroke-dashoffset" values="60;-3000" dur={`${trace.dur}s`} begin={`${trace.delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.05;0.9;1" dur={`${trace.dur}s`} begin={`${trace.delay}s`} repeatCount="indefinite" />
            </motion.path>
          ))}

          {/* Minimal junction markers — small rings, not squares */}
          {NODE_POINTS.map((p, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={p.x} cy={p.y} r="3"
              fill="#0A0F1E" stroke="#00B4D8" strokeWidth="1"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: (i % TRACES.length) * 0.35 }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 28px rgba(0,180,216,0.5)" }}
          />
          <Bot size={24} className="text-cyan-300 relative z-10" />
        </motion.div>

        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/25 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-heading font-black text-5xl md:text-7xl leading-tight mb-6"
          style={{
            backgroundImage: "linear-gradient(100deg, #FFFFFF 20%, #B7F3FF 55%, #00F5FF 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {heroTitle}
        </motion.h1>

        {heroSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            {heroSubtitle}
          </motion.p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#0D1B2A" />
        </svg>
      </div>
    </section>
  );
}