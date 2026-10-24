/* Author: Nithish Kaliannan Ananth */
// src/components/ui/HudPanel.tsx
// The base surface of the system: oxidised-steel panel with hairline
// border, servo corner brackets and an optional serial/status header.
// Replaces GlowCard and every rounded "card" from the old UI.

import type { ElementType, ReactNode } from "react";
import ServoBracket from "./ServoBracket";
import SonarBadge, { type SonarStatus } from "./SonarBadge";

type Tone = "default" | "hydro" | "arc" | "ghost";

const SURFACE: Record<Tone, string> = {
  default: "bg-hull/85 border-line",
  hydro: "bg-hull/85 border-hydro/35",
  arc: "bg-hull/85 border-arc/40",
  ghost: "bg-transparent border-line",
};

export default function HudPanel({
  as: Tag = "div",
  serial,
  status,
  statusLabel,
  label,
  tone = "default",
  padded = true,
  brackets = true,
  className = "",
  bodyClassName = "",
  children,
  ...rest
}: {
  as?: ElementType;
  serial?: string;
  status?: SonarStatus;
  statusLabel?: string;
  label?: ReactNode;
  tone?: Tone;
  padded?: boolean;
  brackets?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
} & Record<string, unknown>) {
  const hasHeader = serial || status || label;
  return (
    <Tag className={`relative border ${SURFACE[tone]} ${className}`} {...rest}>
      {brackets && <ServoBracket tone={tone === "arc" ? "arc" : tone === "hydro" ? "hydro" : "line"} />}
      {hasHeader && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
          <span className="stencil truncate">{label ?? serial}</span>
          <span className="flex shrink-0 items-center gap-4">
            {label && serial && <span className="stencil hidden sm:inline">{serial}</span>}
            {status && <SonarBadge status={status} label={statusLabel} />}
          </span>
        </div>
      )}
      <div className={`${padded ? "p-5 sm:p-6" : ""} ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
