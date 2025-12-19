// src/lib/api/companies.ts
import { PositionsAPI, Position } from "./positions";

export interface CompanyGroup {
  companyName: string;
  totalInvestment: number;
  totalCurrentValue: number;
  unrealizedPnL: number;
  unrealizedPct: number;
  gainLoss: number; // Legacy field, same as unrealizedPnL
  percent: number; // Legacy field, same as unrealizedPct
  totalQuantity: number;
  positions: Position[];
}

export const CompaniesAPI = {
  aggregate: async (): Promise<CompanyGroup[]> => {
    const positions = await PositionsAPI.getAll();

    const map = new Map<string, CompanyGroup>();

    positions.forEach((p) => {
      const existingGroup = map.get(p.companyName);
      let group: CompanyGroup;
      
      if (existingGroup) {
        group = existingGroup;
      } else {
        group = {
          companyName: p.companyName,
          totalInvestment: 0,
          totalCurrentValue: 0,
          unrealizedPnL: 0,
          unrealizedPct: 0,
          gainLoss: 0,
          percent: 0,
          totalQuantity: 0,
          positions: [],
        };
        map.set(p.companyName, group);
      }

      group.positions.push(p);
      group.totalInvestment += p.investmentWithFees || 0;
      group.totalCurrentValue += p.currentValue || 0;
      group.totalQuantity += p.totalQuantity || 0;
    });

    // calculate percentages
    map.forEach((g) => {
      g.unrealizedPnL = g.totalCurrentValue - g.totalInvestment;
      g.unrealizedPct =
        g.totalInvestment === 0
          ? 0
          : (g.unrealizedPnL / g.totalInvestment) * 100;
      // Legacy fields for backward compatibility
      g.gainLoss = g.unrealizedPnL;
      g.percent = g.unrealizedPct;
    });

    return Array.from(map.values());
  },
};
