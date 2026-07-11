// src/components/admin/MessageList.tsx
import { Mail, Inbox } from "lucide-react";
import type { ContactMessageAdmin } from "../../types/contactMessage";
import { getSenderColor } from "../../utils/avatarColor";

interface Props {
  messages: ContactMessageAdmin[];
  selectedId: number | null;
  onSelect: (msg: ContactMessageAdmin) => void;
  formatDate: (iso: string) => string;
}

const ACCENT = "#F59E0B";

export default function MessageList({ messages, selectedId, onSelect, formatDate }: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
      {/* panel header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06] bg-white/[0.015]">
        <div className="w-6 h-6 rounded-md bg-[#F59E0B]/15 flex items-center justify-center">
          <Inbox size={12} className="text-[#F59E0B]" />
        </div>
        <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Inbox</span>
        <span className="ml-auto text-slate-600 text-xs bg-white/[0.04] px-2 py-0.5 rounded-full">
          {messages.length}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="p-12 text-center">
          <Mail size={28} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No messages yet.</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isActive = selectedId === msg.id;
          const avatarColor = getSenderColor(msg.name);
          const initial = msg.name?.[0]?.toUpperCase() ?? "?";

          const avatarStyle = msg.isRead
            ? { backgroundColor: `${avatarColor}14`, color: `${avatarColor}99` }
            : { backgroundColor: `${avatarColor}26`, color: avatarColor, boxShadow: `0 0 10px ${avatarColor}40` };

          return (
            <button
              key={msg.id}
              onClick={() => onSelect(msg)}
              className={`group relative w-full text-left px-5 py-4 border-b border-white/[0.05] last:border-0 transition-all duration-200 ${
                isActive ? "bg-[#F59E0B]/[0.08]" : "hover:bg-white/[0.04]"
              }`}
            >
              {/* hover bar — same animation as BlogRow, always rendered, slides in on hover/active */}
              <span
                className={`absolute left-0 top-0 bottom-0 w-[3px] transition-transform duration-200 origin-center ${
                  isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                }`}
                style={{ backgroundColor: ACCENT, boxShadow: isActive ? `0 0 8px ${ACCENT}` : "none" }}
              />

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                  style={avatarStyle}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    {/* white text on selected row, matching Blog rows */}
                    <span
                      className={`text-sm truncate font-medium transition-colors ${
                        isActive
                          ? "text-white"
                          : msg.isRead
                          ? "text-slate-400 group-hover:text-slate-200"
                          : "text-white"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-slate-600 text-[11px] flex-shrink-0">
                      {formatDate(msg.submittedAt).split(",")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span
                      className={`text-xs truncate ${
                        isActive
                          ? "text-slate-300"
                          : msg.isRead
                          ? "text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {msg.subject}
                    </span>
                    {!msg.isRead && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}