// src/components/product/ProductCTA.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  ctaTitle?: string;
  ctaButtonText?: string;
}

export default function ProductCTA({ ctaTitle, ctaButtonText }: Props) {
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
        {/* Rotating glow border, matching CTASection / AboutCTA */}
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

            {/* Drifting particles, same as other CTAs */}
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
              {ctaTitle || "Interested in AquaBot?"}
            </h2>
            <p className="text-slate-400 mb-8 relative z-10">
              Let’s Change the Way We Clean Water.
            </p>

            {/* Breathing glow on button, matching other CTAs */}
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
                className="inline-flex items-center gap-2 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg no-underline hover:scale-[1.02]"
              >
                {ctaButtonText || "Contact Us"} <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}