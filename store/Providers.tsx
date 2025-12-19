"use client";

import { ReactNode, useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { ToastProvider } from "@/components/ui/Toast";
import { AppInitializer } from "./AppInitializer";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    logger.info("App initialized", {
      userAgent: navigator.userAgent,
      url: window.location.href,
      pathname: window.location.pathname,
    });
  }, []);

  return (
    <ReactQueryProvider>
      <ToastProvider>
        <AppInitializer>{children}</AppInitializer>
      </ToastProvider>
    </ReactQueryProvider>
  );
}
