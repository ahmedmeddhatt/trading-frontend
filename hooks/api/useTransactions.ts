// React Query hooks for transactions
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TransactionsAPI,
  Transaction,
  TransactionPayload,
} from "@/lib/api/transactions";
import { useToast } from "@/components/ui/Toast";

export const useTransactions = (positionId?: string) => {
  return useQuery({
    queryKey: ["transactions", positionId],
    queryFn: () => TransactionsAPI.getAll(positionId),
    enabled: positionId !== undefined,
    staleTime: 30 * 1000,
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: () => TransactionsAPI.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (data: TransactionPayload) => TransactionsAPI.create(data),
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({
        queryKey: ["transactions", newTransaction.positionId],
      });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
        newTransaction.positionId,
      ]);

      if (previousTransactions) {
        const optimisticTransaction: Transaction = {
          _id: `temp-${Date.now()}`,
          userId: "",
          positionId: newTransaction.positionId,
          quantity: newTransaction.quantity,
          price: newTransaction.price,
          fees: newTransaction.fees || 0,
          type: newTransaction.type || "buy",
          total: newTransaction.quantity * newTransaction.price + (newTransaction.fees || 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Transaction[]>(
          ["transactions", newTransaction.positionId],
          [...previousTransactions, optimisticTransaction]
        );
      }

      return { previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions", newTransaction.positionId],
          context.previousTransactions
        );
      }
      addToast(err.message || "Failed to create transaction", "error");
    },
    onSuccess: (data) => {
      // Update position cache with the returned position
      queryClient.setQueryData(["positions", data.position._id], data.position);
      addToast("Transaction created successfully", "success");
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["transactions", data.transaction.positionId],
        });
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => TransactionsAPI.delete(id),
    onMutate: async (deletedId) => {
      // Find which position this transaction belongs to
      const allQueries = queryClient.getQueryCache().getAll();
      const transactionQueries = allQueries.filter(
        (q) => q.queryKey[0] === "transactions" && Array.isArray(q.queryKey[1])
      );

      for (const query of transactionQueries) {
        await queryClient.cancelQueries({ queryKey: query.queryKey });
        const previousTransactions = queryClient.getQueryData<Transaction[]>(
          query.queryKey
        );

        if (previousTransactions?.some((t) => t._id === deletedId)) {
          queryClient.setQueryData<Transaction[]>(
            query.queryKey,
            previousTransactions.filter((t) => t._id !== deletedId)
          );
          return { previousTransactions, queryKey: query.queryKey };
        }
      }

      return { previousTransactions: undefined, queryKey: undefined };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousTransactions && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousTransactions);
      }
      addToast(err.message || "Failed to delete transaction", "error");
    },
    onSuccess: () => {
      addToast("Transaction deleted successfully", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};



