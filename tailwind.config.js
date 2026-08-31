/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F8FAFC",
        ink: {
          DEFAULT: "#0F172A",
          soft: "#475569",
        },
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#EFF6FF",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
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
