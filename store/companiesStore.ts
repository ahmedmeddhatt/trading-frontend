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
    set({ loading: true });
    try {
      const data = await CompaniesAPI.aggregate();
      set({ companies: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
