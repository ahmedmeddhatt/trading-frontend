// ui/Modal.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "full";
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  size = "md",
  closeOnOverlayClick = true,
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
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    full: "max-w-full mx-4",
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1040]"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "glass rounded-2xl shadow-2xl w-full relative border border-[#2a2a2a] pointer-events-auto",
                isMobile ? "max-h-[90vh] overflow-y-auto" : sizes[size],
                isMobile && "bottom-0 absolute rounded-t-3xl rounded-b-none"
              )}
            >
              {(title || !isMobile) && (
                <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                  {title && (
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                  )}
                  <button
                    onClick={onClose}
                    className="text-[#a3a3a3] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1a1a1a]"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className={cn(isMobile && !title ? "p-4" : "p-6")}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
