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

        {/* Left Layer — Image frame, same rotating conic-gradient glow
            border language used on Solution/Product sections, so all
            image treatments across the site feel consistent.
            order-2 md:order-1: on mobile the image sits BELOW the text
            (matching ProblemSection's mobile behavior); on md+ it moves
            back to the left column. */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative order-2 md:order-1"
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
                {imageUrl && imageUrl.trim() !== "" ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Our Genesis Story"
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
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.5">
                        <path d="M12 2C12 2 18 8 18 13C18 16.3 15.3 19 12 19C8.7 19 6 16.3 6 13C6 8 12 2 12 2Z"/>
                        <path d="M12 19V22M9 22H15" strokeLinecap="round"/>
                      </svg>
                    </motion.div>
                    <p className="text-slate-500 text-sm">Story illustration coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Layer — Copywriting Context Layout Panel.
            order-1 md:order-2: on mobile the text sits ABOVE the image;
            on md+ it moves back to the right column. */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="order-1 md:order-2"
        >
          <span className="inline-flex items-center text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Our Story
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