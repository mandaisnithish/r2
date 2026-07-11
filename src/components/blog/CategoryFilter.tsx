// src/components/blog/CategoryFilter.tsx
interface Props {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onChange }: Props) {
  if (categories.length <= 1) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 mb-10">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${
              activeCategory === cat
                ? "bg-[#00B4D8] text-[#0A0F1E]"
                : "bg-[#0D1B2A] text-slate-400 border border-[#00B4D8]/15 hover:border-[#00B4D8]/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}