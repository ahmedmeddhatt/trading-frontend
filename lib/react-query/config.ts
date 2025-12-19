// React Query configuration for trading platform
import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - trading data should be fresh
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: (failureCount: number, error: any) => {
        // Don't retry if offline
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          return false;
        }
        // Retry up to 2 times for network errors
        if (error?.isNetworkError || error?.code === "ERR_NETWORK") {
          return failureCount < 2;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: () => {
        // Only refetch if online
        return typeof navigator !== "undefined" ? navigator.onLine : true;
      },
      refetchOnReconnect: true,
      refetchOnMount: true,
      // Cache data for offline access
      networkMode: "offlineFirst" as const,
    },
    mutations: {
      retry: (failureCount: number, error: any) => {
        // Don't retry mutations if offline
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
      networkMode: "offlineFirst" as const,
    },
  },
};

export const createQueryClient = () => {
  return new QueryClient(queryClientConfig);
};

