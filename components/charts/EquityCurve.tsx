// Portfolio equity curve chart using TradingView Lightweight Charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, LineSeries } from "lightweight-charts";
import { DailySnapshot } from "@/lib/api/analytics";
import { ChartContainer } from "./ChartContainer";
import { chartColors } from "@/lib/charts/config";

interface EquityCurveProps {
  snapshots: DailySnapshot[];
}

export const EquityCurve: React.FC<EquityCurveProps> = ({ snapshots }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
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
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: chartColors.grid,
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: chartColors.line,
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Handle resize
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
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !snapshots.length) return;

    // Prepare data
    const data = snapshots
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((snapshot) => ({
        time: new Date(snapshot.date).getTime() / 1000 as any, // Unix timestamp
        value: snapshot.totalCurrentValue || 0,
      }));

    seriesRef.current.setData(data);

    // Fit content
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [snapshots]);

  return (
    <ChartContainer>
      <div ref={chartContainerRef} className="w-full" style={{ height: "300px" }} />
    </ChartContainer>
  );
};

