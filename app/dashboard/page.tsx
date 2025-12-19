"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { useSummary, useSnapshots, useCreateSnapshot } from "@/hooks/api/useAnalytics";
import { useAllocationData } from "@/hooks/analytics/useAllocationData";
import { useTransactionAnalytics } from "@/hooks/analytics/useTransactionAnalytics";
import { getTopPositions } from "@/lib/analytics/comparisons";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const GainLossChart = dynamic(() => import("@/components/dashboard/GainLossChart").then(mod => ({ default: mod.GainLossChart })), {
  loading: () => <Skeleton variant="rectangular" height="300px" />,
  ssr: false,
});

const SnapshotsTable = dynamic(() => import("@/components/dashboard/SnapshotsTable").then(mod => ({ default: mod.SnapshotsTable })), {
  loading: () => <Skeleton variant="rectangular" height="200px" />,
  ssr: false,
});

const AllocationPieChart = dynamic(
  () => import("@/components/charts/analytics/AllocationPieChart").then((mod) => ({ default: mod.AllocationPieChart })),
  { loading: () => <Skeleton variant="rectangular" height="200px" />, ssr: false }
);

const TransactionVolumeChart = dynamic(
  () => import("@/components/charts/analytics/TransactionVolumeChart").then((mod) => ({ default: mod.TransactionVolumeChart })),
  { loading: () => <Skeleton variant="rectangular" height="200px" />, ssr: false }
);

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useSummary();
  const { data: snapshots = [], isLoading: snapshotsLoading, error: snapshotsError } = useSnapshots();
  const { allocation } = useAllocationData();
  const { analytics: transactionAnalytics } = useTransactionAnalytics();
  const createSnapshotMutation = useCreateSnapshot();

  useEffect(() => {
    logger.page("Dashboard", {
      pathname: window.location.pathname,
      searchParams: window.location.search,
    });
  }, []);

  const handleCreateSnapshot = async () => {
    await createSnapshotMutation.mutateAsync(undefined);
  };

  const topPerformers = React.useMemo(() => {
    if (!summary?.positions) return [];
    return getTopPositions(summary.positions, 5);
  }, [summary]);

  // Prepare transaction volume data (last 7 days)
  const recentTransactionData = React.useMemo(() => {
    if (!transactionAnalytics?.dailyAggregation) return [];
    return transactionAnalytics.dailyAggregation.slice(-7).map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      buyVolume: item.buyValue,
      sellVolume: item.sellValue,
      buyCount: item.buyCount,
      sellCount: item.sellCount,
    }));
  }, [transactionAnalytics]);

  const loading = summaryLoading || snapshotsLoading;
  const error = summaryError || snapshotsError;

  if (loading && !summary && !error) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height="100px" />
              ))}
            </div>
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
          <Heading level={1}>Dashboard</Heading>

          {error && <Error message={getErrorMessage(error)} />}

          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <SummaryCard title="Total Investment" value={summary.totalInvestment} />
              <SummaryCard title="Total Current Value" value={summary.totalCurrentValue} />
              <SummaryCard
                title="Unrealized PnL"
                value={summary.totalUnrealizedPnL}
                positiveColor={true}
              />
              <SummaryCard
                title="Total Percent"
                value={summary.totalPercent}
                currency={false}
                positiveColor={true}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleCreateSnapshot}
              variant="secondary"
              disabled={createSnapshotMutation.isPending}
              loading={createSnapshotMutation.isPending}
            >
              Create Manual Snapshot
            </Button>
          </div>

          {snapshots.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 md:mb-6">Portfolio Performance</h2>
                <div className="bg-dark-elevated p-4 md:p-6 rounded-xl border border-dark-border">
                  <GainLossChart snapshots={snapshots} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allocation && allocation.companies.length > 0 && (
                  <Card variant="elevated" padding="lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Portfolio Allocation</h3>
                      <Link href="/analytics/allocation" className="text-green-primary hover:text-green-hover text-sm transition-colors">
                        View Details →
                      </Link>
                    </div>
                    <AllocationPieChart
                      data={allocation.companies.slice(0, 5).map((c) => ({
                        companyName: c.companyName,
                        value: c.totalInvestment,
                        percentage: c.allocationPercent,
                      }))}
                    />
                  </Card>
                )}

                {recentTransactionData.length > 0 && (
                  <Card variant="elevated" padding="lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Recent Transaction Volume</h3>
                      <Link href="/analytics/transactions" className="text-green-primary hover:text-green-hover text-sm transition-colors">
                        View Details →
                      </Link>
                    </div>
                    <TransactionVolumeChart data={recentTransactionData} height={200} />
                  </Card>
                )}
              </div>

              {topPerformers.length > 0 && (
                <Card variant="elevated" padding="lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Top Performers</h3>
                    <Link href="/analytics/positions" className="text-green-primary hover:text-green-hover text-sm transition-colors">
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {topPerformers.map((position) => (
                      <div key={position._id} className="flex justify-between items-center p-3 bg-dark-surface rounded-lg">
                        <div>
                          <p className="font-semibold text-text-primary">{position.companyName}</p>
                          <p className="text-sm text-text-secondary">{position.totalQuantity} shares</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-primary font-bold">
                            {formatPercentage(position.unrealizedPct || 0, { showSign: true })}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {formatCurrency(position.unrealizedPnL || 0, { showSign: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-4 md:mb-6">Daily Snapshots</h2>
                <SnapshotsTable snapshots={snapshots} />
              </div>
            </div>
          ) : !loading && (
            <div className="bg-dark-elevated p-8 md:p-12 rounded-xl text-center text-text-secondary border border-dark-border">
              <p>No snapshots available yet. Create your first position to see analytics.</p>
            </div>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
