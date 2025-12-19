// components/company/CompanySummary.tsx
import React from "react";
import { useCompanyAnalytics } from "@/hooks/api/useAnalytics";
import { Card } from "../ui/Card";
import { Loading } from "../ui/Loading";
import { Error } from "../ui/Error";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "../ui/Skeleton";

export const CompanySummary: React.FC<{ companyName: string }> = ({ companyName }) => {
  const { data: companyAnalytics, isLoading, error } = useCompanyAnalytics(companyName);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" width="200px" height="40px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height="80px" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={(error as any)?.message || "Failed to load company analytics"} />;
  }

  if (!companyAnalytics) {
    return <p className="text-text-secondary">No data found for {companyName}</p>;
  }

  return (
    <Card variant="elevated" padding="lg">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-primary to-green-hover text-transparent bg-clip-text">
        {companyAnalytics.companyName}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-text-secondary text-sm mb-1">Total Investment</p>
          <p className="text-xl font-semibold text-blue-400">
            {formatCurrency(companyAnalytics.totalInvestment)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm mb-1">Current Value</p>
          <p className="text-xl font-semibold text-green-primary">
            {formatCurrency(companyAnalytics.totalCurrentValue)}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm mb-1">Unrealized PnL</p>
          <p className={`text-xl font-semibold ${companyAnalytics.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
            {formatCurrency(companyAnalytics.unrealizedPnL, { showSign: true })}
          </p>
        </div>

        <div>
          <p className="text-text-secondary text-sm mb-1">Percentage</p>
          <p className={`text-xl font-semibold ${companyAnalytics.unrealizedPct >= 0 ? "text-green-primary" : "text-red-primary"}`}>
            {formatPercentage(companyAnalytics.unrealizedPct, { showSign: true })}
          </p>
        </div>
      </div>

      <p className="text-text-secondary mt-4 text-sm">
        Positions: <span className="font-semibold text-text-primary">{companyAnalytics.positions.length}</span>
      </p>
    </Card>
  );
};
