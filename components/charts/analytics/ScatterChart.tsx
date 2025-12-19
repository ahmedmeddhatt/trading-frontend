// Risk-return scatter plot using recharts
"use client";

import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { chartColorSchemes, getValueColor } from "@/lib/charts/colors";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";

interface ScatterData {
  x: number;
  y: number;
  name: string;
  size?: number;
}

interface ScatterChartProps {
  data: ScatterData[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export const RiskReturnScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xLabel = "Risk",
  yLabel = "Return",
  height = 300,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{data.name}</p>
          <p className="text-cyan-400">
            {xLabel}: {data.x.toFixed(2)}
          </p>
          <p className="text-green-primary">
            {yLabel}: {formatPercentage(data.y)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColorSchemes.neon.cyan} opacity={0.2} />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          stroke="#a3a3a3"
          style={{ fontSize: "12px" }}
          label={{ value: xLabel, position: "insideBottom", offset: -5, style: { fill: "#a3a3a3" } }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          stroke="#a3a3a3"
          style={{ fontSize: "12px" }}
          label={{ value: yLabel, angle: -90, position: "insideLeft", style: { fill: "#a3a3a3" } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Positions" data={data} fill={chartColorSchemes.neon.cyan}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getValueColor(entry.y)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};



