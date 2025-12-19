// Bubble chart using chart.js
"use client";

import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BubbleController,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import { chartColorSchemes, getColorByIndex, getValueColor } from "@/lib/charts/colors";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, BubbleController);

interface BubbleData {
  x: number;
  y: number;
  size: number;
  label: string;
}

interface BubbleChartProps {
  data: BubbleData[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  height = 300,
  xLabel = "X Axis",
  yLabel = "Y Axis",
}) => {
  const chartData = {
    datasets: [
      {
        label: "Positions",
        data: data.map((d) => ({
          x: d.x,
          y: d.y,
          r: Math.max(5, Math.min(30, d.size / 100)), // Scale bubble size
        })),
        backgroundColor: data.map((d, index) => {
          const color = getValueColor(d.y);
          return `${color}80`; // Add transparency
        }),
        borderColor: data.map((d) => getValueColor(d.y)),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
          color: "#a3a3a3",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#2a2a2a",
        },
        ticks: {
          color: "#a3a3a3",
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
          color: "#a3a3a3",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#2a2a2a",
        },
        ticks: {
          color: "#a3a3a3",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#ffffff",
        bodyColor: "#a3a3a3",
        borderColor: "#2a2a2a",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const item = data[index];
            return [
              `Company: ${item.label}`,
              `${xLabel}: ${item.x.toLocaleString()}`,
              `${yLabel}: ${item.y.toFixed(2)}%`,
              `Size: ${item.size}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bubble data={chartData} options={options} />
    </div>
  );
};

