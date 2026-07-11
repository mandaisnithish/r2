// src/components/contact/ContactHero.tsx
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface Props {
  heroTitle: string;
  heroSubtitle?: string;
}

export default function ContactHero({ heroTitle, heroSubtitle }: Props) {
  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
      {/* Signal/transmission visual — concentric pulse rings emanating from
          a central point, plus small dots traveling outward along curved
          paths like messages being sent. Distinct from the main Hero and
          Impact Hero, tied specifically to "reaching out / getting through". */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center">
        <div className="absolute top-10 w-[600px] h-[500px] rounded-full bg-[#00B4D8]/10 blur-[120px]" />

        <div className="absolute top-16 w-72 h-72">
          {/* Expanding rings, staggered */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border border-[#00B4D8]"
              initial={{ opacity: 0.6, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.4 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
            />
          ))}

          {/* Central transmitter node */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ boxShadow: [
                "0 0 0px rgba(0,180,216,0.4)",
                "0 0 24px rgba(0,180,216,0.6)",
                "0 0 0px rgba(0,180,216,0.4)",
              ] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full bg-[#0D1B2A] border border-[#00B4D8]/50 flex items-center justify-center"
            >
              <Mail size={18} className="text-[#00B4D8]" />
            </motion.div>
          </div>

          {/* Small "message" dots traveling outward along four directions */}
          {[
            { angle: 35, delay: 0 },
            { angle: 145, delay: 0.7 },
            { angle: 230, delay: 1.4 },
            { angle: 320, delay: 2.1 },
          ].map(({ angle, delay }, i) => {
            const rad = (angle * Math.PI) / 180;
            const dx = Math.cos(rad) * 130;
            const dy = Math.sin(rad) * 130;
            return (
              <motion.span
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#00F5FF]"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: dx, y: dy, opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay, ease: "easeOut" }}
              />
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative z-10"
        style={{ marginTop: "5rem" }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
          Get in touch
        </motion.span>

        <h1 className="font-heading font-black text-4xl md:text-6xl text-white mb-4 tracking-tight">
          {heroTitle}
        </h1>

        {heroSubtitle && (
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {heroSubtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}