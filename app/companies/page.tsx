"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { useCompanies } from "@/hooks/api/useCompanies";
import { Error } from "@/components/ui/Error";
import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { logger } from "@/lib/utils/logger";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export default function CompaniesPage() {
  const { data: companies = [], isLoading, error } = useCompanies();

  useEffect(() => {
    logger.page("Companies", {
      pathname: window.location.pathname,
      searchParams: window.location.search,
    });
  }, []);

  if (isLoading && companies.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <PageContainer>
          <div className="space-y-4">
            <Skeleton variant="text" width="200px" height="40px" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height="200px" />
              ))}
            </div>
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
          <Heading level={1}>Companies</Heading>

          {error && <Error message={getErrorMessage(error)} />}

          {companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {companies.map((company, index) => (
              <motion.div
                key={company.companyName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={`/company/${encodeURIComponent(company.companyName)}`}
                  className="block"
                >
                  <Card variant="elevated" className="hover:scale-[1.02] hover:shadow-xl hover:shadow-green-primary/20 transition-all duration-normal cursor-pointer h-full hover:border-green-primary group">
                  <h2 className="text-xl font-bold mb-3 text-green-primary">{company.companyName}</h2>
                  <div className="space-y-2">
                    <p className="text-text-secondary">
                      <span className="text-text-tertiary">Investment:</span> {formatCurrency(company.totalInvestment)}
                    </p>
                    <p className="text-text-secondary">
                      <span className="text-text-tertiary">Result:</span> {formatCurrency(company.totalCurrentValue)}
                    </p>
                    <p className={company.unrealizedPnL >= 0 ? "text-green-primary font-semibold" : "text-red-primary font-semibold"}>
                      Unrealized PnL: {formatCurrency(company.unrealizedPnL, { showSign: true })} ({formatPercentage(company.unrealizedPct, { showSign: true })})
                    </p>
                    <p className="text-text-secondary">
                      <span className="text-text-tertiary">Positions:</span> {company.positions.length}
                    </p>
                  </div>
                </Card>
              </Link>
              </motion.div>
            ))}
          </div>
        ) : !isLoading && (
          <div className="bg-dark-elevated p-8 md:p-12 rounded-xl text-center text-text-secondary border border-dark-border">
            <p>No companies found. Create your first position to see companies.</p>
          </div>
        )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
