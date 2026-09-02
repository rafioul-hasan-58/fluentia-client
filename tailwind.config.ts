import type { Config } from "tailwindcss";

const config: Config = {
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
        paper: "var(--background)",
        "paper-card": "var(--surface)",
        "paper-elevated": "var(--surface-hover)",
        border: "var(--border)",
        ink: {
          DEFAULT: "var(--text)",
          soft: "var(--text-soft)",
        },
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "var(--primary-light)",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "rgba(245, 158, 11, 0.15)",
        },
      },
      fontFamily: {
        brand: ["var(--font-brand)", "var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        nav: ["var(--font-brand)", "var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-brand)", "var(--font-outfit)", "sans-serif"],
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
