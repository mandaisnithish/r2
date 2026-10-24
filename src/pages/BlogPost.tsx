/* Author: Nithish Kaliannan Ananth */
// src/pages/BlogPost.tsx
// A single field note: reading-progress trace under the nav, cover in an
// industrial frame, TipTap HTML rendered with the `prose-hydro` theme
// (@tailwindcss/typography is now registered), tags and related posts.

import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useBlog, useBlogs } from "../lib/blogQueries";
import { splitTags } from "../lib/format";
import MediaSlot from "../components/ui/MediaSlot";
import CircuitDivider from "../components/ui/CircuitDivider";
import RelayButton from "../components/ui/RelayButton";
import { PostCard, PostMeta } from "../components/blog/PostCard";

export default function BlogPostPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, live, error } = useBlog(slug);
  const { data: all } = useBlogs();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  if (!post) {
    return (
      <section className="grid min-h-[70vh] place-items-center">
        <div className="grid-wrap max-w-xl text-center">
          <p className="stencil">{error ? "Signal lost" : live ? "No record" : "Acquiring signal…"}</p>
          <h1 className="display-m mt-4 text-bone">This note isn’t on the record.</h1>
          <p className="mt-4 text-fog">It may have been unpublished or moved.</p>
          <div className="mt-8"><RelayButton to="/blog">Back to field notes</RelayButton></div>
        </div>
      </section>
    );
  }

  const related = all.filter((b) => b.slug !== post.slug).slice(0, 3);
  const tags = splitTags(post.tags);

  return (
    <>
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-16 z-40 h-px origin-left bg-hydro" style={{ scaleX: progress }} />
      <article className="pb-10 pt-12 sm:pt-20">
        <header className="grid-wrap max-w-[60rem]">
          <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stencil text-drift hover:text-bone">
            <ArrowLeft size={14} /> Field notes
          </Link>
          <div className="mt-8"><PostMeta post={post} /></div>
          <h1 className="display-l mt-5 text-bone">{post.title}</h1>
        </header>

        <div className="grid-wrap mt-12 max-w-[72rem]">
          <MediaSlot slotId={`BLOG_${post.id}`} src={post.coverImageUrl} alt={post.title} aspect="21:9" priority brief="Wide cover image for this post." />
        </div>

        <div className="grid-wrap mt-14 max-w-[46rem]">
          <div
            className="prose prose-hydro max-w-none prose-headings:text-bone prose-p:text-fog prose-li:text-fog prose-img:my-10"
            // Admin-authored TipTap HTML (trusted single-admin CMS; see PostContent history).
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
              {tags.map((t) => (
                <li key={t} className="border border-line-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-stencil text-fog">#{t}</li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <>
          <CircuitDivider variant="left" label="BUS 01 · MORE NOTES" />
          <section className="py-14 sm:py-20">
            <div className="grid-wrap">
              <p className="stencil">Keep reading</p>
              <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.id}><PostCard post={p} /></li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  );
}
