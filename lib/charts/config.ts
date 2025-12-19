// TradingView Lightweight Charts configuration
import { ColorType, createChart, IChartApi } from "lightweight-charts";

export const chartColors = {
  background: "#0a0a0a",
  text: "#ffffff",
  grid: "#2a2a2a",
  line: "#00ff88",
  lineNegative: "#ff4444",
  area: "rgba(0, 255, 136, 0.1)",
  areaNegative: "rgba(255, 68, 68, 0.1)",
};

export const createChartConfig = (container: HTMLElement): IChartApi => {
  return createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: chartColors.background },
      textColor: chartColors.text,
    },
    grid: {
      vertLines: { color: chartColors.grid },
      horzLines: { color: chartColors.grid },
    },
    width: container.clientWidth,
    height: 300,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: chartColors.grid,
    },
  });
};

