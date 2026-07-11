// src/components/blogPost/PostCoverImage.tsx
import { motion } from "framer-motion";

export default function PostCoverImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden border border-[#00B4D8]/15 mb-10 mt-8 shadow-2xl"
    >
      <img src={src} alt={alt} className="w-full h-auto" />
      {/* Subtle vignette for depth, ties the image into the dark page
          background instead of sitting as a flat inserted rectangle */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_20px_rgba(10,15,30,0.4)] pointer-events-none" />
    </motion.div>
  );
}