// src/components/product/ProductInfo.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  name: string;
  tagline?: string;
  description: string;
  coverImageUrl?: string;
}

export default function ProductInfo({ name, tagline, description, coverImageUrl }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      {/* Dot-grid texture, matching StorySection / Why We Exist treatment */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Ambient glow blobs, consistent with every other section */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#00F5FF]/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Icon badge with glow ring, matching "Why We Exist" treatment */}
          {/* <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(0,180,216,0.3)", "0 0 20px rgba(0,180,216,0.5)", "0 0 0px rgba(0,180,216,0.3)"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-center justify-center mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B4D8]" />
          </motion.div> */}

          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Product Overview
          </span>

          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3 mb-4">
            {name}
          </h2>

          <div className="w-12 h-[2px] bg-gradient-to-r from-[#00B4D8] to-transparent mb-6 rounded-full" />

          {tagline && (
            <p className="text-[#00B4D8] text-sm font-medium tracking-wide uppercase mb-4">
              {tagline}
            </p>
          )}

          <p className="text-slate-400 text-lg leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-[#00B4D8]/10 blur-2xl pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-[#00B4D8]/15 aspect-[4/3] bg-[#0A0F1E] flex items-center justify-center shadow-2xl">
            {coverImageUrl && coverImageUrl.trim() !== "" ? (
              <img
                src={coverImageUrl}
                alt={name}
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="text-center p-8">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center mx-auto mb-4"
                >
                  <i className="ti ti-robot text-3xl text-[#00B4D8]" />
                </motion.div>
                <p className="text-slate-500 text-sm">Product image coming soon</p>
              </div>
            )}

            {/* Animated corner accents */}
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#00B4D8] rounded-tl-2xl pointer-events-none"
            />
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#00B4D8] rounded-br-2xl pointer-events-none"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}