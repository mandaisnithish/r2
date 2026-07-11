// src/components/blogPost/PostTags.tsx

export default function PostTags({ tags }: { tags?: string }) {
  const parsed = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (parsed.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/5">
      {parsed.map((tag) => (
        <span
          key={tag}
          className="text-xs text-slate-400 bg-[#0D1B2A] border border-[#00B4D8]/15 rounded-full px-3 py-1"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}