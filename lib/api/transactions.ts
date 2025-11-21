// src/lib/api/transactions.ts
import { api } from "./client";

export interface TransactionPayload {
  positionId: string;
  quantity: number;
  price: number;
  tax?: number;
}

export interface Transaction extends TransactionPayload {
  _id: string;
  total: number;
  createdAt: string;
}

export const TransactionsAPI = {
  getAll: async (positionId?: string) => {
    const res = await api.get<Transaction[]>("/transactions", {
      params: positionId ? { positionId } : {},
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<Transaction>(`/transactions/${id}`);
    return res.data;
  },

  create: async (data: TransactionPayload) => {
    const res = await api.post<Transaction>("/transactions", data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/transactions/${id}`);
    return res.data;
  },
};
