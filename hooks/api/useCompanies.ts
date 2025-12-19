// React Query hooks for companies
import { useQuery } from "@tanstack/react-query";
import { CompaniesAPI, CompanyGroup } from "@/lib/api/companies";

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => CompaniesAPI.aggregate(),
    staleTime: 30 * 1000,
  });
};



