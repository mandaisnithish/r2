// src/components/blogPost/PostHeader.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import type { Blog } from "../../types/blog";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PostHeader({ blog }: { blog: Blog }) {
  return (
    <div className="relative">
      {/* Ambient glow behind the header, giving the opening of the
          article some real visual presence instead of plain text on
          flat background. */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#00B4D8]/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 no-underline transition-colors"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>

        {blog.category && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B4D8] uppercase tracking-wide mb-5 bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
              {blog.category}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-heading font-black text-4xl md:text-6xl text-white mb-6 leading-[1.05] tracking-tight"
        >
          {blog.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 text-slate-500 text-sm pb-8 border-b border-white/5"
        >
          <span className="font-medium text-slate-300">{blog.author || "Aquaholics Team"}</span>
          {blog.publishedAt && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>{formatDate(blog.publishedAt)}</span>
            </>
          )}
          {blog.readTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-1">
                <Clock size={12} /> {blog.readTime} min read
              </span>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}