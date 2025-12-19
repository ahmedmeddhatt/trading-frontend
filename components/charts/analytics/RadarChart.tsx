// Radar chart for multi-metric comparison using recharts
"use client";

import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";

interface RadarData {
  metric: string;
  [key: string]: string | number;
}

interface RadarChartProps {
  data: RadarData[];
  series: Array<{ key: string; label: string }>;
  height?: number;
}

export const MultiMetricRadarChart: React.FC<RadarChartProps> = ({
  data,
  series,
  height = 400,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated border border-dark-border rounded-lg p-3 shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{payload[0].payload.metric}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <PolarGrid stroke={chartColorSchemes.neon.cyan} opacity={0.3} />
        <PolarAngleAxis dataKey="metric" stroke="#a3a3a3" style={{ fontSize: "12px" }} />
        <PolarRadiusAxis angle={90} domain={[0, "auto"]} stroke="#a3a3a3" style={{ fontSize: "12px" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#a3a3a3" }} />
        {series.map((serie, index) => (
          <Radar
            key={serie.key}
            name={serie.label}
            dataKey={serie.key}
            stroke={getColorByIndex(index, "companies")}
            fill={getColorByIndex(index, "companies")}
            fillOpacity={0.3}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
};



