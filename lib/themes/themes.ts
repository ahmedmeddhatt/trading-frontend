// Theme definitions with vibrant, colorful palettes
export type ThemeMode = "dark" | "light";

export type ThemeName = 
  | "neon" 
  | "ocean" 
  | "sunset" 
  | "forest" 
  | "purple" 
  | "cyber" 
  | "aurora" 
  | "candy"
  | "midnight"
  | "fire";

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    // Background colors
    base: string;
    surface: string;
    elevated: string;
    border: string;
    
    // Primary accent colors
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    
    // Secondary accent colors
    secondary: string;
    secondaryHover: string;
    
    // Status colors
    success: string;
    successHover: string;
    danger: string;
    dangerHover: string;
    warning: string;
    info: string;
    
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    
    // Chart colors
    chartColors: string[];
    gradient: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  neon: {
    name: "neon",
    displayName: "Neon Green",
    colors: {
      base: "#0a0a0a",
      surface: "#121212",
      elevated: "#1a1a1a",
      border: "#2a2a2a",
      primary: "#00ff88",
      primaryHover: "#00cc6f",
      primaryLight: "#33ffaa",
      primaryDark: "#00cc6f",
      secondary: "#00ffff",
      secondaryHover: "#00cccc",
      success: "#00ff88",
      successHover: "#00cc6f",
      danger: "#ff4444",
      dangerHover: "#cc3333",
      warning: "#ffaa00",
      info: "#00aaff",
      textPrimary: "#ffffff",
      textSecondary: "#a3a3a3",
      textTertiary: "#737373",
      chartColors: ["#00ff88", "#00ffff", "#0088ff", "#ff00ff", "#ff8800"],
      gradient: "linear-gradient(135deg, #00ff88 0%, #00ffff 50%, #ff00ff 100%)",
    },
  },
  ocean: {
    name: "ocean",
    displayName: "Ocean Blue",
    colors: {
      base: "#0a1520",
      surface: "#0f1e2e",
      elevated: "#152438",
      border: "#1e3a52",
      primary: "#00d4ff",
      primaryHover: "#00b8e6",
      primaryLight: "#33ddff",
      primaryDark: "#0099cc",
      secondary: "#00aaff",
      secondaryHover: "#0088dd",
      success: "#00ffaa",
      successHover: "#00dd88",
      danger: "#ff5577",
      dangerHover: "#dd4466",
      warning: "#ffaa44",
      info: "#00aaff",
      textPrimary: "#ffffff",
      textSecondary: "#a8c5d9",
      textTertiary: "#7a9bb3",
      chartColors: ["#00d4ff", "#00aaff", "#0088ff", "#00ffaa", "#ff5577"],
      gradient: "linear-gradient(135deg, #00d4ff 0%, #00aaff 50%, #0088ff 100%)",
    },
  },
  sunset: {
    name: "sunset",
    displayName: "Sunset Orange",
    colors: {
      base: "#1a0a0a",
      surface: "#2a1515",
      elevated: "#3a2020",
      border: "#4a2a2a",
      primary: "#ff6600",
      primaryHover: "#cc5500",
      primaryLight: "#ff8833",
      primaryDark: "#cc4400",
      secondary: "#ffaa00",
      secondaryHover: "#cc8800",
      success: "#ffaa00",
      successHover: "#cc8800",
      danger: "#ff4444",
      dangerHover: "#cc3333",
      warning: "#ffaa00",
      info: "#ff6600",
      textPrimary: "#ffffff",
      textSecondary: "#d9a3a3",
      textTertiary: "#b37a7a",
      chartColors: ["#ff6600", "#ffaa00", "#ffcc00", "#ff4444", "#ff0066"],
      gradient: "linear-gradient(135deg, #ff6600 0%, #ffaa00 50%, #ffcc00 100%)",
    },
  },
  forest: {
    name: "forest",
    displayName: "Forest Green",
    colors: {
      base: "#0a1a0a",
      surface: "#152a15",
      elevated: "#1f3a1f",
      border: "#2a4a2a",
      primary: "#00ff66",
      primaryHover: "#00cc55",
      primaryLight: "#33ff88",
      primaryDark: "#00cc44",
      secondary: "#66ff88",
      secondaryHover: "#44cc66",
      success: "#00ff66",
      successHover: "#00cc55",
      danger: "#ff6666",
      dangerHover: "#cc5555",
      warning: "#ffaa44",
      info: "#00ffaa",
      textPrimary: "#ffffff",
      textSecondary: "#a3d9a3",
      textTertiary: "#7ab37a",
      chartColors: ["#00ff66", "#66ff88", "#00ffaa", "#44ffaa", "#ffaa44"],
      gradient: "linear-gradient(135deg, #00ff66 0%, #66ff88 50%, #00ffaa 100%)",
    },
  },
  purple: {
    name: "purple",
    displayName: "Purple Dream",
    colors: {
      base: "#1a0a1a",
      surface: "#2a152a",
      elevated: "#3a203a",
      border: "#4a2a4a",
      primary: "#aa00ff",
      primaryHover: "#8800cc",
      primaryLight: "#bb33ff",
      primaryDark: "#8800cc",
      secondary: "#ff00ff",
      secondaryHover: "#cc00cc",
      success: "#00ff88",
      successHover: "#00cc6f",
      danger: "#ff4444",
      dangerHover: "#cc3333",
      warning: "#ffaa00",
      info: "#aa00ff",
      textPrimary: "#ffffff",
      textSecondary: "#d9a3d9",
      textTertiary: "#b37ab3",
      chartColors: ["#aa00ff", "#ff00ff", "#ff00aa", "#aa00aa", "#ff00ff"],
      gradient: "linear-gradient(135deg, #aa00ff 0%, #ff00ff 50%, #ff00aa 100%)",
    },
  },
  cyber: {
    name: "cyber",
    displayName: "Cyber Punk",
    colors: {
      base: "#0a0a1a",
      surface: "#15152a",
      elevated: "#20203a",
      border: "#2a2a4a",
      primary: "#00ffff",
      primaryHover: "#00cccc",
      primaryLight: "#33ffff",
      primaryDark: "#00aaaa",
      secondary: "#ff00ff",
      secondaryHover: "#cc00cc",
      success: "#00ff00",
      successHover: "#00cc00",
      danger: "#ff0044",
      dangerHover: "#cc0033",
      warning: "#ffff00",
      info: "#00ffff",
      textPrimary: "#ffffff",
      textSecondary: "#a3a3d9",
      textTertiary: "#7a7ab3",
      chartColors: ["#00ffff", "#ff00ff", "#00ff00", "#ffff00", "#ff0044"],
      gradient: "linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ff00 100%)",
    },
  },
  aurora: {
    name: "aurora",
    displayName: "Aurora",
    colors: {
      base: "#0a0a1a",
      surface: "#15152a",
      elevated: "#1f1f3a",
      border: "#2a2a4a",
      primary: "#00ffaa",
      primaryHover: "#00cc88",
      primaryLight: "#33ffbb",
      primaryDark: "#00aa66",
      secondary: "#00aaff",
      secondaryHover: "#0088cc",
      success: "#00ffaa",
      successHover: "#00cc88",
      danger: "#ff5577",
      dangerHover: "#cc4466",
      warning: "#ffaa44",
      info: "#00aaff",
      textPrimary: "#ffffff",
      textSecondary: "#a3d9e6",
      textTertiary: "#7ab3c4",
      chartColors: ["#00ffaa", "#00aaff", "#00ffff", "#ff5577", "#ffaa44"],
      gradient: "linear-gradient(135deg, #00ffaa 0%, #00aaff 50%, #00ffff 100%)",
    },
  },
  candy: {
    name: "candy",
    displayName: "Candy",
    colors: {
      base: "#1a0a0a",
      surface: "#2a1515",
      elevated: "#3a2020",
      border: "#4a2a2a",
      primary: "#ff00aa",
      primaryHover: "#cc0088",
      primaryLight: "#ff33bb",
      primaryDark: "#cc0066",
      secondary: "#ff00ff",
      secondaryHover: "#cc00cc",
      success: "#00ff88",
      successHover: "#00cc6f",
      danger: "#ff4444",
      dangerHover: "#cc3333",
      warning: "#ffaa00",
      info: "#ff00aa",
      textPrimary: "#ffffff",
      textSecondary: "#ffa3d9",
      textTertiary: "#ff7ab3",
      chartColors: ["#ff00aa", "#ff00ff", "#ff00cc", "#ff00dd", "#ff00ee"],
      gradient: "linear-gradient(135deg, #ff00aa 0%, #ff00ff 50%, #ff00cc 100%)",
    },
  },
  midnight: {
    name: "midnight",
    displayName: "Midnight Blue",
    colors: {
      base: "#0a0a15",
      surface: "#151520",
      elevated: "#1f1f2a",
      border: "#2a2a35",
      primary: "#6b5bff",
      primaryHover: "#5544cc",
      primaryLight: "#8877ff",
      primaryDark: "#4433cc",
      secondary: "#8b7fff",
      secondaryHover: "#6b5bcc",
      success: "#00ff88",
      successHover: "#00cc6f",
      danger: "#ff5577",
      dangerHover: "#cc4466",
      warning: "#ffaa44",
      info: "#6b5bff",
      textPrimary: "#ffffff",
      textSecondary: "#b3a3e6",
      textTertiary: "#8b7fc4",
      chartColors: ["#6b5bff", "#8b7fff", "#aa99ff", "#ccbbff", "#ff5577"],
      gradient: "linear-gradient(135deg, #6b5bff 0%, #8b7fff 50%, #aa99ff 100%)",
    },
  },
  fire: {
    name: "fire",
    displayName: "Fire Red",
    colors: {
      base: "#1a0a0a",
      surface: "#2a1515",
      elevated: "#3a2020",
      border: "#4a2a2a",
      primary: "#ff3300",
      primaryHover: "#cc2800",
      primaryLight: "#ff5533",
      primaryDark: "#cc2200",
      secondary: "#ff6600",
      secondaryHover: "#cc5500",
      success: "#00ff88",
      successHover: "#00cc6f",
      danger: "#ff3300",
      dangerHover: "#cc2800",
      warning: "#ffaa00",
      info: "#ff6600",
      textPrimary: "#ffffff",
      textSecondary: "#ffa3a3",
      textTertiary: "#ff7a7a",
      chartColors: ["#ff3300", "#ff6600", "#ff9900", "#ffaa00", "#ffcc00"],
      gradient: "linear-gradient(135deg, #ff3300 0%, #ff6600 50%, #ff9900 100%)",
    },
  },
};

export const defaultTheme: ThemeName = "neon";

