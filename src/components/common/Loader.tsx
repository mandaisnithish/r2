import companyLogo from "../../assets/companylogo.jpeg";

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#060B16] flex flex-col items-center justify-center z-[9999] overflow-hidden">

      {/* Ambient glow behind everything, matched to brand cyan */}
      <div className="absolute w-[560px] h-[560px] rounded-full bg-[#00B4D8]/[0.07] blur-3xl" />

      {/* Bubble column rising up from beneath the logo */}
      <span className="absolute w-1 h-1 rounded-full bg-[#00B4D8]/70 animate-[bubble_3.2s_ease-in_infinite]" style={{ left: "calc(50% - 8px)" }} />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-[#00B4D8]/60 animate-[bubble_2.6s_ease-in_infinite] [animation-delay:0.5s]" style={{ left: "calc(50% + 14px)" }} />
      <span className="absolute w-1 h-1 rounded-full bg-[#00B4D8]/60 animate-[bubble_3.6s_ease-in_infinite] [animation-delay:1.1s]" style={{ left: "calc(50% - 20px)" }} />
      <span className="absolute w-1.5 h-1.5 rounded-full bg-[#00B4D8]/50 animate-[bubble_2.9s_ease-in_infinite] [animation-delay:1.7s]" style={{ left: "calc(50% + 6px)" }} />
      <span className="absolute w-1 h-1 rounded-full bg-[#00B4D8]/60 animate-[bubble_3.3s_ease-in_infinite] [animation-delay:2.2s]" style={{ left: "calc(50% - 2px)" }} />

      <div className="relative flex items-center justify-center w-56 h-56">

        {/* Radar sweep — a soft rotating wedge of light behind the logo */}
        <div
          className="absolute w-56 h-56 rounded-full animate-[spin_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, rgba(0,180,216,0.25), transparent 35%)",
          }}
        />

        {/* Expanding sonar rings */}
        <span className="absolute w-24 h-24 rounded-full border-2 border-[#00B4D8] animate-[ripple_2.8s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        <span className="absolute w-24 h-24 rounded-full border-2 border-[#00B4D8] animate-[ripple_2.8s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:0.9s]" />
        <span className="absolute w-24 h-24 rounded-full border-2 border-[#00B4D8] animate-[ripple_2.8s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:1.8s]" />

        {/* Static faint guide ring */}
        <div className="absolute w-36 h-36 rounded-full border border-[#00B4D8]/20" />

        {/* Orbit 1 — comet dot, clockwise */}
        <div className="absolute w-36 h-36 rounded-full animate-[spin_3.5s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#00B4D8] shadow-[0_0_14px_#00B4D8]" />
        </div>

        {/* Orbit 2 — comet dot, counter-clockwise, larger radius */}
        <div className="absolute w-44 h-44 rounded-full animate-[spin-reverse_6s_linear_infinite]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#48CAE4] shadow-[0_0_12px_#48CAE4]" />
        </div>

        {/* Logo — circular, still, breathing glow, brand-matched */}
        <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_45px_rgba(0,180,216,0.5)] overflow-hidden animate-pulse-glow ring-2 ring-[#00B4D8]/50">
          <img
            src={companyLogo}
            alt="Aquaholics"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <p className="mt-8 text-[#00B4D8] font-heading font-black text-sm tracking-[0.3em] uppercase animate-pulse">
        Deploying AWSCR
      </p>

      <div className="flex gap-1.5 mt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-[dot-pulse_1.4s_ease-in-out_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-[dot-pulse_1.4s_ease-in-out_infinite] [animation-delay:0.2s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] animate-[dot-pulse_1.4s_ease-in-out_infinite] [animation-delay:0.4s]" />
      </div>

      {/* Animated waterline, brand-matched colors */}
      <svg
        className="absolute bottom-0 left-0 w-full h-40 opacity-70"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 C150,110 350,30 600,70 C850,110 1050,30 1200,70 L1200,140 L0,140 Z"
          fill="#00B4D8"
          fillOpacity="0.12"
          className="animate-[wave_7s_ease-in-out_infinite]"
        />
        <path
          d="M0,85 C200,45 400,115 600,85 C800,55 1000,115 1200,85 L1200,140 L0,140 Z"
          fill="#00B4D8"
          fillOpacity="0.18"
          className="animate-[wave_5s_ease-in-out_infinite_reverse]"
        />
        <path
          d="M0,100 C220,130 380,80 600,100 C820,120 980,80 1200,100 L1200,140 L0,140 Z"
          fill="#0A1628"
          fillOpacity="0.6"
          className="animate-[wave_4s_ease-in-out_infinite]"
        />
      </svg>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 0.9; border-width: 2.5px; }
          100% { transform: scale(2.6); opacity: 0; border-width: 0.5px; }
        }
        @keyframes bubble {
          0% { bottom: 12%; opacity: 0; transform: translateX(0) scale(0.6); }
          15% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { bottom: 80%; opacity: 0; transform: translateX(10px) scale(1.1); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-50px); }
        }
      `}</style>
    </div>
  );
}