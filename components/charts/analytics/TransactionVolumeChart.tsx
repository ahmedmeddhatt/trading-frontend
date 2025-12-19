// Transaction volume chart using recharts
"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { chartColorSchemes } from "@/lib/charts/colors";
import { formatCurrency } from "@/lib/utils/formatNumber";

interface VolumeData {
  date: string;
  buyVolume: number;
  sellVolume: number;
  buyCount: number;
  sellCount: number;
}

interface TransactionVolumeChartProps {
  data: VolumeData[];
  height?: number;
  showCount?: boolean;
}

export const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({
  data,
  height = 300,
  showCount = false,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {showCount ? entry.value : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColorSchemes.neon.cyan} opacity={0.2} />
        <XAxis
          dataKey="date"
          stroke="#a3a3a3"
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="#a3a3a3" style={{ fontSize: "12px" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#a3a3a3" }} />
        <Bar
          dataKey={showCount ? "buyCount" : "buyVolume"}
          fill={chartColorSchemes.neon.green}
          name="Buy"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey={showCount ? "sellCount" : "sellVolume"}
          fill={chartColorSchemes.neon.red}
          name="Sell"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};



