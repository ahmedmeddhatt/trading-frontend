// Buy vs Sell ratio pie/donut chart using recharts
"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { chartColorSchemes } from "@/lib/charts/colors";

interface BuySellData {
  buy: number;
  sell: number;
}

interface BuySellRatioChartProps {
  data: BuySellData;
  height?: number;
  variant?: "pie" | "donut";
}

export const BuySellRatioChart: React.FC<BuySellRatioChartProps> = ({
  data,
  height = 300,
  variant = "donut",
}) => {
  const chartData = [
    { name: "Buy", value: data.buy, color: chartColorSchemes.neon.green },
    { name: "Sell", value: data.sell, color: chartColorSchemes.neon.red },
  ];

  const total = data.buy + data.sell;
  const buyPercent = total > 0 ? (data.buy / total) * 100 : 0;
  const sellPercent = total > 0 ? (data.sell / total) * 100 : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold">{data.name}</p>
          <p style={{ color: data.color }}>
            {data.value} ({(data.payload?.value / total * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={height * 0.35}
          innerRadius={variant === "donut" ? height * 0.2 : 0}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => {
            if (value === "Buy") return `Buy: ${data.buy} (${buyPercent.toFixed(1)}%)`;
            if (value === "Sell") return `Sell: ${data.sell} (${sellPercent.toFixed(1)}%)`;
            return value;
          }}
          wrapperStyle={{ color: "#a3a3a3" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};


