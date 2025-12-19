// src/components/layout/PageContainer.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-dark-base",
        "px-4 py-6 md:px-8 md:py-8", // Better padding
        "pb-24 md:pb-8", // Extra bottom padding on mobile for bottom nav (96px = 24*4)
        "max-w-7xl mx-auto", // Center content and limit width
        className
      )}
    >
      <div className="space-y-6 md:space-y-8">
        {children}
      </div>
    </div>
  );
};
