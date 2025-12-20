"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeName, ThemeMode, themes, defaultTheme } from "./themes";

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  mode: ThemeMode;
  setTheme: (themeName: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// Helper function to adjust brightness
const adjustBrightness = (hex: string, factor: number): string => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust brightness
  const newR = Math.min(255, Math.round(r * factor + 255 * (1 - factor)));
  const newG = Math.min(255, Math.round(g * factor + 255 * (1 - factor)));
  const newB = Math.min(255, Math.round(b * factor + 255 * (1 - factor)));
  
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [mode, setMode] = useState<ThemeMode>("dark");

  // Load theme and mode from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeName;
    const savedMode = localStorage.getItem("themeMode") as ThemeMode;
    
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
    
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme and mode to CSS variables
  useEffect(() => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Apply light/dark mode adjustments
    const isLight = mode === "light";
    
    // Base colors - adjust for light mode
    const base = isLight ? adjustBrightness(theme.colors.base, 0.95) : theme.colors.base;
    const surface = isLight ? adjustBrightness(theme.colors.surface, 0.92) : theme.colors.surface;
    const elevated = isLight ? adjustBrightness(theme.colors.elevated, 0.90) : theme.colors.elevated;
    const border = isLight ? adjustBrightness(theme.colors.border, 0.85) : theme.colors.border;
    
    // Text colors - invert for light mode
    const textPrimary = isLight ? "#0a0a0a" : theme.colors.textPrimary;
    const textSecondary = isLight ? "#4a4a4a" : theme.colors.textSecondary;
    const textTertiary = isLight ? "#6a6a6a" : theme.colors.textTertiary;
    
    // Set CSS variables
    root.style.setProperty("--color-dark-base", base);
    root.style.setProperty("--color-dark-surface", surface);
    root.style.setProperty("--color-dark-elevated", elevated);
    root.style.setProperty("--color-dark-border", border);
    
    root.style.setProperty("--color-green-primary", theme.colors.primary);
    root.style.setProperty("--color-green-hover", theme.colors.primaryHover);
    
    root.style.setProperty("--color-red-primary", theme.colors.danger);
    root.style.setProperty("--color-red-hover", theme.colors.dangerHover);
    
    root.style.setProperty("--color-text-primary", textPrimary);
    root.style.setProperty("--color-text-secondary", textSecondary);
    root.style.setProperty("--color-text-tertiary", textTertiary);
    
    // Set data attribute for mode
    root.setAttribute("data-theme-mode", mode);
    
    // Save to localStorage
    localStorage.setItem("theme", themeName);
    localStorage.setItem("themeMode", mode);
  }, [themeName, mode]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
  };
  
  const setModeHandler = (newMode: ThemeMode) => {
    setMode(newMode);
  };
  
  const toggleMode = () => {
    setMode(prev => prev === "dark" ? "light" : "dark");
  };

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName,
    mode,
    setTheme,
    setMode: setModeHandler,
    toggleMode,
    availableThemes: Object.values(themes),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

