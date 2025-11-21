// src/lib/api/analytics.ts
import { api } from "./client";

export interface Summary {
  totalInvestment: number;
  totalResult: number;
  totalGainLoss: number;
  totalPercent: number;
  count: number;
}

export interface CompanyAnalytics {
  companyName: string;
  positions: any[];
  totalInvestment: number;
  totalResult: number;
  gainLoss: number;
  percent: number;
}

export interface SnapshotPosition {
  positionId?: string;
  companyName: string;
  quantity: number;
  currentPrice: number;
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
  totalResult: number;
  gainLoss: number;
  percent: number;
  positions: SnapshotPosition[];
  createdAt?: string;
}



// ---------- API ----------
export const AnalyticsAPI = {
  getSummary: async () => {
    const res = await api.get<Summary>("/analytics/summary");
    return res.data;
  },

  getCompanyAnalytics: async (company: string) => {
    const res = await api.get<CompanyAnalytics>(
      `/analytics/company/${company}`
    );
    return res.data;
  },

  getSnapshots: async () => {
    const res = await api.get<DailySnapshot[]>("/analytics/snapshots");
    return res.data;
  },

  createSnapshot: async (date?: string) => {
    const res = await api.post<DailySnapshot>("/analytics/snapshot", null, {
      params: date ? { date } : {},
    });
    return res.data;
  },
};
