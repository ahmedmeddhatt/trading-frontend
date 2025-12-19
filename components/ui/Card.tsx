// src/components/ui/Card.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = "default", padding = "md", ...props }, ref) => {
    const variants = {
      default: "glass border border-dark-border",
      elevated: "bg-dark-elevated border border-dark-border shadow-lg",
      outlined: "bg-transparent border border-dark-border",
    };

    const paddings = {
      none: "p-0",
      sm: "p-3 md:p-4",
      md: "p-4 md:p-6",
      lg: "p-6 md:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-250",
          variants[variant],
          paddings[padding],
          variant === "default" && "neon-hover",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

