import { create } from "zustand";
import { api } from "@/lib/api/client";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user?: User | null;
  loading: boolean;
  error?: string;

  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: undefined,

  register: async (payload) => {
    set({ loading: true });

    const res = await api.post("/auth/register", payload);

    localStorage.setItem("token", res.data.token);
    api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

    set({ user: res.data.user, loading: false });
  },

  login: async (payload) => {
    set({ loading: true });

    const res = await api.post("/auth/login", payload);

    localStorage.setItem("token", res.data.token);
    api.defaults.headers.Authorization = `Bearer ${res.data.token}`;

    set({ user: res.data.user, loading: false });
  },

  fetchMe: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      api.defaults.headers.Authorization = `Bearer ${token}`;
      const res = await api.get("/auth/me");

      set({ user: res.data.user });
    } catch (err) {
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
