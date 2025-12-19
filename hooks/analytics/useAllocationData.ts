// Hook for portfolio allocation data
import { useMemo } from "react";
import { useSummary } from "@/hooks/api/useAnalytics";
import { aggregateByCompany } from "@/lib/analytics/aggregations";
import { comparePositionSizes } from "@/lib/analytics/comparisons";

export const useAllocationData = () => {
  const { data: summary } = useSummary();
  
  const allocation = useMemo(() => {
    if (!summary || !summary.positions) return null;
    
    const companyAggregation = aggregateByCompany(summary.positions);
    const positionSizes = comparePositionSizes(summary.positions);
    const totalInvestment = summary.totalInvestment;
    
    // Calculate allocation percentages
    const allocationData = companyAggregation.map((company) => ({
      ...company,
      allocationPercent: totalInvestment > 0
        ? (company.totalInvestment / totalInvestment) * 100
        : 0,
      valuePercent: summary.totalCurrentValue > 0
        ? (company.totalCurrentValue / summary.totalCurrentValue) * 100
        : 0,
    }));
    
    return {
      companies: allocationData,
      positionSizes,
      totalInvestment,
      totalCurrentValue: summary.totalCurrentValue,
      companyCount: companyAggregation.length,
    };
  }, [summary]);
  
  return {
    allocation,
    isLoading: !summary,
  };
};

