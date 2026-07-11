// src/components/blogPost/ReadingProgress.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[90] bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-[#00B4D8] to-[#00F5FF]"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 12px rgba(0,245,255,0.6)",
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}