/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/DashboardHome.tsx
// Console overview: live counts from the blog and inbox APIs, plus
// quick routes into each content area.

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, FileText, Globe, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAllBlogsForAdmin } from "../../api/admin/blogAdminApi";
import { getAllMessages } from "../../api/admin/contactMessageAdminApi";
import HudPanel from "../../components/ui/HudPanel";

const AREAS = [
  { to: "/admin/dashboard/content", code: "C-01", title: "Website content", desc: "Home, About, Product, Impact timeline and Contact.", icon: Globe },
  { to: "/admin/dashboard/blog", code: "C-02", title: "Blog", desc: "Write posts, edit drafts, publish or unpublish.", icon: FileText },
  { to: "/admin/dashboard/messages", code: "C-03", title: "Messages", desc: "Submissions from the contact form.", icon: Mail },
  { to: "/admin/dashboard/sensors", code: "C-04", title: "River monitoring", desc: "Waste collected and water-quality readings.", icon: Activity },
];

export default function DashboardHome() {
  const { email } = useAuth();
  const name = email?.split("@")[0] ?? "operator";
  const blogs = useQuery({ queryKey: ["admin", "blogs"], queryFn: getAllBlogsForAdmin });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: getAllMessages });

  const published = blogs.data?.filter((b) => b.published).length;
  const drafts = blogs.data?.filter((b) => !b.published).length;
  const unread = messages.data?.filter((m) => !m.isRead).length;
  const total = messages.data?.length;
  const err = blogs.isError || messages.isError;

  const reading = (v: number | undefined, loading: boolean) => (loading ? "··" : v === undefined ? "—" : String(v).padStart(2, "0"));

  return (
    <div>
      <p className="stencil">C-00 // OVERVIEW</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">Welcome back, {name}.</h1>
      <p className="mt-2 text-fog">Everything on aquaholics.in is edited from here.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published posts", v: reading(published, blogs.isLoading), tone: "text-bone" },
          { label: "Drafts", v: reading(drafts, blogs.isLoading), tone: "text-drift" },
          { label: "Unread messages", v: reading(unread, messages.isLoading), tone: (unread ?? 0) > 0 ? "text-arc" : "text-bone" },
          { label: "Messages total", v: reading(total, messages.isLoading), tone: "text-bone" },
        ].map((s) => (
          <HudPanel key={s.label} serial={s.label}>
            <p className={`font-display text-5xl font-semibold tabular ${s.tone}`}>{s.v}</p>
          </HudPanel>
        ))}
      </div>
      {err && <p role="alert" className="mt-4 border-l-2 border-rust pl-3 text-[13px] text-rust">Couldn’t load live counts. The API may be waking up — refresh in a minute.</p>}

      <h2 className="mt-14 stencil">Content areas</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {AREAS.map(({ to, code, title, desc, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="group flex h-full items-start gap-4 border border-line bg-hull/60 p-5 transition-colors hover:border-hydro/50">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-line-2 text-fog group-hover:text-hydro">
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-mono text-[10px] text-hydro">{code}</span>
                <span className="mt-1 block font-display text-lg font-semibold text-bone">{title}</span>
                <span className="mt-1 block text-[14px] text-fog">{desc}</span>
              </span>
              <ArrowRight size={16} className="mt-1 text-drift transition-transform group-hover:translate-x-1 group-hover:text-bone" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
