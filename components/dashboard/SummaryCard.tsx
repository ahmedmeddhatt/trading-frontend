// src/components/dashboard/SummaryCard.tsx
import React from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  currency?: boolean;
  positiveColor?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  currency = true,
  positiveColor = false,
}) => {
  const isPositive = positiveColor && value >= 0;
  const isNegative = positiveColor && value < 0;

  return (
    <Card 
      variant="elevated" 
      className={cn(
        "hover:border-green-primary/50 hover:shadow-xl transition-all duration-normal group",
        "relative overflow-hidden",
        isPositive && "hover:shadow-green-primary/30",
        isNegative && "hover:shadow-red-primary/30"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-normal",
        isPositive && "bg-gradient-to-br from-green-primary to-green-hover",
        isNegative && "bg-gradient-to-br from-red-primary to-red-hover",
        !isPositive && !isNegative && "bg-gradient-to-br from-green-primary to-cyan-400"
      )} />
      
      <div className="relative z-10">
        <p className="text-text-secondary text-sm mb-2 group-hover:text-text-primary transition-colors duration-normal font-medium">
          {title}
        </p>
        <p className={cn(
          "text-2xl md:text-3xl font-bold tabular-nums transition-all duration-normal",
          "group-hover:scale-105 inline-block",
          isPositive && "text-green-primary",
          isNegative && "text-red-primary",
          !isPositive && !isNegative && "text-text-primary"
        )}>
          {currency ? formatCurrency(value) : formatPercentage(value)}
        </p>
      </div>
    </Card>
  );
};
