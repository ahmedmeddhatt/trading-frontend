"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/api/useAuth";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { User, LogOut, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, logout: logoutStore } = useAuthStore();
  const logoutMutation = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    logger.page("Settings", {
      pathname: window.location.pathname,
    });
  }, []);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🔴 [LOGOUT] ========== LOGOUT BUTTON CLICKED ==========");
    console.log("🔴 [LOGOUT] Event type:", e.type);
    console.log("🔴 [LOGOUT] Button disabled:", (e.currentTarget as HTMLButtonElement).disabled);
    
    // Check if already in progress
    if (logoutMutation.isPending) {
      console.log("⚠️ [LOGOUT] Already in progress, ignoring");
      return;
    }
    
    // IMMEDIATE LOGOUT - Don't wait for mutation
    console.log("🔄 [LOGOUT] Starting immediate logout process...");
    
    // Step 1: Get token before
    const tokenBefore = localStorage.getItem("token");
    console.log("🔄 [LOGOUT] Step 1 - Token before:", tokenBefore ? "EXISTS" : "NULL");
    
    // Step 2: Remove token
    localStorage.removeItem("token");
    console.log("🔄 [LOGOUT] Step 2 - Token removed from localStorage");
    
    // Step 3: Clear auth headers
    if (api.defaults.headers) {
      delete api.defaults.headers.Authorization;
    }
    console.log("🔄 [LOGOUT] Step 3 - Auth headers cleared");
    
    // Step 4: Clear auth store
    logoutStore();
    console.log("🔄 [LOGOUT] Step 4 - Auth store cleared");
    
    // Step 5: Clear query cache
    queryClient.clear();
    queryClient.removeQueries();
    console.log("🔄 [LOGOUT] Step 5 - Query cache cleared");
    
    // Step 6: Verify token removed
    const tokenAfter = localStorage.getItem("token");
    console.log("🔄 [LOGOUT] Step 6 - Token after:", tokenAfter ? "STILL EXISTS ❌" : "REMOVED ✅");
    
    // Step 7: Show success message
    console.log("✅ [LOGOUT] Step 7 - Logout complete, navigating...");
    
    // Step 8: Navigate to login - use window.location immediately for reliability
    console.log("🔄 [LOGOUT] Step 8 - Redirecting to /login");
    console.log("🔄 [LOGOUT] Current path:", window.location.pathname);
    
    // Use window.location.href immediately - most reliable
    window.location.href = "/login";
    
    // Also try router as backup
    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        console.log("⚠️ [LOGOUT] window.location didn't work, trying router...");
        router.push("/login");
      } else {
        console.log("✅ [LOGOUT] Successfully redirected to /login");
      }
    }, 100);
  };

  const handleClearCache = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log("Clear cache button clicked");
    if (confirm("Are you sure you want to clear all cached data? This will log you out.")) {
      console.log("Clearing cache...");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <Heading level={1}>Settings</Heading>

          <div className="space-y-6 max-w-2xl">
          {user && (
            <Card className="p-6 bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#00ff88]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                  <p className="text-[#a3a3a3] text-sm">{user.email}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 bg-[#1a1a1a] border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4 text-white">Account</h2>
            <div className="space-y-3">
              <button
                onClick={(e) => {
                  console.log("🔴 [BUTTON] onClick event fired directly");
                  handleLogout(e);
                }}
                onMouseDown={(e) => {
                  console.log("🔴 [BUTTON] onMouseDown event fired");
                }}
                disabled={logoutMutation.isPending}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-base bg-gradient-to-r from-red-primary to-red-hover hover:from-red-hover hover:to-red-primary text-text-primary shadow-lg hover:shadow-xl hover:shadow-red-primary/50 px-4 py-2 text-base font-semibold"
                style={{ 
                  cursor: logoutMutation.isPending ? 'not-allowed' : 'pointer',
                  pointerEvents: logoutMutation.isPending ? 'none' : 'auto',
                  zIndex: 10,
                  position: 'relative'
                }}
                aria-label="Logout"
              >
                {logoutMutation.isPending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </button>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4 text-white">Data</h2>
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearCache(e);
                }}
                icon={<Trash2 className="w-4 h-4" />}
                fullWidth
                type="button"
              >
                Clear Cache & Logout
              </Button>
              <p className="text-xs text-[#737373] mt-2">
                This will clear all cached data including your session. You'll need to log in again.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4 text-white">About</h2>
            <div className="space-y-2 text-[#a3a3a3] text-sm">
              <p>Portfolio Tracker v1.0.0</p>
              <p>Built with Next.js, React Query, and TradingView Charts</p>
            </div>
          </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

