// src/components/ui/Error.tsx
import React from "react";

interface ErrorProps {
  message: string;
}

export const Error = ({ message }: any) => (
  <div className="p-3 rounded-lg bg-red-900/40 text-red-300 border border-red-700 shadow">
    {message}
  </div>
);

