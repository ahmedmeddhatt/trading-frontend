// src/lib/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://aeb984f5-3583-4f23-a88f-25828e3ceac3-00-g337wi7drv6o.picard.replit.dev:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to include token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});