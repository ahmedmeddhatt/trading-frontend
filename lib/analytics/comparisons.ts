// Comparison logic for analytics
import { Position, CompanyAnalytics } from "@/lib/api/analytics";

export interface ComparisonData {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
}

// Compare companies by performance
export const compareCompanies = (
  companies: CompanyAnalytics[]
): Array<CompanyAnalytics & { rank: number }> => {
  return companies
    .map((company) => ({
      ...company,
      rank: 0, // Will be set after sorting
    }))
    .sort((a, b) => (b.unrealizedPct || 0) - (a.unrealizedPct || 0))
    .map((company, index) => ({
      ...company,
      rank: index + 1,
    }));
};

// Compare periods (current vs previous)
export interface PeriodComparison {
  current: {
    totalInvestment: number;
    totalCurrentValue: number;
    totalUnrealizedPnL: number;
    totalUnrealizedPct: number;
  };
  previous: {
    totalInvestment: number;
    totalCurrentValue: number;
    totalUnrealizedPnL: number;
    totalUnrealizedPct: number;
  };
  change: {
    investment: number;
    currentValue: number;
    unrealizedPnL: number;
    unrealizedPct: number;
  };
  changePercent: {
    investment: number;
    currentValue: number;
    unrealizedPnL: number;
    unrealizedPct: number;
  };
}

export const comparePeriods = (
  currentSnapshots: Array<{ totalInvestment: number; totalCurrentValue: number; totalUnrealizedPnL: number }>,
  previousSnapshots: Array<{ totalInvestment: number; totalCurrentValue: number; totalUnrealizedPnL: number }>
): PeriodComparison => {
  const current = currentSnapshots.length > 0
    ? currentSnapshots[currentSnapshots.length - 1]
    : { totalInvestment: 0, totalCurrentValue: 0, totalUnrealizedPnL: 0 };
    
  const previous = previousSnapshots.length > 0
    ? previousSnapshots[previousSnapshots.length - 1]
    : { totalInvestment: 0, totalCurrentValue: 0, totalUnrealizedPnL: 0 };
  
  const currentPct = current.totalInvestment > 0
    ? (current.totalUnrealizedPnL / current.totalInvestment) * 100
    : 0;
    
  const previousPct = previous.totalInvestment > 0
    ? (previous.totalUnrealizedPnL / previous.totalInvestment) * 100
    : 0;
  
  const change = {
    investment: current.totalInvestment - previous.totalInvestment,
    currentValue: current.totalCurrentValue - previous.totalCurrentValue,
    unrealizedPnL: current.totalUnrealizedPnL - previous.totalUnrealizedPnL,
    unrealizedPct: currentPct - previousPct,
  };
  
  const changePercent = {
    investment: previous.totalInvestment > 0
      ? (change.investment / previous.totalInvestment) * 100
      : 0,
    currentValue: previous.totalCurrentValue > 0
      ? (change.currentValue / previous.totalCurrentValue) * 100
      : 0,
    unrealizedPnL: previous.totalUnrealizedPnL !== 0
      ? (change.unrealizedPnL / Math.abs(previous.totalUnrealizedPnL)) * 100
      : 0,
    unrealizedPct: change.unrealizedPct,
  };
  
  return {
    current: {
      ...current,
      totalUnrealizedPct: currentPct,
    },
    previous: {
      ...previous,
      totalUnrealizedPct: previousPct,
    },
    change,
    changePercent,
  };
};

// Get top N positions by performance
export const getTopPositions = (positions: Position[], count: number = 5): Position[] => {
  return [...positions]
    .sort((a, b) => (b.unrealizedPct || 0) - (a.unrealizedPct || 0))
    .slice(0, count);
};

// Get bottom N positions by performance
export const getBottomPositions = (positions: Position[], count: number = 5): Position[] => {
  return [...positions]
    .sort((a, b) => (a.unrealizedPct || 0) - (b.unrealizedPct || 0))
    .slice(0, count);
};

// Compare position sizes
export const comparePositionSizes = (positions: Position[]): Array<{ companyName: string; size: number; percentage: number }> => {
  const total = positions.reduce((sum, p) => sum + (p.investmentWithFees || 0), 0);
  
  return positions
    .map((p) => ({
      companyName: p.companyName,
      size: p.investmentWithFees || 0,
      percentage: total > 0 ? ((p.investmentWithFees || 0) / total) * 100 : 0,
    }))
    .sort((a, b) => b.size - a.size);
};



