/* Author: Nithish Kaliannan Ananth */
import typography from "@tailwindcss/typography";

// Tokens mirror DESIGN_SYSTEM.md §2–§6. Change them there first.
const colors = {
  abyss: "#040C12",
  hull: "#0A1720",
  "hull-2": "#10212D",
  line: "#192D3A",
  "line-2": "#264050",
  bone: "#E6EEF2",
  fog: "#93A8B6",
  drift: "#78909F",
  hydro: "#38C6D9",
  "hydro-deep": "#0E6B7C",
  arc: "#E5A93B",
  rust: "#E04F44",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ['"Chakra Petch"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // Legacy aliases still used by the admin console.
        heading: ['"Chakra Petch"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: { grid: "1320px" },
      transitionTimingFunction: {
        hydro: "cubic-bezier(.22,.9,.24,1)",
        servo: "steps(6, end)",
      },
      letterSpacing: { stencil: "0.08em" },
      typography: () => ({
        hydro: {
          css: {
            "--tw-prose-body": colors.fog,
            "--tw-prose-headings": colors.bone,
            "--tw-prose-lead": colors.bone,
            "--tw-prose-links": colors.hydro,
            "--tw-prose-bold": colors.bone,
            "--tw-prose-counters": colors.drift,
            "--tw-prose-bullets": colors.hydro,
            "--tw-prose-hr": colors.line,
            "--tw-prose-quotes": colors.bone,
            "--tw-prose-quote-borders": colors.arc,
            "--tw-prose-captions": colors.drift,
            "--tw-prose-code": colors.hydro,
            "--tw-prose-pre-code": colors.bone,
            "--tw-prose-pre-bg": colors.hull,
            "--tw-prose-th-borders": colors["line-2"],
            "--tw-prose-td-borders": colors.line,
            fontSize: "1.0625rem",
            lineHeight: "1.8",
            h2: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: "600", letterSpacing: "-0.005em" },
            h3: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: "600" },
            a: { textDecoration: "none", borderBottom: `1px solid ${colors["hydro-deep"]}`, fontWeight: "500" },
            "a:hover": { borderBottomColor: colors.hydro },
            img: { borderRadius: "0", border: `1px solid ${colors.line}` },
            blockquote: {
              fontFamily: '"Chakra Petch", sans-serif',
              fontStyle: "normal",
              fontWeight: "500",
              borderLeftWidth: "2px",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            code: { fontFamily: '"IBM Plex Mono", monospace', fontWeight: "400" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
