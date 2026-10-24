// src/components/ui/Icon.tsx
// One icon system for the whole app. Replaces the `import * as Icons`
// wildcard (which bundled every lucide icon) and the Tabler webfont.
//
// CMS rows store icon names in several dialects — "Route", "lucide-zap",
// "ti-robot", "SlidersHorizontal" — so names are normalised before lookup
// (see iconMap.ts). Unknown names fall back to the sonar glyph instead of
// a warning icon.

import { createElement } from "react";
import { resolveIcon, type IconProps } from "./iconMap";

export function Icon({ name, size = 20, className, strokeWidth = 1.5 }: IconProps & { name?: string | null }) {
  return createElement(resolveIcon(name), { size, className, strokeWidth });
}
