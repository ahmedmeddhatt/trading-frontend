// src/components/dashboard/SnapshotsTable.tsx
import { DailySnapshot } from "@/lib/api/analytics";
import React from "react";

interface SnapshotsTableProps {
  snapshots: DailySnapshot[];
}

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ snapshots }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Total Investment</th>
          <th className="p-2 border">Total Result</th>
          <th className="p-2 border">Gain/Loss</th>
          <th className="p-2 border">Percent</th>
        </tr>
      </thead>
      <tbody>
        {snapshots.map((snap) => (
          <tr key={snap._id} className="text-center">
            <td className="p-2 border">{new Date(snap.date).toLocaleDateString()}</td>
            <td className="p-2 border">${snap.totalInvestment?.toFixed(2)}</td>
            <td className="p-2 border">${snap.totalResult?.toFixed(2)}</td>
            <td className="p-2 border">${snap.gainLoss?.toFixed(2)}</td>
            <td className="p-2 border">{snap.percent?.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
