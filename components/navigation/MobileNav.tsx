// Mobile-first bottom navigation
// Version: 2.0.0 - HMR fix
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/positions", label: "Positions", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: TrendingUp },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  // Don't show on login page
  if (pathname === "/login" || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1030] bg-dark-elevated border-t border-dark-border md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 md:h-20 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors duration-normal",
                isActive ? "text-green-primary" : "text-text-tertiary"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

