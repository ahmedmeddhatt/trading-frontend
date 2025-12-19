// Responsive chart container wrapper
"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
  height = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ minHeight: `${height}px` }}
    >
      {dimensions.width > 0 && (
        <div style={{ width: dimensions.width, height: dimensions.height }}>
          {children}
        </div>
      )}
    </div>
  );
};



