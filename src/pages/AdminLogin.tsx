// src/pages/AdminLogin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlowCard from "../components/common/GlowCard";
import companyLogo from "../assets/companylogo.jpeg";

const SUBTITLE = "Aquaholics control panel";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [typedText, setTypedText] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(SUBTITLE.slice(0, i + 1));
      i++;
      if (i === SUBTITLE.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);
      setError("Incorrect email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-6 relative overflow-hidden">

      <style>{`
        /* ── HUD rings ── */
        @keyframes hudRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes hudRotateReverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes hudPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.35; }
        }
        @keyframes scanLine {
          0%   { top: -10%; opacity: 0; }
          10%  { opacity: 0.4; }
          90%  { opacity: 0.4; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes cornerBlink {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 0.15; }
        }
        /* ── Bubbles ── */
        @keyframes bubbleRise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(1.3); opacity: 0; }
        }
        /* ── Hex grid ── */
        @keyframes hexFade {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.07; }
        }
        /* ── Targeting cross ── */
        @keyframes targetPing {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2);   opacity: 0; }
        }
        /* ── Waveform ── */
        @keyframes waveMove {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* ── Blink cursor ── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        /* ── Shimmer button ── */
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .shimmer-btn { position: relative; overflow: hidden; }
        .shimmer-btn::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
        .login-input {
          width: 100%;
          background: rgba(10,15,30,0.8);
          border: 1px solid rgba(0,180,216,0.15);
          border-radius: 12px;
          padding: 10px 16px 10px 40px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #334155; }
        .login-input:focus {
          border-color: rgba(0,180,216,0.5);
          border-left: 3px solid #00B4D8;
          box-shadow: 0 0 0 3px rgba(0,180,216,0.08);
        }

        /* bubbles */
        .bubble { position: absolute; border-radius: 50%; animation: bubbleRise linear infinite; }

        /* HUD ring base */
        .hud-ring {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(0,180,216,0.2);
          animation: hudPulse 3s ease-in-out infinite;
        }
        .hud-ring-spin {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%;
          border-top: 1px solid rgba(0,245,255,0.5);
          border-right: 1px solid transparent;
          border-bottom: 1px solid transparent;
          border-left: 1px solid transparent;
        }
      `}</style>

      {/* ── BACKGROUND LAYER ── */}

      {/* Base dark glow center */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,180,216,0.06) 0%, transparent 70%)" }} />

      {/* HUD concentric static rings */}
      {[320, 460, 600, 740, 880].map((size, i) => (
        <div key={i} className="hud-ring pointer-events-none"
          style={{
            width: size, height: size,
            marginLeft: -size / 2, marginTop: -size / 2,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }} />
      ))}

      {/* HUD spinning dashed rings */}
      <div className="hud-ring-spin pointer-events-none"
        style={{
          width: 520, height: 520,
          marginLeft: -260, marginTop: -260,
          animation: "hudRotate 12s linear infinite",
        }} />
      <div className="hud-ring-spin pointer-events-none"
        style={{
          width: 680, height: 680,
          marginLeft: -340, marginTop: -340,
          animation: "hudRotateReverse 18s linear infinite",
          borderTopColor: "rgba(0,180,216,0.3)",
        }} />
      <div className="hud-ring-spin pointer-events-none"
        style={{
          width: 820, height: 820,
          marginLeft: -410, marginTop: -410,
          animation: "hudRotate 25s linear infinite",
          borderTopColor: "rgba(0,245,255,0.2)",
        }} />

      {/* HUD corner brackets — top left */}
      {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} pointer-events-none`}
          style={{ animation: `cornerBlink ${1.5 + i * 0.3}s ease-in-out infinite` }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            {i === 0 && <><path d="M0 20 L0 0 L20 0" stroke="#00B4D8" strokeWidth="1.5" fill="none"/></>}
            {i === 1 && <><path d="M40 20 L40 0 L20 0" stroke="#00B4D8" strokeWidth="1.5" fill="none"/></>}
            {i === 2 && <><path d="M0 20 L0 40 L20 40" stroke="#00B4D8" strokeWidth="1.5" fill="none"/></>}
            {i === 3 && <><path d="M40 20 L40 40 L20 40" stroke="#00B4D8" strokeWidth="1.5" fill="none"/></>}
          </svg>
        </div>
      ))}

      {/* Scan line sweeping down */}
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.4), rgba(0,245,255,0.6), rgba(0,180,216,0.4), transparent)",
          animation: "scanLine 6s ease-in-out infinite",
          boxShadow: "0 0 12px rgba(0,180,216,0.4)",
        }} />

      {/* Targeting crosshair ping top-right */}
      <div className="absolute pointer-events-none" style={{ top: "20%", right: "15%" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 60, height: 60, borderRadius: "50%",
          border: "1px solid rgba(0,180,216,0.6)",
          animation: "targetPing 2.5s ease-out infinite",
        }} />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.4 }}>
          <line x1="10" y1="0" x2="10" y2="7" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="10" y1="13" x2="10" y2="20" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="0" y1="10" x2="7" y2="10" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="13" y1="10" x2="20" y2="10" stroke="#00B4D8" strokeWidth="1"/>
          <circle cx="10" cy="10" r="3" stroke="#00B4D8" strokeWidth="1"/>
        </svg>
      </div>

      {/* Targeting crosshair ping bottom-left */}
      <div className="absolute pointer-events-none" style={{ bottom: "25%", left: "12%" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 50, height: 50, borderRadius: "50%",
          border: "1px solid rgba(0,180,216,0.4)",
          animation: "targetPing 3.5s ease-out infinite 1s",
        }} />
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.3 }}>
          <line x1="10" y1="0" x2="10" y2="7" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="10" y1="13" x2="10" y2="20" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="0" y1="10" x2="7" y2="10" stroke="#00B4D8" strokeWidth="1"/>
          <line x1="13" y1="10" x2="20" y2="10" stroke="#00B4D8" strokeWidth="1"/>
          <circle cx="10" cy="10" r="3" stroke="#00B4D8" strokeWidth="1"/>
        </svg>
      </div>

      {/* Rising bubbles */}
      {[
        { left: "5%",  size: 4,  duration: "8s",  delay: "0s"   },
        { left: "12%", size: 6,  duration: "11s", delay: "2s"   },
        { left: "20%", size: 3,  duration: "9s",  delay: "4s"   },
        { left: "75%", size: 5,  duration: "10s", delay: "1s"   },
        { left: "82%", size: 4,  duration: "7s",  delay: "3s"   },
        { left: "90%", size: 7,  duration: "13s", delay: "0.5s" },
        { left: "93%", size: 3,  duration: "9s",  delay: "5s"   },
        { left: "30%", size: 4,  duration: "12s", delay: "6s"   },
        { left: "65%", size: 5,  duration: "10s", delay: "2.5s" },
      ].map((b, i) => (
        <div key={i} className="bubble pointer-events-none"
          style={{
            left: b.left,
            bottom: "-20px",
            width: b.size,
            height: b.size,
            background: `rgba(0,180,216,${0.2 + Math.random() * 0.2})`,
            boxShadow: `0 0 ${b.size * 2}px rgba(0,180,216,0.4)`,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }} />
      ))}

      {/* HUD data readouts — left side */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex flex-col gap-3"
        style={{ opacity: 0.25 }}>
        {["SYS: ONLINE", "AUTH: READY", "SEC: LVL 5", "NET: STABLE"].map((txt, i) => (
          <div key={i} className="text-[#00B4D8] font-mono text-xs flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00B4D8]"
              style={{ animation: `blink ${1 + i * 0.3}s infinite` }} />
            {txt}
          </div>
        ))}
      </div>

      {/* HUD data readouts — right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex flex-col gap-3 items-end"
        style={{ opacity: 0.25 }}>
        {["ROBOT: ACTIVE", "WATER: CLEAN", "AI: ENGAGED", "GPS: LOCKED"].map((txt, i) => (
          <div key={i} className="text-[#00B4D8] font-mono text-xs flex items-center gap-2">
            {txt}
            <div className="w-1.5 h-1.5 rounded-full bg-[#00B4D8]"
              style={{ animation: `blink ${1.2 + i * 0.3}s infinite` }} />
          </div>
        ))}
      </div>

      {/* Waves bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
        <svg style={{ width: "200%", animation: "waveMove 8s linear infinite" }} viewBox="0 0 1440 120" fill="none">
          <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,20 1440,60 L1440,120 L0,120 Z" fill="rgba(0,180,216,0.06)" />
          <path d="M0,80 C240,40 480,100 720,80 C960,60 1200,100 1440,80 L1440,120 L0,120 Z" fill="rgba(0,180,216,0.04)" />
        </svg>
      </div>

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        <GlowCard>
          {/* Cyan top accent bar */}
          <div className="h-[3px] w-full rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, transparent, #00B4D8, #00F5FF, #00B4D8, transparent)" }} />

          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 mb-4">
                <img src={companyLogo} alt="Aquaholics logo" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-bold text-lg tracking-widest text-white">
                  AQUA<span className="text-[#00B4D8]">HOLICS</span>
                </span>
              </div>

              <div className="w-full h-px mb-5"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.3), transparent)" }} />

              <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/25 flex items-center justify-center mb-3">
                <Lock size={22} className="text-[#00B4D8]" />
              </div>
              <h1 className="text-white font-semibold text-xl">Admin Login</h1>
              <p className="text-slate-500 text-sm mt-1 h-5">
                {typedText}
                <span className="text-[#00B4D8]" style={{ animation: "blink 1s infinite" }}>|</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <input
                    type="text"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@aquaholics.com"
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5 tracking-wider uppercase">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="login-input"
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00B4D8] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                className="shimmer-btn w-full bg-[#00B4D8] hover:bg-[#00d4f5] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0F1E] font-bold text-sm rounded-xl py-3 mt-1 transition-all duration-200 hover:-translate-y-px active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? "Signing in..." : (
                  <>
                    Sign in
                    <motion.span animate={{ x: btnHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
                  </>
                )}
              </button>
            </form>

            <div className="w-full h-px mt-6 mb-4"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,180,216,0.2), transparent)" }} />
            <p className="text-center text-slate-700 text-xs">🔒 Secured access · Aquaholics internal only</p>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}