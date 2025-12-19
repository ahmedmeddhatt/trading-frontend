// src/lib/api/positions.ts
import { api } from "./client";

// ---------- TYPES (matching backend documentation) ----------
export interface PositionPayload {
  companyName: string;
  currentPrice?: number;
  status?: "holding" | "sold" | "watching";
}

export interface Position {
  _id: string;
  userId: string;
  companyName: string;
  totalQuantity: number;
  avgPurchasePrice: number;
  totalInvestment: number;
  totalFees: number;
  investmentWithFees: number;
  currentPrice?: number;
  currentValue?: number;
  unrealizedPnL?: number;
  unrealizedPct?: number;
  status: "holding" | "sold" | "watching";
  createdAt: string;
  updatedAt: string;
}

export interface PositionsResponse {
  Count: number;
  positions: Position[];
}

// ---------- API FUNCTIONS ----------
export const PositionsAPI = {
  getAll: async (): Promise<Position[]> => {
    const res = await api.get<PositionsResponse>("/positions");
    return res.data.positions || [];
  },

  getById: async (id: string): Promise<Position> => {
    const res = await api.get<Position>(`/positions/${id}`);
    return res.data;
  },

  create: async (data: PositionPayload): Promise<Position> => {
    const res = await api.post<Position>("/positions", data);
    return res.data;
  },

  update: async (id: string, data: Partial<PositionPayload>): Promise<Position> => {
    const res = await api.put<Position>(`/positions/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/positions/${id}`);
    return res.data;
  },
};
