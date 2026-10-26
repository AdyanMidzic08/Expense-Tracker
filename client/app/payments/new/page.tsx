'use client';

import { useState } from 'react';

export default function NewPayment() {
  const [formData, setFormData] = useState({
    invoice_id: '',
    client: '',
    amount: '',
    status: 'Pending',
    category: '',
  });

  const categories = [
    { id: '1', name: 'Food & Dining' },
    { id: '2', name: 'Rent & Housing' },
    { id: '3', name: 'Utilities & Internet' },
    { id: '4', name: 'Transport & Mobility' },
    { id: '5', name: 'Entertainment & Gaming' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data captured (Frontend only):', formData);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Sidebar (gleiches Design wie Homepage) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              .
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900">Test's Payments</span>
          </div>

          <nav className="space-y-1.5">
            <a href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors">
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
          <h1 className="text-xl font-bold text-slate-900">New Invoice</h1>
          <a href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            &larr; Back to Dashboard
          </a>
        </header>

        {/* Form Content */}
        <div className="p-8 max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Create New Payment Record</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Invoice ID & Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Invoice ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1001"
                    value={formData.invoice_id}
                    onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Amount & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Category selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <a
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all"
                >
                  Save Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

    </div>
  );
}
