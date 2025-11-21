// src/components/layout/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 p-4 mt-10 text-center">
      &copy; {new Date().getFullYear()} Trading Dashboard. All rights reserved.
    </footer>
  );
};
