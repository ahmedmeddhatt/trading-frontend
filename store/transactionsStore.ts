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
    set({ loading: true });
    try {
      const data = await TransactionsAPI.getAll(positionId);
      set({ transactions: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addTransaction: async (data) => {
    const newTxn = await TransactionsAPI.create(data as any);
    set({ transactions: [...get().transactions, newTxn] });
  },

  deleteTransaction: async (id) => {
    await TransactionsAPI.delete(id);
    set({ transactions: get().transactions.filter((t) => t._id !== id) });
  },
}));
