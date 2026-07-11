// src/components/admin/RichTextEditor.tsx
// Requires: npm install @tiptap/react @tiptap/starter-kit
//           @tiptap/extension-image @tiptap/extension-link
//
// The image toolbar button uploads through the real backend
// endpoint (POST /api/v1/upload/media?folder=blog-content) and
// inserts the returned Cloudinary URL directly into the editor
// as an <img> tag -- this is the "content images" flow we
// discussed, separate from the single cover image field.

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ImagePlus,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { uploadMedia, isAllowedFileType } from "../../api/admin/uploadApi";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be picked again
    if (!file) return;

    if (!isAllowedFileType(file)) {
      setUploadError(
        "Unsupported file type. Use JPG, PNG, WEBP, GIF, or SVG."
      );
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadMedia(file, "blog-content");
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error("Content image upload failed", err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-[#00B4D8]/20 text-[#00B4D8]"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-[#00B4D8]/15 rounded-xl overflow-hidden bg-[#0A0F1E]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#00B4D8]/15 bg-[#0D1B2A]">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Insert link" onClick={handleLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Insert image"
          onClick={handleImageButtonClick}
          disabled={uploading}
        >
          <ImagePlus size={16} />
        </ToolbarButton>

        <div className="w-px h-5 bg-[#00B4D8]/15 mx-1" />

        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </ToolbarButton>

        {uploading && (
          <span className="text-[#00B4D8] text-xs ml-2">Uploading...</span>
        )}
      </div>

      {uploadError && (
        <div className="px-4 py-2 text-red-400 text-xs bg-red-400/10 border-b border-red-400/20">
          {uploadError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      <EditorContent editor={editor} />
    </div>
  );
}