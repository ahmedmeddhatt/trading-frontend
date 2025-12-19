"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { usePositions } from "@/hooks/api/usePositions";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { Skeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";

// Lazy load PositionsTable
const PositionsTable = dynamic(() => import("@/components/positions/PositionsTable").then(mod => ({ default: mod.PositionsTable })), {
  loading: () => <Skeleton variant="rectangular" height="400px" />,
  ssr: false,
});

export default function PositionsPage() {
  const { data: positions = [], isLoading, error } = usePositions();

  useEffect(() => {
    logger.page("Positions", {
      pathname: window.location.pathname,
      searchParams: window.location.search,
    });
  }, []);

  if (isLoading && positions.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-4">
            <Skeleton variant="text" width="200px" height="40px" />
            <Skeleton variant="rectangular" height="400px" />
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <Heading level={1}>Positions</Heading>
          {error && <Error message={getErrorMessage(error)} />}
          <PositionsTable />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
