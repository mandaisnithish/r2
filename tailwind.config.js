/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00B4D8",
        "primary-dark": "#0077B6",
        "primary-light": "#90E0EF",
        accent: "#00F5FF",
        "dark-bg": "#0A0F1E",
        "dark-surface": "#0D1B2A",
        "dark-deep": "#060B16",
      },
      fontFamily: {
        heading: ["Exo 2", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,180,216,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,245,255,0.5)" },
        },
      },
    },
  },
  plugins: [],
}