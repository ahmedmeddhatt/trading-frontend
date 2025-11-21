// components/dashboard/gainLossChart.tsx
import { DailySnapshot } from "@/lib/api/analytics";
import React from "react";

interface SnapshotsTableProps {
  snapshots: DailySnapshot[];
}

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ snapshots }) => {
  return (
    <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Total Investment</th>
          <th className="p-2 border">Current Value</th>
          <th className="p-2 border">Unrealized PnL</th>
        </tr>
      </thead>
      <tbody>
        {snapshots.map((snap) => (
          <tr key={snap._id} className="text-center">
            <td className="p-2 border">{new Date(snap.date).toLocaleDateString()}</td>
            <td className="p-2 border">${snap.totalInvestment.toFixed(2)}</td>
            <td className="p-2 border">${snap.totalCurrentValue.toFixed(2)}</td>
            <td
              className={`p-2 border ${
                snap.totalUnrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${snap.totalUnrealizedPnL.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
