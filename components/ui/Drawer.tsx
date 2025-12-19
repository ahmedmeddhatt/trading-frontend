// components/ui/Drawer.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  title,
  side = "right",
  size = "md",
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const sizes = {
    sm: side === "left" || side === "right" ? "w-64" : "h-64",
    md: side === "left" || side === "right" ? "w-80" : "h-80",
    lg: side === "left" || side === "right" ? "w-96" : "h-96",
  };

  const positions = {
    left: "left-0 top-0 bottom-0",
    right: "right-0 top-0 bottom-0",
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
  };

  const variants = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1040]"
            onClick={onClose}
          />
          <motion.div
            initial={variants[side]}
            animate={{ x: 0, y: 0 }}
            exit={variants[side]}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed z-[1050] glass border border-[#2a2a2a]",
              positions[side],
              sizes[size],
              side === "left" || side === "right" ? "overflow-y-auto" : "overflow-x-auto"
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a] z-10">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-[#a3a3a3] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2a2a2a]"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className={cn(title ? "p-4" : "p-6")}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};



