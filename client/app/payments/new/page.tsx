'use client';

import { Category} from '@/types';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { METHODS } from 'node:http';

export default function NewPayment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoice_id: '',
    client: '',
    amount: '',
    status: 'Pending',
    category: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // States for backend submission handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setLoadingCategories(false);
      });

    fetch('http://localhost:3001/api/payments')
      .then((res) => res.json())
      .then((payments) => {
        const year = new Date().getFullYear();
        
        if (payments && payments.length > 0) {
          let maxNum = 0;
          payments.forEach((p: any) => {
            const parts = p.invoice_id.split('-');
            const lastPart = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(lastPart) && lastPart > maxNum) {
              maxNum = lastPart;
            }
          });

          const nextNumString = String(maxNum + 1).padStart(3, '0');
          setFormData((prev) => ({ ...prev, invoice_id: `INV-${year}-${nextNumString}` }));
        } else {
          setFormData((prev) => ({ ...prev, invoice_id: `INV-${year}-001` }));
        }
      })
      .catch((err) => {
        console.error("Error generating invoice ID:", err);

        setFormData((prev) => ({ ...prev, invoice_id: `INV-2026-001` }));
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(false);

    try {
      const response = await fetch(`http://localhost:3001/api/payments`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              invoice_id: formData.invoice_id,
              client: formData.client,
              amount: parseFloat(formData.amount),
              status: formData.status,
              category_id: formData.category ? Number(formData.category) : null, // Hier angepasst
          }),
      });

        if (!response.ok) {
            throw new Error('Failed to save the payment to the database.');
        }
        setSuccessMessage(true);
        
        setTimeout(() => {
            router.push('/');
        },120);

    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(false);

        try {
        const response = await fetch(`http://localhost:3001/api/payments`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                invoice_id: formData.invoice_id,
                client: formData.client,
                amount: parseFloat(formData.amount),
                status: formData.status,
                // category: formData.category // Uncomment if your payments table supports category_id
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete the payment from the database.');
        }
        setSuccessMessage(true);
        
        setTimeout(() => {
            router.push('/');
        },1200);

    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900">New Invoice</h1>
          <a href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            &larr; Back to Dashboard
          </a>
        </header>

        <div className="p-8 max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Create New Payment Record</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Invoice ID (Auto-Generated)
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={formData.invoice_id}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-sm cursor-not-allowed"
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <a
                  href="/"
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                >
                  Cancel
                </a>
            
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                {isSubmitting ? 'Saving...' : 'Save Payment'}
            </button>

              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
