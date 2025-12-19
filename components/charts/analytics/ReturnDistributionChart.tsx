// Return distribution histogram using recharts
"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { chartColorSchemes, getValueColor } from "@/lib/charts/colors";

interface DistributionData {
  range: string;
  count: number;
}

interface ReturnDistributionChartProps {
  data: DistributionData[];
  height?: number;
}

export const ReturnDistributionChart: React.FC<ReturnDistributionChartProps> = ({
  data,
  height = 300,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{label}</p>
          <p className="text-green-primary">
            Count: {payload[0].value} positions
          </p>
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
          dataKey="range"
          stroke="#a3a3a3"
          style={{ fontSize: "11px" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="#a3a3a3" style={{ fontSize: "12px" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          fill={chartColorSchemes.neon.cyan}
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => {
            // Color based on return range (positive/negative)
            const isPositive = entry.range.includes("+") || parseFloat(entry.range.split("%")[0]) >= 0;
            return (
              <Cell key={`cell-${index}`} fill={isPositive ? chartColorSchemes.neon.green : chartColorSchemes.neon.red} />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};


