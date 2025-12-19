// Analytics Hub - Central analytics dashboard
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useSummary, useSnapshots } from "@/hooks/api/useAnalytics";
import { usePerformanceAnalytics } from "@/hooks/analytics/usePerformanceAnalytics";
import { useTransactionAnalytics } from "@/hooks/analytics/useTransactionAnalytics";
import { useAllocationData } from "@/hooks/analytics/useAllocationData";
import { usePositions } from "@/hooks/api/usePositions";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import dynamic from "next/dynamic";

// Lazy load charts
const AllocationPieChart = dynamic(
  () =>
    import("@/components/charts/analytics/AllocationPieChart").then((mod) => ({
      default: mod.AllocationPieChart,
    })),
  {
    loading: () => <Skeleton variant="rectangular" height="200px" />,
    ssr: false,
  }
);

export default function AnalyticsHubPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useSummary();
  const { data: snapshots = [] } = useSnapshots();
  const { metrics: performanceMetrics } = usePerformanceAnalytics();
  const { analytics: transactionAnalytics } = useTransactionAnalytics();
  const { allocation } = useAllocationData();
  const { data: positions = [] } = usePositions();

  useEffect(() => {
    logger.page("Analytics Hub", {
      pathname: window.location.pathname,
    });
  }, []);

  const analyticsCards = React.useMemo(
    () => [
      {
        title: "Performance Analytics",
        description: "Portfolio performance, returns, and metrics",
        href: "/analytics/performance",
        icon: TrendingUp,
        color: "from-green-primary to-green-hover",
        metric: performanceMetrics
          ? `${formatPercentage(performanceMetrics.averageReturn)}`
          : "N/A",
        metricLabel: "Avg Return",
      },
      {
        title: "Transaction Analytics",
        description: "Transaction volume, patterns, and trends",
        href: "/analytics/transactions",
        icon: BarChart3,
        color: "from-cyan-400 to-blue-500",
        metric: transactionAnalytics?.totalTransactions ?? 0,
        metricLabel: "Total Transactions",
      },
      {
        title: "Portfolio Allocation",
        description: "Investment distribution and allocation",
        href: "/analytics/allocation",
        icon: PieChart,
        color: "from-purple-500 to-pink-500",
        metric: allocation?.companyCount ?? 0,
        metricLabel: "Companies",
      },
      {
        title: "Company Comparison",
        description: "Compare performance across companies",
        href: "/analytics/companies/compare",
        icon: LineChart,
        color: "from-yellow-400 to-orange-500",
        metric: allocation?.companies?.length ?? 0,
        metricLabel: "Companies",
      },
      {
        title: "Time-Based Analysis",
        description: "Historical trends and period comparisons",
        href: "/analytics/timeline",
        icon: Activity,
        color: "from-blue-400 to-cyan-400",
        metric: snapshots?.length ?? 0,
        metricLabel: "Snapshots",
      },
      {
        title: "Position Analytics",
        description: "Position performance and analysis",
        href: "/analytics/positions",
        icon: Target,
        color: "from-green-400 to-emerald-500",
        metric: summary?.count ?? 0,
        metricLabel: "Positions",
      },
      {
        title: "Risk Analysis",
        description: "Risk metrics and drawdown analysis",
        href: "/analytics/risk",
        icon: Shield,
        color: "from-red-400 to-orange-500",
        metric: performanceMetrics
          ? `${formatPercentage(Math.abs(performanceMetrics.maxDrawdown))}`
          : "N/A",
        metricLabel: "Max Drawdown",
      },
    ],
    [performanceMetrics, transactionAnalytics, allocation, snapshots, summary]
  );

  const loading = summaryLoading;
  const error = summaryError;

  if (loading && !summary) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} variant="rectangular" height="200px" />
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
          <Heading level={1}>Analytics Hub</Heading>

          {summaryError && <Error message={getErrorMessage(summaryError)} />}

          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card
                variant="elevated"
                padding="md"
                className="bg-gradient-to-br from-green-primary/20 to-green-hover/10 border-green-primary/30"
              >
                <p className="text-text-secondary text-sm mb-2">
                  Total Investment
                </p>
                <p className="text-2xl font-bold text-green-primary">
                  {formatCurrency(summary.totalInvestment)}
                </p>
              </Card>
              <Card
                variant="elevated"
                padding="md"
                className="bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border-cyan-400/30"
              >
                <p className="text-text-secondary text-sm mb-2">
                  Current Value
                </p>
                <p className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(summary.totalCurrentValue)}
                </p>
              </Card>
              <Card
                variant="elevated"
                padding="md"
                className={
                  summary.totalUnrealizedPnL >= 0
                    ? "bg-gradient-to-br from-green-primary/20 to-green-hover/10 border-green-primary/30"
                    : "bg-gradient-to-br from-red-primary/20 to-red-hover/10 border-red-primary/30"
                }
              >
                <p className="text-text-secondary text-sm mb-2">
                  Unrealized P/L
                </p>
                <p
                  className={`text-2xl font-bold ${
                    summary.totalUnrealizedPnL >= 0
                      ? "text-green-primary"
                      : "text-red-primary"
                  }`}
                >
                  {formatCurrency(summary.totalUnrealizedPnL, {
                    showSign: true,
                  })}
                </p>
              </Card>
              <Card
                variant="elevated"
                padding="md"
                className={
                  summary.totalPercent >= 0
                    ? "bg-gradient-to-br from-green-primary/20 to-green-hover/10 border-green-primary/30"
                    : "bg-gradient-to-br from-red-primary/20 to-red-hover/10 border-red-primary/30"
                }
              >
                <p className="text-text-secondary text-sm mb-2">Total Return</p>
                <p
                  className={`text-2xl font-bold ${
                    summary.totalPercent >= 0
                      ? "text-green-primary"
                      : "text-red-primary"
                  }`}
                >
                  {formatPercentage(summary.totalPercent, { showSign: true })}
                </p>
              </Card>
            </div>
          )}

          {allocation && allocation.companies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 md:mb-6">
                Portfolio Allocation
              </h2>
              <Card variant="elevated" padding="lg">
                <AllocationPieChart
                  data={allocation.companies.map((c) => ({
                    companyName: c.companyName,
                    value: c.totalInvestment,
                    percentage: c.allocationPercent,
                  }))}
                />
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4 md:mb-6">
              Analytics Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {analyticsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link href={card.href}>
                      <Card
                        variant="elevated"
                        padding="lg"
                        className="h-full hover:scale-[1.02] hover:shadow-xl hover:shadow-green-primary/20 transition-all duration-normal cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${card.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-green-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-text-secondary text-sm mb-4">
                          {card.description}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-primary to-green-hover text-transparent bg-clip-text">
                            {card.metric}
                          </span>
                          <span className="text-text-tertiary text-sm">
                            {card.metricLabel}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
