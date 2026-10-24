/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/ContactMessagesPage.tsx
import { useState } from "react";
import { RefreshCw, Mail, MailOpen } from "lucide-react";
import {
  getAllMessages,
  markMessageAsRead,
  deleteMessage,
} from "../../api/admin/contactMessageAdminApi";
import type { ContactMessageAdmin } from "../../types/contactMessage";
import MessageList from "../../components/admin/MessageList";
import MessageDetail from "../../components/admin/MessageDetail";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useMountLoad } from "../../hooks/useMountLoad";

const ACCENT = "#FFB800";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ModalState = { kind: "confirm-delete"; id: number } | null;

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageAdmin[]>([]);
  const [selected, setSelected] = useState<ContactMessageAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllMessages();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() -
          new Date(a.submittedAt).getTime()
      );
      setMessages(sorted);
    } catch (err) {
      console.error("Failed to load messages", err);
      setError("Couldn't load messages. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useMountLoad(loadMessages);

  const handleSelect = async (msg: ContactMessageAdmin) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        const updated = await markMessageAsRead(msg.id);
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setSelected(updated);
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="relative min-h-full p-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#FFB800]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#00E5FF]/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-5 mb-8">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
          Contact Messages
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-sm border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
            <Mail size={13} className="text-drift" />
            <span className="text-white font-semibold text-sm">{messages.length}</span>
            <span className="text-drift text-xs">Total</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-sm border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
            <MailOpen size={13} style={unreadCount > 0 ? { color: ACCENT } : { color: "#94A3B8" }} />
            <span className="text-white font-semibold text-sm">{unreadCount}</span>
            <span className="text-drift text-xs">Unread</span>
          </div>
          <button
            onClick={loadMessages}
            className="inline-flex items-center gap-2 text-fog hover:text-white text-sm border border-white/[0.08] hover:border-[#FFB800]/40 rounded-sm px-4 py-2.5 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="relative z-10 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="relative z-10 flex justify-center py-20">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        <div className="relative z-10 grid md:grid-cols-[360px_1fr] gap-5 items-start">
          <MessageList
            messages={messages}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
            formatDate={formatDate}
          />
          <MessageDetail
            message={selected}
            onDelete={requestDelete}
            formatDate={formatDate}
          />
        </div>
      )}

      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm"
        tone="danger"
        title="Delete this message?"
        message="This message will be permanently deleted. This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (modal?.kind === "confirm-delete") confirmDelete(modal.id);
        }}
        onClose={() => setModal(null)}
      />
    </div>
  );
}