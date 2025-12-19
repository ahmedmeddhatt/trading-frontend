// Transaction Analytics page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useTransactionAnalytics } from "@/hooks/analytics/useTransactionAnalytics";
import { usePositions } from "@/hooks/api/usePositions";
import { formatCurrency } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { Button } from "@/components/ui/Button";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import dynamic from "next/dynamic";

// Lazy load charts
const TransactionVolumeChart = dynamic(
  () => import("@/components/charts/analytics/TransactionVolumeChart").then((mod) => ({ default: mod.TransactionVolumeChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const BuySellRatioChart = dynamic(
  () => import("@/components/charts/analytics/BuySellRatioChart").then((mod) => ({ default: mod.BuySellRatioChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type Period = "daily" | "weekly" | "monthly";

export default function TransactionAnalyticsPage() {
  const { analytics, isLoading } = useTransactionAnalytics();
  const { data: positions = [] } = usePositions();
  const [period, setPeriod] = useState<Period>("monthly");
  const [showCount, setShowCount] = useState(false);

  useEffect(() => {
    logger.page("Transaction Analytics", {
      pathname: window.location.pathname,
    });
  }, []);

  const volumeData = React.useMemo(() => {
    if (!analytics) return [];
    
    const aggregation = period === "daily" 
      ? analytics.dailyAggregation
      : period === "weekly"
      ? analytics.weeklyAggregation
      : analytics.monthlyAggregation;
    
    return aggregation.map((item) => ({
      date: item.date,
      buyVolume: item.buyVolume,
      sellVolume: item.sellVolume,
      buyCount: item.buyCount,
      sellCount: item.sellCount,
    }));
  }, [analytics, period]);

  if (isLoading) {
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

  if (isLoading) {
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

  if (!analytics) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <Error message="No transaction data available" />
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
            <Heading level={1}>Transaction Analytics</Heading>
            <div className="flex gap-2 flex-wrap">
              {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
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
                variant={showCount ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowCount(!showCount)}
              >
                {showCount ? "Show Volume" : "Show Count"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card variant="elevated" padding="md" className="bg-gradient-to-br from-green-primary/20 to-green-hover/10 border-green-primary/30">
              <p className="text-text-secondary text-sm mb-2">Total Transactions</p>
              <p className="text-2xl font-bold text-green-primary">{analytics.totalTransactions}</p>
            </Card>
            <Card variant="elevated" padding="md" className="bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border-cyan-400/30">
              <p className="text-text-secondary text-sm mb-2">Buy Transactions</p>
              <p className="text-2xl font-bold text-cyan-400">{analytics.buyCount}</p>
            </Card>
            <Card variant="elevated" padding="md" className="bg-gradient-to-br from-red-primary/20 to-red-hover/10 border-red-primary/30">
              <p className="text-text-secondary text-sm mb-2">Sell Transactions</p>
              <p className="text-2xl font-bold text-red-primary">{analytics.sellCount}</p>
            </Card>
            <Card variant="elevated" padding="md" className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30">
              <p className="text-text-secondary text-sm mb-2">Total Fees</p>
              <p className="text-2xl font-bold text-purple-400">{formatCurrency(analytics.totalFees)}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Buy Volume</p>
              <p className="text-2xl font-bold text-green-primary">{analytics.buyVolume.toLocaleString()}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Sell Volume</p>
              <p className="text-2xl font-bold text-red-primary">{analytics.sellVolume.toLocaleString()}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Buy Value</p>
              <p className="text-2xl font-bold text-green-primary">{formatCurrency(analytics.buyValue)}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Avg Transaction Size</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(analytics.averageTransactionSize)}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Transaction Volume Over Time" height={400}>
              <TransactionVolumeChart data={volumeData} height={400} showCount={showCount} />
            </ChartCard>

            <ChartCard title="Buy vs Sell Ratio" height={400}>
              <BuySellRatioChart
                data={{
                  buy: analytics.buyCount,
                  sell: analytics.sellCount,
                }}
                height={400}
                variant="donut"
              />
            </ChartCard>
          </div>

          <Card variant="elevated" padding="lg">
            <h3 className="text-xl font-bold mb-4">Transaction Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary text-sm mb-1">Buy/Sell Ratio</p>
                <p className="text-2xl font-bold text-cyan-400">{analytics.buySellRatio.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm mb-1">Total Transaction Value</p>
                <p className="text-2xl font-bold text-green-primary">
                  {formatCurrency(analytics.buyValue + analytics.sellValue)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

