// src/components/admin/ConfirmModal.tsx
// A reusable styled modal that replaces browser-native alert()/confirm().
// Two modes: "confirm" (Cancel + confirm action) and "alert" (just OK).

import { AlertTriangle, Info, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  mode?: "confirm" | "alert";
  tone?: "danger" | "info";
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  mode = "confirm",
  tone = "info",
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  const accent = tone === "danger" ? "#FF3B30" : "#00E5FF";
  const Icon = tone === "danger" ? AlertTriangle : Info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal card */}
      <div className="relative w-full max-w-sm rounded-sm border border-white/[0.08] bg-gradient-to-b from-[#0F1726] to-[#060A0E] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] animate-[fadeIn_0.15s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-drift hover:text-white p-1.5 rounded-sm hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>

        <div
          className="w-11 h-11 rounded-sm flex items-center justify-center mb-4"
          style={{ backgroundColor: `${accent}1F`, color: accent }}
        >
          <Icon size={20} />
        </div>

        <h3 className="text-white font-heading font-semibold text-base mb-2">
          {title}
        </h3>
        <p className="text-fog text-sm leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center gap-3 justify-end">
          {mode === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-sm text-sm font-medium text-fog hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (mode === "confirm") onConfirm?.();
              onClose();
            }}
            className="px-4 py-2.5 rounded-sm text-sm font-semibold transition-colors"
            style={{ backgroundColor: accent, color: "#060A0E" }}
          >
            {mode === "confirm" ? confirmLabel : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}