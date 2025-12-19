// src/components/dashboard/SnapshotsTable.tsx
import { DailySnapshot } from "@/lib/api/analytics";
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";

interface SnapshotsTableProps {
  snapshots: DailySnapshot[];
}

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ snapshots }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="bg-dark-elevated border border-dark-border">
        <TableHeader>
          <TableRow className="bg-dark-surface">
            <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Date</TableHead>
            <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Total Investment</TableHead>
            <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Current Value</TableHead>
            <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">Unrealized P/L</TableHead>
            <TableHead className="p-3 md:p-4 border-b border-dark-border text-text-secondary">% Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {snapshots.map((snap) => {
            const percent = snap.totalInvestment > 0 
              ? ((snap.totalUnrealizedPnL / snap.totalInvestment) * 100)
              : 0;
            
            return (
              <TableRow key={snap._id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-surface/50 transition-colors duration-normal">
                <TableCell className="p-3 md:p-4">{new Date(snap.date).toLocaleDateString()}</TableCell>
                <TableCell className="p-3 md:p-4">{formatCurrency(snap.totalInvestment)}</TableCell>
                <TableCell className="p-3 md:p-4">{formatCurrency(snap.totalCurrentValue)}</TableCell>
                <TableCell className={`p-3 md:p-4 ${snap.totalUnrealizedPnL >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatCurrency(snap.totalUnrealizedPnL, { showSign: true })}
                </TableCell>
                <TableCell className={`p-3 md:p-4 ${percent >= 0 ? "text-green-primary" : "text-red-primary"}`}>
                  {formatPercentage(percent, { showSign: true })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
