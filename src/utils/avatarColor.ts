/* Author: Nithish Kaliannan Ananth */
// src/utils/avatarColor.ts
// Deterministically maps a sender's name to a consistent accent color,
// so the same person always gets the same color across the whole inbox.

const PALETTE = ["#00B4D8", "#22C55E", "#A855F7", "#F59E0B", "#3B82F6", "#EC4899"];

export function getSenderColor(name: string | undefined | null): string {
  const str = name?.trim() || "?";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}