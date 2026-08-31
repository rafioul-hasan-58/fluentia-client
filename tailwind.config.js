/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#030712", // Deep space black
        "paper-card": "#0b132b", // Surface card background
        "paper-elevated": "#111827", // Elevated dialog / dropdown
        ink: {
          DEFAULT: "#F8FAFC", // Crisp white text
          soft: "#94A3B8", // Slate-400 secondary text
        },
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#1e3a8a",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#78350f",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};
