// src/components/layout/RouteFallback.tsx
// Shown while a lazy route chunk downloads. Quiet, on-brand, no spinner.

export default function RouteFallback({ label = "Acquiring signal", full = false }: { label?: string; full?: boolean }) {
  return (
    <div className={`grid place-items-center ${full ? "min-h-screen bg-abyss" : "min-h-[60vh]"}`} role="status" aria-live="polite">
      <div className="flex w-56 flex-col gap-3">
        <span className="stencil">{label}…</span>
        <span className="relative block h-px w-full overflow-hidden bg-line">
          <span className="absolute inset-y-0 left-0 w-1/3 bg-hydro" style={{ animation: "sonar-scan 1.2s cubic-bezier(.22,.9,.24,1) 3 both", transform: "translateX(-100%)" }} />
        </span>
      </div>
    </div>
  );
}
