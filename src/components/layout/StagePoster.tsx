// src/components/layout/StagePoster.tsx
// Static "bathymetry poster" behind the page while WebGL loads, and the
// permanent background when WebGL is unavailable. Pure CSS + SVG.

export default function StagePoster({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 ease-hydro ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "linear-gradient(180deg, #07131B 0%, #060E14 38%, #04090C 70%, #03070A 100%)" }}
    >
      <svg className="absolute inset-x-0 bottom-0 h-[70vh] w-full opacity-60" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
        <g fill="none" stroke="#1B2833" strokeWidth="1">
          {Array.from({ length: 14 }, (_, i) => {
            const y = 120 + i * 34;
            const a = 18 + i * 2;
            return (
              <path
                key={i}
                d={`M0 ${y} C 240 ${y - a}, 420 ${y + a}, 720 ${y - a * 0.4} S 1200 ${y + a * 0.8}, 1440 ${y}`}
                stroke={i % 5 === 0 ? "#22414E" : "#1B2833"}
              />
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-x-0 top-[38vh] h-px bg-gradient-to-r from-transparent via-hydro/25 to-transparent" />
    </div>
  );
}
