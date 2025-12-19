import { create } from "zustand";
import { AnalyticsAPI, Summary, CompanyAnalytics, DailySnapshot } from "@/lib/api/analytics";

interface AnalyticsState {
  summary?: Summary;
  companyAnalytics?: CompanyAnalytics;
  snapshots: DailySnapshot[];
  loading: boolean;
  error?: string;

  fetchSummary: () => Promise<void>;
  fetchCompanyAnalytics: (companyName: string) => Promise<void>;
  fetchSnapshots: () => Promise<void>;
  createSnapshot: (date?: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: undefined,
  companyAnalytics: undefined,
  snapshots: [],
  loading: false,
  error: undefined,

  fetchSummary: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await AnalyticsAPI.getSummary();
      set({ summary: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch summary";
      set({ error: errorMessage, loading: false });
    }
  },

  fetchCompanyAnalytics: async (companyName: string) => {
    set({ loading: true, error: undefined });
    try {
      const data = await AnalyticsAPI.getCompanyAnalytics(companyName);
      set({ companyAnalytics: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch company analytics";
      set({ error: errorMessage, loading: false });
    }
  },

  fetchSnapshots: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await AnalyticsAPI.getSnapshots();
      set({ snapshots: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch snapshots";
      set({ error: errorMessage, loading: false });
    }
  },

  createSnapshot: async (date?: string) => {
    set({ loading: true, error: undefined });
    try {
      await AnalyticsAPI.createSnapshot(date);
      // Refresh snapshots after creating
      const data = await AnalyticsAPI.getSnapshots();
      set({ snapshots: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create snapshot";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },
}));




