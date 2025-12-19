// React Query hooks for analytics
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AnalyticsAPI,
  Summary,
  CompanyAnalytics,
  DailySnapshot,
} from "@/lib/api/analytics";
import { useToast } from "@/components/ui/Toast";

export const useSummary = () => {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => AnalyticsAPI.getSummary(),
    staleTime: 30 * 1000,
  });
};

export const useCompanyAnalytics = (companyName: string) => {
  return useQuery({
    queryKey: ["analytics", "company", companyName],
    queryFn: () => AnalyticsAPI.getCompanyAnalytics(companyName),
    enabled: !!companyName,
    staleTime: 30 * 1000,
  });
};

export const useSnapshots = () => {
  return useQuery({
    queryKey: ["analytics", "snapshots"],
    queryFn: () => AnalyticsAPI.getSnapshots(),
    staleTime: 60 * 1000, // 1 minute - snapshots change less frequently
  });
};

export const useCreateSnapshot = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (date?: string) => AnalyticsAPI.createSnapshot(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "snapshots"] });
      addToast("Snapshot created successfully", "success");
    },
    onError: (err) => {
      addToast(err.message || "Failed to create snapshot", "error");
    },
  });
};



