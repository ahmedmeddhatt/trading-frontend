// src/pages/dashboard.tsx
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { Loading } from "@/components/ui/Loading";
import { Error } from "@/components/ui/Error";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { SnapshotsTable } from "@/components/dashboard/SnapshotsTable";
import { GainLossChart } from "@/components/company/GainLossChart";

export default function DashboardPage() {
  const { summary, snapshots, fetchSummary, fetchSnapshots, loading, error } = useAnalyticsStore();

  useEffect(() => {
    fetchSummary();
    fetchSnapshots();
  }, []);

  return (
    <>
      <Navbar />
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {loading && <Loading />}
        {error && <Error message={error} />}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard title="Total Investment" value={summary.totalInvestment} />
            <SummaryCard title="Total Result" value={summary.totalResult} />
            <SummaryCard title="Total Gain/Loss" value={summary.totalGainLoss} />
          </div>
        )}

        {snapshots.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Gain/Loss Chart</h2>
            <GainLossChart snapshots={snapshots} />

            <h2 className="text-2xl font-bold mt-6 mb-2">Recent Daily Snapshots</h2>
            <SnapshotsTable snapshots={snapshots.slice(0, 7)} />
          </>
        )}
      </PageContainer>
    </>
  );
}
