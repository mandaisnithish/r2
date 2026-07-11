// src/components/blog/FeaturedPost.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import type { Blog } from "../../types/blog";
import GlowCard from "../common/GlowCard";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FeaturedPost({
  post,
  showLatestBadge = true,
}: {
  post: Blog;
  showLatestBadge?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <GlowCard>
        <Link to={`/blog/${post.slug}`} className="relative grid md:grid-cols-2 no-underline group min-h-[420px]">
          <motion.div
            className="absolute top-4 right-4 z-20 text-cyan-300/60"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          >
            <Sparkles size={18} />
          </motion.div>

          {/* Image side — gradient fade on the right edge blends it
              directly into the panel color instead of a hard seam.
              On mobile (stacked layout) the fade runs along the bottom
              instead, since the panels stack vertically there. */}
          <div className="relative aspect-video md:aspect-auto md:h-full bg-[#0A0F1E] overflow-hidden">
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[220px]">
                <i className="ti ti-article text-5xl text-[#00B4D8]/30" />
              </div>
            )}
            {/* Fade blending image into panel: vertical fade on mobile,
                horizontal fade into the right panel on desktop */}
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-[#0D1B2A] md:to-[#0D1B2A]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent md:hidden" />
          </div>

          {/* Content side */}
          <div className="relative p-8 md:p-10 flex flex-col justify-center">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#00B4D8]/10 blur-[80px] pointer-events-none" />

            {/* Large faint "01" — a focal anchor that gives the eye
                somewhere confident to land, echoing editorial magazine
                layouts rather than a generic card template. */}
            <span
              className="absolute top-4 left-6 md:left-8 text-7xl md:text-8xl font-black select-none pointer-events-none"
              style={{ color: "rgba(0,180,216,0.08)" }}
            >
              01
            </span>

            <div className="relative z-10">
              {showLatestBadge && (
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00B4D8] uppercase bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-full px-3 py-1 mb-4 w-fit">
                  Latest post
                </span>
              )}

              {post.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B4D8] uppercase tracking-wide mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
                  {post.category}
                </span>
              )}

              <h2 className="font-heading font-black text-3xl md:text-4xl text-white mb-4 leading-[1.05] tracking-tight">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-slate-400 text-base leading-relaxed mb-6 line-clamp-3 max-w-md">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                <span>{post.author || "Aquaholics Team"}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{formatDate(post.publishedAt)}</span>
                {post.readTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime} min
                    </span>
                  </>
                )}
              </div>

              <span className="inline-flex items-center gap-2 bg-[#00B4D8] group-hover:bg-[#00F5FF] text-[#0A0F1E] text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-300 group-hover:gap-3 w-fit">
                Read post <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </Link>
      </GlowCard>
    </motion.div>
  );
}