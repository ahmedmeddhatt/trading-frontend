// App initializer - handles auth on mount
"use client";

import { ReactNode, useEffect } from "react";
import { useMe } from "@/hooks/api/useAuth";

export function AppInitializer({ children }: { children: ReactNode }) {
  const { data: user } = useMe();

  // User is automatically fetched if token exists
  // This component just ensures the query runs on mount

  return <>{children}</>;
}



