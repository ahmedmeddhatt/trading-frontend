// Hook for performance analytics calculations
import { useMemo } from "react";
import { useSummary, useSnapshots } from "@/hooks/api/useAnalytics";
import { calculatePerformanceMetrics } from "@/lib/analytics/calculations";

export const usePerformanceAnalytics = () => {
  const { data: summary } = useSummary();
  const { data: snapshots = [] } = useSnapshots();
  
  const metrics = useMemo(() => {
    if (!summary) return null;
    
    return calculatePerformanceMetrics(summary.positions || [], snapshots);
  }, [summary, snapshots]);
  
  return {
    metrics,
    isLoading: !summary || !snapshots,
  };
};



