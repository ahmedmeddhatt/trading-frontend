// Reusable chart container with neon styling
"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChartCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  height?: string | number;
  glow?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className,
  height = "auto",
  glow = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="elevated"
        padding="lg"
        className={cn(
          "relative overflow-hidden",
          glow && "hover:border-green-primary/50 hover:shadow-lg hover:shadow-green-primary/10",
          "transition-all duration-normal",
          className
        )}
      >
        {title && (
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-primary to-green-hover text-transparent bg-clip-text">
            {title}
          </h3>
        )}
        <div style={{ height: typeof height === "number" ? `${height}px` : height }}>
          {children}
        </div>
      </Card>
    </motion.div>
  );
};



