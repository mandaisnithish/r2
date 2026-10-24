// src/hooks/useIconResolver.tsx
// Back-compat wrapper around the curated icon map in components/ui/iconMap.
// Previously this imported every lucide icon (`import * as Icons`), which
// defeated tree-shaking and couldn't resolve Tabler-style names.

import { createElement, type ReactNode } from "react";
import { resolveIcon } from "../components/ui/iconMap";

export function useIconResolver() {
  const resolve = (iconName?: string, size = 20, className = "text-hydro"): ReactNode =>
    createElement(resolveIcon(iconName), { size, className, strokeWidth: 1.5 });
  return { resolveIcon: resolve };
}
