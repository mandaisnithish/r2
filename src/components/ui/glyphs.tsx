// src/components/ui/glyphs.tsx
// Custom technical glyphs drawn for Aquaholics, plus the brand marks that
// lucide-react 1.x no longer ships. Same contract as lucide icons:
// 24×24 viewBox, currentColor, `size` + `className` + `strokeWidth`.

import type { SVGProps } from "react";

export type GlyphProps = SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string };

function Svg({ size = 24, strokeWidth = 1.5, children, ...rest }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Sonar sweep: the default glyph when a CMS icon name is unknown. */
export const SonarGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M4.5 19.5a10.6 10.6 0 0 1 0-15" />
    <path d="M7.6 16.4a6.2 6.2 0 0 1 0-8.8" />
    <path d="M12 12 20.5 6.5" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="17.6" cy="8.4" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

/** Twin pontoons with a deck: Walrus / DRAKEN silhouette from above. */
export const PontoonGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="4.5" height="16" rx="2.25" />
    <rect x="16.5" y="4" width="4.5" height="16" rx="2.25" />
    <path d="M7.5 8h9M7.5 16h9" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
  </Svg>
);

export const PropellerGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="1.8" />
    <path d="M12 10.2C11 6.5 12.5 3.5 15 3.2c1.5 1.4.6 4.6-3 7" />
    <path d="M13.6 12.9c3.6.9 5.6 3.5 4.7 5.8-1.9.6-4.3-1.8-4.7-5.8" />
    <path d="M10.4 12.9c-2.6 2.7-5.9 3.1-7.3 1.1.4-1.9 3.6-2.8 7.3-1.1" />
  </Svg>
);

/** Screw conveyor: the collection mechanism. */
export const ConveyorGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M3 17 21 7" />
    <path d="M5.2 13.2c1 2.2 2.6 2.7 3.6 1.9M8.9 11.2c1 2.2 2.6 2.7 3.6 1.9M12.6 9.1c1 2.2 2.6 2.7 3.6 1.9M16.3 7c1 2.2 2.6 2.7 3.6 1.9" />
    <path d="M3 20h7" />
  </Svg>
);

export const BallastGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <path d="M5 13c2.3-1.2 4.7-1.2 7 0s4.7 1.2 7 0" />
    <path d="M12 2v4M10.5 4.5 12 6l1.5-1.5" />
  </Svg>
);

export const PcbGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="8" y="8" width="8" height="8" rx="1" />
    <path d="M10 8V3M14 8V5.5M16 10h3M16 14h5M10 16v5M14 16v3M8 12H3" />
    <circle cx="10" cy="3" r="0.6" fill="currentColor" />
    <circle cx="21" cy="14" r="0.6" fill="currentColor" />
    <circle cx="3" cy="12" r="0.6" fill="currentColor" />
  </Svg>
);

export const BathymetryGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M2.5 7c3-2 5.5 1.5 9.5-.5S19 4 21.5 6" />
    <path d="M2.5 12c3.2-1.6 5.3 1.8 9.5 0s6.6-2 9.5 0" />
    <path d="M2.5 17c3.4-1.2 5.6 2 9.5.3s6.2-1.4 9.5.7" />
  </Svg>
);

/** S500-style quad from above. */
export const QuadGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="m7 7 10 10M17 7 7 17" />
    <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="0.8" />
    <circle cx="5.5" cy="5.5" r="2.6" />
    <circle cx="18.5" cy="5.5" r="2.6" />
    <circle cx="5.5" cy="18.5" r="2.6" />
    <circle cx="18.5" cy="18.5" r="2.6" />
  </Svg>
);

export const RelayGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M3 12h5l3-6 3 12 3-6h4" />
  </Svg>
);

/* ---- Brand marks (monoline, not the official logos' exact geometry) ---- */

export const LinkedInGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7.5 10.5v6M7.5 7.6v.1M11 16.5v-6M11 13c0-1.6 1.1-2.6 2.6-2.6S16.5 11.4 16.5 13v3.5" />
  </Svg>
);

export const GitHubGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.3-6-2.8m12 5.6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </Svg>
);

export const InstagramGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.4" fill="currentColor" />
  </Svg>
);

export const YouTubeGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </Svg>
);

export const XGlyph = (p: GlyphProps) => (
  <Svg {...p}>
    <path d="M4 4l16 16M20 4l-6.5 7.3M10.6 13.4 4 20" />
  </Svg>
);
