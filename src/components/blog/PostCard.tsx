/* Author: Nithish Kaliannan Ananth */
// src/components/blog/PostCard.tsx
// Post card + metadata line shared by the blog index and post pages.

import { Link } from "react-router-dom";
import MediaSlot from "../ui/MediaSlot";
import type { Blog } from "../../types/blog";

export function PostMeta({ post }: { post: Blog }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-stencil text-drift">
      {post.category && <span className="text-hydro">{post.category}</span>}
      {post.readTime ? <span>{post.readTime} min read</span> : null}
      {post.author && <span>{post.author}</span>}
    </p>
  );
}

export function PostCard({ post }: { post: Blog }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group/post block" data-ping>
      <MediaSlot slotId={`BLOG_${post.id}`} src={post.coverImageUrl} alt={post.title} aspect="3:2" width={900} brief="Cover image for this post." />
      <div className="mt-5">
        <PostMeta post={post} />
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-bone transition-colors group-hover/post:text-hydro">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 whitespace-pre-line text-[15px] leading-relaxed text-fog">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
