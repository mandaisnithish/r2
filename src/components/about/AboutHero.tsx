import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
}

interface StarConfig {
  width: string;
  height: string;
  top: string;
  left: string;
  opacity: number;
  duration: number;
  delay: number;
}

export default function AboutHero({ title, subtitle }: Props) {
  const [stars, setStars] = useState<StarConfig[]>([]);

  useEffect(() => {
    const staticStars = [...Array(35)].map(() => {
      const isLarge = Math.random() > 0.7;
      return {
        width: isLarge ? "2px" : "1px",
        height: isLarge ? "2px" : "1px",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3,
      };
    });
    setStars(staticStars);
  }, []);

  return (
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#00B4D8]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-[#0077B6]/10 blur-[100px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
            animate={{ opacity: [star.opacity, 0.6, star.opacity] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      {/* Growing root/branch structure — organic curved lines that grow
          upward and outward from base points on both sides, branching as
          they rise, with particles flowing upward like rising energy and
          a continuous gentle sway once fully grown. Desktop gets the full
          two-sided version; mobile gets a simpler single-side version
          sized for a narrow viewport instead of being hidden entirely. */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
          {/* Left-side branches. Each TRUNK and its attached sub-branch
              are grouped into one <g> so they sway together as one rigid
              unit, pivoting from the same root point. Previously each
              sub-branch had its own independent sway animation with a
              mismatched transform-origin, so trunk and sub-branch drifted
              apart and back together asynchronously — visible as a gap
              opening and closing. Grouping them fixes that at the root
              cause instead of just retuning numbers. */}
          {[
            {
              trunk: "M150,600 C140,480 180,420 130,340 C90,270 160,200 120,110",
              sub: "M120,110 C100,80 110,50 80,25",
              delay: 0, dur: 2.2, subDelay: 1.8, subDur: 0.9, sway: 3,
            },
            {
              trunk: "M150,600 C160,470 200,430 260,360 C310,300 280,220 340,150",
              sub: "M340,150 C370,120 410,115 450,90",
              delay: 0.3, dur: 2, subDelay: 1.6, subDur: 1, sway: 4,
            },
            {
              trunk: "M150,600 C170,490 230,460 300,420 C360,390 420,400 480,350",
              sub: "M480,350 C530,330 560,290 610,275",
              delay: 0.6, dur: 2.4, subDelay: 1.9, subDur: 1, sway: 3.5,
            },
            {
              trunk: "M150,600 C155,500 130,440 90,400 C60,365 70,300 30,260",
              sub: null,
              delay: 0.5, dur: 1.8, subDelay: 0, subDur: 0, sway: 4.5,
            },
          ].map((branch, i) => (
            <motion.g
              key={`l-${i}`}
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 1.2, 0, -1.2, 0] }}
              style={{ transformOrigin: "150px 600px" }}
              transition={{
                duration: branch.sway,
                repeat: Infinity,
                delay: branch.delay + branch.dur,
                ease: "easeInOut",
              }}
            >
              <motion.path
                d={branch.trunk}
                fill="none"
                stroke="#00B4D8"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: branch.dur, delay: branch.delay, ease: "easeOut" }}
              />
              {branch.sub && (
                <motion.path
                  d={branch.sub}
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: branch.subDur, delay: branch.subDelay, ease: "easeOut" }}
                />
              )}
            </motion.g>
          ))}

          {/* Mirrored right-side branches (flipped via negative scale
              transform on a wrapping group, base point at 1290,600).
              Same grouping fix applied: trunk + its sub-branch sway
              together as one rigid unit. */}
          <g transform="translate(1440,0) scale(-1,1)">
            {[
              {
                trunk: "M150,600 C140,480 180,420 130,340 C90,270 160,200 120,110",
                sub: "M120,110 C100,80 110,50 80,25",
                delay: 0.2, dur: 2.2, subDelay: 2.0, subDur: 0.9, sway: 3.4,
              },
              {
                trunk: "M150,600 C160,470 200,430 260,360 C310,300 280,220 340,150",
                sub: "M340,150 C370,120 410,115 450,90",
                delay: 0.5, dur: 2, subDelay: 1.8, subDur: 1, sway: 3.8,
              },
              {
                trunk: "M150,600 C155,500 130,440 90,400 C60,365 70,300 30,260",
                sub: null,
                delay: 0.7, dur: 1.8, subDelay: 0, subDur: 0, sway: 4.2,
              },
            ].map((branch, i) => (
              <motion.g
                key={`r-${i}`}
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 1.2, 0, -1.2, 0] }}
                style={{ transformOrigin: "150px 600px" }}
                transition={{
                  duration: branch.sway,
                  repeat: Infinity,
                  delay: branch.delay + branch.dur,
                  ease: "easeInOut",
                }}
              >
                <motion.path
                  d={branch.trunk}
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: branch.dur, delay: branch.delay, ease: "easeOut" }}
                />
                {branch.sub && (
                  <motion.path
                    d={branch.sub}
                    fill="none"
                    stroke="#00B4D8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: branch.subDur, delay: branch.subDelay, ease: "easeOut" }}
                  />
                )}
              </motion.g>
            ))}
          </g>

          {/* Glowing buds at branch tips, both sides */}
          {[
            { cx: 480, cy: 90, delay: 2.6 },
            { cx: 80, cy: 25, delay: 2.7 },
            { cx: 610, cy: 275, delay: 2.9 },
            { cx: 30, cy: 260, delay: 2.3 },
            { cx: 960, cy: 90, delay: 2.8 },
            { cx: 1360, cy: 260, delay: 2.5 },
          ].map((bud, i) => (
            <motion.circle
              key={`bud-${i}`}
              cx={bud.cx}
              cy={bud.cy}
              r="4"
              fill="#00F5FF"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6], scale: [0, 1.4, 1] }}
              transition={{ duration: 0.6, delay: bud.delay }}
            />
          ))}

          {/* Particles rising along the main left and right trunks, like
              energy/sap flowing upward. Animated via direct cx/cy
              keyframes (matching points along the trunk curve) rather
              than CSS motion-path/offsetPath, which has inconsistent
              cross-browser support and isn't a standard Framer Motion
              animation target — this approach works everywhere. */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`rise-l-${i}`}
              r="2.5"
              fill="#00F5FF"
              initial={{ opacity: 0, cx: 150, cy: 600 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                cx: [150, 140, 130, 120],
                cy: [600, 480, 340, 110],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 3 + i * 1.3, ease: "linear" }}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`rise-r-${i}`}
              r="2.5"
              fill="#00F5FF"
              initial={{ opacity: 0, cx: 1290, cy: 600 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                cx: [1290, 1300, 1310, 1320],
                cy: [600, 480, 340, 110],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 3.6 + i * 1.3, ease: "linear" }}
            />
          ))}
        </svg>
      </div>

      {/* Mobile version — a single, simpler upward-growing branch sized
          for a narrow viewport, plus a couple of rising particles. Not
          hidden entirely like before; mobile now gets its own atmosphere
          instead of a flat background. */}
      <div className="absolute inset-0 pointer-events-none md:hidden overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none">
          {[
            { d: "M80,600 C75,500 100,460 70,380 C50,320 90,260 65,190", delay: 0, dur: 1.8 },
            { d: "M80,600 C90,490 120,460 150,400 C175,350 160,290 195,240", delay: 0.3, dur: 1.6 },
            { d: "M65,190 C55,160 60,130 45,100", delay: 1.5, dur: 0.8 },
          ].map((branch, i) => (
            <motion.path
              key={i}
              d={branch.d}
              fill="none"
              stroke="#00B4D8"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: branch.dur, delay: branch.delay, ease: "easeOut" }}
            />
          ))}
          <motion.circle
            cx={45}
            cy={100}
            r="4"
            fill="#00F5FF"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.6], scale: [0, 1.4, 1] }}
            transition={{ duration: 0.6, delay: 2.1 }}
          />
          {[0, 1].map((i) => (
            <motion.circle
              key={`m-rise-${i}`}
              r="2"
              fill="#00F5FF"
              initial={{ opacity: 0, cx: 80, cy: 600 }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                cx: [80, 75, 70, 65],
                cy: [600, 500, 380, 190],
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 2.4 + i * 1.6, ease: "linear" }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Centered icon badge above the small pill — same pattern used on
            Impact (trophy), Blog (pen), and Contact (envelope), so About
            now matches the established site-wide language instead of
            using its own different motif. */}
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
          <Compass size={24} className="text-cyan-300 relative z-10" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/25 rounded-full px-5 py-2 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
          About Us
        </motion.span>

        <h1 className="font-heading font-black text-5xl md:text-7xl leading-tight mb-6">
          {title.split(" ").map((word, wi) => {
            const isSecondHalf = wi >= Math.ceil(title.split(" ").length / 2);
            return (
              <span key={wi} className="inline-block mr-[0.3em]">
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    className={`inline-block ${isSecondHalf ? "text-[#00B4D8]" : "text-white"}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + (wi * 6 + ci) * 0.025,
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

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle}
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