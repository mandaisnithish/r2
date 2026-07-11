// src/components/blog/BlogHero.tsx
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

// Splits "Our Blog" into individual letters for a staggered reveal —
// each letter fades + rises in sequence instead of the whole heading
// appearing at once.
function RevealText({
  text,
  className,
  delayStart = 0,
  gradient,
}: {
  text: string;
  className?: string;
  delayStart?: number;
  gradient?: string;
}) {
  return (
    <span className={className} style={gradient ? { backgroundImage: gradient } : undefined}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delayStart + i * 0.045, ease: "easeOut" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function BlogHero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full bg-[#00B4D8]/14 blur-[140px]" />

        {/* Wrapping line — now a tall loose loop that arcs above, around,
            and below the heading area instead of one flat horizontal
            squiggle behind it. Drawn in on load. */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-30"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M-50,420 C150,460 250,300 400,340 C550,380 600,180 750,150 C900,120 950,260 1100,200 C1180,170 1220,220 1260,180"
            fill="none"
            stroke="#00B4D8"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />
          {/* Second line for depth, fainter, offset timing and shape */}
          <motion.path
            d="M-50,120 C200,80 300,220 450,180 C600,140 700,300 850,320 C1000,340 1050,200 1260,260"
            fill="none"
            stroke="#00F5FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.6, delay: 0.4, ease: "easeInOut" }}
          />
        </svg>

        {/* Brighter, bigger drifting particles */}
        {[...Array(22)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00F5FF]"
            style={{
              width: Math.random() > 0.5 ? "4px" : "2px",
              height: Math.random() > 0.5 ? "4px" : "2px",
              top: `${Math.random() * 85}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.25, 0.85, 0.25],
              y: [0, -22, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2.5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative"
          style={{
            background: "linear-gradient(135deg, rgba(0,180,216,0.25), rgba(0,245,255,0.06))",
            border: "1px solid rgba(0,180,216,0.45)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 34px rgba(0,180,216,0.6)" }}
          />
          <PenLine size={24} className="text-cyan-300 relative z-10" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
          From the team
        </motion.span>

        <h1 className="font-heading font-black text-5xl md:text-7xl mb-5 tracking-tight">
          <RevealText text="Our" className="text-white" delayStart={0.3} />
          {"\u00A0"}
          <RevealText
            text="Blog"
            className="text-transparent bg-clip-text"
            delayStart={0.45}
            gradient="linear-gradient(90deg, #00B4D8, #00F5FF)"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-slate-400 text-lg max-w-xl mx-auto"
        >
          Updates, research, and stories from the Aquaholics journey.
        </motion.p>
      </motion.div>
    </section>
  );
}