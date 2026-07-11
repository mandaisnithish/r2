// src/components/product/ProductFeatures.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductFeature } from "../../types/product";

interface Props {
  features: ProductFeature[];
}

const FallbackIcon = LucideIcons.CircleCheck;

function getIcon(name?: string): LucideIcon {
  if (!name) return FallbackIcon;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? FallbackIcon;
}

export default function ProductFeatures({ features }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sorted = [...features].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-6xl mx-auto"
      >
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Key Features
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Built for the job
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map((feature, i) => {
            const offset = (i % 5) * 0.4;
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-[1.5px] rounded-2xl overflow-hidden group"
              >
                <div
                  className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
                    animationDelay: `${offset}s`,
                  }}
                />

                <div className="relative bg-[#0A0F1E] rounded-2xl p-6 h-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(0,180,216,0.1), transparent 70%)",
                    }}
                  />

                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: offset,
                    }}
                    className="relative w-12 h-12 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/25 flex items-center justify-center mb-5"
                    style={{ boxShadow: "0 0 18px rgba(0,180,216,0.15)" }}
                  >
                    <Icon className="w-5 h-5 text-[#00B4D8]" strokeWidth={2} />
                  </motion.div>

                  <h3 className="relative font-heading font-semibold text-white text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="relative text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}