// Next.js error page
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="max-w-md w-full bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] text-center">
        <h1 className="text-2xl font-bold mb-2 text-white">Something went wrong</h1>
        <p className="text-[#a3a3a3] mb-4">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#00ff88] text-black rounded-lg font-semibold hover:bg-[#00cc6f] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

