// Performance Analytics page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useSummary, useSnapshots } from "@/hooks/api/useAnalytics";
import { usePerformanceAnalytics } from "@/hooks/analytics/usePerformanceAnalytics";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Button } from "@/components/ui/Button";
import { getTopPositions, getBottomPositions } from "@/lib/analytics/comparisons";
import { getReturnDistribution } from "@/lib/analytics/aggregations";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import dynamic from "next/dynamic";

// Lazy load charts
const EquityCurve = dynamic(
  () => import("@/components/charts/EquityCurve").then((mod) => ({ default: mod.EquityCurve })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const GainLossChart = dynamic(
  () => import("@/components/dashboard/GainLossChart").then((mod) => ({ default: mod.GainLossChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const ReturnDistributionChart = dynamic(
  () => import("@/components/charts/analytics/ReturnDistributionChart").then((mod) => ({ default: mod.ReturnDistributionChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const MultiSeriesChart = dynamic(
  () => import("@/components/charts/financial/MultiSeriesChart").then((mod) => ({ default: mod.MultiSeriesChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "All";

export default function PerformanceAnalyticsPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useSummary();
  const { data: snapshots = [] } = useSnapshots();
  const { metrics } = usePerformanceAnalytics();
  const [timeframe, setTimeframe] = useState<Timeframe>("All");

  useEffect(() => {
    logger.page("Performance Analytics", {
      pathname: window.location.pathname,
    });
  }, []);

  // Filter snapshots by timeframe
  const filteredSnapshots = React.useMemo(() => {
    if (timeframe === "All" || snapshots.length === 0) return snapshots;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeframe) {
      case "1D":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return snapshots.filter((snapshot) => new Date(snapshot.date) >= cutoffDate);
  }, [snapshots, timeframe]);

  const returnDistribution = React.useMemo(() => {
    if (!summary?.positions || summary.positions.length === 0) return [];
    return getReturnDistribution(summary.positions, 10);
  }, [summary]);

  const topPositions = React.useMemo(() => {
    if (!summary?.positions) return [];
    return getTopPositions(summary.positions, 5);
  }, [summary]);

  const bottomPositions = React.useMemo(() => {
    if (!summary?.positions) return [];
    return getBottomPositions(summary.positions, 5);
  }, [summary]);

  const loading = summaryLoading;

  if (loading && !summary) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <Skeleton variant="rectangular" height="300px" />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Heading level={1}>Performance Analytics</Heading>
            <div className="flex gap-2 flex-wrap">
              {(["1D", "1W", "1M", "3M", "6M", "1Y", "All"] as Timeframe[]).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          {summaryError && <Error message={getErrorMessage(summaryError)} />}

          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Win Rate</p>
                <p className="text-2xl font-bold text-green-primary">{metrics.winRate.toFixed(1)}%</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Avg Return</p>
                <p className="text-2xl font-bold text-cyan-400">{formatPercentage(metrics.averageReturn)}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Volatility</p>
                <p className="text-2xl font-bold text-yellow-400">{formatPercentage(metrics.volatility)}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.sharpeRatio.toFixed(2)}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-primary">{formatPercentage(Math.abs(metrics.maxDrawdown))}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Total Return</p>
                <p className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatPercentage(metrics.totalReturn, { showSign: true })}
                </p>
              </Card>
            </div>
          )}

          {filteredSnapshots.length > 0 && (
            <div className="space-y-6 md:space-y-8">
              <ChartCard title="Portfolio Equity Curve" height={400}>
                <EquityCurve snapshots={filteredSnapshots} />
              </ChartCard>

              <ChartCard title="Portfolio Gain/Loss" height={400}>
                <GainLossChart snapshots={filteredSnapshots} />
              </ChartCard>

              {summary && (
                <ChartCard title="Portfolio Value & PnL" height={400}>
                  <MultiSeriesChart
                    snapshots={filteredSnapshots}
                    series={[
                      {
                        key: "value",
                        label: "Portfolio Value",
                        color: "#00ffff",
                        type: "line",
                        dataKey: (s) => s.totalCurrentValue,
                      },
                      {
                        key: "pnl",
                        label: "Unrealized P/L",
                        color: "#00ff88",
                        type: "area",
                        dataKey: (s) => s.totalUnrealizedPnL,
                      },
                    ]}
                  />
                </ChartCard>
              )}
            </div>
          )}

          {returnDistribution.length > 0 && (
            <ChartCard title="Return Distribution" height={400}>
              <ReturnDistributionChart data={returnDistribution} />
            </ChartCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4 text-green-primary">Top Performers</h3>
              <div className="space-y-2">
                {topPositions.length > 0 ? (
                  topPositions.map((position, index) => (
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
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-4">No positions available</p>
                )}
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4 text-red-primary">Bottom Performers</h3>
              <div className="space-y-2">
                {bottomPositions.length > 0 ? (
                  bottomPositions.map((position, index) => (
                    <div key={position._id} className="flex justify-between items-center p-3 bg-dark-surface rounded-lg">
                      <div>
                        <p className="font-semibold text-text-primary">{position.companyName}</p>
                        <p className="text-sm text-text-secondary">{position.totalQuantity} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-primary font-bold">
                          {formatPercentage(position.unrealizedPct || 0, { showSign: true })}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {formatCurrency(position.unrealizedPnL || 0, { showSign: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-4">No positions available</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

