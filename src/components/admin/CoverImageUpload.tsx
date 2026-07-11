// src/components/admin/CoverImageUpload.tsx
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadMedia, isAllowedFileType } from "../../api/admin/uploadApi";

interface Props {
  value?: string;
  onChange: (url: string | undefined) => void;
}

export default function CoverImageUpload({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isAllowedFileType(file)) {
      setError("Unsupported file type. Use JPG, PNG, WEBP, GIF, or SVG.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadMedia(file, "blog-covers");
      onChange(url);
    } catch (err) {
      console.error("Cover image upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">
        Cover image
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#00B4D8]/15 group">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 bg-[#0A0F1E]/80 hover:bg-red-500/80 text-white p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Remove cover image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border border-dashed border-[#00B4D8]/25 hover:border-[#00B4D8]/50 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
        >
          <Upload size={20} />
          <span className="text-xs">
            {uploading ? "Uploading..." : "Click to upload cover image"}
          </span>
        </button>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}