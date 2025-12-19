// Polar area chart using chart.js
"use client";

import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface PolarAreaData {
  label: string;
  value: number;
}

interface PolarAreaChartProps {
  data: PolarAreaData[];
  height?: number;
}

export const PolarAreaChart: React.FC<PolarAreaChartProps> = ({ data, height = 300 }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((_, index) => {
          const color = getColorByIndex(index, "companies");
          return `${color}80`; // Add transparency
        }),
        borderColor: data.map((_, index) => getColorByIndex(index, "companies")),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#a3a3a3",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#ffffff",
        bodyColor: "#a3a3a3",
        borderColor: "#2a2a2a",
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        grid: {
          color: "#2a2a2a",
        },
        ticks: {
          color: "#a3a3a3",
          backdropColor: "transparent",
        },
        pointLabels: {
          color: "#a3a3a3",
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <PolarArea data={chartData} options={options} />
    </div>
  );
};

