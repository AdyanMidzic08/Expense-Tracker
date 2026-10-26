// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar (links) - justify-between sorgt dafür, dass das Ende ganz unten sitzt */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen p-4 justify-between shrink-0">
        <div>
          {/* Logo / Titel */}
          <div className="flex items-center justify-between mb-8 px-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Test's</h2>
                <h1 className="text-lg font-extrabold text-slate-900">Payments</h1>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Dashboard Link */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === "/"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Dashboard
            </Link>

            {/* Payments Link */}
            <Link
              href="/payments"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith("/payments")
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Payments
            </Link>

            {/* Categories Link */}
            <Link
              href="/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith("/categories")
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Categories
            </Link>

            {/* Diagramm Link */}
            <Link
              href="/diagrams"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith("/diagrams")
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Diagramm
            </Link>
          </nav>
        </div>

        {/* Unten: Workspace Test’s & Platzhalter für Login */}
        <div className="px-4 py-3 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
              T
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">Workspace Test’s</p>
              <p className="text-[10px] text-slate-400">Login coming soon...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area (rechts) */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
