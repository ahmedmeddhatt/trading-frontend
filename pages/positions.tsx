import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { PositionsTable } from "@/components/positions/PositionsTable";

export default function PositionsPage() {
  return (
    <>
      <Navbar />
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Positions</h1>
        <PositionsTable />
      </PageContainer>
    </>
  );
}
