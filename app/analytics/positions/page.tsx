// Position Analytics page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { usePositions } from "@/hooks/api/usePositions";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import dynamic from "next/dynamic";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { motion } from "framer-motion";

// Lazy load charts
const HeatmapChart = dynamic(
  () => import("@/components/charts/analytics/HeatmapChart").then((mod) => ({ default: mod.HeatmapChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const RiskReturnScatterChart = dynamic(
  () => import("@/components/charts/analytics/ScatterChart").then((mod) => ({ default: mod.RiskReturnScatterChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const BubbleChart = dynamic(
  () => import("@/components/charts/specialized/BubbleChart").then((mod) => ({ default: mod.BubbleChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type ViewMode = "heatmap" | "scatter" | "bubble";

export default function PositionAnalyticsPage() {
  const { data: positions = [], isLoading } = usePositions();
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");

  useEffect(() => {
    logger.page("Position Analytics", {
      pathname: window.location.pathname,
    });
  }, []);

  // Calculate position analytics
  const positionAnalytics = React.useMemo(() => {
    if (!positions.length) return null;

    const holdingPositions = positions.filter((p) => p.status === "holding");
    const soldPositions = positions.filter((p) => p.status === "sold");
    const watchingPositions = positions.filter((p) => p.status === "watching");

    // Calculate average holding period (simplified - using created date)
    const now = new Date();
    const holdingPeriods = holdingPositions.map((p) => {
      const created = new Date(p.createdAt);
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return days;
    });

    const avgHoldingPeriod = holdingPeriods.length > 0
      ? holdingPeriods.reduce((sum, days) => sum + days, 0) / holdingPeriods.length
      : 0;

    // Calculate win rate
    const winningPositions = positions.filter((p) => (p.unrealizedPct || 0) > 0);
    const winRate = positions.length > 0 ? (winningPositions.length / positions.length) * 100 : 0;

    // Calculate average metrics
    const avgReturn = positions.length > 0
      ? positions.reduce((sum, p) => sum + (p.unrealizedPct || 0), 0) / positions.length
      : 0;

    const avgInvestment = positions.length > 0
      ? positions.reduce((sum, p) => sum + (p.investmentWithFees || 0), 0) / positions.length
      : 0;

    return {
      totalPositions: positions.length,
      holdingCount: holdingPositions.length,
      soldCount: soldPositions.length,
      watchingCount: watchingPositions.length,
      winRate,
      avgReturn,
      avgInvestment,
      avgHoldingPeriod: Math.round(avgHoldingPeriod),
    };
  }, [positions]);

  // Prepare heatmap data
  const heatmapData = React.useMemo(() => {
    return positions.map((position) => ({
      companyName: position.companyName,
      positionId: position._id,
      value: position.unrealizedPct || 0,
      label: `${position.companyName} - ${formatPercentage(position.unrealizedPct || 0)}`,
    }));
  }, [positions]);

  // Prepare scatter plot data (risk vs return)
  const scatterData = React.useMemo(() => {
    return positions
      .filter((p) => p.investmentWithFees && p.investmentWithFees > 0)
      .map((position) => {
        // Use investment size as proxy for risk (larger investment = higher risk)
        const risk = Math.log10(position.investmentWithFees || 1);
        return {
          x: risk,
          y: position.unrealizedPct || 0,
          name: position.companyName,
          size: position.investmentWithFees || 0,
        };
      });
  }, [positions]);

  // Prepare bubble chart data (size vs performance)
  const bubbleData = React.useMemo(() => {
    return positions
      .filter((p) => p.investmentWithFees && p.investmentWithFees > 0)
      .map((position) => ({
        x: position.investmentWithFees || 0,
        y: position.unrealizedPct || 0,
        size: position.totalQuantity || 0,
        label: position.companyName,
      }));
  }, [positions]);

  // Group positions by status
  const statusDistribution = React.useMemo(() => {
    if (!positions.length) return [];
    
    const statuses = positions.reduce((acc, p) => {
      const status = p.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: count ?? 0,
      percentage: positions.length > 0 ? (count / positions.length) * 100 : 0,
    }));
  }, [positions]);

  if (isLoading && !positions.length) {
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

  if (!positions.length) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <Error message="No positions available. Create positions to see analytics." />
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
            <Heading level={1}>Position Analytics</Heading>
            <div className="flex gap-2 flex-wrap">
              {(["heatmap", "scatter", "bubble"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === mode
                      ? "bg-green-primary text-dark-base font-semibold"
                      : "bg-dark-surface text-text-secondary hover:bg-dark-elevated"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {positionAnalytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-green-primary/20 to-green-hover/10 border-green-primary/30">
                <p className="text-text-secondary text-sm mb-2">Total Positions</p>
                <p className="text-2xl font-bold text-green-primary">{positionAnalytics.totalPositions}</p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border-cyan-400/30">
                <p className="text-text-secondary text-sm mb-2">Win Rate</p>
                <p className="text-2xl font-bold text-cyan-400">{positionAnalytics.winRate.toFixed(1)}%</p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30">
                <p className="text-text-secondary text-sm mb-2">Avg Return</p>
                <p className={`text-2xl font-bold ${positionAnalytics.avgReturn >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatPercentage(positionAnalytics.avgReturn, { showSign: true })}
                </p>
              </Card>
              <Card variant="elevated" padding="md" className="bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border-yellow-400/30">
                <p className="text-text-secondary text-sm mb-2">Avg Holding Period</p>
                <p className="text-2xl font-bold text-yellow-400">{positionAnalytics.avgHoldingPeriod} days</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Holding</p>
                <p className="text-2xl font-bold text-green-primary">{positionAnalytics.holdingCount}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Sold</p>
                <p className="text-2xl font-bold text-cyan-400">{positionAnalytics.soldCount}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Watching</p>
                <p className="text-2xl font-bold text-purple-400">{positionAnalytics.watchingCount}</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-text-secondary text-sm mb-2">Avg Investment</p>
                <p className="text-2xl font-bold text-yellow-400">{formatCurrency(positionAnalytics.avgInvestment)}</p>
              </Card>
            </div>
          )}

          {heatmapData.length > 0 && viewMode === "heatmap" && (
            <ChartCard title="Position Performance Heatmap" height={500}>
              <HeatmapChart data={heatmapData} height={500} />
            </ChartCard>
          )}

          {scatterData.length > 0 && viewMode === "scatter" && (
            <ChartCard title="Risk vs Return Analysis" height={400}>
              <RiskReturnScatterChart
                data={scatterData}
                xLabel="Risk (Log Investment)"
                yLabel="Return %"
                height={400}
              />
            </ChartCard>
          )}

          {bubbleData.length > 0 && viewMode === "bubble" && (
            <ChartCard title="Position Size vs Performance" height={400}>
              <BubbleChart data={bubbleData} height={400} />
            </ChartCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4">Status Distribution</h3>
              <div className="space-y-3">
                {statusDistribution.map((item, index) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: index === 0 ? "#00ff88" : index === 1 ? "#00ffff" : "#ff00ff",
                        }}
                      />
                      <span className="text-text-primary font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-text-secondary">{item.count ?? 0}</span>
                      <span className="text-text-tertiary text-sm">{(item.percentage ?? 0).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4">Top Performers</h3>
              <div className="space-y-2">
                {positions
                  .filter((p) => (p.unrealizedPct || 0) > 0)
                  .sort((a, b) => (b.unrealizedPct || 0) - (a.unrealizedPct || 0))
                  .slice(0, 5)
                  .map((position, index) => (
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
                {positions.filter((p) => (p.unrealizedPct || 0) > 0).length === 0 && (
                  <p className="text-text-secondary text-center py-4">No winning positions</p>
                )}
              </div>
            </Card>
          </div>

          <Card variant="elevated" padding="lg">
            <h3 className="text-xl font-bold mb-4">All Positions Summary</h3>
            <div className="overflow-x-auto">
              <Table className="bg-dark-elevated border border-dark-border">
                <TableHeader>
                  <TableRow className="bg-dark-surface">
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Company</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Status</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Quantity</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Investment</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Current Value</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">P/L</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Return %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position, index) => (
                    <motion.tr
                      key={position._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal"
                    >
                      <TableCell className="p-3 md:p-4 text-green-primary font-semibold">
                        {position.companyName}
                      </TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary capitalize">{position.status}</TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{position.totalQuantity}</TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(position.investmentWithFees || 0)}</TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(position.currentValue || 0)}</TableCell>
                      <TableCell
                        className={`p-3 md:p-4 font-semibold ${
                          (position.unrealizedPnL || 0) >= 0 ? "text-green-primary" : "text-red-primary"
                        }`}
                      >
                        {formatCurrency(position.unrealizedPnL || 0, { showSign: true })}
                      </TableCell>
                      <TableCell
                        className={`p-3 md:p-4 font-semibold ${
                          (position.unrealizedPct || 0) >= 0 ? "text-green-primary" : "text-red-primary"
                        }`}
                      >
                        {formatPercentage(position.unrealizedPct || 0, { showSign: true })}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

