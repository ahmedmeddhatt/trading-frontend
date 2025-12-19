// Protected route wrapper
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/api/useAuth";
import { Loading } from "../ui/Loading";
import { Skeleton } from "../ui/Skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: meData, isLoading } = useMe();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isLoading) {
      router.push("/login");
    }
  }, [router, isLoading]);

  // Show loading while checking auth
  if (isLoading || (!user && !meData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="space-y-4">
          <Skeleton variant="circular" width={64} height={64} className="mx-auto" />
          <Skeleton variant="text" width="200px" className="mx-auto" />
        </div>
      </div>
    );
  }

  // If no user after loading, redirect will happen
  if (!user && !meData) {
    return null;
  }

  return <>{children}</>;
};



