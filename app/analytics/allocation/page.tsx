// Portfolio Allocation page
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { useAllocationData } from "@/hooks/analytics/useAllocationData";
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
const AllocationPieChart = dynamic(
  () => import("@/components/charts/analytics/AllocationPieChart").then((mod) => ({ default: mod.AllocationPieChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

const DonutChart = dynamic(
  () => import("@/components/charts/specialized/DonutChart").then((mod) => ({ default: mod.DonutChart })),
  { loading: () => <Skeleton variant="rectangular" height="300px" />, ssr: false }
);

export default function AllocationPage() {
  const { allocation, isLoading } = useAllocationData();
  const [view, setView] = useState<"investment" | "value">("investment");

  useEffect(() => {
    logger.page("Portfolio Allocation", {
      pathname: window.location.pathname,
    });
  }, []);

  if (isLoading) {
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

  if (!allocation || allocation.companies.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <Error message="No allocation data available. Create positions to see portfolio allocation." />
        </PageContainer>
      </ProtectedRoute>
    );
  }

  const sortedCompanies = [...allocation.companies].sort(
    (a, b) => (view === "investment" ? b.totalInvestment : b.totalCurrentValue) - (view === "investment" ? a.totalInvestment : a.totalCurrentValue)
  );

  const chartData = sortedCompanies.map((company) => ({
    label: company.companyName,
    value: view === "investment" ? company.totalInvestment : company.totalCurrentValue,
  }));

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Heading level={1}>Portfolio Allocation</Heading>
            <div className="flex gap-2">
              <button
                onClick={() => setView("investment")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === "investment"
                    ? "bg-green-primary text-dark-base font-semibold"
                    : "bg-dark-surface text-text-secondary hover:bg-dark-elevated"
                }`}
              >
                By Investment
              </button>
              <button
                onClick={() => setView("value")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === "value"
                    ? "bg-green-primary text-dark-base font-semibold"
                    : "bg-dark-surface text-text-secondary hover:bg-dark-elevated"
                }`}
              >
                By Current Value
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Total Investment</p>
              <p className="text-2xl font-bold text-green-primary">{formatCurrency(allocation.totalInvestment)}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-text-secondary text-sm mb-2">Total Current Value</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(allocation.totalCurrentValue)}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartData.length > 0 && (
              <>
                <ChartCard
                  title={`Allocation by ${view === "investment" ? "Investment" : "Current Value"}`}
                  height={400}
                >
                  <AllocationPieChart
                    data={sortedCompanies.map((c) => ({
                      companyName: c.companyName,
                      value: view === "investment" ? c.totalInvestment : c.totalCurrentValue,
                      percentage: view === "investment" ? c.allocationPercent : c.valuePercent,
                    }))}
                  />
                </ChartCard>

                <ChartCard title="Donut Chart View" height={400}>
                  <DonutChart data={chartData} height={400} />
                </ChartCard>
              </>
            )}
          </div>

          <Card variant="elevated" padding="lg">
            <h3 className="text-xl font-bold mb-4">Detailed Allocation</h3>
            <div className="overflow-x-auto">
              <Table className="bg-dark-elevated border border-dark-border">
                <TableHeader>
                  <TableRow className="bg-dark-surface">
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Company</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Positions</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Investment</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Current Value</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Allocation %</TableHead>
                    <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCompanies.map((company, index) => (
                    <motion.tr
                      key={company.companyName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal"
                    >
                      <TableCell className="p-3 md:p-4 text-green-primary font-semibold">
                        {company.companyName}
                      </TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{company.positionCount}</TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(company.totalInvestment)}</TableCell>
                      <TableCell className="p-3 md:p-4 text-text-primary">{formatCurrency(company.totalCurrentValue)}</TableCell>
                      <TableCell className="p-3 md:p-4 text-cyan-400 font-semibold">
                        {formatPercentage(company.allocationPercent / 100)}
                      </TableCell>
                      <TableCell
                        className={`p-3 md:p-4 font-semibold ${
                          company.totalUnrealizedPct >= 0 ? "text-green-primary" : "text-red-primary"
                        }`}
                      >
                        {formatPercentage(company.totalUnrealizedPct / 100, { showSign: true })}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

