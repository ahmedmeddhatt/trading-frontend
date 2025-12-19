// Drawdown chart using lightweight-charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType, AreaSeries } from "lightweight-charts";
import { DailySnapshot } from "@/lib/api/analytics";
import { chartColors } from "@/lib/charts/config";
import { chartColorSchemes } from "@/lib/charts/colors";

interface DrawdownChartProps {
  snapshots: DailySnapshot[];
  height?: number;
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ snapshots, height = 300 }) => {
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
      height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: chartColors.grid,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: chartColorSchemes.neon.red,
      topColor: chartColorSchemes.withOpacity.red20,
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
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || !snapshots.length) return;

    // Calculate drawdowns
    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let maxValue = sorted[0]?.totalCurrentValue ?? 0;
    const drawdowns = sorted
      .map((snapshot) => {
        const currentValue = snapshot.totalCurrentValue ?? 0;
        if (currentValue > maxValue) {
          maxValue = currentValue;
        }
        // Avoid division by zero and NaN
        const drawdown = maxValue > 0 
          ? ((currentValue - maxValue) / maxValue) * 100 
          : 0;
        return {
          time: (new Date(snapshot.date).getTime() / 1000) as any,
          value: isNaN(drawdown) ? 0 : drawdown,
        };
      })
      .filter((item) => !isNaN(item.value) && isFinite(item.value));

    seriesRef.current.setData(drawdowns);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [snapshots]);

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
  );
};



