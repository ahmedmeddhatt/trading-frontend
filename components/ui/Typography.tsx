// components/ui/Typography.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "number";
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body",
  as,
  className,
  ...props
}) => {
  const variants = {
    h1: "text-4xl md:text-5xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
    body: "text-base text-[#a3a3a3]",
    caption: "text-sm text-[#737373]",
    number: "text-base font-mono tabular-nums",
  };

  const defaultElements = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    body: "p",
    caption: "span",
    number: "span",
  };

  const Component = as || defaultElements[variant];

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};

// Convenience components
export interface HeadingProps extends Omit<TypographyProps, "variant"> {
  level?: 1 | 2 | 3 | 4;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  ...props
}) => {
  const variant = (`h${level}` as "h1" | "h2" | "h3" | "h4") || "h1";
  return <Typography variant={variant} {...props} />;
};

export const Body: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Number: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="number" {...props} />
);

