"use client";

import { useState } from "react";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-all duration-300 relative z-20`}
      >
        <div>
          {/* Logo & Toggle Button */}
          <div className="flex items-center justify-between mb-10 px-2">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
                  .
                </div>
                <span className="font-semibold text-lg tracking-tight text-slate-900">
                  Test's Payments
                </span>
              </div>
            )}
            
            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors mx-auto"
              title="Toggle Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <a
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!isCollapsed && <span>Dashboard</span>}
            </a>

            <a
              href="/payments"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!isCollapsed && <span>Payments</span>}
            </a>

            <a
              href="/categories"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
            >
              <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {!isCollapsed && <span>Categories</span>}
            </a>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 min-w-[36px] rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600 text-sm">
            AM
          </div>
rising          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">Test's</p>
              <p className="text-xs text-slate-500 truncate">Workspace</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
