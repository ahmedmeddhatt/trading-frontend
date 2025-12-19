// src/store/positionsStore.ts
import { create } from "zustand";
import { PositionsAPI, Position, PositionPayload } from "@/lib/api/positions";

interface PositionsState {
  positions: Position[];
  loading: boolean;
  error: string | null;
  fetchPositions: () => Promise<void>;
  addPosition: (data: PositionPayload) => Promise<void>;
  updatePosition: (id: string, data: Partial<PositionPayload>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
}

export const usePositionsStore = create<PositionsState>((set, get) => ({
  positions: [],
  loading: false,
  error: null,

  fetchPositions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await PositionsAPI.getAll();
      set({ positions: data, loading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch positions";
      set({ error: errorMessage, loading: false });
    }
  },

  addPosition: async (data) => {
    set({ loading: true, error: null });
    try {
      const newPosition = await PositionsAPI.create(data);
      set((state) => ({ positions: [...state.positions, newPosition], loading: false }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add position";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  updatePosition: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await PositionsAPI.update(id, data);
      set((state) => ({
        positions: state.positions.map((p) => (p._id === id ? updated : p)),
        loading: false,
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update position";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },

  deletePosition: async (id) => {
    set({ loading: true, error: null });
    try {
      await PositionsAPI.delete(id);
      set((state) => ({ positions: state.positions.filter((p) => p._id !== id), loading: false }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete position";
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },
}));
