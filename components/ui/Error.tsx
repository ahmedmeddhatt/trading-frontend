// src/components/ui/Error.tsx
import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorProps {
  message: string;
  className?: string;
}

export const Error: React.FC<ErrorProps> = ({ message, className }) => (
  <div className={cn(
    "p-4 rounded-lg bg-red-primary/10 text-red-primary border border-red-primary/30 shadow-lg",
    "flex items-start gap-3",
    className
  )}>
    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-semibold mb-1">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

