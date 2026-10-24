/* Author: Nithish Kaliannan Ananth */
// src/components/ui/BlueprintCard.tsx
// Content card on exposed blueprint hairlines: index number, glyph,
// title, body. Hover lights the top trace and the index; click pings.
// Used for features, values, use cases, principles.

import type { ReactNode } from "react";
import { Icon } from "./Icon";

export default function BlueprintCard({
  index,
  icon,
  title,
  children,
  meta,
  className = "",
}: {
  index?: string;
  icon?: string | null;
  title: ReactNode;
  children?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <article
      data-ping
      className={`group/card relative flex h-full flex-col border-t border-line bg-gradient-to-b from-hull/70 to-transparent px-5 pb-7 pt-5 transition-colors duration-300 hover:from-hull ${className}`}
    >
      {/* the top trace charges on hover */}
      <span aria-hidden="true" className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-hydro transition-transform duration-500 ease-hydro group-hover/card:scale-x-100" />
      <span aria-hidden="true" className="absolute left-0 top-[-4px] h-[7px] w-px bg-line-2 group-hover/card:bg-hydro" />
      <div className="flex items-start justify-between gap-4">
        {index && <span className="font-mono text-[11px] tracking-stencil text-drift transition-colors group-hover/card:text-hydro">{index}</span>}
        {icon !== undefined && (
          <span className="grid h-10 w-10 place-items-center border border-line text-fog transition-colors duration-300 group-hover/card:border-hydro/50 group-hover/card:text-hydro">
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold leading-tight text-bone sm:text-[1.375rem]">{title}</h3>
      {children && <div className="mt-3 text-[15px] leading-relaxed text-fog">{children}</div>}
      {meta && <div className="mt-auto pt-6">{meta}</div>}
    </article>
  );
}
