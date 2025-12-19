// src/lib/api/analytics.ts
import { api } from "./client";

// ---------- TYPES (matching backend documentation) ----------
export interface Position {
  _id: string;
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
  [key: string]: any;
}

export interface Summary {
  count: number;
  totalInvestment: number;
  totalCurrentValue: number;
  totalUnrealizedPnL: number;
  totalPercent: number;
  positions: Position[];
}

export interface CompanyAnalytics {
  companyName: string;
  positions: Position[];
  totalInvestment: number;
  totalCurrentValue: number;
  unrealizedPnL: number;
  unrealizedPct: number;
  gainLoss: number; // Legacy field, same as unrealizedPnL
  percent: number; // Legacy field, same as unrealizedPct
}

export interface SnapshotPosition {
  positionId: string;
  companyName: string;
  quantity: number;
  currentPrice?: number;
  currentValue: number;
  unrealizedPnL: number;
}

export interface DailySnapshot {
  _id: string;
  userId: string;
  date: string;
  totalInvestment: number;
  totalCurrentValue: number;
  totalUnrealizedPnL: number;
  positions: SnapshotPosition[];
  createdAt?: string;
  updatedAt?: string;
}

// ---------- API FUNCTIONS ----------
export const AnalyticsAPI = {
  getSummary: async (): Promise<Summary> => {
    const res = await api.get<Summary>("/analytics/summary");
    return res.data;
  },

  getCompanyAnalytics: async (companyName: string): Promise<CompanyAnalytics> => {
    const res = await api.get<CompanyAnalytics>(
      `/analytics/company/${encodeURIComponent(companyName)}`
    );
    return res.data;
  },

  getSnapshots: async (): Promise<DailySnapshot[]> => {
    const res = await api.get<DailySnapshot[]>("/analytics/snapshots");
    return res.data;
  },

  createSnapshot: async (date?: string): Promise<DailySnapshot> => {
    const res = await api.post<DailySnapshot>("/analytics/snapshot", null, {
      params: date ? { date } : {},
    });
    return res.data;
  },
};
