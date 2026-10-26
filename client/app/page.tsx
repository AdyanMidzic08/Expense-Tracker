'use client';
import { Category } from "@/types";
import { useEffect, useState } from "react";

export interface Payment {
  id: number;
  invoice_id: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
  category_id?: number;
  created_at?: string;
}

export default function Home() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch payments on mount
    useEffect(() => {
      fetch("http://localhost:3001/api/payments")
        .then((response) => {
          if(!response.ok){
              throw new Error("Failed to load payments");
          }
          return response.json();
        })  
        .then((data) => {
          setPayments(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, []);

    // Fetch categories on mount
    useEffect(() => {
      fetch('http://localhost:3001/api/categories')
      .then((response) => {
          if(!response.ok) {
            throw new Error("Failed to load categories")
          }
          return response.json();
      })
      .then((data) => {
          setCategories(data);
          setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    }, []);

  function loadRecentPaymentsFromDatabase() {
      if(loading) {
        return <div className="p-6 text-slate-500">Loading payments...</div>;
      }

      if(error) {
        return <div className="p-6 text-rose-600">Error: {error}</div>;
      }

      const displayedPayments = payments.slice(0, 3);
      const hasMore = payments.length > 3;

      return (
        <div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200"><th className="py-3 px-6">Category</th><th className="py-3 px-6">Client</th><th className="py-3 px-6">Amount</th><th className="py-3 px-6">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedPayments.map((payment: any) => {
                const matchedCategory = categories.find(cat => cat.id === payment.category_id);

                return (
                  <tr key={payment.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {matchedCategory ? matchedCategory.name : 'Allgemein'}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{payment.client}</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">${payment.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                        payment.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {hasMore && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-between px-6">
              <span>Showing 3 of {payments.length} recent invoices.</span>
              <a href="/payments" className="font-medium text-indigo-600 hover:text-indigo-700">
                View all payments &rarr;
              </a>
            </div>
          )}
        </div>
      );
  }

  function getTotalRevenue() {
    let totalRevenue = 0;
    payments.forEach(payment => {
      if (payment.status === 'Paid') {
        totalRevenue += Number(payment.amount);
      }
    });
    return <p className="text-3xl font-bold text-slate-900 mt-2">{totalRevenue.toFixed(2)}</p>;
  }

  function getTotalPendingInvoices() {
    let countOfInvoices = 0;
    payments.forEach(payment => {
      if(payment.status === 'Pending') {
        countOfInvoices++;
      }
    });
    return <p className="text-3xl font-bold text-slate-900 mt-2">{countOfInvoices}</p>;
  }

  function getTotalCategories() {
    return (
      <p className="text-3xl font-bold text-slate-900 mt-2">{categories.length}</p>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <a href="/payments/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
            + New Invoice
          </a>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            {getTotalRevenue()}
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-3">+12% this month</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Pending Invoices</p>
            {getTotalPendingInvoices()} 
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-3">Due soon</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Categories</p>
            {getTotalCategories()}
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-3">Maintained</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 text-base">Recent Invoices</h2>
            <a href="/payments" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</a>
          </div>
          <div className="overflow-x-auto">
              {loadRecentPaymentsFromDatabase()}
          </div>
        </div>
      </div>
    </div>
  );
}
