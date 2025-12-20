// src/components/ui/Button.tsx
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-green-primary to-green-hover hover:from-green-hover hover:to-green-primary text-dark-base font-semibold shadow-lg hover:shadow-xl hover:shadow-green-primary/50 transition-all",
      secondary:
        "bg-dark-elevated hover:bg-dark-border text-text-primary border border-dark-border hover:border-green-primary hover:shadow-lg hover:shadow-green-primary/20 transition-all",
      danger:
        "bg-gradient-to-r from-red-primary to-red-hover hover:from-red-hover hover:to-red-primary text-text-primary shadow-lg hover:shadow-xl hover:shadow-red-primary/50 transition-all",
      ghost:
        "bg-transparent hover:bg-dark-elevated text-text-primary hover:text-green-primary transition-all",
      outline:
        "bg-transparent border-2 border-dark-border hover:border-green-primary text-text-primary hover:text-green-primary hover:shadow-lg hover:shadow-green-primary/20 transition-all",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-250",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";


