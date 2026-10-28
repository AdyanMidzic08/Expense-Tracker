"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Workspace");

  useEffect(() => {
    // Wenn wir auf /login oder /register sind, müssen wir den Token-Check gar nicht machen
    if (pathname === "/login" || pathname === "/register") {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const email = localStorage.getItem("userEmail");
    if (email) {
      const namePart = email.split("@")[0];
      const formatted = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      queueMicrotask(() => {
        setUserName(formatted);
      });
    }
  }, [pathname, router]);

  // 2. Abmelden-Funktion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  // 3. ERST NACH ALLEN HOOKS darf die Bedingung zum Ausblenden kommen!
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar (links) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen p-4 justify-between shrink-0">
        <div>
          {/* Logo / Titel */}
          <div className="flex items-center justify-between mb-8 px-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-slate-900 truncate">{userName}&apos;s</h2>
                <h1 className="text-lg font-extrabold text-slate-900">Payments</h1>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
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

        {/* Unten: Workspace & Abmelden-Button */}
        <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400">Eingeloggt</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-1 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content Area (rechts) */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
