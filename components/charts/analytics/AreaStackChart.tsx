// Stacked area chart for investment over time using recharts
"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";
import { formatCurrency } from "@/lib/utils/formatNumber";

interface StackData {
  date: string;
  [key: string]: string | number;
}

interface AreaStackChartProps {
  data: StackData[];
  series: Array<{ key: string; label: string }>;
  height?: number;
}

export const AreaStackChart: React.FC<AreaStackChartProps> = ({
  data,
  series,
  height = 300,
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
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        {series.map((serie, index) => (
          <Area
            key={serie.key}
            type="monotone"
            dataKey={serie.key}
            stackId="1"
            stroke={getColorByIndex(index, "companies")}
            fill={getColorByIndex(index, "companies")}
            fillOpacity={0.6}
            name={serie.label}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};



