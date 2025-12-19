// Design token utilities for consistent styling
// Use these instead of hardcoded values

export const tokens = {
  colors: {
    dark: {
      base: "#0a0a0a",
      surface: "#121212",
      elevated: "#1a1a1a",
      border: "#2a2a2a",
    },
    green: {
      primary: "#00ff88",
      hover: "#00cc6f",
      light: "#33ffaa",
      dark: "#00cc6f",
    },
    red: {
      primary: "#ff4444",
      hover: "#cc3333",
      light: "#ff6666",
      dark: "#cc3333",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a3a3a3",
      tertiary: "#737373",
      inverse: "#0a0a0a",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      mono: ["SF Mono", "Monaco", "monospace"],
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
    },
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },
  transitions: {
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
  },
} as const;

// Tailwind class helpers for common patterns
export const tw = {
  // Background colors
  bg: {
    dark: {
      base: "bg-[#0a0a0a]",
      surface: "bg-[#121212]",
      elevated: "bg-[#1a1a1a]",
      border: "bg-[#2a2a2a]",
    },
    green: {
      primary: "bg-[#00ff88]",
      hover: "bg-[#00cc6f]",
    },
    red: {
      primary: "bg-[#ff4444]",
      hover: "bg-[#cc3333]",
    },
  },
  // Text colors
  text: {
    primary: "text-white",
    secondary: "text-[#a3a3a3]",
    tertiary: "text-[#737373]",
    green: "text-[#00ff88]",
    red: "text-[#ff4444]",
  },
  // Border colors
  border: {
    dark: "border-[#2a2a2a]",
    green: "border-[#00ff88]",
    red: "border-[#ff4444]",
  },
  // Gradient text
  gradient: {
    primary: "bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-transparent bg-clip-text",
  },
} as const;



