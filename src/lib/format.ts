// src/lib/format.ts
// Formatting helpers for telemetry-style UI: money in Indian notation,
// stencil dates, serials, IST timestamps and media URLs.

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** ₹3,15,000 */
export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** ₹3.15L / ₹1.2Cr / ₹15,000 */
export function inrShort(n: number): string {
  if (n >= 1e7) return `₹${trim(n / 1e7)}Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)}L`;
  return inr(n);
}

function trim(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, "");
}

/** "10 JUN 2026" for ISO dates (yyyy-mm-dd...). */
export function stencilDate(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

/** "10 June 2026" */
export function longDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Serial plates: serial("AQH-USV", 1) -> "AQH-USV-01". */
export function serial(prefix: string, n: number | string): string {
  return `${prefix}-${String(n).padStart(2, "0")}`;
}

/** "2026-10-24 21:40:12 IST" for the given date (default now). */
export function istStamp(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} IST`;
}

/** YouTube id from watch, share or embed URLs. */
export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * Adds Cloudinary delivery transforms (auto format/quality, width cap) to
 * CMS image URLs; leaves any other URL untouched.
 */
export function cdn(url: string | undefined, width = 1600): string | undefined {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[a-z]_[^/]*\//.test(url)) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

/** Splits "a, b ,c" tag strings. */
export function splitTags(tags?: string): string[] {
  return (tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
}

/** Two-letter initials for monograms. */
export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}
