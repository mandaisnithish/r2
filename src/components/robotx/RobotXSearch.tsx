import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_INDEX } from "../../data/robotxData";

export default function RobotXSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return SEARCH_INDEX.filter((item) => {
      const hay = `${item.title} ${item.text}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).slice(0, 8);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={boxRef} className="relative w-full lg:w-80" role="search">
      <label htmlFor="robotx-search" className="sr-only">
        Search RobotX pages
      </label>
      <input
        id="robotx-search"
        type="search"
        value={q}
        placeholder="Search RobotX pages…"
        autoComplete="off"
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && results[0]) go(results[0].path);
        }}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40"
      />
      {open && q.trim() && (
        <ul className="absolute right-0 left-0 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0F1629] shadow-xl z-50">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-400">No results for “{q}”.</li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.path}-${i}`}>
                <button
                  type="button"
                  onClick={() => go(r.path)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                >
                  <span className="block text-sm font-semibold text-white">{r.title}</span>
                  <span className="block text-xs text-slate-400 truncate">{r.path}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
