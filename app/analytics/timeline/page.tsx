// Time-Based Analysis page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useSnapshots } from "@/hooks/api/useAnalytics";
import { useTimeBasedAnalytics } from "@/hooks/analytics/useTimeBasedAnalytics";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Button } from "@/components/ui/Button";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import dynamic from "next/dynamic";

// Lazy load charts
const EquityCurve = dynamic(
  () => import("@/components/charts/EquityCurve").then((mod) => ({ default: mod.EquityCurve })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const AreaStackChart = dynamic(
  () => import("@/components/charts/analytics/AreaStackChart").then((mod) => ({ default: mod.AreaStackChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type Period = "daily" | "weekly" | "monthly" | "yearly";

export default function TimelineAnalysisPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [compareToPrevious, setCompareToPrevious] = useState(true);
  const { analytics, isLoading } = useTimeBasedAnalytics(period);
  const { data: allSnapshots = [] } = useSnapshots();
  
  const aggregatedSnapshots = analytics?.aggregated || [];
  const periodComparison = analytics?.periodComparison;

  useEffect(() => {
    logger.page("Timeline Analysis", {
      pathname: window.location.pathname,
    });
  }, []);

  const stackData = React.useMemo(() => {
    if (!aggregatedSnapshots.length) return [];
    
    return aggregatedSnapshots.map((snapshot) => ({
      date: new Date(snapshot.date).toLocaleDateString(),
      investment: snapshot.totalInvestment,
      value: snapshot.totalCurrentValue,
      pnl: snapshot.totalUnrealizedPnL,
    }));
  }, [aggregatedSnapshots]);

  if (isLoading && !analytics) {
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
            <Heading level={1}>Time-Based Analysis</Heading>
            <div className="flex gap-2 flex-wrap">
              {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
              <Button
                variant={compareToPrevious ? "primary" : "secondary"}
                size="sm"
                onClick={() => setCompareToPrevious(!compareToPrevious)}
              >
                {compareToPrevious ? "Hide Comparison" : "Show Comparison"}
              </Button>
            </div>
          </div>


          {periodComparison && compareToPrevious && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Investment Change</p>
                <p className={`text-2xl font-bold ${periodComparison.changePercent.investment >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatCurrency(periodComparison.change.investment, { showSign: true })}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {formatPercentage(periodComparison.changePercent.investment, { showSign: true })}
                </p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Value Change</p>
                <p className={`text-2xl font-bold ${periodComparison.changePercent.currentValue >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatCurrency(periodComparison.change.currentValue, { showSign: true })}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {formatPercentage(periodComparison.changePercent.currentValue, { showSign: true })}
                </p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">P/L Change</p>
                <p className={`text-2xl font-bold ${periodComparison.changePercent.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatCurrency(periodComparison.change.unrealizedPnL, { showSign: true })}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {formatPercentage(periodComparison.changePercent.unrealizedPnL, { showSign: true })}
                </p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Return % Change</p>
                <p className={`text-2xl font-bold ${periodComparison.changePercent.unrealizedPct >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatPercentage(periodComparison.changePercent.unrealizedPct, { showSign: true })}
                </p>
              </Card>
            </div>
          )}

          {allSnapshots.length > 0 && (
            <ChartCard title="Portfolio Equity Curve" height={400}>
              <EquityCurve snapshots={allSnapshots} />
            </ChartCard>
          )}

          {stackData.length > 0 && (
            <ChartCard title="Investment & Value Over Time" height={400}>
              <AreaStackChart
                data={stackData}
                series={[
                  { key: "investment", label: "Investment" },
                  { key: "value", label: "Current Value" },
                ]}
                height={400}
              />
            </ChartCard>
          )}

          {aggregatedSnapshots.length > 0 && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4">Aggregated Data</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left p-3 text-text-secondary">Date</th>
                      <th className="text-right p-3 text-text-secondary">Investment</th>
                      <th className="text-right p-3 text-text-secondary">Current Value</th>
                      <th className="text-right p-3 text-text-secondary">Unrealized P/L</th>
                      <th className="text-right p-3 text-text-secondary">Return %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedSnapshots.slice(-10).reverse().map((snapshot, index) => {
                      const returnPct = snapshot.totalInvestment > 0
                        ? (snapshot.totalUnrealizedPnL / snapshot.totalInvestment) * 100
                        : 0;
                      return (
                        <tr key={`${snapshot.date}-${index}`} className="border-b border-dark-border hover:bg-dark-surface/50">
                          <td className="p-3 text-text-primary">{new Date(snapshot.date).toLocaleDateString()}</td>
                          <td className="p-3 text-right text-text-primary">{formatCurrency(snapshot.totalInvestment)}</td>
                          <td className="p-3 text-right text-text-primary">{formatCurrency(snapshot.totalCurrentValue)}</td>
                          <td className={`p-3 text-right font-semibold ${snapshot.totalUnrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                            {formatCurrency(snapshot.totalUnrealizedPnL, { showSign: true })}
                          </td>
                          <td className={`p-3 text-right font-semibold ${returnPct >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                            {formatPercentage(returnPct / 100, { showSign: true })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

