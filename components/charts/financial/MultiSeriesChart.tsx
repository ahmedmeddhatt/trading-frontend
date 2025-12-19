// Multi-series chart using lightweight-charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType, LineSeries, AreaSeries } from "lightweight-charts";
import { DailySnapshot } from "@/lib/api/analytics";
import { chartColors } from "@/lib/charts/config";
import { chartColorSchemes } from "@/lib/charts/colors";

interface SeriesConfig {
  key: string;
  label: string;
  color: string;
  type: "line" | "area";
  dataKey: (snapshot: DailySnapshot) => number;
}

interface MultiSeriesChartProps {
  snapshots: DailySnapshot[];
  series: SeriesConfig[];
  height?: number;
}

export const MultiSeriesChart: React.FC<MultiSeriesChartProps> = ({
  snapshots,
  series,
  height = 300,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<Map<string, ISeriesApi<"Line" | "Area">>>(new Map());

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

    const newSeriesRefs = new Map<string, ISeriesApi<"Line" | "Area">>();

    series.forEach((config) => {
      if (config.type === "area") {
        const areaSeries = chart.addSeries(AreaSeries, {
          lineColor: config.color,
          topColor: config.color + "33",
          bottomColor: chartColors.background,
          lineWidth: 2,
        });
        newSeriesRefs.set(config.key, areaSeries);
      } else {
        const lineSeries = chart.addSeries(LineSeries, {
          color: config.color,
          lineWidth: 2,
        });
        newSeriesRefs.set(config.key, lineSeries);
      }
    });

    chartRef.current = chart;
    seriesRefs.current = newSeriesRefs;

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
  }, [height, series]);

  useEffect(() => {
    if (!snapshots.length || seriesRefs.current.size === 0) return;

    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    series.forEach((config) => {
      const seriesInstance = seriesRefs.current.get(config.key);
      if (seriesInstance) {
        const data = sorted
          .map((snapshot) => {
            const value = config.dataKey(snapshot);
            return {
              time: (new Date(snapshot.date).getTime() / 1000) as any,
              value: isNaN(value) || !isFinite(value) ? 0 : value,
            };
          })
          .filter((item) => !isNaN(item.value) && isFinite(item.value));
        seriesInstance.setData(data);
      }
    });

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [snapshots, series]);

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
  );
};



