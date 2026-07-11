import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  title: string;
  text?: string;
  imageUrl?: string;
}

export default function StorySection({ title, text, imageUrl }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Handle line breaks cleanly by splitting narrative updates into structural rows
  const descriptionParagraphs = (text || "").split("\n").filter(p => p.trim() !== "");

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      {/* Subtle background texture — faint dot grid, giving this section
          its own quiet atmosphere distinct from the flat color blocks
          elsewhere, without competing with the content. */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Ambient glow blobs for depth */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-[#00F5FF]/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left Layer — Structural Image CDN Frame/Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Soft glow sitting behind the image frame for depth, rather
              than the frame floating flat against the section background */}
          <div className="absolute -inset-4 rounded-3xl bg-[#00B4D8]/10 blur-2xl pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-[#00B4D8]/15 aspect-[4/3] bg-[#0A0F1E] flex items-center justify-center shadow-2xl">
            {imageUrl && imageUrl.trim() !== "" ? (
              <img 
                src={imageUrl} 
                alt="Our Genesis Story" 
                className="w-full h-full object-cover select-none" 
              />
            ) : (
              <div className="text-center p-8">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center mx-auto mb-4"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.5">
                    <path d="M12 2C12 2 18 8 18 13C18 16.3 15.3 19 12 19C8.7 19 6 16.3 6 13C6 8 12 2 12 2Z"/>
                    <path d="M12 19V22M9 22H15" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                <p className="text-slate-500 text-sm">Story illustration coming soon</p>
              </div>
            )}
            
            {/* Corner accents — now animated, gently pulsing rather than
                static lines, so the frame feels alive at rest */}
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

        {/* Right Layer — Copywriting Context Layout Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="inline-flex items-center text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Our Genesis
          </span>
          
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3 mb-6">
            {title || "Our Story"}
          </h2>
          
          <div className="w-12 h-[2px] bg-gradient-to-r from-[#00B4D8] to-transparent mb-6 rounded-full" />
          
          {/* Narrative Content Rendering with paragraph spacing protection */}
          <div className="space-y-4">
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph, index) => (
                <p key={index} className="text-slate-400 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-slate-400 text-lg leading-relaxed italic">
                Aquaholics was born from a deep concern for aquatic ecosystems and a belief that intelligent technology can solve what humans alone cannot.
              </p>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}