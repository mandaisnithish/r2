/* Author: Nithish Kaliannan Ananth */
// src/components/admin/shared/FormPrimitives.tsx
import { Trash2, Upload } from "lucide-react";
import { Icon } from "../../ui/Icon";

const DEFAULT_ACCENT = "#00E5FF";

export const inputCls = "w-full bg-[#060A0E] border border-[#00E5FF]/15 rounded-sm px-4 py-2.5 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#00E5FF]/50 transition-colors";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-fog text-xs font-medium mb-1.5">{children}</label>;
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0D151C] border border-[#00E5FF]/15 rounded-sm p-6 mb-5">
      <h3 className="font-heading font-semibold text-white text-base mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function ImageField({ label, value, onUpload, onClear, accent = DEFAULT_ACCENT }: {
  label: string; value?: string;
  onUpload: (f: File) => void; onClear: () => void;
  accent?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {value ? (
        <div className="relative rounded-sm overflow-hidden border border-white/[0.09] group w-full max-w-[220px] aspect-video">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-1.5 right-1.5 bg-[#060A0E]/80 hover:bg-red-500/80 text-white p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={13} />
          </button>
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center gap-2 w-full max-w-[220px] aspect-video rounded-sm border border-dashed cursor-pointer transition-colors hover:bg-white/[0.02]"
          style={{ borderColor: `${accent}55` }}
        >
          <Upload size={18} style={{ color: accent }} />
          <span className="text-xs font-medium" style={{ color: accent }}>Upload image</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
            className="hidden" />
        </label>
      )}
    </div>
  );
}

export function Select({ label, value, options, onChange }: {
  label: string; value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#060A0E]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SocialField({ icon, label, value, onChange }: {
  icon: string; label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>
        <span className="inline-flex items-center gap-1.5">
          <Icon name={icon} size={13} className="text-hydro" /> {label}
        </span>
      </Label>
      <input type="text" value={value} placeholder="https://..."
        onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}