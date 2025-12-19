import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          base: "#0a0a0a",
          surface: "#121212",
          elevated: "#1a1a1a",
          border: "#2a2a2a",
        },
        // Accent colors
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
        // Text colors
        text: {
          primary: "#ffffff",
          secondary: "#a3a3a3",
          tertiary: "#737373",
          inverse: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["SF Mono", "Monaco", "monospace"],
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
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 136, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;



