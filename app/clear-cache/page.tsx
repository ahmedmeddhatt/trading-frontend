// Utility page to clear cached data
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ClearCachePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage logs
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_logs");
      console.log("Cleared app logs from localStorage");
    }
  }, []);

  const handleClearAll = () => {
    if (typeof window !== "undefined") {
      // Clear all localStorage except token (user might want to stay logged in)
      const token = localStorage.getItem("token");
      localStorage.clear();
      if (token) {
        localStorage.setItem("token", token);
      }
      console.log("Cleared all cached data");
      alert("Cache cleared! Please do a hard refresh (Ctrl+Shift+R) to reload the page.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <Card className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Clear Cache</h1>
        <p className="text-[#a3a3a3] mb-6">
          This will clear all cached data including logs. Your login token will be preserved.
        </p>
        <Button onClick={handleClearAll} variant="primary" className="w-full">
          Clear All Cache
        </Button>
        <p className="text-xs text-[#737373] mt-4">
          After clearing, do a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
        </p>
      </Card>
    </div>
  );
}



