// src/components/dashboard/SummaryCard.tsx
import React from "react";
import { Card } from "@/components/ui/Card";

interface SummaryCardProps {
  title: string;
  value: number;
  currency?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, currency = true }) => {
  return (
    <Card>
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">
        {currency ? `$${value?.toFixed(2)}` : value.toFixed(2)}
      </p>
    </Card>
  );
};
