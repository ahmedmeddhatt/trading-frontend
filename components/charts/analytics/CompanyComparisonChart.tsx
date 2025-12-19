// Multi-company comparison line chart using recharts
"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";

interface CompanyData {
  companyName: string;
  totalInvestment: number;
  totalCurrentValue: number;
  unrealizedPnL: number;
  unrealizedPct: number;
}

interface CompanyComparisonChartProps {
  data: CompanyData[];
  metric?: "investment" | "value" | "pnl" | "percent";
  height?: number;
}

export const CompanyComparisonChart: React.FC<CompanyComparisonChartProps> = ({
  data,
  metric = "percent",
  height = 300,
}) => {
  const chartData = data.map((company, index) => ({
    name: company.companyName,
    investment: company.totalInvestment,
    value: company.totalCurrentValue,
    pnl: company.unrealizedPnL,
    percent: company.unrealizedPct,
    color: getColorByIndex(index, "companies"),
  }));

  const getDataKey = () => {
    switch (metric) {
      case "investment": return "investment";
      case "value": return "value";
      case "pnl": return "pnl";
      case "percent": return "percent";
      default: return "percent";
    }
  };

  const getLabel = () => {
    switch (metric) {
      case "investment": return "Investment";
      case "value": return "Current Value";
      case "pnl": return "Unrealized P/L";
      case "percent": return "Return %";
      default: return "Return %";
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mb-1">
              <p className="text-text-primary font-semibold">{entry.name}</p>
              <p style={{ color: entry.color }}>
                {metric === "percent"
                  ? formatPercentage(entry.value, { showSign: true })
                  : formatCurrency(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColorSchemes.neon.cyan} opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="#a3a3a3"
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="#a3a3a3" style={{ fontSize: "12px" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#a3a3a3" }} />
        {chartData.map((company, index) => (
          <Line
            key={company.name}
            type="monotone"
            dataKey={getDataKey()}
            stroke={company.color}
            strokeWidth={2}
            dot={{ fill: company.color, r: 4 }}
            activeDot={{ r: 6 }}
            name={company.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};



