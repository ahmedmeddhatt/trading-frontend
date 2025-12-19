// Virtualized position list for mobile
"use client";

import React, { useState, useEffect } from "react";
import { Position } from "@/lib/api/positions";
import { PositionCard } from "./PositionCard";
import { EmptyState } from "../common/EmptyState";
import { VirtualizedList } from "../common/VirtualizedList";
import { Package } from "lucide-react";

interface PositionListProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (positionId: string) => void;
  onAdd: () => void;
  useVirtualization?: boolean;
}

export const PositionList: React.FC<PositionListProps> = ({
  positions,
  onEdit,
  onDelete,
  onAdd,
  useVirtualization = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (positions.length === 0) {
    return (
      <EmptyState
        title="No Positions"
        message="Create your first position to start tracking your portfolio."
        actionLabel="Add Position"
        onAction={onAdd}
        icon={<Package className="w-12 h-12 text-[#737373]" />}
      />
    );
  }

  // Use virtualization for lists with 20+ items on mobile
  const shouldVirtualize = useVirtualization && positions.length > 20 && isMobile;

  if (shouldVirtualize) {
    return (
      <VirtualizedList
        items={positions}
        itemHeight={180}
        height={Math.min(600, typeof window !== "undefined" ? window.innerHeight - 200 : 600)}
        renderItem={(position, index) => (
          <div className="mb-3">
            <PositionCard
              position={position}
              onEdit={() => onEdit(position)}
              onDelete={() => onDelete(position._id)}
            />
          </div>
        )}
      />
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((position) => (
        <PositionCard
          key={position._id}
          position={position}
          onEdit={() => onEdit(position)}
          onDelete={() => onDelete(position._id)}
        />
      ))}
    </div>
  );
};
