// Virtualized list for performance with long data sets
"use client";

import React, { useEffect, useState, useRef } from "react";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  height?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 60,
  height = 400,
  className,
}: VirtualizedListProps<T>) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: Math.ceil(height / itemHeight) });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !mounted) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
      const end = Math.min(start + Math.ceil(height / itemHeight) + 2, items.length);
      setVisibleRange({ start, end });
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [itemHeight, height, items.length, mounted]);

  if (!mounted || items.length === 0) {
    return null;
  }

  const totalHeight = items.length * itemHeight;
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className || ""}`}
      style={{ height: `${height}px` }}
    >
      <div style={{ height: `${totalHeight}px`, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: `${visibleRange.start * itemHeight}px`,
            width: "100%",
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start + index} style={{ height: `${itemHeight}px` }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
