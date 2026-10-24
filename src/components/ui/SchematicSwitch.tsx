// src/components/ui/SchematicSwitch.tsx
// Mechanical multi-position switch with detents. Accessible as a radio
// group (arrow keys move between positions). Used for the vessel's
// schematic layers and other "progressive disclosure" toggles.

import { useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { SPRING_HYDRO } from "../../lib/motion";
import { rippleAt } from "../../lib/hydroBus";

export type SwitchOption<T extends string> = { value: T; label: string; code?: string };

export default function SchematicSwitch<T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label: string;
  options: SwitchOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const move = (next: number) => {
    const i = (next + options.length) % options.length;
    onChange(options[i].value);
    refs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(index + 1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(index - 1); }
  };

  return (
    <div className={className}>
      <span className="stencil" id={`sw-${label}`}>{label}</span>
      <div
        role="radiogroup"
        aria-labelledby={`sw-${label}`}
        onKeyDown={onKey}
        className="relative mt-2 grid border border-line-2 bg-abyss/70"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {/* travelling thumb */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 border border-hydro/70 bg-hydro/10"
          style={{ width: `${100 / options.length}%` }}
          animate={{ left: `${(100 / options.length) * index}%` }}
          transition={SPRING_HYDRO}
        />
        {/* detent ticks between positions */}
        {options.slice(1).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-line-2"
            style={{ left: `${(100 / options.length) * (i + 1)}%` }}
          />
        ))}
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={(e) => {
                if (!on) rippleAt(e.clientX, e.clientY, 0.6);
                onChange(o.value);
              }}
              data-ping
              className={`relative z-10 flex min-h-11 flex-col items-start justify-center px-3 py-2 text-left transition-colors duration-200 ${
                on ? "text-bone" : "text-drift hover:text-bone"
              }`}
            >
              {o.code && <span className="font-mono text-[9px] tracking-stencil text-current opacity-70">{o.code}</span>}
              <span className="font-mono text-[11px] uppercase tracking-stencil">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
