import { api } from "./client";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ---------- API FUNCTIONS ----------
export const AuthAPI = {
  register: async (data: RegisterPayload) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginPayload) => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  me: async () => {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },
};
