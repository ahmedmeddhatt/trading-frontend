import { create } from "zustand";
import { CompaniesAPI, CompanyGroup } from "@/lib/api/companies";

interface CompaniesState {
  companies: CompanyGroup[];
  loading: boolean;
  error?: string;

  fetchCompanies: () => Promise<void>;
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: [],
  loading: false,
  error: undefined,

  fetchCompanies: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await CompaniesAPI.aggregate();
      set({ companies: data, loading: false, error: undefined });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch companies";
      set({ error: errorMessage, loading: false });
    }
  },
}));
