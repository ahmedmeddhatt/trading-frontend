import { create } from "zustand";
import { api } from "@/lib/api/client";
import { User } from "@/lib/api/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      const token = localStorage.getItem("token");
      if (token && api.defaults.headers) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("token");
    if (api.defaults.headers) {
      delete api.defaults.headers.Authorization;
    }
    set({ user: null });
  },
}));
