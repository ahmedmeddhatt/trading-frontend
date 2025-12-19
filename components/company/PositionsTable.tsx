// components/company/PositionsTable.tsx
import React from "react";
import { useCompanyAnalytics } from "@/hooks/api/useAnalytics";
import { usePositions } from "@/hooks/api/usePositions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import Link from "next/link";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { EmptyState } from "../common/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { Error } from "../ui/Error";

interface PositionsTableProps {
  companyName: string;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ companyName }) => {
  const { data: companyAnalytics, isLoading, error } = useCompanyAnalytics(companyName);
  const { data: allPositions = [] } = usePositions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height="60px" />
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={(error as any)?.message || "Failed to load positions"} />;
  }

  if (!companyAnalytics || companyAnalytics.positions.length === 0) {
    return (
      <EmptyState
        title="No Positions"
        message={`No positions found for ${companyName}.`}
      />
    );
  }

  // Filter positions for this company
  const companyPositions = allPositions.filter(
    (p) => p.companyName === companyName
  );

  if (companyPositions.length === 0) {
    return (
      <EmptyState
        title="No Positions"
        message={`No positions found for ${companyName}.`}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Table className="bg-dark-elevated border border-dark-border">
        <TableHeader>
          <TableRow className="bg-dark-surface">
            {["Position ID", "Quantity", "Investment", "Current Value", "Unrealized PnL", "Actions"].map((col) => (
              <TableHead key={col} className="p-3 md:p-4 border-b border-dark-border text-text-secondary">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companyPositions.map((position) => (
            <TableRow key={position._id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal">
              <TableCell className="p-3 md:p-4 text-green-primary hover:underline">
                <Link href={`/position/${position._id}`}>{position._id.substring(0, 8)}...</Link>
              </TableCell>
              <TableCell className="p-3 md:p-4">{position.totalQuantity}</TableCell>
              <TableCell className="p-3 md:p-4">{formatCurrency(position.investmentWithFees)}</TableCell>
              <TableCell className="p-3 md:p-4">{position.currentValue ? formatCurrency(position.currentValue) : "N/A"}</TableCell>
              <TableCell className={`p-3 md:p-4 ${position.unrealizedPnL && position.unrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                {position.unrealizedPnL !== undefined ? (
                  <>
                    {formatCurrency(position.unrealizedPnL, { showSign: true })}
                    {" "}
                    ({formatPercentage(position.unrealizedPct || 0, { showSign: true })})
                  </>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="p-3 md:p-4">
                <Link
                  href={`/transactions/${position._id}`}
                  className="text-green-primary hover:text-green-hover transition-colors duration-normal"
                >
                  View Transactions
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
