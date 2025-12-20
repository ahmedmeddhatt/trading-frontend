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
      sm: "p-4 sm:p-5 md:p-6",
      md: "p-5 sm:p-6 md:p-7 lg:p-8",
      lg: "p-6 sm:p-8 md:p-10 lg:p-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-250",
          variants[variant],
          paddings[padding],
          variant === "default" && "neon-hover card-glow",
          variant === "elevated" && "hover:shadow-2xl hover:shadow-green-primary/20",
          className
        )}
        style={{
          ...(variant === "elevated" && {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

