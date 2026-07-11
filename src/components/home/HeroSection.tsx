import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl?: string;
  badgeText?: string;
}

const DEFAULTS = {
  title: "Two worlds.\nOne robot.",
  subtitle:
    "What happens above the surface ripples below. Our robots clean what eyes can't see — sky to seabed, autonomously.",
  buttonText: "See Both Sides",
  // Real, meaningful badge copy instead of dev-placeholder text.
  badgeText: "Autonomous · AI-Powered · Built for Rivers & Lakes",
};

interface Bottle { id: number; }

function RobotBoat() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const spawn = () => {
      counter.current += 1;
      setBottles((prev) => [...prev, { id: counter.current }]);
    };
    spawn();
    const interval = setInterval(spawn, 2400);
    return () => clearInterval(interval);
  }, []);

  const remove = (id: number) => setBottles((p) => p.filter((b) => b.id !== id));

  return (
    // Scene height pushed to 560px and the boat itself scaled much larger
    // (2.1x instead of 1.45x) — this is the direct fix for "boat looks tiny
    // floating in empty space." The column should now feel as visually
    // weighted as the text column beside it. Height and scale are reduced
    // on mobile so the scene doesn't force excessive page height / overflow.
    <div
      className="relative flex items-center justify-center w-full h-[280px] md:h-[560px]"
    >

      <AnimatePresence>
        {bottles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ x: 300, opacity: 1, scale: 1 }}
            animate={{ x: -15, opacity: [1, 1, 0], scale: [1, 1, 0.1] }}
            transition={{ duration: 3.4, ease: "linear", times: [0, 0.82, 1] }}
            onAnimationComplete={() => remove(b.id)}
            style={{ position: "absolute", top: "53%", zIndex: 5, pointerEvents: "none" }}
          >
            <svg width="24" height="40" viewBox="0 0 18 30" fill="none">
              <rect x="5" y="0" width="8" height="5" rx="2" fill="#00B4D8"/>
              <rect x="6" y="4" width="6" height="4" rx="1" fill="#1a6080"/>
              <rect x="2" y="7" width="14" height="20" rx="4" fill="#1a4a6e" stroke="#00B4D8" strokeWidth="0.8"/>
              <rect x="3" y="17" width="12" height="8" rx="3" fill="#0a2540" opacity="0.7"/>
              <path d="M9,9 C9,9 13,12.5 13,15 C13,17.2 11.2,19 9,19 C6.8,19 5,17.2 5,15 C5,12.5 9,9 9,9 Z"
                fill="#00B4D8" opacity="0.45"/>
              <text x="9" y="16.5" textAnchor="middle" fontSize="4.5" fontWeight="900"
                fontFamily="Georgia,serif" fill="white" opacity="0.95">A</text>
              <line x1="4" y1="9" x2="4" y2="22" stroke="white" strokeWidth="0.8" opacity="0.1"/>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Robot boat — bobbing, scaled up via wrapper instead of editing every
          coordinate in the SVG (keeps the original artwork intact). Scale
          reduced on mobile so the boat doesn't overflow/crowd the section. */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 scale-[1.1] md:scale-[2.1]"
      >
        <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* Hull — curved instead of straight-edged, rounded prow on the left */}
          <path
            d="M30,118 Q20,118 16,108 Q10,95 22,90 L228,90 Q248,90 250,108 Q252,122 238,128 L42,128 Q32,128 30,118 Z"
            fill="#0D2244" stroke="#00B4D8" strokeWidth="1.2"
          />
          <path d="M42,128 Q135,142 238,128" fill="none" stroke="#00B4D8" strokeWidth="1" opacity="0.5"/>
          {/* Hull highlight strip for dimension */}
          <path d="M30,100 Q135,94 238,100" fill="none" stroke="#00F5FF" strokeWidth="0.8" opacity="0.25"/>

          {/* Cabin — softer rounding */}
          <rect x="78" y="58" width="124" height="36" rx="9" fill="#0A1A38" stroke="#00B4D8" strokeWidth="1"/>

          {/* Window */}
          <rect x="90" y="67" width="26" height="17" rx="4" fill="#001830" stroke="#00B4D8" strokeWidth="0.8"/>
          <rect x="90" y="67" width="26" height="17" rx="4" fill="#00B4D8" opacity="0.1"/>

          {/* Aquaholics water-drop emblem on cabin */}
          <path
            d="M158,61 C158,61 170,70 170,77 C170,83.6 164.6,89 158,89 C151.4,89 146,83.6 146,77 C146,70 158,61 158,61 Z"
            fill="#00B4D8" opacity="0.22" stroke="#00B4D8" strokeWidth="0.8"
          />
          <text x="158" y="84" textAnchor="middle" fontSize="14" fontWeight="900"
            fontFamily="Georgia,serif" fill="#00F5FF" opacity="0.95">A</text>
          <path d="M153,62 L155,57 L158,60 L161,57 L163,62 Z"
            fill="none" stroke="#00F5FF" strokeWidth="0.8" strokeLinejoin="round" opacity="0.8"/>
          <text x="172" y="64" fontSize="6" fontFamily="sans-serif" fill="#00B4D8" opacity="0.7">™</text>

          {/* Status LEDs */}
          <circle cx="188" cy="68" r="2.5" fill="#00F5FF" opacity="0.9"/>
          <circle cx="196" cy="68" r="2.5" fill="#00cc66" opacity="0.85"/>

          {/* Mast + beacon */}
          <line x1="140" y1="58" x2="140" y2="18" stroke="#00B4D8" strokeWidth="1.2"/>
          <circle cx="140" cy="15" r="4"  fill="#00F5FF" opacity="0.9"/>
          <circle cx="140" cy="15" r="2"  fill="white"  opacity="0.85"/>
          <circle cx="140" cy="15" r="9"  fill="none" stroke="#00F5FF" strokeWidth="0.6" opacity="0.35"/>
          <circle cx="140" cy="15" r="15" fill="none" stroke="#00F5FF" strokeWidth="0.4" opacity="0.18"/>

          {/* Front collector arm — curved instead of straight segments */}
          <path d="M78,93 Q45,98 24,102 Q14,104 10,94" fill="none" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M10,94 Q5,105 17,108" fill="none" stroke="#00B4D8" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.7"/>

          {/* Rear propeller */}
          <circle cx="238" cy="104" r="10" fill="#051020" stroke="#00B4D8" strokeWidth="0.8"/>
          <circle cx="238" cy="104" r="5"  fill="#030c18" stroke="#00B4D8" strokeWidth="0.5"/>
          <g style={{ transformOrigin: "238px 104px", animation: "spin 1s linear infinite" }}>
            <ellipse cx="238" cy="97" rx="2.5" ry="6"   fill="#00B4D8" opacity="0.85"/>
            <ellipse cx="245" cy="104" rx="6"   ry="2.5" fill="#00B4D8" opacity="0.85"/>
            <ellipse cx="238" cy="111" rx="2.5" ry="6"   fill="#00B4D8" opacity="0.85"/>
            <ellipse cx="231" cy="104" rx="6"   ry="2.5" fill="#00B4D8" opacity="0.85"/>
          </g>

          {/* Wake */}
          <path d="M242,114 Q258,108 268,114" fill="none" stroke="#00B4D8" strokeWidth="0.8" opacity="0.45"/>
          <path d="M244,119 Q262,112 272,118" fill="none" stroke="#00B4D8" strokeWidth="0.5" opacity="0.25"/>

          {/* Waterline beneath the hull */}
          <path d="M0,124 C30,117 65,130 100,124 C140,117 175,130 210,124 C232,120 252,125 280,124"
            fill="none" stroke="#00B4D8" strokeWidth="1.2" opacity="0.6"/>
          <path d="M0,128 C30,121 65,134 100,128 C140,121 175,134 210,128 C232,124 252,129 280,128"
            fill="none" stroke="#00F5FF" strokeWidth="0.5" opacity="0.28"/>
        </svg>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}

