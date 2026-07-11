import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Droplets } from "lucide-react";

interface Props {
  title?: string;
  text?: string;
}

export default function WhyWeExist({ title, text }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const paragraphs = (text || "").split("\n").filter(p => p.trim() !== "");

  return (
    <section ref={ref} className="bg-[#0D1B2A] py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/5 blur-[100px] pointer-events-none" />

      {/* Drifting bubbles either side of the centered content, filling
          what was empty space and tying back to the water motif used
          across the rest of the site (loader, hero, contact). */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "8%", size: 4, delay: 0, dur: 6 },
          { left: "14%", size: 6, delay: 1.4, dur: 7.5 },
          { left: "5%", size: 3, delay: 2.6, dur: 5.5 },
          { left: "92%", size: 5, delay: 0.6, dur: 6.8 },
          { left: "86%", size: 4, delay: 2, dur: 7 },
          { left: "95%", size: 3, delay: 3.2, dur: 5.8 },
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

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icon now sits inside a glowing ring with a breathing pulse,
            and the droplet itself bobs gently, instead of sitting static */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative w-16 h-16 mx-auto mb-8"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: "0 0 30px rgba(0,180,216,0.5)" }}
          />
          <div className="relative w-16 h-16 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/25 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Droplets size={28} className="text-[#00B4D8]" />
            </motion.div>
          </div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase"
        >
          Why We Exist
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-6"
        >
          {title || "Why We Exist"}
        </motion.h2>

        {/* Divider now fades out instead of being a flat solid bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-[2px] mx-auto mb-8 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #00B4D8, transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4 max-w-2xl mx-auto"
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="text-slate-400 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-slate-400 text-lg leading-relaxed">
              We exist because the world's water bodies are in crisis — and no one else is building the right tools to fix it at scale.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}