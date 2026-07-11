// src/components/product/UseCases.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ProductUseCase } from "../../types/product";

interface Props {
  useCases: ProductUseCase[];
}

export default function UseCases({ useCases }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sorted = [...useCases].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      {/* Ambient glow, consistent with every other section */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00F5FF]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-6xl mx-auto"
      >
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Use Cases
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Where it works best
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((useCase, i) => {
            const offset = (i % 5) * 0.4;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-[1.5px] rounded-2xl overflow-hidden group"
              >
                {/* Rotating glow border, matching Values/Features card language */}
                <div
                  className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
                    animationDelay: `${offset}s`,
                  }}
                />

                <div className="relative bg-[#0A0F1E] rounded-2xl overflow-hidden h-full transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-video bg-[#0A0F1E] flex items-center justify-center overflow-hidden">
                    {useCase.imageUrl ? (
                      <>
                        <img
                          src={useCase.imageUrl}
                          alt={useCase.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent opacity-60 pointer-events-none" />
                      </>
                    ) : (
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: offset,
                        }}
                      >
                        <i
                          className={`ti ${useCase.icon || "ti-droplet"} text-5xl text-[#00B4D8]/40`}
                        />
                      </motion.div>
                    )}
                  </div>
                  <div className="relative p-6">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, rgba(0,180,216,0.08), transparent 70%)",
                      }}
                    />
                    <h3 className="relative font-heading font-semibold text-white text-lg mb-2">
                      {useCase.title}
                    </h3>
                    <p className="relative text-slate-400 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}