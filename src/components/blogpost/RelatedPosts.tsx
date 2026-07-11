// src/components/blogPost/RelatedPosts.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getPublishedBlogs } from "../../api/blogApi";
import type { Blog } from "../../types/blog";

export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const [posts, setPosts] = useState<Blog[]>([]);

  useEffect(() => {
    getPublishedBlogs()
      .then((all) => {
        const others = all.filter((b) => b.slug !== currentSlug).slice(0, 3);
        setPosts(others);
      })
      .catch(() => setPosts([]));
  }, [currentSlug]);

  if (posts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 pt-12 border-t border-white/10"
    >
      <h3 className="font-heading font-bold text-xl text-white mb-6">
        Keep reading
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group block rounded-xl border border-[#00B4D8]/15 hover:border-[#00B4D8]/40 bg-[#0D1B2A] overflow-hidden no-underline transition-colors"
          >
            <div className="aspect-video bg-[#0A0F1E] overflow-hidden">
              {post.coverImageUrl ? (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="ti ti-article text-3xl text-[#00B4D8]/30" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-white font-semibold text-sm mb-1.5 line-clamp-2 leading-snug">
                {post.title}
              </h4>
              <span className="inline-flex items-center gap-1 text-[#00B4D8] text-xs font-medium group-hover:gap-1.5 transition-all">
                Read <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}