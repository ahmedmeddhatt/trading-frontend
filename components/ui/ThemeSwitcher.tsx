"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { Palette, Check, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, themeName, mode, setTheme, toggleMode, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative flex items-center gap-2", className)}>
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleMode}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          "bg-dark-elevated border border-dark-border",
          "hover:border-green-primary transition-all",
          "shadow-lg hover:shadow-xl hover:shadow-green-primary/20"
        )}
        style={{
          borderColor: mode === "light" ? theme.colors.primary : undefined,
        }}
        title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      >
        {mode === "dark" ? (
          <Sun className="w-4 h-4" style={{ color: theme.colors.primary }} />
        ) : (
          <Moon className="w-4 h-4" style={{ color: theme.colors.primary }} />
        )}
      </button>
      
      {/* Theme Switcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          "bg-dark-elevated border border-dark-border",
          "hover:border-green-primary transition-colors",
          "text-text-primary font-medium",
          "shadow-lg hover:shadow-xl hover:shadow-green-primary/20"
        )}
        style={{
          borderColor: isOpen ? theme.colors.primary : undefined,
          boxShadow: isOpen ? `0 0 20px ${theme.colors.primary}33` : undefined,
        }}
      >
        <Palette className="w-4 h-4" style={{ color: theme.colors.primary }} />
        <span className="hidden sm:inline">{theme.displayName}</span>
        <span className="sm:hidden">Theme</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full mt-2 right-0 z-50",
              "bg-dark-elevated border border-dark-border rounded-lg",
              "shadow-2xl overflow-hidden",
              "min-w-[200px]"
            )}
            style={{
              backgroundColor: theme.colors.elevated,
              borderColor: theme.colors.border,
            }}
          >
            <div className="p-2">
              {availableThemes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTheme(t.name);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md",
                    "hover:bg-dark-surface transition-colors",
                    "text-left text-sm",
                    themeName === t.name && "bg-dark-surface"
                  )}
                  style={{
                    backgroundColor: themeName === t.name ? theme.colors.surface : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: t.colors.primary,
                        borderColor: t.colors.primary,
                        boxShadow: `0 0 8px ${t.colors.primary}80`,
                      }}
                    />
                    <span className="text-text-primary font-medium">{t.displayName}</span>
                  </div>
                  {themeName === t.name && (
                    <Check className="w-4 h-4" style={{ color: theme.colors.primary }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

