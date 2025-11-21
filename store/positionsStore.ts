// src/store/positionsStore.ts
import { create } from "zustand";
import axios from "axios";

export interface Position {
  _id: string;
  companyName: string;
  stockPrice: number;
  quantity: number;
  investment: number;
  investmentWithTax: number;
  resultWithTax: number;
  percentGainLoss: number;
  status: "holding" | "sold" | "watching";
  createdAt: string;
  updatedAt: string;
}

interface PositionsState {
  positions: Position[];
  loading: boolean;
  error: string | null;
  fetchPositions: () => void;
  addPosition: (data: Partial<Position>) => Promise<void>;
  updatePosition: (id: string, data: Partial<Position>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
}

export const usePositionsStore = create<PositionsState>((set) => ({
  positions: [],
  loading: false,
  error: null,

  fetchPositions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/positions");
      set({ positions: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addPosition: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/positions", data);
      set((state) => ({ positions: [...state.positions, res.data], loading: false }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updatePosition: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/positions/${id}`, data);
      set((state) => ({
        positions: state.positions.map((p) => (p._id === id ? res.data : p)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deletePosition: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/positions/${id}`);
      set((state) => ({ positions: state.positions.filter((p) => p._id !== id), loading: false }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