export default function HeroSection({ title, subtitle, buttonText, imageUrl, badgeText }: Props) {
  const displayTitle    = title      || DEFAULTS.title;
  const displaySubtitle = subtitle   || DEFAULTS.subtitle;
  const displayButton   = buttonText || DEFAULTS.buttonText;
  const displayBadge    = badgeText  || DEFAULTS.badgeText;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-[55%] bg-gradient-to-b from-[#060D1F] via-[#0A1628] to-[#0D1F35]" />
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-b from-[#0A2540] via-[#072035] to-[#040F1A]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden pointer-events-none">
        {/* Moon — sits upper-right, away from the text column. Scaled down
            and pulled further into the corner on mobile so it no longer
            sits on top of the badge/headline; full size only from md+. */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-[2%] right-[4%] w-16 h-16 md:top-[8%] md:right-[10%] md:w-[120px] md:h-[120px]"
        >
          <svg width="100%" height="100%" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="60" fill="#00B4D8" opacity="0.06"/>
            <circle cx="60" cy="60" r="44" fill="#00B4D8" opacity="0.1"/>
            <circle cx="60" cy="60" r="32" fill="#E8F6FA"/>
            <circle cx="48" cy="48" r="5" fill="#C9E8EF"/>
            <circle cx="68" cy="64" r="3.5" fill="#C9E8EF"/>
            <circle cx="62" cy="42" r="2.5" fill="#C9E8EF"/>
            <circle cx="60" cy="60" r="32" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.2"/>
          </svg>
        </motion.div>

        {[...Array(40)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.7 ? "2px" : "1px",
              height: Math.random() > 0.7 ? "2px" : "1px",
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/8 blur-[100px]" />
      </div>

      <div className="absolute top-[52%] left-0 right-0 -translate-y-1/2 pointer-events-none z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,30 C120,10 240,50 360,30 C480,10 600,50 720,30 C840,10 960,50 1080,30 C1200,10 1320,50 1440,30"
            stroke="#00B4D8" strokeWidth="2.5" fill="none" opacity="0.7"/>
          <path d="M0,35 C120,15 240,55 360,35 C480,15 600,55 720,35 C840,15 960,55 1080,35 C1200,15 1320,55 1440,35"
            stroke="#00F5FF" strokeWidth="1" fill="none" opacity="0.4"/>
          <path d="M0,40 C120,22 240,58 360,40 C480,22 600,58 720,40 C840,22 960,58 1080,40 C1200,22 1320,58 1440,40"
            stroke="#00B4D8" strokeWidth="0.5" fill="none" opacity="0.25"/>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex items-center min-h-screen">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center w-full py-24">

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/25 rounded-full px-5 py-2 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
              {displayBadge}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="font-heading font-black text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6"
            >
              {displayTitle.includes("\n") ? (
                <>
                  <span className="text-white block">{displayTitle.split("\n")[0]}</span>
                  <span className="text-[#00B4D8] block">{displayTitle.split("\n")[1]}</span>
                </>
              ) : (
                <>
                  <span className="text-white block">
                    {displayTitle.split(" ").slice(0, Math.ceil(displayTitle.split(" ").length / 2)).join(" ")}
                  </span>
                  <span className="text-[#00B4D8] block">
                    {displayTitle.split(" ").slice(Math.ceil(displayTitle.split(" ").length / 2)).join(" ")}
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="text-slate-400 text-base md:text-lg leading-relaxed mb-10 max-w-md"
            >
              {displaySubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/product"
                className="inline-flex items-center gap-2.5 border border-slate-600 hover:border-[#00B4D8] text-white hover:text-[#00B4D8] font-bold text-xs tracking-[0.15em] uppercase px-7 py-3.5 rounded-lg transition-all duration-300 no-underline hover:bg-[#00B4D8]/5"
              >
                <span className="text-[#00B4D8]">▶</span>
                {displayButton}
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold text-xs tracking-[0.15em] uppercase px-7 py-3.5 rounded-lg transition-all duration-300 no-underline hover:scale-[1.02]"
              >
                Get Demo
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center items-center relative"
          >
            {imageUrl ? (
              <motion.img src={imageUrl} alt="AWSCR"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full max-w-lg object-contain"
              />
            ) : (
              <RobotBoat />
            )}
          </motion.div>

        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 z-20"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>

    </section>
  );
}