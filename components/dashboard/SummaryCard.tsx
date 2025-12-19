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
      className="hover:border-green-primary/50 hover:shadow-lg hover:shadow-green-primary/10 transition-all duration-normal group"
    >
      <p className="text-text-secondary text-sm mb-2 group-hover:text-text-primary transition-colors duration-normal">
        {title}
      </p>
      <p className={cn(
        "text-2xl font-bold tabular-nums transition-all duration-normal",
        isPositive && "text-green-primary group-hover:scale-105",
        isNegative && "text-red-primary group-hover:scale-105",
        !isPositive && !isNegative && "text-text-primary"
      )}>
        {currency ? formatCurrency(value) : formatPercentage(value)}
      </p>
    </Card>
  );
};
