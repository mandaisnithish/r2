import { Link, NavLink, Outlet } from "react-router-dom";
import RobotXSearch from "../../components/robotx/RobotXSearch";
import { EVENT, NAV, TEAM } from "../../data/robotxData";

export default function RobotXLayout() {
  return (
    <div>
      {/* Sub-navigation (sticks under the main Navbar) */}
      <div className="sticky top-[72px] z-30 border-b border-white/10 bg-[#0A0F1E]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/robotx" className="flex items-center gap-3">
            <span className="font-heading text-lg font-extrabold tracking-wide text-white">
              ROBOT<span className="text-[#00B4D8]">X</span> 2026
            </span>
            <span className="hidden sm:inline text-xs text-slate-400">· {TEAM.name}</span>
          </Link>
          <RobotXSearch />
        </div>
        <nav aria-label="RobotX sections" className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <ul className="flex gap-1 whitespace-nowrap py-2">
            {NAV.map((n) => (
              <li key={n.path}>
                <NavLink
                  to={n.path}
                  end={n.end}
                  className={({ isActive }) =>
                    `inline-block rounded-md px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] ${
                      isActive ? "bg-[#00B4D8]/15 text-[#00F5FF]" : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Outlet />

      {/* RobotX contact strip — appears on every RobotX page */}
      <div className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-sm text-slate-300">
          <p>
            <span className="font-semibold text-white">{TEAM.name}</span> · {TEAM.institution}
          </p>
          <p>
            <a href={`mailto:${TEAM.email}`} className="text-[#00B4D8] hover:text-[#00F5FF] underline underline-offset-2">
              {TEAM.email}
            </a>{" "}
            · {EVENT.name}
          </p>
        </div>
      </div>
    </div>
  );
}
