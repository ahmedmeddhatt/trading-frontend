// Portfolio gain/loss chart using TradingView Lightweight Charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType, AreaSeries } from "lightweight-charts";
import { DailySnapshot } from "@/lib/api/analytics";
import { chartColors } from "@/lib/charts/config";

interface GainLossChartProps {
  snapshots: DailySnapshot[];
}

export const GainLossChart: React.FC<GainLossChartProps> = ({ snapshots }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

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
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: chartColors.grid,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: chartColors.line,
      topColor: chartColors.area,
      bottomColor: chartColors.background,
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

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
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !snapshots.length) return;

    const data = snapshots
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((snapshot) => ({
        time: (new Date(snapshot.date).getTime() / 1000) as any,
        value: snapshot.totalUnrealizedPnL || 0,
      }));

    seriesRef.current.setData(data);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [snapshots]);

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height: "300px" }} />
  );
};
