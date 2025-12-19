// Transaction timeline chart using recharts
"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { chartColorSchemes } from "@/lib/charts/colors";
import { formatCurrency } from "@/lib/utils/formatNumber";

interface TimelineData {
  date: string;
  buyValue: number;
  sellValue: number;
  netValue: number;
  cumulativeValue: number;
}

interface TimelineChartProps {
  data: TimelineData[];
  height?: number;
  showCumulative?: boolean;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  height = 300,
  showCumulative = false,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <ReferenceLine y={0} stroke="#737373" strokeDasharray="2 2" />
        {showCumulative ? (
          <Line
            type="monotone"
            dataKey="cumulativeValue"
            stroke={chartColorSchemes.neon.cyan}
            strokeWidth={2}
            dot={{ fill: chartColorSchemes.neon.cyan, r: 4 }}
            activeDot={{ r: 6 }}
            name="Cumulative Value"
          />
        ) : (
          <>
            <Line
              type="monotone"
              dataKey="buyValue"
              stroke={chartColorSchemes.neon.green}
              strokeWidth={2}
              dot={{ fill: chartColorSchemes.neon.green, r: 4 }}
              activeDot={{ r: 6 }}
              name="Buy Value"
            />
            <Line
              type="monotone"
              dataKey="sellValue"
              stroke={chartColorSchemes.neon.red}
              strokeWidth={2}
              dot={{ fill: chartColorSchemes.neon.red, r: 4 }}
              activeDot={{ r: 6 }}
              name="Sell Value"
            />
            <Line
              type="monotone"
              dataKey="netValue"
              stroke={chartColorSchemes.neon.cyan}
              strokeWidth={2}
              dot={{ fill: chartColorSchemes.neon.cyan, r: 4 }}
              activeDot={{ r: 6 }}
              name="Net Value"
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

