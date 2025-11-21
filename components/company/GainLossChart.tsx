// GainLossChart.tsx
import { DailySnapshot } from "@/lib/api/analytics";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const GainLossChart: React.FC<{ snapshots: DailySnapshot[] }> = ({ snapshots }) => {
  const data = snapshots.map(snap => ({
    date: new Date(snap.date).toLocaleDateString(),
    value: snap.totalUnrealizedPnL ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#4ade80" />
      </LineChart>
    </ResponsiveContainer>
  );
};
