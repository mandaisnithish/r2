// src/pages/Blog.tsx
import { useEffect, useState } from "react";
import { getPublishedBlogs } from "../api/blogApi";
import type { Blog } from "../types/blog";

import BlogHero from "../components/blog/BlogHero";
import BlogGrid from "../components/blog/BlogGrid";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getPublishedBlogs();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Newest first, but no post is singled out as "featured" — every post
  // gets identical card treatment in one grid, regardless of how many
  // exist.
  const sorted = [...blogs].sort(
    (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
  );

  return (
    <div className="bg-[#0A0F1E] min-h-screen">
      <BlogHero />

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <BlogGrid posts={sorted} loading={loading} error={error} totalBlogCount={blogs.length} />
      </section>
    </div>
  );
}