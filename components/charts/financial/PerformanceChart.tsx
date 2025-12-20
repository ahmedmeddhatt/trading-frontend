// Performance chart using lightweight-charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType, LineSeries } from "lightweight-charts";
import { chartColors } from "@/lib/charts/config";
import { chartColorSchemes } from "@/lib/charts/colors";

interface PerformanceData {
  time: string | number;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  benchmarkData?: PerformanceData[];
  height?: number;
  label?: string;
  benchmarkLabel?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  benchmarkData,
  height = 300,
  label = "Portfolio",
  benchmarkLabel = "Benchmark",
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const benchmarkSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: chartColors.background },
        textColor: chartColors.text,
      },
      grid: {
        vertLines: { color: chartColors.grid },
        horzLines: { color: chartColors.grid },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: chartColors.grid,
      },
    });

    // Main performance series
    const series = chart.addSeries(LineSeries, {
      color: chartColorSchemes.neon.green,
      lineWidth: 2,
      title: label,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    // Benchmark series (if provided)
    if (benchmarkData) {
      const benchmarkSeries = chart.addSeries(LineSeries, {
        color: chartColorSchemes.neon.cyan,
        lineWidth: 2,
        title: benchmarkLabel,
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
        lineStyle: 1, // Dashed line
      });
      benchmarkSeriesRef.current = benchmarkSeries;
    }

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height, label, benchmarkLabel, benchmarkData]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    const formattedData = data.map((item) => ({
      time: typeof item.time === "string" ? (new Date(item.time).getTime() / 1000) as any : item.time,
      value: item.value,
    }));

    seriesRef.current.setData(formattedData);

    if (benchmarkData && benchmarkSeriesRef.current) {
      const formattedBenchmark = benchmarkData.map((item) => ({
        time: typeof item.time === "string" ? (new Date(item.time).getTime() / 1000) as any : item.time,
        value: item.value,
      }));
      benchmarkSeriesRef.current.setData(formattedBenchmark);
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data, benchmarkData]);

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
  );
};

