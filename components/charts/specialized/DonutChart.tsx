// Donut chart using chart.js
"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { chartColorSchemes, getColorByIndex } from "@/lib/charts/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutData {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutData[];
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, height = 300 }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((_, index) => getColorByIndex(index, "companies")),
        borderColor: data.map(() => "#1a1a1a"),
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
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};



