// Offline/online status indicator
"use client";

import React from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[1070]",
            "bg-[#ff4444] text-white px-4 py-2",
            "flex items-center justify-center gap-2",
            "text-sm font-medium"
          )}
        >
          <WifiOff className="w-4 h-4" />
          <span>You're offline. Some features may be limited.</span>
        </motion.div>
      )}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[1070]",
            "bg-[#00ff88] text-black px-4 py-2",
            "flex items-center justify-center gap-2",
            "text-sm font-medium"
          )}
        >
          <Wifi className="w-4 h-4" />
          <span>You're back online!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



