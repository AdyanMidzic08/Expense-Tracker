'use client';

import { useEffect, useState } from 'react';
import { Payment } from '@/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all payments from the backend API on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/payments')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load payments from the server.');
        }
        return response.json();
      })
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle payment deletion
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/payments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the payment.');
      }

      // Remove the deleted payment from local state to update the UI instantly
      setPayments(payments.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting.');
    }
  };

  // Handle payment editing redirection
  const handleEdit = (id: number) => {
    window.location.href = `/payments/edit/${id}`;
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">All Payments</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all flex items-center gap-2"
            >
              {/* Home / Arrow Left SVG Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </a>
            <a
              href="/payments/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              + New Invoice
            </a>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl w-full mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Payment History</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage and view all registered invoices and transactions.</p>
              </div>
            </div>

            {/* Loading state */}
            {loading && <div className="p-8 text-center text-slate-500 text-sm">Loading all payments...</div>}

            {/* Error state */}
            {error && <div className="p-8 text-center text-rose-600 text-sm font-medium">Error: {error}</div>}

            {/* Payments Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-6">Invoice ID</th>
                      <th className="py-3 px-6">Client</th>
                      <th className="py-3 px-6">Amount</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No payments found. Create your first invoice!
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-medium text-slate-900">#{payment.invoice_id}</td>
                          <td className="py-4 px-6 text-slate-600">{payment.client}</td>
                          <td className="py-4 px-6 text-slate-900 font-medium">${Number(payment.amount).toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : payment.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit Button with SVG Icon */}
                              <button
                                onClick={() => handleEdit(payment.id)}
                                title="Edit Payment"
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487zm0 0L19.5 7.125"
                                  />
                                </svg>
                              </button>

                              {/* Delete Button with SVG Icon */}
                              <button
                                onClick={() => handleDelete(payment.id)}
                                title="Delete Payment"
                                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
