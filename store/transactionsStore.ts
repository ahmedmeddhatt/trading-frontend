import { create } from "zustand";
import { TransactionsAPI, Transaction } from "@/lib/api/transactions";

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error?: string;

  fetchTransactions: (positionId?: string) => Promise<void>;
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  loading: false,
  error: undefined,

  fetchTransactions: async (positionId?: string) => {
    set({ loading: true, error: undefined });
    try {
      const data = await TransactionsAPI.getAll(positionId);
      set({ transactions: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch transactions";
      set({ error: errorMessage, loading: false });
    }
  },

  addTransaction: async (data) => {
    set({ loading: true, error: undefined });
    try {
      const response = await TransactionsAPI.create(data as any);
      // Backend returns { transaction, position }
      const newTxn = response.transaction;
      set({ transactions: [...get().transactions, newTxn], loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add transaction";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: undefined });
    try {
      await TransactionsAPI.delete(id);
      set({ transactions: get().transactions.filter((t) => t._id !== id), loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete transaction";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },
}));
