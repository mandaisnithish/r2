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

        {/* Left — Text. order-1 md:order-1 keeps text first on mobile,
            matching the "text above image" pattern used across the site. */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="order-1 md:order-1"
        >
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

        {/* Right — Image. Same rotating conic-gradient glow border frame
            used in StorySection, so image treatment is consistent across
            the whole site. order-2 md:order-2 keeps image below text on
            mobile, side-by-side on md+. */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative order-2 md:order-2"
        >
          {/* Soft glow sitting behind the frame for depth */}
          <div className="absolute -inset-6 rounded-3xl bg-[#00B4D8]/15 blur-3xl pointer-events-none" />

          {/* Rotating glow border */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden group">
            <div
              className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-60"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
              }}
            />

            <div className="relative bg-[#0A0F1E] rounded-2xl p-3 overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#0A0F1E] flex items-center justify-center">
                {coverImageUrl && coverImageUrl.trim() !== "" ? (
                  <>
                    <img
                      src={coverImageUrl}
                      alt={name}
                      className="w-full h-full object-cover select-none transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Subtle gradient wash at the bottom, ties the image
                        edge into the frame rather than a hard cut */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0F1E]/60 to-transparent pointer-events-none" />
                  </>
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
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}