// src/hooks/useTilt.ts
import { useRef } from "react";

/**
 * Returns a ref + mouse handlers that apply a subtle 3D tilt toward the
 * cursor, like the card is reacting to where you're looking at it.
 * Keep maxTilt small (6-10deg) — anything bigger feels gimmicky/dizzying
 * rather than premium.
 */
export function useTilt(maxTilt: number = 8) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return { ref, onMouseMove, onMouseLeave };
}