// src/pages/BlogPost.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { getBlogBySlug } from "../api/blogApi";
import type { Blog } from "../types/blog";

import PageAtmosphere from "../components/blogpost/PageAtmosphere";
import ReadingProgress from "../components/blogpost/ReadingProgress";
import PostHeader from "../components/blogpost/PostHeader";
import PostCoverImage from "../components/blogpost/PostCoverImage";
import PostContent from "../components/blogpost/PostContent";
import PostTags from "../components/blogpost/PostTags";
import RelatedPosts from "../components/blogpost/RelatedPosts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog post", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <div className="w-10 h-10 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1E] px-6 text-center">
        <AlertCircle size={32} className="text-slate-600 mb-4" />
        <h1 className="font-heading font-semibold text-white text-xl mb-2">
          Post not found
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          This post may have been removed or unpublished.
        </p>
        <Link
          to="/blog"
          className="text-[#00B4D8] text-sm font-medium hover:underline no-underline"
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0A0F1E] min-h-screen">
      <PageAtmosphere />
      <ReadingProgress />
      <article className="relative z-10 max-w-[680px] mx-auto px-6 pt-32 pb-24">
        <PostHeader blog={blog} />
        <PostCoverImage src={blog.coverImageUrl} alt={blog.title} />
        <PostContent html={blog.content} />
        <PostTags tags={blog.tags} />
        {slug && <RelatedPosts currentSlug={slug} />}
      </article>
    </div>
  );
}