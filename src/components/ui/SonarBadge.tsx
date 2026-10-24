/* Author: Nithish Kaliannan Ananth */
// src/components/ui/SonarBadge.tsx
// Status chip with an instrument LED. Used for validation states, CMS link
// state and admin statuses.

export type SonarStatus = "validated" | "partial" | "ongoing" | "offline" | "live" | "cached" | "draft";

const LED: Record<SonarStatus, string> = {
  validated: "bg-hydro",
  live: "bg-hydro",
  partial: "bg-[linear-gradient(90deg,#FFB800_50%,transparent_50%)] ring-1 ring-arc",
  ongoing: "ring-1 ring-hydro bg-transparent",
  cached: "ring-1 ring-drift bg-transparent",
  draft: "ring-1 ring-drift bg-transparent",
  offline: "bg-rust",
};

const TEXT: Record<SonarStatus, string> = {
  validated: "text-hydro",
  live: "text-hydro",
  partial: "text-arc",
  ongoing: "text-bone",
  cached: "text-drift",
  draft: "text-drift",
  offline: "text-rust",
};

export default function SonarBadge({
  status,
  label,
  className = "",
}: {
  status: SonarStatus;
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stencil ${TEXT[status]} ${className}`}>
      <span className="relative inline-flex h-2 w-2">
        {status === "live" && (
          <span className="absolute inset-[-4px] rounded-full border border-hydro/60 [animation:ring-out_1.6s_ease-out_2_both]" />
        )}
        <span className={`h-2 w-2 rounded-full ${LED[status]}`} />
      </span>
      {label ?? status}
    </span>
  );
}
