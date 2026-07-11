// src/components/common/GlowCard.tsx
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Offsets the border-glow animation so multiple cards on one page
      don't all pulse in perfect sync — pass something like index * 0.4 */
  delay?: number;
}

export default function GlowCard({ children, className = "", delay = 0 }: Props) {
  return (
    <div className={`relative p-[1.5px] rounded-2xl overflow-hidden ${className}`}>
      <div
        className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
          animationDelay: `${delay}s`,
        }}
      />
      <div className="relative bg-[#0D1B2A] rounded-2xl h-full">{children}</div>
    </div>
  );
}