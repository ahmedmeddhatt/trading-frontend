// React Query hooks for positions
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PositionsAPI, Position, PositionPayload } from "@/lib/api/positions";
import { useToast } from "@/components/ui/Toast";

export const usePositions = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => PositionsAPI.getAll(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const usePosition = (id: string) => {
  return useQuery({
    queryKey: ["positions", id],
    queryFn: () => PositionsAPI.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: PositionPayload) => PositionsAPI.create(data),
    onMutate: async (newPosition) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["positions"] });

      // Snapshot previous value
      const previousPositions = queryClient.getQueryData<Position[]>(["positions"]);

      // Optimistically update
      if (previousPositions) {
        const optimisticPosition: Position = {
          _id: `temp-${Date.now()}`,
          userId: "",
          companyName: newPosition.companyName,
          totalQuantity: 0,
          avgPurchasePrice: 0,
          totalInvestment: 0,
          totalFees: 0,
          investmentWithFees: 0,
          currentPrice: newPosition.currentPrice,
          currentValue: 0,
          unrealizedPnL: 0,
          unrealizedPct: 0,
          status: newPosition.status || "holding",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Position[]>(["positions"], (old) => [
          ...(old || []),
          optimisticPosition,
        ]);
      }

      return { previousPositions };
    },
    onError: (err, newPosition, context) => {
      // Rollback on error
      if (context?.previousPositions) {
        queryClient.setQueryData(["positions"], context.previousPositions);
      }
      addToast(err.message || "Failed to create position", "error");
    },
    onSuccess: () => {
      addToast("Position created successfully", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PositionPayload> }) =>
      PositionsAPI.update(id, data),
    onSuccess: (updatedPosition) => {
      queryClient.setQueryData(["positions", updatedPosition._id], updatedPosition);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      addToast("Position updated successfully", "success");
    },
    onError: (err) => {
      addToast(err.message || "Failed to update position", "error");
    },
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => PositionsAPI.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["positions"] });
      const previousPositions = queryClient.getQueryData<Position[]>(["positions"]);

      if (previousPositions) {
        queryClient.setQueryData<Position[]>(
          ["positions"],
          previousPositions.filter((p) => p._id !== deletedId)
        );
      }

      return { previousPositions };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousPositions) {
        queryClient.setQueryData(["positions"], context.previousPositions);
      }
      addToast(err.message || "Failed to delete position", "error");
    },
    onSuccess: () => {
      addToast("Position deleted successfully", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};



