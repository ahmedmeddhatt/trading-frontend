// Company Comparison page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useCompanyComparison } from "@/hooks/analytics/useCompanyComparison";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import { Error } from "@/components/ui/Error";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { ChartCard } from "@/components/charts/shared/ChartCard";
import dynamic from "next/dynamic";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { motion } from "framer-motion";

// Lazy load charts
const CompanyComparisonChart = dynamic(
  () => import("@/components/charts/analytics/CompanyComparisonChart").then((mod) => ({ default: mod.CompanyComparisonChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const MultiMetricRadarChart = dynamic(
  () => import("@/components/charts/analytics/RadarChart").then((mod) => ({ default: mod.MultiMetricRadarChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

type Metric = "investment" | "value" | "pnl" | "percent";

export default function CompanyComparisonPage() {
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const [metric, setMetric] = useState<Metric>("percent");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const { comparison, isLoading: comparisonLoading } = useCompanyComparison(selectedCompanies.length > 0 ? selectedCompanies : undefined);

  useEffect(() => {
    logger.page("Company Comparison", {
      pathname: window.location.pathname,
    });
  }, []);

  useEffect(() => {
    if (companies.length > 0 && selectedCompanies.length === 0) {
      // Select top 5 companies by default
      const sorted = [...companies].sort((a, b) => (b.unrealizedPct || 0) - (a.unrealizedPct || 0));
      setSelectedCompanies(sorted.slice(0, Math.min(5, sorted.length)).map((c) => c.companyName));
    }
  }, [companies, selectedCompanies.length]);

  const isLoading = companiesLoading || comparisonLoading;
  const comparisonData = comparison?.companies || [];
  const rankedCompanies = comparison?.companies || [];

  const radarData = React.useMemo(() => {
    if (!comparisonData.length) return [];
    
    return comparisonData.map((company) => ({
      metric: company.companyName,
      investment: company.totalInvestment / 1000, // Normalize for radar
      value: company.totalCurrentValue / 1000,
      pnl: company.unrealizedPnL / 1000,
      percent: company.unrealizedPct,
    }));
  }, [comparisonData]);

  if (isLoading && !comparisonData) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-6">
            <Skeleton variant="text" width="200px" height="40px" />
            <Skeleton variant="rectangular" height="300px" />
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <Heading level={1}>Company Comparison</Heading>

          {companies.length > 0 && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Select Companies to Compare</h3>
              <div className="flex flex-wrap gap-2">
                {companies.map((company) => (
                  <button
                    key={company.companyName}
                    onClick={() => {
                      setSelectedCompanies((prev) =>
                        prev.includes(company.companyName)
                          ? prev.filter((c) => c !== company.companyName)
                          : [...prev, company.companyName]
                      );
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCompanies.includes(company.companyName)
                        ? "bg-green-primary text-dark-base font-semibold"
                        : "bg-dark-surface text-text-secondary hover:bg-dark-elevated"
                    }`}
                  >
                    {company.companyName}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {comparisonData.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap">
                {(["investment", "value", "pnl", "percent"] as Metric[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      metric === m
                        ? "bg-green-primary text-dark-base font-semibold"
                        : "bg-dark-surface text-text-secondary hover:bg-dark-elevated"
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              <ChartCard
                title={`Company Comparison - ${metric.charAt(0).toUpperCase() + metric.slice(1)}`}
                height={400}
              >
                <CompanyComparisonChart data={comparisonData} metric={metric} height={400} />
              </ChartCard>

              {radarData.length > 0 && (
                <ChartCard title="Multi-Metric Comparison" height={400}>
                  <MultiMetricRadarChart
                    data={radarData}
                    series={[
                      { key: "investment", label: "Investment" },
                      { key: "value", label: "Current Value" },
                      { key: "pnl", label: "P/L" },
                      { key: "percent", label: "Return %" },
                    ]}
                  />
                </ChartCard>
              )}
            </>
          )}

          {rankedCompanies.length > 0 && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold mb-4">Company Rankings</h3>
              <div className="overflow-x-auto">
                <Table className="bg-dark-elevated border border-dark-border">
                  <TableHeader>
                    <TableRow className="bg-dark-surface">
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Rank</TableHead>
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Company</TableHead>
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Investment</TableHead>
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Current Value</TableHead>
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Unrealized P/L</TableHead>
                      <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Return %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankedCompanies.map((company, index) => (
                      <motion.tr
                        key={company.companyName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal"
                      >
                        <TableCell className="p-3 md:p-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? "bg-yellow-400 text-dark-base" :
                            index === 1 ? "bg-gray-300 text-dark-base" :
                            index === 2 ? "bg-orange-400 text-dark-base" :
                            "bg-dark-surface text-text-secondary"
                          }`}>
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="p-3 md:p-4 text-green-primary font-semibold">
                          {company.companyName}
                        </TableCell>
                        <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(company.totalInvestment)}</TableCell>
                        <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(company.totalCurrentValue)}</TableCell>
                        <TableCell
                          className={`p-3 md:p-4 font-semibold ${
                            company.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"
                          }`}
                        >
                          {formatCurrency(company.unrealizedPnL, { showSign: true })}
                        </TableCell>
                        <TableCell
                          className={`p-3 md:p-4 font-semibold ${
                            company.unrealizedPct >= 0 ? "text-green-primary" : "text-red-primary"
                          }`}
                        >
                          {formatPercentage(company.unrealizedPct, { showSign: true })}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

