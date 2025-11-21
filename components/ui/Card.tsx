// src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

// ui/Card.tsx
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`glass p-5 rounded-xl shadow-xl border border-gray-700 transition-all neon-hover ${className}`}
  >
    {children}
  </div>
);

