// src/components/product/ProductGallery.tsx
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Package, ZoomIn } from "lucide-react";
import type { ProductImage } from "../../types/product";

interface Props {
  name: string;
  images: ProductImage[];
  fallbackImageUrl?: string;
}

export default function ProductGallery({ name, images, fallbackImageUrl }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const gallery =
    images.length > 0
      ? images
      : fallbackImageUrl
      ? [{ imageUrl: fallbackImageUrl, caption: name }]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const active = gallery[activeIndex];

  const goTo = (i: number) => {
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
  };

  return (
    <section id="showcase" ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      {/* Ambient glow, consistent with every other section */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#00F5FF]/5 blur-[100px] pointer-events-none" />
      {/* Faint dot grid, same texture language as StorySection */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
          Take A Look
        </span>
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
          Product Showcase
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Rotating glow border wrapping the whole frame, matching the
            site-wide card language used on About/Team/Values */}
        <div className="relative p-[1.5px] rounded-2xl overflow-hidden group">
          <div
            className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50 pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
            }}
          />

          <div className="relative aspect-[16/9] rounded-2xl bg-[#0D1B2A] flex items-center justify-center overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              {active ? (
                <motion.img
                  key={activeIndex}
                  src={active.imageUrl}
                  alt={active.caption || name}
                  custom={direction}
                  initial={{ opacity: 0, scale: 1.04, x: direction * 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: direction * -24 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center"
                >
                  <Package size={32} className="text-[#00B4D8]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover scrim + zoom affordance */}
            {active && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end justify-end p-4">
                <div className="w-9 h-9 rounded-full bg-[#0A0F1E]/80 border border-[#00B4D8]/30 flex items-center justify-center">
                  <ZoomIn size={15} className="text-[#00B4D8]" />
                </div>
              </div>
            )}

            {/* Corner accents matching StorySection */}
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#00B4D8] rounded-tl-2xl pointer-events-none"
            />
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#00B4D8] rounded-br-2xl pointer-events-none"
            />

            {/* Image position indicator, top-right */}
            {gallery.length > 1 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0A0F1E]/70 border border-[#00B4D8]/20 text-[10px] font-semibold tracking-wider text-[#00B4D8]">
                {activeIndex + 1} / {gallery.length}
              </div>
            )}
          </div>
        </div>

        {active?.caption && (
          <motion.p
            key={`caption-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-slate-400 text-sm text-center mt-5 mb-2"
          >
            {active.caption}
          </motion.p>
        )}

        {gallery.length > 1 && (
          <div className="flex gap-4 flex-wrap justify-center mt-8">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={img.caption || `View ${i + 1}`}
                aria-current={i === activeIndex}
                className={`relative w-24 h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
                  i === activeIndex
                    ? "border-[#00B4D8] shadow-[0_0_16px_rgba(0,180,216,0.45)] -translate-y-1"
                    : "border-[#00B4D8]/15 opacity-50 hover:opacity-100 hover:border-[#00B4D8]/40 hover:-translate-y-0.5"
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || `view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === activeIndex ? (
                  <div className="absolute inset-0 bg-[#00B4D8]/10 pointer-events-none" />
                ) : (
                  <div className="absolute inset-0 bg-[#0A0F1E]/40 pointer-events-none" />
                )}
                {i === activeIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B4D8]" />
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}