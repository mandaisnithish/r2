import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  title: string;
  text: string;
  imageUrl?: string;
}

export default function SolutionSection({ title, text, imageUrl }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      {/* Ambient glow for depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00B4D8]/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00F5FF]/6 blur-[120px] pointer-events-none" />

      {/* Rising particles, friendly upward bubbles since this section is
          showcasing the solution, not the problem */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "10%", delay: 0, dur: 7 },
          { left: "92%", delay: 2.2, dur: 8 },
          { left: "5%", delay: 4, dur: 6.5 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#00B4D8]/30"
            style={{ left: p.left, width: 4, height: 4, bottom: "5%" }}
            animate={{ y: [0, -420], opacity: [0, 0.7, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeIn" }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left — Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Our Solution
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-white mt-3 mb-6 leading-[1.1] tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-[2px] mb-6 rounded-full" style={{ background: "linear-gradient(90deg, #00B4D8, transparent)" }} />
          <p className="text-slate-400 text-lg leading-relaxed">
            {text}
          </p>
        </motion.div>

        {/* Right — Image Container */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Soft glow sitting behind the frame for depth */}
          <div className="absolute -inset-6 rounded-3xl bg-[#00B4D8]/15 blur-3xl pointer-events-none" />

          {/* Rotating glow border, matching the site-wide card language */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden group">
            <div
              className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-60"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
              }}
            />

            <div className="relative bg-[#0D1B2A] rounded-2xl p-3 overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900/50">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={title || "Solution Graphic"}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Subtle gradient wash at the bottom, ties the image
                        edge into the frame rather than a hard cut */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0D1B2A]/60 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="w-full h-full bg-[#0A0F1E]/50 animate-pulse flex items-center justify-center text-slate-600 text-xs">
                    Loading asset matrix...
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}