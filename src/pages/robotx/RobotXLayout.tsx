import { Link, NavLink, Outlet } from "react-router-dom";
import RobotXSearch from "../../components/robotx/RobotXSearch";
import { EVENT, NAV, TEAM } from "../../data/robotxData";

export default function RobotXLayout() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      {/* =========================================================
          ROBOTX SUB NAVIGATION
      ========================================================= */}
      <header className="sticky top-[72px] z-30 border-b border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Top row */}
          <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
            <Link
              to="/robotx"
              className="flex w-fit items-center gap-3"
              aria-label="RobotX 2026 home"
            >
              <span className="font-heading text-lg font-extrabold tracking-wide text-white">
                ROBOT
                <span className="text-[#00B4D8]">X</span> 2026
              </span>

              <span className="hidden text-xs text-slate-400 sm:inline">
                · {TEAM.name}
              </span>
            </Link>

            <div className="w-full lg:w-auto">
              <RobotXSearch />
            </div>
          </div>

          {/* Navigation */}
          <nav
            aria-label="RobotX sections"
            className="overflow-x-auto"
          >
            <ul className="flex min-w-max gap-1 whitespace-nowrap py-2">
              {NAV.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/robotx"}
                    className={({ isActive }) =>
                      [
                        "inline-flex items-center rounded-md px-3 py-2",
                        "text-sm font-medium transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2",
                        "focus-visible:ring-[#00B4D8]",
                        isActive
                          ? "bg-[#00B4D8]/15 text-[#00F5FF]"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}
      <main>
        <Outlet />
      </main>

      {/* =========================================================
          ROBOTX CONTACT STRIP
      ========================================================= */}
      <footer className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-300 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-white">
              {TEAM.name}
            </span>{" "}
            · {TEAM.institution}
          </p>

          <p>
            <a
              href={`mailto:${TEAM.email}`}
              className="text-[#00B4D8] underline underline-offset-2 transition-colors hover:text-[#00F5FF]"
            >
              {TEAM.email}
            </a>{" "}
            · {EVENT.name}
          </p>
        </div>
      </footer>
    </div>
  );
}