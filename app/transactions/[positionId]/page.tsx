"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { useTransactions } from "@/hooks/api/useTransactions";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Skeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";

// Lazy load TransactionsTable
const TransactionsTable = dynamic(() => import("@/components/transactions/TransactionsTable").then(mod => ({ default: mod.TransactionsTable })), {
  loading: () => <Skeleton variant="rectangular" height="400px" />,
  ssr: false,
});

interface TransactionsPageProps {
  params: {
    positionId: string;
  };
}

export default function TransactionsPage({ params }: TransactionsPageProps) {
  const { positionId } = params;
  const { data: transactions = [], isLoading, error } = useTransactions(positionId);

  useEffect(() => {
    logger.page("Transactions", {
      pathname: window.location.pathname,
      positionId,
      params,
    });
  }, [positionId, params]);

  if (isLoading) {
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
          <Heading level={1}>Transactions</Heading>
          {error && <Error message={getErrorMessage(error)} />}
          <TransactionsTable positionId={positionId} />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
