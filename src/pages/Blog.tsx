// src/pages/Blog.tsx
// Field notes from the team. Latest post leads; the rest sit in an
// offset grid; filter by CMS category.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PostCard, PostMeta } from "../components/blog/PostCard";
import { useBlogs } from "../lib/blogQueries";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import CircuitDivider from "../components/ui/CircuitDivider";
import MediaSlot from "../components/ui/MediaSlot";
import Reveal from "../components/ui/Reveal";

export default function BlogPage() {
  const { data: posts } = useBlogs();
  const [cat, setCat] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]))], [posts]);
  const filtered = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  const [lead, ...rest] = filtered;

  return (
    <>
      <section className="pb-12 pt-14 sm:pb-16 sm:pt-24">
        <div className="grid-wrap grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <TelemetryHeader as="h1" size="xl" index="LOG-NOTES" code="FROM THE TEAM" title="Field notes." lede="Updates, research and stories from the Aquaholics journey — written by the people building the robots." />
          </div>
          <div role="radiogroup" aria-label="Filter by category" className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
            {categories.map((c) => {
              const on = c === cat;
              return (
                <button
                  key={c}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setCat(c)}
                  data-ping
                  className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-stencil transition-colors ${on ? "border-hydro bg-hydro/10 text-bone" : "border-line-2 text-drift hover:text-bone"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CircuitDivider variant="right" label="BUS 01 · LATEST TRANSMISSION" />

      {lead ? (
        <section className="py-12 sm:py-16">
          <div className="grid-wrap">
            <Link to={`/blog/${lead.slug}`} className="group/lead grid gap-8 lg:grid-cols-12 lg:items-center" data-ping>
              <div className="lg:col-span-7">
                <MediaSlot slotId={`BLOG_${lead.id}`} src={lead.coverImageUrl} alt={lead.title} aspect="16:9" priority brief="Cover image for this post (Admin → Blog → Cover)." />
              </div>
              <div className="lg:col-span-5">
                <PostMeta post={lead} />
                <h2 className="display-m mt-4 text-bone transition-colors group-hover/lead:text-hydro">{lead.title}</h2>
                {lead.excerpt && <p className="mt-4 line-clamp-4 whitespace-pre-line text-[16px] leading-relaxed text-fog">{lead.excerpt}</p>}
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stencil text-bone">
                  Read the note <ArrowUpRight size={14} className="transition-transform group-hover/lead:-translate-y-0.5 group-hover/lead:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="grid-wrap stencil">No posts in this category yet.</div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="py-12 sm:py-20">
          <div className="grid-wrap">
            <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <Reveal as="li" key={p.id} delay={(i % 3) * 0.06} className={i % 3 === 1 ? "lg:mt-16" : ""}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
