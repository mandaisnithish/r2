import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title?: string;
  buttonText?: string;
}

export default function AboutCTA({ title, buttonText }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#0A0F1E] py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        {/* Rotating glow border, same language closing out the page as
            every other upgraded section now uses */}
        <div className="relative p-[1.5px] rounded-3xl overflow-hidden">
          <div
            className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-60"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
            }}
          />

          <div className="relative bg-[#0D1B2A] rounded-3xl px-8 py-16 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#00B4D8]/10 blur-[80px]" />
            </div>

            {/* Drifting particles rising inside the card, same bubble
                motif used across the loader, hero, and other sections —
                gives this final card a sense of life rather than sitting
                static as the page's last moment. */}
            {[
              { left: "15%", delay: 0, size: 3 },
              { left: "30%", delay: 1.2, size: 4 },
              { left: "70%", delay: 0.6, size: 3 },
              { left: "85%", delay: 2, size: 4 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[#00B4D8]/30 pointer-events-none"
                style={{ left: p.left, width: p.size, height: p.size, bottom: "8%" }}
                animate={{ y: [0, -280], opacity: [0, 0.8, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeIn" }}
              />
            ))}

            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4 relative z-10">
              {title || "Want to Work With Us?"}
            </h2>

            <p className="text-slate-400 mb-8 relative z-10">
              Partner with us, invest in the mission, or join the team.
            </p>

            {/* Button now carries a continuous breathing glow, matching
                every other primary CTA button across the site */}
            <motion.div
              className="relative z-10 inline-block"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(0,180,216,0.4)",
                  "0 0 28px rgba(0,180,216,0.55)",
                  "0 0 0px rgba(0,180,216,0.4)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ borderRadius: "0.75rem" }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base no-underline hover:scale-[1.02]"
              >
                {buttonText || "Get in Touch"} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}