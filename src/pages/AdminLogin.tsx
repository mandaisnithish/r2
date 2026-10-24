// src/pages/AdminLogin.tsx
// Console sign-in. Same API (POST /api/v1/auth/login via AuthContext).
// Shows a notice when the previous session expired (401) and returns the
// operator to the page they were on.

import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { DropletMark } from "../components/layout/Wordmark";
import HudPanel from "../components/ui/HudPanel";
import RelayButton from "../components/ui/RelayButton";

const field =
  "mt-2 w-full border border-line-2 bg-abyss px-4 py-3 text-[15px] text-bone placeholder:text-drift/70 transition-colors focus:border-hydro focus:outline-none focus:ring-1 focus:ring-hydro/40";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as { from?: string; expired?: boolean };
  const { login, sessionExpired } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (!password) return setError("Password is required.");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(state.from?.startsWith("/admin/dashboard") ? state.from : "/admin/dashboard", { replace: true });
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center bg-abyss px-5 py-12">
      <div className="blueprint" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-3 text-bone">
          <DropletMark size={26} className="text-hydro" />
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.14em]">
            Aqua<span className="text-hydro">holics</span>
          </span>
        </Link>
        <HudPanel tone="hydro" serial="CONSOLE · AUTH" status={error ? "offline" : "ongoing"} statusLabel={error ? "Rejected" : "Awaiting credentials"} bodyClassName="p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold text-bone">Mission control</h1>
          <p className="mt-2 text-[14px] text-fog">Sign in to edit the website, the blog and read messages.</p>

          {(state.expired || sessionExpired) && !error && (
            <p role="status" className="mt-6 border-l-2 border-arc pl-3 text-[13px] text-arc">
              Your session expired. Sign in again to continue.
            </p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <label className="block">
              <span className="stencil">Email</span>
              <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@aquaholics.in" />
            </label>
            <label className="block">
              <span className="stencil">Password</span>
              <span className="relative block">
                <input type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-2 top-[calc(50%+4px)] grid h-9 w-9 -translate-y-1/2 place-items-center text-drift hover:text-bone"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            {error && <p role="alert" className="border-l-2 border-rust pl-3 text-[13px] text-rust">{error}</p>}
            <RelayButton type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Authenticating…" : "Open console"}
            </RelayButton>
          </form>
        </HudPanel>
        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-stencil text-drift">
          <Link to="/" className="hover:text-bone">← Back to the site</Link>
        </p>
      </div>
    </div>
  );
}
