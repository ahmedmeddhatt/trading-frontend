// components/company/CompanySummary.tsx
import React from "react";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { Card } from "../ui/Card";

export const CompanySummary: React.FC<{ companyName: string }> = ({ companyName }) => {
  const { companyAnalytics, fetchCompanyAnalytics, loading, error } = useAnalyticsStore();

  React.useEffect(() => {
    fetchCompanyAnalytics(companyName);
  }, [companyName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!companyAnalytics) return <p>No data found for {companyName}</p>;

return (
  <Card className="space-y-3">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
      {companyAnalytics.companyName}
    </h2>

    <p>Total Investment: <span className="text-blue-400">${companyAnalytics.totalInvestment.toFixed(2)}</span></p>
    <p>Total Result: <span className="text-green-400">${companyAnalytics.totalResult.toFixed(2)}</span></p>

    <p className={companyAnalytics.gainLoss >= 0 ? "text-green-400" : "text-red-400"}>
      Gain/Loss: ${companyAnalytics.gainLoss.toFixed(2)}
      {" "}
      ({companyAnalytics.percent.toFixed(2)}%)
    </p>

    <p className="text-gray-400">Positions: {companyAnalytics.positions.length}</p>
  </Card>
);

};
