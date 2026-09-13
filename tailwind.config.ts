import type { Config } from "tailwindcss";
import { themeConfig } from "./src/config/theme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "paper-card": "var(--surface)",
        "paper-elevated": "var(--surface-hover)",
        border: "var(--border)",
        ink: {
          DEFAULT: "var(--text)",
          soft: "var(--text-soft)",
        },
        primary: {
          DEFAULT: themeConfig.colors.primary.DEFAULT,
          dark: themeConfig.colors.primary.dark,
          light: "var(--primary-light)",
        },
        secondary: {
          DEFAULT: themeConfig.colors.secondary.DEFAULT,
          dark: themeConfig.colors.secondary.dark,
          light: themeConfig.colors.secondary.light,
        },
        amber: {
          DEFAULT: themeConfig.colors.amber.DEFAULT,
          light: themeConfig.colors.amber.light,
        },
        emerald: {
          DEFAULT: themeConfig.colors.emerald.DEFAULT,
          light: themeConfig.colors.emerald.light,
        },
        rose: {
          DEFAULT: themeConfig.colors.rose.DEFAULT,
          light: themeConfig.colors.rose.light,
        },
        cyan: {
          DEFAULT: themeConfig.colors.accent.DEFAULT,
          light: themeConfig.colors.accent.light,
        },
        purple: {
          DEFAULT: themeConfig.colors.purple.DEFAULT,
          light: themeConfig.colors.purple.light,
        },
      },
      backgroundImage: {
        "gradient-primary": themeConfig.gradients.primary,
        "gradient-primary-hover": themeConfig.gradients.primaryHover,
        "gradient-secondary": themeConfig.gradients.secondary,
        "gradient-hero": themeConfig.gradients.hero,
        "gradient-hero-dark": themeConfig.gradients.heroDark,
        "gradient-accent": themeConfig.gradients.accent,
        "gradient-card-border": themeConfig.gradients.cardBorder,
      },
      fontFamily: {
        brand: ["var(--font-brand)", "var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        nav: ["var(--font-brand)", "var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-brand)", "var(--font-outfit)", "sans-serif"],
        bangla: ["var(--font-bangla)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "var(--font-bangla)", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
