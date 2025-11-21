// src/components/layout/Navbar.tsx
import Link from "next/link";

// layout/Navbar.tsx
export const Navbar = () => {
  return (
    <nav className="glass px-6 py-4 flex justify-between items-center shadow-xl border-b border-gray-700">
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Trading Dashboard
      </h1>

      <div className="space-x-6 text-lg">
        <Link className="hover:text-green-400" href="/dashboard">Home</Link>
        <Link className="hover:text-green-400" href="/positions">Positions</Link>
        <Link className="hover:text-green-400" href="/analytics">Analytics</Link>
        <Link className="hover:text-green-400" href="/companies">Companies</Link>
      </div>
    </nav>
  );
};

