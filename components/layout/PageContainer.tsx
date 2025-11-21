// src/components/layout/PageContainer.tsx
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = ({ children }: any) => (
  <div className="p-6 min-h-screen bg-gradient-to-b from-[#0d0f1a] to-[#0b1220]">
    {children}
  </div>
);
