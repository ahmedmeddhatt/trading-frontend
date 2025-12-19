// components/ui/FAB.tsx
import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./Button";

export interface FABProps extends Omit<ButtonProps, "size" | "variant"> {
  icon?: React.ReactNode;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const FAB: React.FC<FABProps> = ({
  icon = <Plus className="w-5 h-5" />,
  label,
  position = "bottom-right",
  className,
  ...props
}) => {
  const positions = {
    "bottom-right": "bottom-4 right-4 md:bottom-6 md:right-6",
    "bottom-left": "bottom-4 left-4 md:bottom-6 md:left-6",
    "top-right": "top-4 right-4 md:top-6 md:right-6",
    "top-left": "top-4 left-4 md:top-6 md:left-6",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn("fixed z-[1030]", positions[position])}
    >
      <Button
        variant="primary"
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 p-0 shadow-lg",
          label && "w-auto px-4 gap-2",
          className
        )}
        {...props}
      >
        {icon}
        {label && <span className="hidden sm:inline">{label}</span>}
      </Button>
    </motion.div>
  );
};



