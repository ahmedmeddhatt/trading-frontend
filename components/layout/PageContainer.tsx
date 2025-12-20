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
        "px-4 sm:px-6 md:px-8 lg:px-12", // Responsive horizontal padding
        "py-6 sm:py-8 md:py-10 lg:py-12", // Responsive vertical padding
        "pb-24 md:pb-10 lg:pb-12", // Extra bottom padding on mobile for bottom nav
        "max-w-7xl mx-auto", // Center content and limit width
        className
      )}
    >
      <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        {children}
      </div>
    </div>
  );
};
