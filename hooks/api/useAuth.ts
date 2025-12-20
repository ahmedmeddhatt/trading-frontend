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
      console.log("🔄 [LOGOUT MUTATION] mutationFn called");
      const tokenBefore = localStorage.getItem("token");
      console.log("🔄 [LOGOUT MUTATION] Token before:", tokenBefore ? "EXISTS" : "NULL");
      
      // Clear token and auth headers
      localStorage.removeItem("token");
      if (api.defaults.headers) {
        delete api.defaults.headers.Authorization;
      }
      console.log("🔄 [LOGOUT MUTATION] Token removed, headers cleared");
      
      // Clear auth store
      logout();
      console.log("🔄 [LOGOUT MUTATION] Auth store cleared");
      
      // Clear all query cache
      queryClient.clear();
      console.log("🔄 [LOGOUT MUTATION] Query cache cleared");
      
      const tokenAfter = localStorage.getItem("token");
      console.log("🔄 [LOGOUT MUTATION] Token after:", tokenAfter ? "STILL EXISTS ❌" : "REMOVED ✅");
      console.log("✅ [LOGOUT MUTATION] mutationFn completed");
      
      // Return success
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("✅ [LOGOUT MUTATION] onSuccess called");
      addToast("Logged out successfully", "success");
      
      // Clear all queries immediately
      queryClient.removeQueries();
      console.log("🔄 [LOGOUT MUTATION] All queries removed");
      
      // Navigate immediately - router should work
      console.log("🔄 [LOGOUT MUTATION] Navigating to /login via router...");
      router.push("/login");
      
      // Force navigation as fallback after a short delay
      setTimeout(() => {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          console.log("🔄 [LOGOUT MUTATION] Checking navigation... Current path:", currentPath);
          if (currentPath !== "/login") {
            console.log("⚠️ [LOGOUT MUTATION] Router didn't work, forcing with window.location");
            window.location.href = "/login";
          } else {
            console.log("✅ [LOGOUT MUTATION] Successfully navigated to /login");
          }
        }
      }, 300);
    },
    onError: (error: any) => {
      console.error("❌ [LOGOUT MUTATION] onError:", error);
      addToast(error?.message || "Logout failed", "error");
      
      // Even on error, try to redirect to login
      console.log("🔄 [LOGOUT MUTATION] Attempting fallback navigation...");
      setTimeout(() => {
        router.push("/login");
        if (window.location.pathname !== "/login") {
          console.log("🔄 [LOGOUT MUTATION] Forcing navigation with window.location");
          window.location.href = "/login";
        }
      }, 100);
    },
  });
};

