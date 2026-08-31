import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#030712",
        "paper-card": "#0b132b",
        "paper-elevated": "#111827",
        ink: {
          DEFAULT: "#F8FAFC",
          soft: "#94A3B8",
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

export default config;
