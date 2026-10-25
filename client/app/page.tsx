export default function Home() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              .
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900">Test's Payments</span>
          </div>

          <nav className="space-y-1.5">
            <a href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-medium text-sm transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              Dashboard
            </a>
            <a href="/payments" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Payments
            </a>
            <a href="/categories" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              Categories
            </a>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600 text-sm">
            AM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">Adyan Midzic</p>
            <p className="text-xs text-slate-500 truncate">Workspace</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/payments/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
              + New Invoice
            </a>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">$12,450.00</p>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-3">+12% this month</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Pending Invoices</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-3">Due soon</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Active Categories</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-3">Maintained</span>
            </div>
          </div>

          {/* Recent Activity / Table Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-base">Recent Invoices</h2>
              <a href="/invoices" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-6">Invoice ID</th>
                    <th className="py-3 px-6">Client</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">#INV-2026-001</td>
                    <td className="py-4 px-6 text-slate-600">TechCorp GmbH</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">$1,250.00</td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Paid</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">#INV-2026-002</td>
                    <td className="py-4 px-6 text-slate-600">Design Studio Linz</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">$840.00</td>
                    <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
