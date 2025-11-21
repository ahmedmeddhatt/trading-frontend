// src/lib/api/companies.ts
import { PositionsAPI } from "./positions";

export interface CompanyGroup {
  companyName: string;
  totalInvestment: number;
  totalResult: number;
  gainLoss: number;
  percent: number;
  totalQuantity: number;
  positions: any[];
}

export const CompaniesAPI = {
  aggregate: async (): Promise<CompanyGroup[]> => {
    const positions = await PositionsAPI.getAll();

    const map = new Map<string, CompanyGroup>();

    positions.forEach((p) => {
      const group = map.get(p.companyName) ?? {
        companyName: p.companyName,
        totalInvestment: 0,
        totalResult: 0,
        gainLoss: 0,
        percent: 0,
        totalQuantity: 0,
        positions: [],
      };

      group.positions.push(p);

      group.totalInvestment += p.investmentWithTax;
      group.totalResult += p.resultWithTax;
      group.totalQuantity += p.quantity;

      map.set(p.companyName, group);
    });

    // calculate percentages
    map.forEach((g) => {
      g.gainLoss = g.totalResult - g.totalInvestment;
      g.percent =
        g.totalInvestment === 0
          ? 0
          : (g.gainLoss / g.totalInvestment) * 100;
    });

    return Array.from(map.values());
  },
};
