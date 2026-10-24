/* Author: Nithish Kaliannan Ananth */
// src/components/layout/Wordmark.tsx
// SVG wordmark: the droplet-A from the Aquaholics logo redrawn as a
// monoline stencil, plus the name in Chakra Petch. Vector, so it stays
// crisp on the dark UI (the JPEG logo has a white box).

export function DropletMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 2.5c0 0-9.5 10.2-9.5 16.4a9.5 9.5 0 0 0 19 0C25.5 12.7 16 2.5 16 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M11.6 23.2 16 12.4l4.4 10.8M13.2 19.6h5.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M23.4 6.2 26.6 3m-1.2 6.2 3.2-1" stroke="#FFB800" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-bone">
      <DropletMark className="text-hydro" />
      {!compact && (
        <span className="font-display text-[17px] font-semibold uppercase leading-none tracking-[0.14em]">
          Aqua<span className="text-hydro">holics</span>
        </span>
      )}
    </span>
  );
}
