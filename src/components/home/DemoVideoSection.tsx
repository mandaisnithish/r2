import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";

interface Props {
  videoUrl: string;
  videoTitle: string;
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function DemoVideoSection({ videoUrl, videoTitle }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      {/* Bigger, dual ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full bg-[#00B4D8]/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] rounded-full bg-[#00F5FF]/6 blur-[110px] pointer-events-none" />

      {/* Drifting bubbles either side, matching WhyWeExist */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "6%", size: 4, delay: 0, dur: 6.5 },
          { left: "12%", size: 6, delay: 1.6, dur: 7.5 },
          { left: "3%", size: 3, delay: 3, dur: 5.5 },
          { left: "94%", size: 5, delay: 0.8, dur: 7 },
          { left: "88%", size: 4, delay: 2.2, dur: 6.2 },
        ].map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#00B4D8]/30"
            style={{ left: b.left, width: b.size, height: b.size, bottom: "5%" }}
            animate={{ y: [0, -420], opacity: [0, 0.7, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: "easeIn" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
       <motion.span
  initial={{ opacity: 0 }}
  animate={inView ? { opacity: 1 } : {}}
  transition={{ duration: 0.4 }}
  className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase"
>
  See It In Action
</motion.span>

        <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-4 mb-10">
          {videoTitle || "See The Solution Come To Life"}
        </h2>

        {videoUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative p-[1.5px] rounded-3xl overflow-hidden"
          >
            {/* Rotating conic-gradient glow border, same language as
                every card/CTA on the site */}
            <div
              className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-60"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
              }}
            />

            <div className="relative aspect-video rounded-[calc(1.5rem-1.5px)] overflow-hidden bg-[#0A0F1E] shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(videoUrl)}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full relative z-10"
              />
            </div>
          </motion.div>
        ) : (
          <div className="relative p-[1.5px] rounded-3xl overflow-hidden">
            <div
              className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-30"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
              }}
            />
            <div className="relative aspect-video rounded-[calc(1.5rem-1.5px)] bg-[#0A0F1E] flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], boxShadow: [
                    "0 0 0px rgba(0,180,216,0.3)",
                    "0 0 30px rgba(0,180,216,0.5)",
                    "0 0 0px rgba(0,180,216,0.3)",
                  ] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center mx-auto mb-4"
                >
                  <Play size={24} className="text-[#00B4D8] ml-0.5" />
                </motion.div>
                <p className="text-slate-500 text-sm">
                  Demo video will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}