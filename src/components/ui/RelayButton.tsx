/* Author: Nithish Kaliannan Ananth */
// src/components/ui/RelayButton.tsx
// Actions behave like heavy-duty marine relays (DESIGN_SYSTEM.md §6):
// hovering primes an amber "capacitor" bar, pressing fires an oscilloscope
// spike + spark and a sonar ripple into the water.

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { rippleAt } from "../../lib/hydroBus";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const VARIANT: Record<Variant, string> = {
  primary: "bg-bone text-abyss hover:bg-white clip-notch",
  secondary: "border border-line-2 bg-abyss/40 text-bone hover:border-hydro/70",
  ghost: "text-bone hover:text-hydro",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[11px] gap-2",
  md: "h-12 px-5 text-[12px] gap-3",
  lg: "h-14 px-7 text-[13px] gap-3",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Trailing arrow; "external" shows ↗. */
  arrow?: boolean | "external";
  leading?: ReactNode;
};

type AsLink = Common & { to: string; href?: never; onClick?: () => void; type?: never; disabled?: never };
type AsAnchor = Common & { href: string; to?: never; onClick?: () => void; type?: never; disabled?: never };
type AsButton = Common & { to?: never; href?: never; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean };

export type RelayButtonProps = AsLink | AsAnchor | AsButton;

export default function RelayButton(props: RelayButtonProps) {
  const { children, variant = "primary", size = "md", className = "", arrow = true, leading } = props;
  const [fired, setFired] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const onPointerDown = (e: PointerEvent) => {
    rippleAt(e.clientX, e.clientY, 0.8);
    setFired((n) => n + 1);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFired(0), 560);
  };

  const cls = `group/relay relative inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap font-mono font-medium uppercase tracking-stencil transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${VARIANT[variant]} ${SIZE[size]} ${className}`;

  const inner = (
    <>
      {variant !== "ghost" && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 transition-colors duration-200 ${
            variant === "primary" ? "bg-abyss/40 group-hover/relay:bg-arc" : "bg-line-2 group-hover/relay:bg-arc"
          }`}
        />
      )}
      {leading}
      <span className="relative">{children}</span>
      {arrow &&
        (arrow === "external" ? (
          <ArrowUpRight size={15} strokeWidth={1.75} className="transition-transform duration-300 ease-hydro group-hover/relay:-translate-y-0.5 group-hover/relay:translate-x-0.5" />
        ) : (
          <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-300 ease-hydro group-hover/relay:translate-x-1" />
        ))}
      {/* capacitor charge bar */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-arc transition-transform duration-[380ms] ease-hydro group-hover/relay:scale-x-100"
      />
      {/* oscilloscope spike, drawn once per press */}
      {fired > 0 && (
        <svg
          key={fired}
          aria-hidden="true"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2"
        >
          <path
            d="M0 10 H38 L42 2 L46 18 L50 4 L54 14 L57 10 H100"
            pathLength={1}
            fill="none"
            stroke="#FFB800"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            style={{ strokeDasharray: 1, animation: "spike-draw 420ms cubic-bezier(.22,.9,.24,1) both" }}
          />
          <circle cx="46" cy="10" r="3" fill="#FFB800" style={{ transformOrigin: "46px 10px", animation: "spark 480ms ease-out both" }} />
        </svg>
      )}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} onClick={props.onClick} onPointerDown={onPointerDown} className={cls} data-ping>
        {inner}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    const external = /^https?:/.test(props.href);
    return (
      <a
        href={props.href}
        onClick={props.onClick}
        onPointerDown={onPointerDown}
        className={cls}
        data-ping
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  const b = props as AsButton;
  return (
    <button type={b.type ?? "button"} disabled={b.disabled} onClick={b.onClick} onPointerDown={onPointerDown} className={cls} data-ping>
      {inner}
    </button>
  );
}
