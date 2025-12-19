// React Query hooks for authentication
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI, RegisterPayload, LoginPayload } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";

export const useMe = () => {
  const { setUser } = useAuthStore();
  
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      if (api.defaults.headers) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      const user = await AuthAPI.me();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthAPI.login(payload),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (api.defaults.headers) {
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
      }
      setUser(data.user);
      queryClient.setQueryData(["auth", "me"], data.user);
      addToast("Login successful", "success");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast(error.message || "Login failed", "error");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => AuthAPI.register(payload),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (api.defaults.headers) {
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
      }
      setUser(data.user);
      queryClient.setQueryData(["auth", "me"], data.user);
      addToast("Registration successful", "success");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast(error.message || "Registration failed", "error");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { addToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      if (api.defaults.headers) {
        delete api.defaults.headers.Authorization;
      }
      logout();
      queryClient.clear();
    },
    onSuccess: () => {
      addToast("Logged out successfully", "success");
      router.push("/login");
    },
  });
};

