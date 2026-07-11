// src/components/product/HowItWorks.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductStep } from "../../types/product";

interface Props {
  steps: ProductStep[];
}

// Fallback icon if the stored name doesn't match a Lucide export
const FallbackIcon = LucideIcons.Circle;

function getIcon(name?: string): LucideIcon {
  if (!name) return FallbackIcon;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? FallbackIcon;
}

export default function HowItWorks({ steps }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <section ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-[#00F5FF]/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            How It Works
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            From deploy to clean
          </h2>
        </div>

        <div className="relative grid sm:grid-cols-3 gap-10">
          <div className="hidden sm:block absolute top-7 left-[16.5%] right-[16.5%] h-px bg-[#00B4D8]/15 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#00B4D8] via-[#00F5FF] to-[#00B4D8] origin-left"
            />
          </div>

          {sorted.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="relative w-14 h-14 mx-auto mb-5">
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 22px rgba(0,180,216,0.5)" }}
                  />
                  <div className="relative w-14 h-14 rounded-full bg-[#0D1B2A] border-2 border-[#00B4D8] flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 group-hover:border-[#00F5FF]">
                    <Icon className="w-6 h-6 text-[#00B4D8]" strokeWidth={2} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#00B4D8] text-[#0A0F1E] text-[11px] font-black flex items-center justify-center z-20 shadow-[0_0_10px_rgba(0,180,216,0.6)]">
                    {step.stepNumber}
                  </div>
                </div>

                <div className="text-[#00B4D8] text-xs font-semibold tracking-widest uppercase mb-2">
                  Step {step.stepNumber}
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}