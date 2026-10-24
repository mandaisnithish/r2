/* Author: Nithish Kaliannan Ananth */
// src/components/ui/Reveal.tsx
// Scroll reveal wrapper (rises and settles once, hydro easing).

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { reveal, revealSide } from "../../lib/motion";

export default function Reveal({
  children,
  delay = 0,
  side,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  side?: 1 | -1;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const M = motion[as];
  const props = side ? revealSide(side, delay) : reveal(delay);
  return (
    <M className={className} {...props}>
      {children}
    </M>
  );
}
