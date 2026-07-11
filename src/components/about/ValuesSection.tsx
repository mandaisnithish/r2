import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield, Leaf, Zap, Heart, Globe, Star,
  Lightbulb, Users, Award, type LucideIcon
} from "lucide-react";
import type { Value } from "../../types";

interface Props {
  values: Value[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  "lucide-shield": Shield,
  "lucide-shield-check": Shield,
  "lucide-leaf": Leaf,
  "lucide-zap": Zap,
  "lucide-heart": Heart,
  "lucide-globe": Globe,
  "lucide-star": Star,
  "lucide-lightbulb": Lightbulb,
  "lucide-users": Users,
  "lucide-award": Award,
};

const FALLBACK_ICONS: LucideIcon[] = [Lightbulb, Leaf, Zap, Heart, Globe, Shield];

const FALLBACK_VALUES: Value[] = [
  { id: 1, title: "Innovation", description: "We push boundaries with cutting-edge autonomous robotics.", icon: "lucide-lightbulb", displayOrder: 1 },
  { id: 2, title: "Sustainability", description: "Every decision we make is guided by environmental impact.", icon: "lucide-leaf", displayOrder: 2 },
  { id: 3, title: "Impact", description: "We measure success by the health of our water bodies.", icon: "lucide-globe", displayOrder: 3 },
  { id: 4, title: "Excellence", description: "We hold ourselves to the highest engineering standards.", icon: "lucide-award", displayOrder: 4 },
];

export default function ValuesSection({ values }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const data = values && values.length > 0
    ? [...values].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : FALLBACK_VALUES;

  // FIX: grid column count now responds to the actual number of items
  // instead of a fixed 4-column layout. With 3 values that left an
  // awkward empty gap in the 4th slot — this picks the cleanest column
  // count for the real count instead.
  const count = data.length;
  const gridClass =
    count === 1 ? "sm:grid-cols-1 max-w-sm mx-auto" :
    count === 2 ? "sm:grid-cols-2 max-w-2xl mx-auto" :
    count === 3 ? "sm:grid-cols-3 max-w-4xl mx-auto" :
    "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            What We Stand For
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Our Values
          </h2>
        </motion.div>

        <div className={`grid gap-5 ${gridClass}`}>
          {data.map((value, i) => {
            const IconComponent = ((value.icon && ICON_MAP[value.icon]) ?? FALLBACK_ICONS[i % FALLBACK_ICONS.length]) as LucideIcon;
            const offset = (i % 5) * 0.4;

            return (
              <motion.div
                key={value.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-[1.5px] rounded-2xl overflow-hidden group"
              >
                {/* Rotating glow border, matching Mission & Vision and the
                    rest of the site's now-established card language */}
                <div
                  className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
                    animationDelay: `${offset}s`,
                  }}
                />

                <div className="relative bg-[#0D1B2A] rounded-2xl p-6 h-full flex flex-col justify-between overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,180,216,0.08), transparent 70%)" }}
                  />

                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: offset }}
                      className="w-12 h-12 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/25 flex items-center justify-center mb-5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      style={{ boxShadow: "0 0 18px rgba(0,180,216,0.15)" }}
                    >
                      <IconComponent size={20} className="text-[#00B4D8]" />
                    </motion.div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">{value.title || "Core Value"}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}