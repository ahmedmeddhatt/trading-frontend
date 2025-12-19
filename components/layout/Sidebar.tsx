// src/components/layout/Sidebar.tsx
import React from "react";
import Link from "next/link";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen">
      <h2 className="font-bold text-xl mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/positions">Positions</Link>
        </li>
        <li>
          <Link href="/analytics">Analytics</Link>
        </li>
        <li>
          <Link href="/companies">Companies</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </aside>
  );
};
