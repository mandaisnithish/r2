// src/pages/robotx/RobotXLayout.tsx
// The RobotX dossier frame: a sticky mission strip under the main nav
// (countdown, section tabs, search), the page, and a sign-off strip.

import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import RobotXSearch from "../../components/robotx/RobotXSearch";
import RouteFallback from "../../components/layout/RouteFallback";
import { EVENT, NAV, TEAM } from "../../data/robotxData";
import { daysUntil, useNow } from "../../lib/useNow";

export default function RobotXLayout() {
  const now = useNow();
  const days = daysUntil(now, "2026-11-08");

  return (
    <div className="relative">
      <div className="sticky top-16 z-30 border-b border-line bg-abyss/90 backdrop-blur-md">
        <div className="grid-wrap flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/robotx" className="flex items-baseline gap-3" aria-label="RobotX 2026 dossier home">
            <span className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-bone">
              Robot<span className="text-arc">X</span> 2026
            </span>
            <span className="stencil hidden sm:inline">{TEAM.name} · {EVENT.venue.split(",")[0]}</span>
            <span className="stencil tabular text-arc">T−{String(days).padStart(2, "0")} days</span>
          </Link>
          <RobotXSearch />
        </div>
        <nav aria-label="RobotX sections" className="grid-wrap overflow-x-auto [scrollbar-width:none]">
          <ul className="flex min-w-max gap-1 pb-2">
            {NAV.map((item, i) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={"end" in item ? item.end : false}
                  data-ping
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-2 px-3 py-2 font-mono text-[11px] uppercase tracking-stencil transition-colors ${
                      isActive ? "text-bone" : "text-drift hover:text-bone"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-arc" : "text-line-2"}>{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                      {isActive && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-arc" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Suspense fallback={<RouteFallback label="Opening file" />}>
        <Outlet />
      </Suspense>

      <div className="grid-wrap mt-16">
        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="stencil">
            {TEAM.name} · {TEAM.institution} · {EVENT.name}
          </p>
          <a href={`mailto:${TEAM.email}`} className="font-mono text-[12px] text-arc hover:text-bone">{TEAM.email}</a>
        </div>
      </div>
    </div>
  );
}
