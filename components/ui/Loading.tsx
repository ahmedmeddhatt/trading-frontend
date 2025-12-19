// src/components/ui/Loading.tsx
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className, size = "md", text }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 gap-3", className)}>
      <Loader2 className={cn("animate-spin text-green-primary", sizes[size])} />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );
};

