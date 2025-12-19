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
import { User, LogOut, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const router = useRouter();

  useEffect(() => {
    logger.page("Settings", {
      pathname: window.location.pathname,
    });
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear all cached data? This will log you out.")) {
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
              <Button
                variant="danger"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                loading={logoutMutation.isPending}
                icon={<LogOut className="w-4 h-4" />}
                fullWidth
              >
                Logout
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4 text-white">Data</h2>
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={handleClearCache}
                icon={<Trash2 className="w-4 h-4" />}
                fullWidth
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

