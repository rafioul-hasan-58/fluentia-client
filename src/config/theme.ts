/**
 * ==============================================================================
 * FLUENTIA CENTRAL THEME CONFIGURATION
 * ==============================================================================
 * 
 * This is the SINGLE SOURCE OF TRUTH for all colors, themes, and gradients in
 * the application. Modifying values here will instantly propagate across:
 *   1. CSS Variables (:root and .dark in globals.css)
 *   2. Tailwind CSS utility classes (bg-primary, text-ink, bg-gradient-primary, etc.)
 *   3. React components and UI elements
 *
 * HOW TO CUSTOMIZE:
 * - Change Primary Color: Update `themeConfig.colors.primary` & mode entries
 * - Change Secondary Color: Update `themeConfig.colors.secondary` & mode entries
 * - Change Background/Surfaces: Update `themeConfig.modes.light` or `themeConfig.modes.dark`
 * - Change Gradients: Update `themeConfig.gradients`
 * ==============================================================================
 */

export interface ColorShade {
  DEFAULT: string;
  dark?: string;
  light?: string;
  glow?: string;
  foreground?: string;
}

export interface ModeTokens {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textSoft: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  card: string;
  cardHover: string;
}

export interface GradientTokens {
  primary: string;
  primaryHover: string;
  secondary: string;
  hero: string;
  heroDark: string;
  accent: string;
  cardBorder: string;
  orb1: string;
  orb2: string;
  orb3: string;
}

export const themeConfig = {
  brand: {
    name: "Fluentia",
    tagline: "Your Personal AI English Tutor",
  },

  /**
   * Core Palette Tokens
   */
  colors: {
    primary: {
      DEFAULT: "#2563EB", // Vibrant Royal Blue
      dark: "#1D4ED8",    // Deeper Blue for hover/active states
      light: "#EFF6FF",   // Soft Blue tint
      glow: "rgba(37, 99, 235, 0.35)",
      foreground: "#FFFFFF",
    },
    secondary: {
      DEFAULT: "#4F46E5", // Indigo / Secondary Accent
      dark: "#4338CA",
      light: "#EEF2FF",
      glow: "rgba(79, 70, 229, 0.35)",
      foreground: "#FFFFFF",
    },
    accent: {
      DEFAULT: "#06B6D4", // Cyan / Sky
      dark: "#0891B2",
      light: "#ECFEFF",
      glow: "rgba(6, 182, 212, 0.35)",
    },
    amber: {
      DEFAULT: "#F59E0B", // Warm Gold / Warning / Streaks
      dark: "#D97706",
      light: "rgba(245, 158, 11, 0.15)",
    },
    emerald: {
      DEFAULT: "#10B981", // Success / Accuracy
      dark: "#059669",
      light: "rgba(16, 185, 129, 0.15)",
    },
    rose: {
      DEFAULT: "#E11D48", // Error / Grammatical Correction Markers
      dark: "#BE123C",
      light: "rgba(225, 29, 72, 0.15)",
    },
    purple: {
      DEFAULT: "#8B5CF6", // Creative / Advanced Fluency
      dark: "#7C3AED",
      light: "rgba(139, 92, 246, 0.15)",
    },
  },

  /**
   * Mode Tokens for Light and Dark themes
   */
  modes: {
    light: {
      background: "#f8fafc",                  // Clean soft slate background
      surface: "#ffffff",                     // Pure white cards & containers
      surfaceHover: "#f1f5f9",                // Subtle hover tint
      border: "rgba(15, 23, 42, 0.08)",      // Gentle divider border
      text: "#0f172a",                        // High contrast deep slate ink
      textSoft: "#475569",                    // Medium slate secondary text
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      primaryLight: "#eff6ff",
      secondary: "#4f46e5",
      secondaryDark: "#4338ca",
      secondaryLight: "#eef2ff",
      card: "#ffffff",
      cardHover: "#f8fafc",
    } as ModeTokens,

    dark: {
      background: "#030712",                  // Deep rich void canvas
      surface: "#0b132b",                     // Elevated midnight card surface
      surfaceHover: "#101d42",                // Interactive hover state
      border: "rgba(255, 255, 255, 0.1)",     // Subtle luminescent border
      text: "#f8fafc",                        // Crisp white text
      textSoft: "#94a3b8",                    // Muted silver text
      primary: "#2563eb",
      primaryDark: "#1d4ed8",
      primaryLight: "rgba(37, 99, 235, 0.18)",
      secondary: "#38bdf8",
      secondaryDark: "#0284c7",
      secondaryLight: "rgba(56, 189, 248, 0.15)",
      card: "#0b132b",
      cardHover: "#101d42",
    } as ModeTokens,
  },

  /**
   * Predefined Theme Gradients
   */
  gradients: {
    // Primary Action Button & CTA Gradient
    primary: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
    primaryHover: "linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #6d28d9 100%)",

    // Secondary Accent Gradient
    secondary: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",

    // Hero Bilingual Headline Gradient (Light mode)
    hero: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #4f46e5 100%)",
    // Hero Bilingual Headline Gradient (Dark mode)
    heroDark: "linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #818cf8 100%)",

    // Warm Accent Gradient
    accent: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",

    // Card Top Highlight Border
    cardBorder: "linear-gradient(90deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)",

    // Ambient Floating Glow Orbs Gradients
    orb1: "radial-gradient(circle, rgba(99, 102, 241, 0.7), rgba(139, 92, 246, 0.4))",
    orb2: "radial-gradient(circle, rgba(6, 182, 212, 0.7), rgba(59, 130, 246, 0.4))",
    orb3: "radial-gradient(circle, rgba(236, 72, 153, 0.6), rgba(168, 85, 247, 0.4))",
  } as GradientTokens,
};

export type AppTheme = typeof themeConfig;

export default themeConfig;
