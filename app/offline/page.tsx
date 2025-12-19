// Offline fallback page
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const { isOnline } = useNetworkStatus();
  const router = useRouter();

  useEffect(() => {
    if (isOnline) {
      router.push("/dashboard");
    }
  }, [isOnline, router]);

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full p-8 text-center">
            <WifiOff className="w-16 h-16 text-[#ff4444] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-white">You're Offline</h1>
            <p className="text-[#a3a3a3] mb-6">
              Please check your internet connection and try again.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Retry
            </Button>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}



