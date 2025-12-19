// Risk Analysis page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useRiskMetrics } from "@/hooks/analytics/useRiskMetrics";
import { useSnapshots } from "@/hooks/api/useAnalytics";
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
const DrawdownChart = dynamic(
  () => import("@/components/charts/financial/DrawdownChart").then((mod) => ({ default: mod.DrawdownChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const MultiSeriesChart = dynamic(
  () => import("@/components/charts/financial/MultiSeriesChart").then((mod) => ({ default: mod.MultiSeriesChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "All";

export default function RiskAnalysisPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("All");
  const { metrics, isLoading } = useRiskMetrics();
  const { data: allSnapshots = [] } = useSnapshots();

  useEffect(() => {
    logger.page("Risk Analysis", {
      pathname: window.location.pathname,
    });
  }, []);

  // Filter snapshots by timeframe
  const filteredSnapshots = React.useMemo(() => {
    if (timeframe === "All" || allSnapshots.length === 0) return allSnapshots;
    
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
    
    return allSnapshots.filter((snapshot) => new Date(snapshot.date) >= cutoffDate);
  }, [allSnapshots, timeframe]);

  if (isLoading && !metrics) {
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
            <Heading level={1}>Risk Analysis</Heading>
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


          {metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-red-primary/20 to-red-hover/10 border-red-primary/30">
                <p className="text-text-secondary text-sm mb-2">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-primary">{formatPercentage(Math.abs(metrics.maxDrawdown))}</p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border-yellow-400/30">
                <p className="text-text-secondary text-sm mb-2">Volatility</p>
                <p className="text-2xl font-bold text-yellow-400">{formatPercentage(metrics.volatility)}</p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30">
                <p className="text-text-secondary text-sm mb-2">Value at Risk (95%)</p>
                <p className="text-2xl font-bold text-purple-400">{formatPercentage(metrics.valueAtRisk)}</p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/30">
                <p className="text-text-secondary text-sm mb-2">Sortino Ratio</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.sortinoRatio.toFixed(2)}</p>
              </Card>
            </div>
          )}

          {filteredSnapshots.length > 0 && (
            <div className="space-y-6 md:space-y-8">
              {filteredSnapshots.length > 0 && (
                <ChartCard title="Drawdown Analysis" height={400}>
                  <DrawdownChart snapshots={filteredSnapshots} height={400} />
                </ChartCard>
              )}

              {filteredSnapshots.length > 1 && (
                <ChartCard title="Portfolio Value & Drawdown" height={400}>
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
                        key: "drawdown",
                        label: "Drawdown",
                        color: "#ff4444",
                        type: "area",
                        dataKey: (s) => {
                          // Calculate drawdown
                          const sorted = [...filteredSnapshots].sort(
                            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                          );
                          let maxValue = sorted[0]?.totalCurrentValue ?? 0;
                          for (const snap of sorted) {
                            const currentValue = snap.totalCurrentValue ?? 0;
                            if (currentValue > maxValue) {
                              maxValue = currentValue;
                            }
                            if (snap.date === s.date) {
                              // Avoid division by zero and NaN
                              if (maxValue <= 0) return 0;
                              const drawdown = ((currentValue - maxValue) / maxValue) * 100;
                              return isNaN(drawdown) || !isFinite(drawdown) ? 0 : drawdown;
                            }
                          }
                          return 0;
                        },
                      },
                    ]}
                  />
                </ChartCard>
              )}
            </div>
          )}

          <Card variant="elevated" padding="lg">
            <h3 className="text-xl font-bold mb-4">Risk Metrics Explanation</h3>
            <div className="space-y-4 text-text-secondary text-sm">
              <div>
                <p className="font-semibold text-text-primary mb-1">Maximum Drawdown</p>
                <p>The largest peak-to-trough decline in portfolio value over the selected period.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Volatility</p>
                <p>Standard deviation of portfolio returns, measuring the degree of variation in returns.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Value at Risk (VaR)</p>
                <p>The maximum potential loss at 95% confidence level based on historical returns.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-1">Sortino Ratio</p>
                <p>Risk-adjusted return measure that only considers downside volatility.</p>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

