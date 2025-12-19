// Hook for company comparison analytics
import { useMemo } from "react";
import { useCompanies } from "@/hooks/api/useCompanies";
import { compareCompanies } from "@/lib/analytics/comparisons";

export const useCompanyComparison = (selectedCompanies?: string[]) => {
  const { data: companies = [] } = useCompanies();
  
  const comparison = useMemo(() => {
    if (companies.length === 0) return null;
    
    // Convert to CompanyAnalytics format
    const companyAnalytics = companies.map((company) => ({
      companyName: company.companyName,
      positions: company.positions,
      totalInvestment: company.totalInvestment,
      totalCurrentValue: company.totalCurrentValue,
      unrealizedPnL: company.unrealizedPnL,
      unrealizedPct: company.unrealizedPct,
      gainLoss: company.unrealizedPnL,
      percent: company.unrealizedPct,
    }));
    
    // Filter if specific companies selected
    const filtered = selectedCompanies && selectedCompanies.length > 0
      ? companyAnalytics.filter((c) => selectedCompanies.includes(c.companyName))
      : companyAnalytics;
    
    const ranked = compareCompanies(filtered);
    
    return {
      companies: ranked,
      bestPerformer: ranked[0] || null,
      worstPerformer: ranked[ranked.length - 1] || null,
      averageReturn: ranked.length > 0
        ? ranked.reduce((sum, c) => sum + (c.unrealizedPct || 0), 0) / ranked.length
        : 0,
    };
  }, [companies, selectedCompanies]);
  
  return {
    comparison,
    isLoading: companies.length === 0,
  };
};



