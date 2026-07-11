import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";
import type { Stat } from "../../types";

interface Props {
  title: string;
  text: string;
  stats: Stat[];
}

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };
    requestAnimationFrame(animate);
  }, [trigger, target, duration]);
  return count;
}

function StatCard({
  stat,
  delay,
  trigger,
  index,
}: {
  stat: Stat;
  delay: number;
  trigger: boolean;
  index: number;
}) {
  const count = useCountUp(stat.numericValue, 2000, trigger);
  const formatted = stat.numericValue >= 1000
    ? count.toLocaleString()
    : count.toString();
  const offset = (index % 5) * 0.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="relative flex-1 p-[1.5px] rounded-2xl overflow-hidden group cursor-default"
    >
      {/* Rotating glow border, matching the site-wide card language */}
      <div
        className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
          animationDelay: `${offset}s`,
        }}
      />

      <div
        className="relative rounded-2xl p-8 h-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)" }}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,180,216,0.1),transparent_70%)]" />

        {/* Number now pulses subtly to feel alive, not just a static figure */}
        <motion.div
          animate={trigger ? { textShadow: ["0 0 0px rgba(0,180,216,0)", "0 0 18px rgba(0,180,216,0.4)", "0 0 0px rgba(0,180,216,0)"] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: offset }}
          className="font-heading font-black text-5xl md:text-6xl mb-3 text-[#00B4D8] relative z-10"
        >
          {stat.prefix ?? ""}{formatted}{stat.suffix ?? ""}
        </motion.div>

        <p className="text-slate-400 text-sm leading-relaxed relative z-10">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

const FALLBACK_STATS: Stat[] = [
  { id: 1, label: "Tons of plastic enter oceans every year", numericValue: 8, suffix: "M+", prefix: "", displayOrder: 1 },
  { id: 2, label: "Of water bodies affected by pollution",   numericValue: 70, suffix: "%", prefix: "", displayOrder: 2 },
  { id: 3, label: "People lack access to clean water",       numericValue: 1,  suffix: "B+", prefix: "", displayOrder: 3 },
];

export default function ProblemSection({ title, text, stats }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const data = stats.length > 0
    ? [...stats].sort((a, b) => a.displayOrder - b.displayOrder)
    : FALLBACK_STATS;

  const words = title.split(" ");
  const half = Math.ceil(words.length / 2);
  const firstPart = words.slice(0, half).join(" ");
  const secondPart = words.slice(half).join(" ");

  return (
    <section ref={ref} className="bg-[#0D1B2A] py-28 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00B4D8]/5 blur-[120px] pointer-events-none" />

      {/* Drifting debris-like particles sinking downward rather than
          rising — distinct from the upward "bubble" motif used on
          friendlier sections elsewhere, fitting since this section is
          specifically about pollution and waste, not aspiration. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "6%", delay: 0, dur: 9, size: 4 },
          { left: "12%", delay: 2.4, dur: 11, size: 3 },
          { left: "92%", delay: 1, dur: 10, size: 4 },
          { left: "87%", delay: 3.2, dur: 8.5, size: 3 },
          { left: "20%", delay: 4.5, dur: 9.5, size: 3 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-sm bg-[#00B4D8]/20"
            style={{ left: p.left, width: p.size, height: p.size, top: "-5%" }}
            animate={{ y: [0, 480], rotate: [0, 180], opacity: [0, 0.6, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            The Problem
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-center leading-[1.05] mb-6"
        >
          <span className="text-white">{firstPart} </span>
          <span className="text-[#00B4D8]">{secondPart}</span>
        </motion.h2>

        {/* Divider now fades at both ends instead of being a flat bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-[2px] mx-auto mb-8 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #00B4D8, transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-16"
        >
          {text}
        </motion.p>

        <div className="flex flex-col md:flex-row gap-5">
          {data.map((stat, i) => (
            <StatCard
              key={stat.id}
              stat={stat}
              delay={0.3 + i * 0.15}
              trigger={inView}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  );
}