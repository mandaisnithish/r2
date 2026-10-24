// src/components/robotx/RobotXSearch.tsx
// Dossier search over SEARCH_INDEX. Keyboard: ↓/↑ to move, Enter to open,
// Esc to close.

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { SEARCH_INDEX } from "../../data/robotxData";

export default function RobotXSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listId = useId();

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return SEARCH_INDEX.filter((item) => {
      const hay = `${item.title} ${item.text} ${item.category}`.toLowerCase();
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

  const show = open && q.trim().length > 0;

  return (
    <div ref={boxRef} className="relative w-full lg:w-72" role="search">
      <label htmlFor="robotx-search" className="sr-only">Search the RobotX dossier</label>
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-drift" />
      <input
        id="robotx-search"
        type="search"
        value={q}
        placeholder="Search dossier…"
        autoComplete="off"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-activedescendant={show && results[cursor] ? `${listId}-${cursor}` : undefined}
        onChange={(e) => {
          setQ(e.target.value);
          setCursor(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
          if (e.key === "Enter" && results[cursor]) go(results[cursor].path);
        }}
        className="h-9 w-full border border-line-2 bg-abyss/70 pl-9 pr-3 font-mono text-[12px] text-bone placeholder:text-drift focus:border-arc focus:outline-none"
      />
      {show && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto border border-line-2 bg-abyss">
          {results.length === 0 ? (
            <li className="px-4 py-3 font-mono text-[12px] text-drift">No match for “{q}”.</li>
          ) : (
            results.map((r, i) => (
              <li key={`${r.id}-${i}`} id={`${listId}-${i}`} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => go(r.path)}
                  className={`flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left ${i === cursor ? "bg-hull" : ""}`}
                >
                  <span className="text-sm text-bone">{r.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-stencil text-arc">{r.category}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
