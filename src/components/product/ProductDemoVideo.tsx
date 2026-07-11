// src/components/product/ProductDemoVideo.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";

interface Props {
  videoUrl?: string;
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function ProductDemoVideo({ videoUrl }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      {/* Ambient glow, consistent with every other section */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
          See It In Action
        </span>
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3 mb-10">
          Watch AquaBot work
        </h2>

        {/* Rotating glow border wrapping the whole frame, matching the
            site-wide card language used on About/Product Gallery */}
        <div className="relative p-[1.5px] rounded-2xl overflow-hidden group">
          <div
            className="absolute inset-[-50%] animate-[spin_10s_linear_infinite] opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
            }}
          />

          {videoUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0A0F1E] shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                title="Product demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full relative z-10"
              />

              {/* Corner accents matching StorySection / ProductGallery */}
              <motion.div
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#00B4D8] rounded-tl-2xl pointer-events-none z-20"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#00B4D8] rounded-br-2xl pointer-events-none z-20"
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl bg-[#0A0F1E] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,180,216,0.1), transparent 70%)" }}
              />
              <div className="relative text-center">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center mx-auto mb-4"
                  style={{ boxShadow: "0 0 24px rgba(0,180,216,0.2)" }}
                >
                  <Play size={24} className="text-[#00B4D8] ml-0.5" />
                </motion.div>
                <p className="text-slate-500 text-sm">
                  Demo video will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}