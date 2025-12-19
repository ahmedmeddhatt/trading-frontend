"use client";

import { useCompanyAnalytics } from "@/hooks/api/useAnalytics";
import { usePositions } from "@/hooks/api/usePositions";
import { useTransactionAnalytics } from "@/hooks/analytics/useTransactionAnalytics";
import { useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Error } from "@/components/ui/Error";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { logger } from "@/lib/utils/logger";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import { formatCurrency } from "@/lib/utils/formatNumber";
import dynamic from "next/dynamic";

// Lazy load company components
const CompanySummary = dynamic(() => import("@/components/company/CompanySummary").then(mod => ({ default: mod.CompanySummary })), {
  loading: () => <Skeleton variant="rectangular" height="200px" />,
  ssr: false,
});

const PositionsTable = dynamic(() => import("@/components/company/PositionsTable").then(mod => ({ default: mod.PositionsTable })), {
  loading: () => <Skeleton variant="rectangular" height="300px" />,
  ssr: false,
});

const TimelineChart = dynamic(
  () => import("@/components/charts/analytics/TimelineChart").then((mod) => ({ default: mod.TimelineChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

interface CompanyPageProps {
  params: {
    companyName: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { companyName } = params;
  const decodedName = decodeURIComponent(companyName);
  const { data: companyAnalytics, isLoading, error } = useCompanyAnalytics(decodedName);
  const { data: positions = [] } = usePositions();
  const { analytics: transactionAnalytics } = useTransactionAnalytics();

  useEffect(() => {
    logger.page("Company", {
      pathname: window.location.pathname,
      companyName: decodedName,
      params,
    });
  }, [companyName, params, decodedName]);

  // Get company positions
  const companyPositions = useMemo(() => {
    return positions.filter((p) => p.companyName === decodedName);
  }, [positions, decodedName]);

  // Prepare transaction timeline data for this company
  const companyTransactionData = useMemo(() => {
    if (!transactionAnalytics?.dailyAggregation || companyPositions.length === 0) return [];
    
    // Get transaction data for this company's positions
    // For now, we'll use aggregated data - in a real scenario, you'd filter by position
    return transactionAnalytics.dailyAggregation.slice(-30).map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      buyValue: item.buyValue / companyPositions.length, // Approximate per company
      sellValue: item.sellValue / companyPositions.length,
      netValue: (item.buyValue - item.sellValue) / companyPositions.length,
      cumulativeValue: 0, // Would need to calculate cumulative
    }));
  }, [transactionAnalytics, companyPositions]);

  if (isLoading && !companyAnalytics) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <Skeleton variant="rectangular" height="200px" />
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <Error message={getErrorMessage(error)} />
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <CompanySummary companyName={decodedName} />
          
          {companyAnalytics && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="elevated" padding="lg">
                  <h3 className="text-xl font-bold mb-4">Company Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total Investment</span>
                      <span className="text-text-primary font-semibold">{formatCurrency(companyAnalytics.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Current Value</span>
                      <span className="text-green-primary font-semibold">{formatCurrency(companyAnalytics.totalCurrentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Unrealized P/L</span>
                      <span className={`font-semibold ${companyAnalytics.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                        {formatCurrency(companyAnalytics.unrealizedPnL, { showSign: true })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Return %</span>
                      <span className={`font-semibold ${companyAnalytics.unrealizedPct >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                        {companyAnalytics.unrealizedPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Number of Positions</span>
                      <span className="text-text-primary font-semibold">{companyAnalytics.positions.length}</span>
                    </div>
                  </div>
                </Card>

                {companyTransactionData.length > 0 && (
                  <ChartCard title="Transaction Activity (Last 30 Days)" height={300}>
                    <TimelineChart data={companyTransactionData} height={300} />
                  </ChartCard>
                )}
              </div>

              <div>
                <Heading level={2}>Positions</Heading>
                <PositionsTable companyName={decodedName} />
              </div>
            </>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
