// src/lib/api/positions.ts
import { api } from "./client";

// ---------- TYPES ----------
export interface PositionPayload {
  companyName: string;
  stockPrice: number;
  quantity: number;
  status?: "holding" | "sold" | "watching";
}

export interface Position extends PositionPayload {
  _id: string;
  investment: number;
  investmentWithTax: number;
  resultWithTax: number;
  percentGainLoss: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- API FUNCTIONS ----------
export const PositionsAPI = {
  getAll: async () => {
    const res = await api.get<Position[]>("/positions");
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<Position>(`/positions/${id}`);
    return res.data;
  },

  create: async (data: PositionPayload) => {
    const res = await api.post<Position>("/positions", data);
    return res.data;
  },

  update: async (id: string, data: Partial<PositionPayload>) => {
    const res = await api.put<Position>(`/positions/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/positions/${id}`);
    return res.data;
  },
};
