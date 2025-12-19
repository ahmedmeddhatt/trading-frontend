// Hook for risk metrics calculations
import { useMemo } from "react";
import { useSummary, useSnapshots } from "@/hooks/api/useAnalytics";
import { calculateRiskMetrics } from "@/lib/analytics/calculations";

export const useRiskMetrics = () => {
  const { data: summary } = useSummary();
  const { data: snapshots = [] } = useSnapshots();
  
  const metrics = useMemo(() => {
    if (!summary) return null;
    
    return calculateRiskMetrics(summary.positions || [], snapshots);
  }, [summary, snapshots]);
  
  return {
    metrics,
    isLoading: !summary || !snapshots,
  };
};



