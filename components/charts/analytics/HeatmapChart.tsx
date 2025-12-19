// Position performance heatmap using custom implementation
"use client";

import React from "react";
import { formatPercentage } from "@/lib/utils/formatNumber";
import { chartColorSchemes, getValueColor } from "@/lib/charts/colors";
import { cn } from "@/lib/utils";

interface HeatmapData {
  companyName: string;
  positionId: string;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  height?: number;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, height = 400 }) => {
  // Group by company
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.companyName]) {
      acc[item.companyName] = [];
    }
    acc[item.companyName].push(item);
    return acc;
  }, {} as Record<string, HeatmapData[]>);

  const companies = Object.keys(grouped);
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)));
  const minValue = Math.min(...data.map((d) => d.value));

  const getIntensity = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    return Math.max(0.3, normalized);
  };

  return (
    <div className="overflow-x-auto" style={{ height: `${height}px` }}>
      <div className="inline-block min-w-full">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${companies.length + 1}, minmax(100px, 1fr))` }}>
          {/* Header row */}
          <div className="font-semibold text-text-secondary p-2 sticky left-0 bg-dark-elevated z-10">
            Company
          </div>
          {companies.map((company) => (
            <div key={company} className="font-semibold text-text-secondary p-2 text-center">
              {company}
            </div>
          ))}

          {/* Data rows */}
          {companies.map((company, companyIndex) => (
            <React.Fragment key={company}>
              <div className="font-medium text-text-primary p-2 sticky left-0 bg-dark-elevated z-10 border-r border-dark-border">
                {company}
              </div>
              {companies.map((targetCompany, targetIndex) => {
                const positions = grouped[targetCompany] || [];
                const companyPositions = positions.filter((p) => p.companyName === company);
                const avgValue = companyPositions.length > 0
                  ? companyPositions.reduce((sum, p) => sum + p.value, 0) / companyPositions.length
                  : 0;

                return (
                  <div
                    key={`${company}-${targetCompany}`}
                    className={cn(
                      "p-2 text-center text-xs border border-dark-border transition-all duration-normal",
                      "hover:scale-105 hover:z-20 hover:shadow-lg",
                      avgValue !== 0 && "cursor-pointer"
                    )}
                    style={{
                      backgroundColor: avgValue !== 0
                        ? `${getValueColor(avgValue)}${Math.floor(getIntensity(avgValue) * 255).toString(16).padStart(2, "0")}`
                        : "transparent",
                    }}
                  >
                    {avgValue !== 0 && (
                      <div className="text-text-primary font-semibold">
                        {formatPercentage(avgValue, { showSign: true })}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};



