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
      DEFAULT: "#7C3AED", // Vibrant Royal Purple / Violet
      dark: "#6D28D9",    // Deeper Purple for hover/active states
      light: "#F5F3FF",   // Soft Purple tint
      glow: "rgba(124, 58, 237, 0.35)",
      foreground: "#FFFFFF",
    },
    secondary: {
      DEFAULT: "#A855F7", // Bright Orchid / Secondary Accent
      dark: "#9333EA",
      light: "#FAF5FF",
      glow: "rgba(168, 85, 247, 0.35)",
      foreground: "#FFFFFF",
    },
    accent: {
      DEFAULT: "#EC4899", // Fuchsia / Pink Accent
      dark: "#DB2777",
      light: "#FDF2F8",
      glow: "rgba(236, 72, 153, 0.35)",
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
      background: "#faf5ff",                  // Clean soft violet-tinted background
      surface: "#ffffff",                     // Pure white cards & containers
      surfaceHover: "#f5f3ff",                // Subtle hover tint
      border: "rgba(15, 23, 42, 0.08)",      // Gentle divider border
      text: "#0f172a",                        // High contrast deep slate ink
      textSoft: "#475569",                    // Medium slate secondary text
      primary: "#7c3aed",
      primaryDark: "#6d28d9",
      primaryLight: "#f5f3ff",
      secondary: "#a855f7",
      secondaryDark: "#9333ea",
      secondaryLight: "#faf5ff",
      card: "#ffffff",
      cardHover: "#f5f3ff",
    } as ModeTokens,

    dark: {
      background: "#070510",                  // Deep rich cosmic violet canvas
      surface: "#0f0c20",                     // Elevated midnight violet card surface
      surfaceHover: "#181236",                // Interactive hover state
      border: "rgba(255, 255, 255, 0.1)",     // Subtle luminescent border
      text: "#f8fafc",                        // Crisp white text
      textSoft: "#94a3b8",                    // Muted silver text
      primary: "#8b5cf6",
      primaryDark: "#7c3aed",
      primaryLight: "rgba(139, 92, 246, 0.18)",
      secondary: "#c084fc",
      secondaryDark: "#a855f7",
      secondaryLight: "rgba(192, 132, 252, 0.15)",
      card: "#0f0c20",
      cardHover: "#181236",
    } as ModeTokens,
  },

  /**
   * Predefined Theme Gradients
   */
  gradients: {
    // Primary Action Button & CTA Gradient
    primary: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a855f7 100%)",
    primaryHover: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)",

    // Secondary Accent Gradient
    secondary: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",

    // Hero Bilingual Headline Gradient (Light mode)
    hero: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
    // Hero Bilingual Headline Gradient (Dark mode)
    heroDark: "linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #818cf8 100%)",

    // Warm Accent Gradient
    accent: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",

    // Card Top Highlight Border
    cardBorder: "linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",

    // Ambient Floating Glow Orbs Gradients
    orb1: "radial-gradient(circle, rgba(124, 58, 237, 0.65), rgba(168, 85, 247, 0.35))",
    orb2: "radial-gradient(circle, rgba(147, 51, 234, 0.65), rgba(217, 70, 239, 0.35))",
    orb3: "radial-gradient(circle, rgba(236, 72, 153, 0.55), rgba(139, 92, 246, 0.35))",
  } as GradientTokens,
};

export type AppTheme = typeof themeConfig;

export default themeConfig;
