// Helper functions for toast notifications
import { useToast } from "@/components/ui/Toast";

export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (message: string) => addToast(message, "success", 3000),
    error: (message: string) => addToast(message, "error", 5000),
    info: (message: string) => addToast(message, "info", 4000),
    warning: (message: string) => addToast(message, "warning", 4000),
  };
};



