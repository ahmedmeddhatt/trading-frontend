// src/lib/api/transactions.ts
import { api } from "./client";

// ---------- TYPES (matching backend documentation) ----------
export interface TransactionPayload {
  positionId: string;
  quantity: number;
  price: number;
  fees?: number;
  type?: "buy" | "sell";
}

export interface Transaction {
  _id: string;
  userId: string;
  positionId: string;
  quantity: number;
  price: number;
  fees: number;
  type: "buy" | "sell";
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  Count: number;
  transactions: Transaction[];
}

export interface CreateTransactionResponse {
  transaction: Transaction;
  position: {
    _id: string;
    totalQuantity: number;
    avgPurchasePrice: number;
    totalInvestment: number;
    investmentWithFees: number;
    currentValue: number;
    unrealizedPnL: number;
    unrealizedPct: number;
    [key: string]: any;
  };
}

// ---------- API FUNCTIONS ----------
export const TransactionsAPI = {
  getAll: async (positionId?: string): Promise<Transaction[]> => {
    const res = await api.get<TransactionsResponse>("/transactions", {
      params: positionId ? { positionId } : {},
    });
    return res.data.transactions || [];
  },

  getById: async (id: string): Promise<Transaction> => {
    const res = await api.get<Transaction>(`/transactions/${id}`);
    return res.data;
  },

  create: async (data: TransactionPayload): Promise<CreateTransactionResponse> => {
    const res = await api.post<CreateTransactionResponse>("/transactions", data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/transactions/${id}`);
    return res.data;
  },
};
