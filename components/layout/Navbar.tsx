// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { BackendStatus } from "../ui/BackendStatus";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/api/useAuth";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Shield,
  ChevronDown,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export const Navbar = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAnalyticsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const analyticsMenuItems = [
    { href: "/analytics", label: "Analytics Hub", icon: BarChart3 },
    { href: "/analytics/performance", label: "Performance", icon: TrendingUp },
    { href: "/analytics/transactions", label: "Transactions", icon: Activity },
    { href: "/analytics/allocation", label: "Allocation", icon: PieChart },
    {
      href: "/analytics/companies/compare",
      label: "Company Comparison",
      icon: LineChart,
    },
    { href: "/analytics/timeline", label: "Timeline", icon: Activity },
    { href: "/analytics/positions", label: "Positions", icon: Target },
    { href: "/analytics/risk", label: "Risk Analysis", icon: Shield },
  ];

  const isAnalyticsActive = pathname?.startsWith("/analytics");

  return (
    <nav
      className={cn(
        "glass px-4 md:px-8 py-4 md:py-5 flex justify-between items-center shadow-xl border-b border-dark-border",
        "sticky top-0 z-[1020]", // Sticky navbar
        "hidden md:flex" // Hide on mobile, show on desktop
      )}
    >
      <Link href="/dashboard">
        <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-green-primary via-cyan-400 to-green-hover text-transparent bg-clip-text hover:from-cyan-400 hover:via-green-primary hover:to-cyan-400 transition-all duration-500">
          Trading Dashboard
        </h1>
      </Link>

      <div className="flex items-center space-x-4 md:space-x-6 text-base md:text-lg">
        <ThemeSwitcher />
        <Link
          className="text-text-secondary hover:text-green-primary transition-colors duration-normal"
          href="/dashboard"
        >
          Home
        </Link>
        <Link
          className="text-text-secondary hover:text-green-primary transition-colors duration-normal"
          href="/positions"
        >
          Positions
        </Link>
        <Link
          className="text-text-secondary hover:text-green-primary transition-colors duration-normal"
          href="/companies"
        >
          Companies
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setAnalyticsOpen(!analyticsOpen)}
            className={cn(
              "flex items-center gap-1 text-text-secondary hover:text-green-primary transition-colors duration-normal",
              isAnalyticsActive && "text-green-primary"
            )}
          >
            Analytics
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-normal",
                analyticsOpen && "rotate-180"
              )}
            />
          </button>

          {analyticsOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-dark-elevated border border-dark-border rounded-lg shadow-xl z-50 overflow-hidden">
              {analyticsMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAnalyticsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-dark-surface transition-colors duration-normal",
                      isActive &&
                        "bg-dark-surface border-l-2 border-green-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span
                      className={cn(
                        isActive && "text-green-primary font-semibold"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          className="text-text-secondary hover:text-green-primary transition-colors duration-normal"
          href="/logs"
        >
          Logs
        </Link>
        <Link
          className="text-text-secondary hover:text-green-primary transition-colors duration-normal"
          href="/settings"
        >
          Settings
        </Link>
        <BackendStatus />
      </div>
    </nav>
  );
};
