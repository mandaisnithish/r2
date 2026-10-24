// src/components/admin/MessageDetail.tsx
import { MailOpen, Trash2, MessageSquare } from "lucide-react";
import type { ContactMessageAdmin } from "../../types/contactMessage";
import { getSenderColor } from "../../utils/avatarColor";

interface Props {
  message: ContactMessageAdmin | null;
  onDelete: (id: number) => void;
  formatDate: (iso: string) => string;
}

const ACCENT = "#FFB800";

export default function MessageDetail({ message, onDelete, formatDate }: Props) {
  return (
    <div className="rounded-sm border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] flex flex-col min-h-[460px]">
      {/* panel header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06] bg-white/[0.015]">
        <div className="w-6 h-6 rounded-md bg-[#FFB800]/15 flex items-center justify-center">
          <MessageSquare size={12} className="text-[#FFB800]" />
        </div>
        <span className="text-bone/90 text-xs font-semibold uppercase tracking-wider">Message</span>
      </div>

      {!message ? (
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8 overflow-hidden">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${ACCENT}14` }}
          />
          <div
            className="relative w-14 h-14 rounded-sm flex items-center justify-center mb-5"
            style={{ backgroundColor: `${ACCENT}1A`, border: `1px solid ${ACCENT}33` }}
          >
            <MailOpen size={22} style={{ color: ACCENT }} />
          </div>
          <p className="relative text-drift text-sm">Select a message to read it</p>
        </div>
      ) : (
        (() => {
          const avatarColor = getSenderColor(message.name);
          const avatarStyle = message.isRead
            ? { backgroundColor: `${avatarColor}14`, color: `${avatarColor}99` }
            : { backgroundColor: `${avatarColor}26`, color: avatarColor, boxShadow: `0 0 12px ${avatarColor}40` };

          return (
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.05]">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={avatarStyle}
                  >
                    {message.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-white text-lg mb-1 leading-tight">
                      {message.subject}
                    </h2>
                    <p className="text-fog text-sm">
                      {message.name} ·{" "}
                      <a href={`mailto:${message.email}`} className="hover:underline" style={{ color: ACCENT }}>
                        {message.email}
                      </a>
                    </p>
                    <p className="text-drift/70 text-xs mt-1">{formatDate(message.submittedAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-drift hover:text-red-400 p-2.5 rounded-sm hover:bg-red-400/10 transition-colors flex-shrink-0"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="text-bone/90 text-sm leading-relaxed whitespace-pre-wrap flex-1">
                {message.message}
              </div>


            </div>
          );
        })()
      )}
    </div>
  );
}