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
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: undefined,
  companyAnalytics: undefined,
  snapshots: [],
  loading: false,
  error: undefined,

  fetchSummary: async () => {
    set({ loading: true });
    try {
      const data = await AnalyticsAPI.getSummary();
      set({ summary: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCompanyAnalytics: async (companyName: string) => {
    set({ loading: true });
    try {
      const data = await AnalyticsAPI.getCompanyAnalytics(companyName);
      set({ companyAnalytics: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchSnapshots: async () => {
    set({ loading: true });
    try {
      const data = await AnalyticsAPI.getSnapshots();
      set({ snapshots: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
