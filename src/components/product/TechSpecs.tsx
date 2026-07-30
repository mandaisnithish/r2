// src/components/product/TechSpecs.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ProductSpec } from "../../types/product";

interface Props {
  specs: ProductSpec[];
}

export default function TechSpecs({ specs }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // group by category, "General" if none set
  const grouped = specs.reduce<Record<string, ProductSpec[]>>((acc, spec) => {
    const key = spec.category || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(spec);
    return acc;
  }, {});

  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  );

  return (
    <section ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      {/* Ambient glow, consistent with every other section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Tech Specs
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Under the hood
          </h2>
        </div>

        {/* Rotating glow border wrapping the whole table, matching the
            site-wide card language used elsewhere */}
        <div className="relative p-[1.5px] rounded-2xl overflow-hidden">
          <div
            className="absolute inset-[-50%] animate-[spin_10s_linear_infinite] opacity-40"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
            }}
          />

          <div className="relative bg-[#0D1B2A] rounded-2xl overflow-hidden shadow-2xl">
            {Object.entries(grouped).map(([category, rows], gi) => (
              <div key={category}>
                <div
                  className={`relative px-6 py-3 flex items-center gap-2 text-[#00B4D8] text-xs font-semibold tracking-widest uppercase bg-[#00B4D8]/[0.08] ${
                    gi > 0 ? "border-t border-[#00B4D8]/10" : ""
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
                  {category}
                </div>
                {rows.map((row, ri) => (
                  <motion.div
                    key={ri}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 * ri }}
                    className="group relative px-6 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-6 border-t border-white/5 transition-colors duration-300 hover:bg-[#00B4D8]/[0.04]"
                  >
                    {/* Left accent bar that appears on hover */}
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00B4D8] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                    <div className="min-w-0 sm:flex-1">
                      <div className="text-slate-300 text-sm">{row.label}</div>
                      {row.description && (
                        <div className="text-slate-500 text-xs mt-1">
                          {row.description}
                        </div>
                      )}
                    </div>
                    <div className="text-white text-sm font-semibold tracking-wide break-words sm:whitespace-nowrap sm:text-right sm:flex-shrink-0">
                      {row.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}