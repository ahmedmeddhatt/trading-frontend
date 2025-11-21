import React from "react";
import { useRouter } from "next/router";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { CompanySummary } from "@/components/company/CompanySummary";
import { PositionsTable } from "@/components/positions/PositionsTable";
import { GainLossChart } from "@/components/company/GainLossChart";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { companyName } = router.query;

  if (!companyName || typeof companyName !== "string") return <p>Invalid company</p>;

  const PositionsTableAny = PositionsTable as any;

  return (
    <>
      <Navbar />
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">{companyName} Analytics</h1>
        <CompanySummary companyName={companyName} />
        <GainLossChart companyName={companyName} />
        <h2 className="text-2xl mt-6 mb-4">Positions / Purchases</h2>
        <PositionsTableAny filterCompany={companyName} />
      </PageContainer>
    </>
  );
}
