import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBFBF8",
        ink: {
          DEFAULT: "#1C2B33",
          soft: "#4A5B63",
        },
        jade: {
          DEFAULT: "#2F6F62",
          dark: "#234F45",
          light: "#E4EEEB",
        },
        amber: {
          DEFAULT: "#E8A33D",
          light: "#FBEBD3",
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
