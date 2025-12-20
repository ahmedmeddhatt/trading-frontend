// Time-based and company-based data aggregations
import { Position, DailySnapshot } from "@/lib/api/analytics";
import { Transaction } from "@/lib/api/transactions";

export interface TimeAggregation {
  date: string;
  totalInvestment: number;
  totalCurrentValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPct: number;
  transactionCount: number;
  transactionVolume: number;
}

export interface CompanyAggregation {
  companyName: string;
  positionCount: number;
  totalInvestment: number;
  totalCurrentValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPct: number;
  averageReturn: number;
}

// Aggregate data by time period (daily, weekly, monthly, yearly)
export const aggregateByTimePeriod = (
  snapshots: DailySnapshot[],
  period: "daily" | "weekly" | "monthly" | "yearly"
): TimeAggregation[] => {
  if (snapshots.length === 0) return [];
  
  const sorted = [...snapshots].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const grouped = new Map<string, DailySnapshot[]>();
  
  for (const snapshot of sorted) {
    const date = new Date(snapshot.date);
    let key: string;
    
    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "yearly":
        key = String(date.getFullYear());
        break;
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(snapshot);
  }
  
  return Array.from(grouped.entries()).map(([date, snapshots]) => {
    const latest = snapshots[snapshots.length - 1];
    return {
      date,
      totalInvestment: latest.totalInvestment,
      totalCurrentValue: latest.totalCurrentValue,
      totalUnrealizedPnL: latest.totalUnrealizedPnL,
      totalUnrealizedPct: latest.totalInvestment > 0
        ? (latest.totalUnrealizedPnL / latest.totalInvestment) * 100
        : 0,
      transactionCount: 0, // Would need transaction data
      transactionVolume: 0, // Would need transaction data
    };
  });
};

// Aggregate positions by company
export const aggregateByCompany = (positions: Position[]): CompanyAggregation[] => {
  const grouped = new Map<string, Position[]>();
  
  for (const position of positions) {
    const company = position.companyName;
    if (!grouped.has(company)) {
      grouped.set(company, []);
    }
    grouped.get(company)!.push(position);
  }
  
  return Array.from(grouped.entries()).map(([companyName, companyPositions]) => {
    const totalInvestment = companyPositions.reduce((sum, p) => sum + (p.investmentWithFees || 0), 0);
    const totalCurrentValue = companyPositions.reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const totalUnrealizedPnL = companyPositions.reduce((sum, p) => sum + (p.unrealizedPnL || 0), 0);
    const totalUnrealizedPct = totalInvestment > 0 ? (totalUnrealizedPnL / totalInvestment) * 100 : 0;
    const averageReturn = companyPositions.length > 0
      ? companyPositions.reduce((sum, p) => sum + (p.unrealizedPct || 0), 0) / companyPositions.length
      : 0;
    
    return {
      companyName,
      positionCount: companyPositions.length,
      totalInvestment,
      totalCurrentValue,
      totalUnrealizedPnL,
      totalUnrealizedPct,
      averageReturn,
    };
  });
};

// Aggregate transactions by time period
export const aggregateTransactionsByTime = (
  transactions: Transaction[],
  period: "daily" | "weekly" | "monthly" | "yearly"
): Array<{ 
  date: string; 
  buyCount: number; 
  sellCount: number; 
  buyVolume: number; 
  sellVolume: number; 
  buyValue: number;
  sellValue: number;
  totalFees: number;
}> => {
  if (transactions.length === 0) return [];
  
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const grouped = new Map<string, Transaction[]>();
  
  for (const transaction of sorted) {
    const date = new Date(transaction.createdAt);
    let key: string;
    
    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "yearly":
        key = String(date.getFullYear());
        break;
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(transaction);
  }
  
  return Array.from(grouped.entries()).map(([date, periodTransactions]) => {
    const buyTransactions = periodTransactions.filter((t) => t.type === "buy");
    const sellTransactions = periodTransactions.filter((t) => t.type === "sell");
    
    return {
      date,
      buyCount: buyTransactions.length,
      sellCount: sellTransactions.length,
      buyVolume: buyTransactions.reduce((sum, t) => sum + t.quantity, 0),
      sellVolume: sellTransactions.reduce((sum, t) => sum + t.quantity, 0),
      buyValue: buyTransactions.reduce((sum, t) => sum + (t.total || 0), 0),
      sellValue: sellTransactions.reduce((sum, t) => sum + (t.total || 0), 0),
      totalFees: periodTransactions.reduce((sum, t) => sum + (t.fees || 0), 0),
    };
  });
};

// Calculate holding period for positions
export const calculateHoldingPeriod = (position: Position): number => {
  const created = new Date(position.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
};

// Get return distribution buckets
export const getReturnDistribution = (positions: Position[], buckets: number = 10): Array<{ range: string; count: number }> => {
  if (positions.length === 0) return [];
  
  const returns = positions.map((p) => p.unrealizedPct || 0);
  const min = Math.min(...returns);
  const max = Math.max(...returns);
  const range = max - min;
  const bucketSize = range / buckets;
  
  const distribution = Array(buckets).fill(0).map((_, i) => ({
    range: `${(min + i * bucketSize).toFixed(1)}% - ${(min + (i + 1) * bucketSize).toFixed(1)}%`,
    count: 0,
  }));
  
  for (const ret of returns) {
    const bucketIndex = Math.min(
      Math.floor((ret - min) / bucketSize),
      buckets - 1
    );
    distribution[bucketIndex].count++;
  }
  
  return distribution;
};



