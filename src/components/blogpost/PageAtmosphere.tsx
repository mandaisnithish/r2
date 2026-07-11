// src/components/blogPost/PageAtmosphere.tsx
import { motion } from "framer-motion";

/**
 * Fixed background layer providing ambient stars + drifting particles for
 * the entire BlogPost page, not just the header — ties this page into the
 * same visual language as Home/Impact/Contact heroes instead of going flat
 * black the moment you scroll past the title.
 */
export default function PageAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#00B4D8]/6 blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#00F5FF]/5 blur-[140px]" />

      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() > 0.7 ? "2px" : "1px",
            height: Math.random() > 0.7 ? "2px" : "1px",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
          }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}