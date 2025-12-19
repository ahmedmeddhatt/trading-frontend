// components/ui/BackendStatus.tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";

export const BackendStatus = () => {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackend = async () => {
    try {
      // Try a simple health check - we'll use auth/me as it's lightweight
      // If it fails with 401, backend is online (just not authenticated)
      // If it fails with 500, backend is online but has errors
      // If it fails with network error, backend is offline
      await api.get("/auth/me", { timeout: 5000 });
      setStatus("online");
    } catch (err: any) {
      // Any HTTP response (even 500) means backend is online
      // Only network errors mean backend is offline
      if (err.response) {
        // Backend responded (even with error) = online
        setStatus("online");
      } else if (err.isNetworkError || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.code === 'ETIMEDOUT') {
        setStatus("offline");
      } else {
        // Unknown error, assume online if we got any response
        setStatus(err.response ? "online" : "offline");
      }
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-xs text-[#737373]">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
        <span>Checking...</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-[#ff4444]"></div>
        <span className="text-[#ff4444]">Offline</span>
        {lastCheck && (
          <span className="text-[#737373]">
            ({lastCheck.toLocaleTimeString()})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-2 h-2 rounded-full bg-[#00ff88]"></div>
      <span className="text-[#00ff88]">Online</span>
    </div>
  );
};

