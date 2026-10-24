/* Author: Nithish Kaliannan Ananth */
// src/components/ui/EmptyState.tsx
// Designed empty state for logs that are intentionally empty until real
// records exist (tests, media, sponsors). Never fabricate to fill these.

import type { ReactNode } from "react";
import HudPanel from "./HudPanel";

export default function EmptyState({
  code,
  title,
  children,
  action,
}: {
  code: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <HudPanel tone="ghost" serial={code} status="cached" statusLabel="No records logged">
      <div className="grid gap-6 py-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <svg aria-hidden="true" width="96" height="96" viewBox="0 0 96 96" className="text-line-2">
          <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" />
          <circle cx="48" cy="48" r="28" fill="none" stroke="currentColor" strokeDasharray="2 5" />
          <circle cx="48" cy="48" r="12" fill="none" stroke="currentColor" />
          <path d="M48 48 82 26" stroke="#00E5FF" strokeOpacity=".6" />
          <circle cx="48" cy="48" r="2" fill="#00E5FF" />
        </svg>
        <div>
          <p className="font-display text-xl font-semibold text-bone">{title}</p>
          {children && <div className="mt-2 max-w-xl text-[15px] leading-relaxed text-fog">{children}</div>}
          {action && <div className="mt-5">{action}</div>}
        </div>
      </div>
    </HudPanel>
  );
}
