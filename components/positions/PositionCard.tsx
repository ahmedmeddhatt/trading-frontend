// Mobile-optimized position card with swipe actions
"use client";

import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Position } from "@/lib/api/positions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatNumber";
import { Trash2, Edit, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PositionCardProps {
  position: Position;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export const PositionCard: React.FC<PositionCardProps> = ({
  position,
  onEdit,
  onDelete,
  className,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showActions, setShowActions] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      // Only allow left swipe (negative deltaX)
      if (e.deltaX < 0) {
        setSwipeOffset(Math.max(e.deltaX, -120));
      }
    },
    onSwipedLeft: () => {
      if (swipeOffset < -60) {
        setShowActions(true);
        setSwipeOffset(-120);
      } else {
        setSwipeOffset(0);
      }
    },
    onSwipedRight: () => {
      setSwipeOffset(0);
      setShowActions(false);
    },
    trackMouse: true,
  });

  const handleActionClick = (action: () => void) => {
    action();
    setSwipeOffset(0);
    setShowActions(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        {...handlers}
        animate={{ x: swipeOffset }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative"
      >
        <Card variant="elevated" className="hover:border-green-primary/50 hover:shadow-lg hover:shadow-green-primary/10 transition-all duration-normal group">
          <Link href={`/position/${position._id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-primary mb-1">
                  {position.companyName}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{position.status}</Badge>
                  <span className="text-sm text-text-tertiary">
                    {position.totalQuantity} shares
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-text-tertiary mb-1">Investment</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(position.investmentWithFees)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Current Value</p>
                <p className="text-sm font-semibold text-text-primary">
                  {position.currentValue
                    ? formatCurrency(position.currentValue)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Avg Price</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(position.avgPurchasePrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Unrealized P/L</p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    position.unrealizedPnL && position.unrealizedPnL >= 0
                      ? "text-green-primary"
                      : "text-red-primary"
                  )}
                >
                  {position.unrealizedPnL !== undefined ? (
                    <>
                      {formatCurrency(position.unrealizedPnL, {
                        showSign: true,
                      })}
                      <br />
                      <span className="text-xs">
                        ({formatPercentage(position.unrealizedPct || 0, { showSign: true })})
                      </span>
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </Link>
        </Card>
      </motion.div>

      {/* Swipe Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-4"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleActionClick(onEdit)}
              icon={<Edit className="w-4 h-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleActionClick(onDelete)}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

