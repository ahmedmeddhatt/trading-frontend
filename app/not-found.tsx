"use client";

import React, { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const [pathname, setPathname] = React.useState("");
  const [href, setHref] = React.useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPathname = window.location.pathname;
      const currentHref = window.location.href;
      
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setPathname(currentPathname);
        setHref(currentHref);
      }, 0);
      
      logger.error("404 - Page not found", {
        pathname: currentPathname,
        href: currentHref,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <h1 className="text-6xl font-bold text-red-400">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-gray-400 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          {pathname && (
            <div className="space-y-2 text-sm text-gray-500">
              <p>Path: <code className="bg-gray-800 px-2 py-1 rounded">{pathname}</code></p>
              <p>Full URL: <code className="bg-gray-800 px-2 py-1 rounded text-xs break-all">{href}</code></p>
            </div>
          )}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </Link>
            <Link href="/logs">
              <Button variant="secondary">View Logs</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </>
  );
}


