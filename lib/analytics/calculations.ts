// Analytics calculations and metrics
import { Position, DailySnapshot, Summary } from "@/lib/api/analytics";
import { Transaction } from "@/lib/api/transactions";

export interface PerformanceMetrics {
  winRate: number;
  averageReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalReturn: number;
  bestPosition: Position | null;
  worstPosition: Position | null;
}

export interface RiskMetrics {
  maxDrawdown: number;
  volatility: number;
  valueAtRisk: number;
  downsideDeviation: number;
  sortinoRatio: number;
}

// Calculate win rate
export const calculateWinRate = (positions: Position[]): number => {
  if (positions.length === 0) return 0;
  const winningPositions = positions.filter((p) => (p.unrealizedPnL || 0) > 0);
  return (winningPositions.length / positions.length) * 100;
};

// Calculate average return
export const calculateAverageReturn = (positions: Position[]): number => {
  if (positions.length === 0) return 0;
  const totalReturn = positions.reduce((sum, p) => sum + (p.unrealizedPct || 0), 0);
  return totalReturn / positions.length;
};

// Calculate volatility (standard deviation of returns)
export const calculateVolatility = (positions: Position[]): number => {
  if (positions.length === 0) return 0;
  const returns = positions.map((p) => p.unrealizedPct || 0);
  const avgReturn = calculateAverageReturn(positions);
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  return Math.sqrt(variance);
};

// Calculate maximum drawdown from snapshots
export const calculateMaxDrawdown = (snapshots: DailySnapshot[]): number => {
  if (snapshots.length === 0) return 0;
  
  const sorted = [...snapshots].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let maxValue = sorted[0].totalCurrentValue;
  let maxDrawdown = 0;
  
  for (const snapshot of sorted) {
    if (snapshot.totalCurrentValue > maxValue) {
      maxValue = snapshot.totalCurrentValue;
    }
    const drawdown = ((snapshot.totalCurrentValue - maxValue) / maxValue) * 100;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return Math.abs(maxDrawdown);
};

// Calculate Sharpe ratio (simplified, assuming risk-free rate = 0)
export const calculateSharpeRatio = (positions: Position[], volatility: number): number => {
  if (volatility === 0) return 0;
  const avgReturn = calculateAverageReturn(positions);
  return avgReturn / volatility;
};

// Calculate Value at Risk (VaR) at 95% confidence
export const calculateVaR = (positions: Position[], confidence: number = 0.95): number => {
  if (positions.length === 0) return 0;
  const returns = positions.map((p) => p.unrealizedPct || 0).sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * returns.length);
  return Math.abs(returns[index] || 0);
};

// Get best performing position
export const getBestPosition = (positions: Position[]): Position | null => {
  if (positions.length === 0) return null;
  return positions.reduce((best, current) => 
    (current.unrealizedPct || 0) > (best.unrealizedPct || 0) ? current : best
  );
};

// Get worst performing position
export const getWorstPosition = (positions: Position[]): Position | null => {
  if (positions.length === 0) return null;
  return positions.reduce((worst, current) => 
    (current.unrealizedPct || 0) < (worst.unrealizedPct || 0) ? current : worst
  );
};

// Calculate all performance metrics
export const calculatePerformanceMetrics = (
  positions: Position[],
  snapshots: DailySnapshot[]
): PerformanceMetrics => {
  const volatility = calculateVolatility(positions);
  
  return {
    winRate: calculateWinRate(positions),
    averageReturn: calculateAverageReturn(positions),
    volatility,
    sharpeRatio: calculateSharpeRatio(positions, volatility),
    maxDrawdown: calculateMaxDrawdown(snapshots),
    totalReturn: positions.reduce((sum, p) => sum + (p.unrealizedPct || 0), 0),
    bestPosition: getBestPosition(positions),
    worstPosition: getWorstPosition(positions),
  };
};

// Calculate risk metrics
export const calculateRiskMetrics = (
  positions: Position[],
  snapshots: DailySnapshot[]
): RiskMetrics => {
  const volatility = calculateVolatility(positions);
  const returns = positions.map((p) => p.unrealizedPct || 0);
  const avgReturn = calculateAverageReturn(positions);
  
  // Downside deviation (only negative returns)
  const negativeReturns = returns.filter((r) => r < 0);
  const downsideVariance = negativeReturns.length > 0
    ? negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length
    : 0;
  const downsideDeviation = Math.sqrt(downsideVariance);
  
  return {
    maxDrawdown: calculateMaxDrawdown(snapshots),
    volatility,
    valueAtRisk: calculateVaR(positions, 0.95),
    downsideDeviation,
    sortinoRatio: downsideDeviation > 0 ? avgReturn / downsideDeviation : 0,
  };
};



