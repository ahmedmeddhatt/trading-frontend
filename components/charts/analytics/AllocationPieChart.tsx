// Portfolio allocation pie chart using recharts
"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, PieLabelRenderProps } from "recharts";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";
import { formatCurrency } from "@/lib/utils/formatNumber";

interface AllocationData {
  companyName: string;
  value: number;
  percentage: number;
}

interface AllocationPieChartProps {
  data: AllocationData[];
  height?: number;
}

export const AllocationPieChart: React.FC<AllocationPieChartProps> = ({
  data,
  height = 300,
}) => {
  const chartData = data.map((item, index) => ({
    name: item.companyName,
    value: item.value,
    percentage: item.percentage,
    color: getColorByIndex(index, "companies"),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold">{data.name}</p>
          <p className="text-green-primary">
            {formatCurrency(data.value)} ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = payload?.percentage || (percent * 100);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${name}: ${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={height * 0.35}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => value}
          wrapperStyle={{ color: "#a3a3a3" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};


