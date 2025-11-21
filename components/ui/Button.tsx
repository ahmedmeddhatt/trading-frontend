// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}


// ui/Button.tsx
export const Button: React.FC<any> = ({ children, variant = "primary", ...props }) => {
  const variants: any = {
    primary:
      "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-black font-bold",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white",
    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-xl transition-all shadow-md ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};


