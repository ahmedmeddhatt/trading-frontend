// Hook for time-based analytics
import { useMemo } from "react";
import { useSnapshots } from "@/hooks/api/useAnalytics";
import { aggregateByTimePeriod } from "@/lib/analytics/aggregations";
import { comparePeriods } from "@/lib/analytics/comparisons";

export const useTimeBasedAnalytics = (timeframe: "daily" | "weekly" | "monthly" | "yearly" = "monthly") => {
  const { data: snapshots = [] } = useSnapshots();
  
  const analytics = useMemo(() => {
    if (snapshots.length === 0) return null;
    
    const aggregated = aggregateByTimePeriod(snapshots, timeframe);
    
    // Get current vs previous period comparison
    const currentPeriod = aggregated.slice(-1);
    const previousPeriod = aggregated.slice(-2, -1);
    const periodComparison = comparePeriods(currentPeriod, previousPeriod);
    
    // Calculate growth rates
    const growthRates = aggregated.slice(1).map((current, index) => {
      const previous = aggregated[index];
      const growth = previous.totalCurrentValue > 0
        ? ((current.totalCurrentValue - previous.totalCurrentValue) / previous.totalCurrentValue) * 100
        : 0;
      return {
        date: current.date,
        growth,
      };
    });
    
    return {
      aggregated,
      periodComparison,
      growthRates,
      totalPeriods: aggregated.length,
    };
  }, [snapshots, timeframe]);
  
  return {
    analytics,
    isLoading: snapshots.length === 0,
  };
};



