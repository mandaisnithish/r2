// src/components/admin/AdminLayout.tsx
// Mission-control console: hairline rail, mono navigation, session strip.
// Same tokens and type as the public site, but no WebGL, no grain, high
// contrast and keyboard-first.

import { type ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Activity, ExternalLink, FileText, Globe, LayoutDashboard, LogOut, Mail, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DropletMark } from "../layout/Wordmark";
import { istStamp } from "../../lib/format";
import { useNow } from "../../lib/useNow";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Overview", code: "C-00", icon: LayoutDashboard, end: true },
  { to: "/admin/dashboard/content", label: "Website content", code: "C-01", icon: Globe },
  { to: "/admin/dashboard/blog", label: "Blog", code: "C-02", icon: FileText },
  { to: "/admin/dashboard/messages", label: "Messages", code: "C-03", icon: Mail },
  { to: "/admin/dashboard/sensors", label: "River monitoring", code: "C-04", icon: Activity },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const now = useNow();
  const active = NAV_ITEMS.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)));

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const rail = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-5">
        <span className="flex items-center gap-3">
          <DropletMark size={26} className="text-hydro" />
          <span>
            <span className="block font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-bone">
              Aqua<span className="text-hydro">holics</span>
            </span>
            <span className="stencil text-[10px]">Mission control</span>
          </span>
        </span>
        <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center border border-line-2 text-fog md:hidden" aria-label="Close menu">
          <X size={16} />
        </button>
      </div>
      <nav aria-label="Console" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, code, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 border px-3 py-2.5 text-sm transition-colors ${
                    isActive ? "border-line-2 bg-hull text-bone" : "border-transparent text-fog hover:border-line hover:text-bone"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-px bg-hydro" />}
                    <span className={`font-mono text-[10px] ${isActive ? "text-hydro" : "text-drift"}`}>{code}</span>
                    <Icon size={15} className={isActive ? "text-hydro" : "text-drift group-hover:text-fog"} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-3 border-t border-line px-5 py-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-stencil text-drift hover:text-bone">
          View live site <ExternalLink size={12} />
        </a>
        <div className="min-w-0">
          <p className="stencil">Operator</p>
          <p className="mt-1 truncate font-mono text-[12px] text-bone">{email ?? "admin"}</p>
        </div>
        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 border border-line-2 px-3 py-2 font-mono text-[11px] uppercase tracking-stencil text-fog transition-colors hover:border-rust/60 hover:text-rust">
          <LogOut size={13} /> End session
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-abyss text-bone">
      {/* desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-[#080D11] md:block">{rail}</aside>

      {/* mobile drawer */}
      {open && <div className="fixed inset-0 z-40 bg-abyss/70 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-[#080D11] transition-transform duration-300 ease-hydro md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {rail}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-abyss/95 px-4 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center border border-line-2 text-fog md:hidden" aria-label="Open menu">
              <Menu size={16} />
            </button>
            <span className="font-mono text-[11px] text-hydro">{active?.code ?? "C-00"}</span>
            <span className="truncate text-sm text-bone">{active?.label ?? "Console"}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden font-mono text-[11px] text-drift tabular sm:inline">{istStamp(new Date(now)).slice(0, 16)} IST</span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-stencil text-hydro">
              <span className="h-1.5 w-1.5 rounded-full bg-hydro" /> Session live
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
