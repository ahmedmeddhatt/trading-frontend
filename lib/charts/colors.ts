// Expanded color schemes for charts with neon design
export const chartColorSchemes = {
  // Primary neon colors
  neon: {
    green: "#00ff88",
    red: "#ff4444",
    cyan: "#00ffff",
    purple: "#ff00ff",
    yellow: "#ffff00",
    orange: "#ff8800",
    pink: "#ff00aa",
    blue: "#0088ff",
  },
  
  // Chart-specific color arrays for multi-series
  performance: ["#00ff88", "#00ffff", "#0088ff", "#ff00ff", "#ff8800"],
  companies: [
    "#00ff88", // Green
    "#00ffff", // Cyan
    "#0088ff", // Blue
    "#ff00ff", // Purple
    "#ff8800", // Orange
    "#ffff00", // Yellow
    "#ff00aa", // Pink
    "#ff4444", // Red
  ],
  
  // Gradient definitions
  gradients: {
    green: "linear-gradient(135deg, #00ff88 0%, #00cc6f 100%)",
    red: "linear-gradient(135deg, #ff4444 0%, #cc3333 100%)",
    cyan: "linear-gradient(135deg, #00ffff 0%, #00cccc 100%)",
    purple: "linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%)",
    rainbow: "linear-gradient(135deg, #00ff88 0%, #00ffff 25%, #0088ff 50%, #ff00ff 75%, #ff8800 100%)",
  },
  
  // Opacity variants for fills
  withOpacity: {
    green10: "rgba(0, 255, 136, 0.1)",
    green20: "rgba(0, 255, 136, 0.2)",
    green30: "rgba(0, 255, 136, 0.3)",
    red10: "rgba(255, 68, 68, 0.1)",
    red20: "rgba(255, 68, 68, 0.2)",
    red30: "rgba(255, 68, 68, 0.3)",
    cyan10: "rgba(0, 255, 255, 0.1)",
    cyan20: "rgba(0, 255, 255, 0.2)",
    purple10: "rgba(255, 0, 255, 0.1)",
    purple20: "rgba(255, 0, 255, 0.2)",
  },
};

// Get color by index (for cycling through colors)
export const getColorByIndex = (index: number, scheme: keyof typeof chartColorSchemes = "companies"): string => {
  const colors = chartColorSchemes[scheme];
  if (Array.isArray(colors)) {
    return colors[index % colors.length];
  }
  return chartColorSchemes.neon.green;
};

// Get color for positive/negative values
export const getValueColor = (value: number): string => {
  return value >= 0 ? chartColorSchemes.neon.green : chartColorSchemes.neon.red;
};



