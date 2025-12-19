// Hook for transaction analytics
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { usePositions } from "@/hooks/api/usePositions";
import { TransactionsAPI, Transaction } from "@/lib/api/transactions";
import { aggregateTransactionsByTime } from "@/lib/analytics/aggregations";

export const useTransactionAnalytics = () => {
  // Get all transactions by fetching from all positions
  const { data: positions = [] } = usePositions();
  
  // Fetch transactions for all positions
  const transactionQueries = useQueries({
    queries: positions.map((position) => ({
      queryKey: ["transactions", position._id],
      queryFn: () => TransactionsAPI.getAll(position._id),
      staleTime: 30 * 1000,
    })),
  });
  
  const allTransactions = useMemo(() => {
    return transactionQueries
      .map((query) => query.data || [])
      .flat()
      .filter((t): t is Transaction => t !== undefined);
  }, [transactionQueries]);
  
  const isLoading = transactionQueries.some((query) => query.isLoading);
  
  const analytics = useMemo(() => {
    const buyTransactions = allTransactions.filter((t: Transaction) => t.type === "buy");
    const sellTransactions = allTransactions.filter((t: Transaction) => t.type === "sell");
    
    const totalBuyVolume = buyTransactions.reduce((sum: number, t: Transaction) => sum + t.quantity, 0);
    const totalSellVolume = sellTransactions.reduce((sum: number, t: Transaction) => sum + t.quantity, 0);
    const totalBuyValue = buyTransactions.reduce((sum: number, t: Transaction) => sum + t.total, 0);
    const totalSellValue = sellTransactions.reduce((sum: number, t: Transaction) => sum + t.total, 0);
    const totalFees = allTransactions.reduce((sum: number, t: Transaction) => sum + (t.fees || 0), 0);
    const averageTransactionSize = allTransactions.length > 0
      ? allTransactions.reduce((sum: number, t: Transaction) => sum + t.total, 0) / allTransactions.length
      : 0;
    
    const dailyAggregation = aggregateTransactionsByTime(allTransactions, "daily");
    const weeklyAggregation = aggregateTransactionsByTime(allTransactions, "weekly");
    const monthlyAggregation = aggregateTransactionsByTime(allTransactions, "monthly");
    
    return {
      totalTransactions: allTransactions.length,
      buyCount: buyTransactions.length,
      sellCount: sellTransactions.length,
      buyVolume: totalBuyVolume,
      sellVolume: totalSellVolume,
      buyValue: totalBuyValue,
      sellValue: totalSellValue,
      totalFees,
      averageTransactionSize,
      buySellRatio: sellTransactions.length > 0 ? buyTransactions.length / sellTransactions.length : 0,
      dailyAggregation,
      weeklyAggregation,
      monthlyAggregation,
    };
  }, [allTransactions]);
  
  return {
    analytics,
    isLoading,
  };
};

