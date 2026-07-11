// src/components/impact/ImpactHero.tsx
import { motion } from "framer-motion";
import { Trophy, Banknote, BookOpen, ShieldCheck, Milestone, Star } from "lucide-react";

// Six nodes arranged loosely around the heading, echoing the same category
// icons used in the stat cards and timeline below — so the hero visual is
// actually connected to real content instead of generic decoration.
const NODES = [
  { Icon: Trophy, top: "12%", left: "8%", delay: 0, color: "#00B4D8" },
  { Icon: Banknote, top: "65%", left: "5%", delay: 0.4, color: "#22c55e" },
  { Icon: BookOpen, top: "20%", left: "90%", delay: 0.8, color: "#34d399" },
  { Icon: ShieldCheck, top: "70%", left: "92%", delay: 1.2, color: "#fbbf24" },
  { Icon: Milestone, top: "5%", left: "45%", delay: 0.2, color: "#a78bfa" },
  { Icon: Star, top: "85%", left: "50%", delay: 1.6, color: "#f472b6" },
];

export default function ImpactHero() {
  return (
    <section className="relative pt-28 pb-20 px-6 text-center overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00B4D8 0%, transparent 70%)" }}
      />

      {/* Constellation layer — faint connecting lines + drifting icon nodes.
          Desktop gets the full six-node spread; mobile gets a smaller
          three-node version scaled for a narrow viewport instead of being
          hidden entirely. */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
          <line x1="8%" y1="12%" x2="45%" y2="5%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="45%" y1="5%" x2="90%" y2="20%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="5%" y1="65%" x2="50%" y2="85%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="50%" y1="85%" x2="92%" y2="70%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="8%" y1="12%" x2="5%" y2="65%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="90%" y1="20%" x2="92%" y2="70%" stroke="#00B4D8" strokeWidth="1" />
        </svg>

        {NODES.map(({ Icon, top, left, delay, color }, i) => (
          <motion.div
            key={i}
            className="absolute w-11 h-11 rounded-xl flex items-center justify-center border"
            style={{
              top,
              left,
              background: `${color}1A`,
              borderColor: `${color}40`,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, delay },
              y: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" },
              scale: { duration: 0.5, delay: delay * 0.3 },
            }}
          >
            <Icon size={18} style={{ color }} />
          </motion.div>
        ))}
      </div>

      {/* Mobile version — three nodes only, repositioned so they sit in
          the corners around the heading without crowding a narrow
          screen, plus their connecting lines. Same drift/pulse motion,
          smaller icon boxes. */}
      <div className="absolute inset-0 pointer-events-none md:hidden">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
          <line x1="10%" y1="10%" x2="90%" y2="14%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="10%" y1="10%" x2="15%" y2="72%" stroke="#00B4D8" strokeWidth="1" />
          <line x1="90%" y1="14%" x2="85%" y2="74%" stroke="#00B4D8" strokeWidth="1" />
        </svg>

        {NODES.slice(0, 3).map(({ Icon, delay, color }, i) => {
          const mobilePositions = [
            { top: "8%", left: "6%" },
            { top: "10%", left: "78%" },
            { top: "72%", left: "42%" },
          ];
          const pos = mobilePositions[i];
          return (
            <motion.div
              key={i}
              className="absolute z-10 w-9 h-9 rounded-lg flex items-center justify-center border"
              style={{
                top: pos.top,
                left: pos.left,
                background: `${color}1A`,
                borderColor: `${color}40`,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.5, 0.9, 0.5],
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 3, repeat: Infinity, delay },
                y: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" },
                scale: { duration: 0.5, delay: delay * 0.3 },
              }}
            >
              <Icon size={14} style={{ color }} />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        {/* Focal trophy centerpiece, sitting above the badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative"
          style={{
            background: "linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,245,255,0.05))",
            border: "1px solid rgba(0,180,216,0.4)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 30px rgba(0,180,216,0.5)" }}
          />
          <Trophy size={28} className="text-cyan-300 relative z-10" />
        </motion.div>

        {/* Badge pill now matches the AboutUs pattern: pulsing dot + inline-flex layout */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Our Journey
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white font-['Exo_2'] mb-4">
          Impact &{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #00B4D8, #00F5FF)" }}
          >
            Achievements
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Every milestone, competition win, publication, and recognition that
          defines our mission to clean the world's water.
        </p>
      </motion.div>
    </section>
  );
}