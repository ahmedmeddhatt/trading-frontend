"use client";

import { useEffect, useState, use } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePosition } from "@/hooks/api/usePositions";
import { logger } from "@/lib/utils/logger";
import Link from "next/link";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import { useTransactions } from "@/hooks/api/useTransactions";
import { useMemo } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const TransactionsTable = dynamic(
  () =>
    import("@/components/transactions/TransactionsTable").then((mod) => ({
      default: mod.TransactionsTable,
    })),
  {
    loading: () => <Skeleton variant="rectangular" height="300px" />,
    ssr: false,
  }
);

const PositionFormModal = dynamic(
  () =>
    import("@/components/positions/PositionFormModal").then((mod) => ({
      default: mod.PositionFormModal,
    })),
  {
    ssr: false,
  }
);

const TimelineChart = dynamic(
  () =>
    import("@/components/charts/analytics/TimelineChart").then((mod) => ({
      default: mod.TimelineChart,
    })),
  {
    loading: () => <Skeleton variant="rectangular" height="300px" />,
    ssr: false,
  }
);

interface PositionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PositionDetailPage({
  params,
}: PositionDetailPageProps) {
  const { id } = use(params);
  const { data: position, isLoading, error, refetch } = usePosition(id);
  const { data: transactions = [] } = useTransactions(id);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    logger.page("Position Detail", {
      pathname: window.location.pathname,
      positionId: id,
    });
  }, [id]);

  // Prepare transaction timeline data
  const transactionTimelineData = useMemo(() => {
    if (!transactions.length) return [];

    const sorted = [...transactions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let cumulativeBuy = 0;
    let cumulativeSell = 0;

    return sorted.map((transaction) => {
      if (transaction.type === "buy") {
        cumulativeBuy += transaction.total;
      } else {
        cumulativeSell += transaction.total;
      }

      return {
        date: new Date(transaction.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        buyValue: transaction.type === "buy" ? transaction.total : 0,
        sellValue: transaction.type === "sell" ? transaction.total : 0,
        netValue:
          transaction.type === "buy" ? transaction.total : -transaction.total,
        cumulativeValue: cumulativeBuy - cumulativeSell,
      };
    });
  }, [transactions]);

  // Calculate position value over time (simplified - using transaction history)
  const positionValueData = useMemo(() => {
    if (!position || !transactions.length) return [];

    const sorted = [...transactions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let totalQuantity = 0;
    let totalInvestment = 0;

    return sorted.map((transaction) => {
      if (transaction.type === "buy") {
        totalQuantity += transaction.quantity;
        totalInvestment += transaction.total;
      } else {
        totalQuantity -= transaction.quantity;
        totalInvestment -= transaction.total;
      }

      // Estimate current value based on average price
      const avgPrice = totalQuantity > 0 ? totalInvestment / totalQuantity : 0;
      const estimatedValue =
        totalQuantity * (position.currentPrice || avgPrice);

      return {
        date: new Date(transaction.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        investment: totalInvestment,
        value: estimatedValue,
        pnl: estimatedValue - totalInvestment,
      };
    });
  }, [position, transactions]);

  if (isLoading && !position) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} variant="rectangular" height="100px" />
              ))}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  if (error && !position) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <Error message={getErrorMessage(error)} />
        </PageContainer>
      </ProtectedRoute>
    );
  }

  if (!position) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <Link href="/positions">
              <Button variant="primary">Back to Positions</Button>
            </Link>
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
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <Heading level={1}>{position.companyName}</Heading>
              <Link
                href="/positions"
                className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-normal mt-2 inline-block"
              >
                ← Back to Positions
              </Link>
            </div>
            <Button onClick={() => setShowEditModal(true)} variant="secondary">
              Edit Position
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Total Quantity</p>
              <p className="text-2xl font-bold">
                {position.totalQuantity || 0} shares
              </p>
            </Card>

            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Avg Purchase Price</p>
              <p className="text-2xl font-bold">
                {position.avgPurchasePrice
                  ? formatCurrency(position.avgPurchasePrice)
                  : "N/A"}
              </p>
            </Card>

            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Total Investment</p>
              <p className="text-2xl font-bold">
                {formatCurrency(position.investmentWithFees || 0)}
              </p>
            </Card>

            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Current Value</p>
              <p className="text-2xl font-bold">
                {(() => {
                  // Priority 1: Use backend currentValue if available and not 0
                  if (
                    position.currentValue !== undefined &&
                    position.currentValue !== null &&
                    position.currentValue !== 0
                  ) {
                    return formatCurrency(position.currentValue);
                  }

                  // Priority 2: Calculate from currentPrice × totalQuantity
                  // Check if both values exist (even if currentPrice is 0, we still calculate)
                  if (
                    position.currentPrice !== undefined &&
                    position.currentPrice !== null &&
                    position.totalQuantity !== undefined &&
                    position.totalQuantity !== null
                  ) {
                    const calculatedValue =
                      position.currentPrice * position.totalQuantity;
                    return formatCurrency(calculatedValue);
                  }

                  // Priority 3: If backend returned 0, show 0
                  if (position.currentValue === 0) {
                    return formatCurrency(0);
                  }

                  // Last resort: N/A
                  return "N/A";
                })()}
              </p>
            </Card>

            <Card
              className={`p-4 bg-[#1a1a1a] border border-[#2a2a2a] ${
                position.unrealizedPnL && position.unrealizedPnL >= 0
                  ? "text-[#00ff88]"
                  : "text-[#ff4444]"
              }`}
            >
              <p className="text-[#a3a3a3] text-sm mb-1">Unrealized P/L</p>
              <p className="text-2xl font-bold">
                {position.unrealizedPnL !== undefined
                  ? formatCurrency(position.unrealizedPnL, { showSign: true })
                  : "N/A"}
              </p>
            </Card>

            <Card
              className={`p-4 bg-[#1a1a1a] border border-[#2a2a2a] ${
                position.unrealizedPct && position.unrealizedPct >= 0
                  ? "text-[#00ff88]"
                  : "text-[#ff4444]"
              }`}
            >
              <p className="text-[#a3a3a3] text-sm mb-1">Unrealized %</p>
              <p className="text-2xl font-bold">
                {position.unrealizedPct !== undefined
                  ? formatPercentage(position.unrealizedPct, { showSign: true })
                  : "N/A"}
              </p>
            </Card>

            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Current Price</p>
              <p className="text-2xl font-bold">
                {position.currentPrice
                  ? formatCurrency(position.currentPrice)
                  : "Not set"}
              </p>
            </Card>

            <Card className="p-4 bg-[#1a1a1a] border border-[#2a2a2a]">
              <p className="text-[#a3a3a3] text-sm mb-1">Status</p>
              <p className="text-2xl font-bold capitalize">{position.status}</p>
            </Card>
          </div>

          {transactionTimelineData.length > 0 && (
            <div className="space-y-6">
              <ChartCard title="Transaction Timeline" height={300}>
                <TimelineChart data={transactionTimelineData} height={300} />
              </ChartCard>
            </div>
          )}

          {positionValueData.length > 0 && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4">
                Position Value Evolution
              </h3>
              <div className="space-y-2">
                {positionValueData
                  .slice(-5)
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-dark-surface rounded-lg"
                    >
                      <div>
                        <p className="text-text-secondary text-sm">
                          {item.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-primary font-semibold">
                          Investment: {formatCurrency(item.investment)}
                        </p>
                        <p className="text-cyan-400 font-semibold">
                          Value: {formatCurrency(item.value)}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            item.pnl >= 0
                              ? "text-green-primary"
                              : "text-red-primary"
                          }`}
                        >
                          P/L: {formatCurrency(item.pnl, { showSign: true })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          <div className="mt-6">
            <TransactionsTable positionId={id} />
          </div>
        </div>

        {showEditModal && (
          <PositionFormModal
            positionId={id}
            onClose={async () => {
              setShowEditModal(false);
              // Immediately invalidate cache to force refresh
              queryClient.invalidateQueries({ queryKey: ["positions", id] });
              queryClient.invalidateQueries({ queryKey: ["positions"] });
              // Wait a bit for backend to process, then refetch
              setTimeout(() => {
                refetch();
              }, 300);
            }}
          />
        )}
      </PageContainer>
    </ProtectedRoute>
  );
}
