// Consistent heading component with gradient styling
import React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean;
  as?: React.ElementType;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  gradient = true,
  as,
  className,
  ...props
}) => {
  const Component = as || (`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");

  const sizes = {
    1: "text-3xl md:text-4xl font-bold",
    2: "text-2xl md:text-3xl font-bold",
    3: "text-xl md:text-2xl font-semibold",
    4: "text-lg md:text-xl font-semibold",
    5: "text-base md:text-lg font-medium",
    6: "text-sm md:text-base font-medium",
  };

  return (
    <Component
      className={cn(
        sizes[level],
        gradient && "bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-transparent bg-clip-text",
        !gradient && "text-text-primary",
        "mb-4 md:mb-6 last:mb-0",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

