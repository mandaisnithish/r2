// src/components/blog/BlogGrid.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
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

interface Props {
  posts: Blog[];
  loading: boolean;
  error: boolean;
  totalBlogCount: number;
}

function Card({ blog, big, offset }: { blog: Blog; big: boolean; offset: number }) {
  return (
    <GlowCard className="h-full" delay={offset}>
      <Link
        to={`/blog/${blog.slug}`}
        className={`relative flex h-full overflow-hidden no-underline group ${
          big ? "flex-col md:flex-row" : "flex-col"
        }`}
      >
        <motion.div
          className="absolute top-3 right-3 z-20 text-cyan-300/60"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: offset }}
        >
          <Sparkles size={big ? 18 : 15} />
        </motion.div>

        <div
          className={`relative bg-[#0A0F1E] overflow-hidden ${
            big ? "aspect-video md:aspect-auto md:w-1/2" : "aspect-video"
          }`}
        >
          {blog.coverImageUrl ? (
            <img
              src={blog.coverImageUrl}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="ti ti-article text-4xl text-[#00B4D8]/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        <div className={`relative flex-1 flex flex-col ${big ? "p-8 md:p-10 justify-center md:justify-start md:py-12" : "p-6"}`}>
          <div
            className="absolute -top-10 -right-10 rounded-full bg-[#00B4D8]/10 blur-[70px] pointer-events-none"
            style={{ width: big ? "12rem" : "9rem", height: big ? "12rem" : "9rem" }}
          />

          {blog.category && (
            <span
              className={`relative z-10 inline-flex items-center gap-2 font-bold uppercase tracking-wide mb-3 w-fit px-3 py-1 rounded-full bg-[#00F5FF]/15 text-[#00F5FF] ${
                big ? "text-xs" : "text-[11px]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
              {blog.category}
            </span>
          )}

          <h2
            className={`relative z-10 font-heading font-black text-white leading-[1.05] tracking-tight mb-3 ${
              big ? "text-3xl md:text-5xl" : "text-xl"
            }`}
          >
            {blog.title}
          </h2>

          {blog.excerpt && (
            <p
              className={`relative z-10 text-slate-400 leading-relaxed mb-5 ${
                big ? "text-base max-w-md line-clamp-3" : "text-sm line-clamp-2"
              }`}
            >
              {blog.excerpt}
            </p>
          )}

          <div className="relative z-10 flex items-center gap-3 text-xs text-slate-500 mb-5">
            <span>{blog.author || "Aquaholics Team"}</span>
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
                  <Clock size={12} /> {blog.readTime} min
                </span>
              </>
            )}
          </div>

          <motion.span
            animate={{
              boxShadow: [
                "0 0 0px rgba(0,245,255,0.3)",
                `0 0 ${big ? 28 : 16}px rgba(0,245,255,0.5)`,
                "0 0 0px rgba(0,245,255,0.3)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: offset }}
            className={`relative z-10 inline-flex items-center gap-2 bg-[#00F5FF] text-[#06121f] font-bold rounded-full transition-all duration-300 group-hover:gap-3 w-fit ${
              big ? "text-sm px-6 py-3 mt-2" : "text-xs px-4 py-2 mt-1"
            }`}
          >
            Read post <ArrowRight size={big ? 16 : 13} />
          </motion.span>
        </div>
      </Link>
    </GlowCard>
  );
}

export default function BlogGrid({ posts, loading, error, totalBlogCount }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-slate-500 text-sm py-20">
        Couldn't load blog posts right now. Please try again later.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-slate-500 text-sm py-20">
        {totalBlogCount === 0
          ? "No posts published yet — check back soon."
          : "No posts in this category yet."}
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {posts.map((blog, i) => {
        const offset = (i % 5) * 0.4;
        // Every 5th post (starting with the very first) spans the full
        // width and gets the bigger treatment — breaks up the grid's
        // rhythm instead of an unbroken wall of identical rectangles.
        const big = i % 5 === 0;

        return (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={big ? "sm:col-span-2 lg:col-span-3" : ""}
          >
            <Card blog={blog} big={big} offset={offset} />
          </motion.div>
        );
      })}
    </div>
  );
}