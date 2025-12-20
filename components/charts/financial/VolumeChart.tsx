// Volume chart using lightweight-charts
"use client";

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, ColorType, HistogramSeries } from "lightweight-charts";
import { chartColors } from "@/lib/charts/config";
import { chartColorSchemes } from "@/lib/charts/colors";

interface VolumeData {
  time: string | number;
  value: number;
  color?: string;
}

interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
  showBuySell?: boolean;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, height = 300, showBuySell = false }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

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
        scaleMargins: {
          top: 0.1,
          bottom: 0,
        },
      },
    });

    const series = chart.addSeries(HistogramSeries, {
      color: showBuySell ? chartColorSchemes.neon.cyan : chartColorSchemes.neon.green,
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
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
  }, [height, showBuySell]);

  useEffect(() => {
    if (!seriesRef.current || !data.length) return;

    const formattedData = data.map((item) => ({
      time: typeof item.time === "string" ? (new Date(item.time).getTime() / 1000) as any : item.time,
      value: item.value,
      color: item.color,
    }));

    seriesRef.current.setData(formattedData);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
  );
};

