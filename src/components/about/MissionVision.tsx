import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Eye } from "lucide-react";

interface Props {
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
}

export default function MissionVision({ missionTitle, missionText, visionTitle, visionText }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cards = [
    {
      icon: Target,
      label: "Mission",
      title: missionTitle || "Our Mission",
      text: missionText || "To deploy autonomous robots that clean every water body on the planet.",
      color: "#00B4D8",
    },
    {
      icon: Eye,
      label: "Vision",
      title: visionTitle || "Our Vision",
      text: visionText || "A world where every lake, river, and ocean is thriving and plastic-free.",
      color: "#00F5FF",
    },
  ];

  return (
    <section ref={ref} className="relative bg-[#0A0F1E] py-24 px-6 overflow-hidden">
      {/* Ambient glow for depth, consistent with other upgraded sections */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            Purpose
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Mission & Vision
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map(({ icon: Icon, label, title, text, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative p-[1.5px] rounded-2xl overflow-hidden group"
            >
              {/* Rotating glow border, same language used on Contact/Impact/
                  Blog cards — gives these cards the "alive at rest" quality
                  the rest of the site now has, instead of a static border. */}
              <div
                className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0%, ${color} 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />

              <div className="relative bg-[#0D1B2A] rounded-2xl p-8 h-full overflow-hidden transition-all duration-300">
                {/* Radial hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}14, transparent 70%)` }}
                />

                {/* Icon box now gently pulses and lifts slightly on hover */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 24px ${color}20` }}
                >
                  <Icon size={24} style={{ color }} />
                </motion.div>

                <span className="relative inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                  {label}
                </span>
                <h3 className="relative font-heading font-bold text-2xl text-white mb-4">{title}</h3>
                <p className="relative text-slate-400 leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}