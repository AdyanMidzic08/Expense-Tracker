'use client';

import { Payment } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuthHeaders } from '@/lib/api';

export default function EditPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Holt die ID aus der URL (/payments/edit/[id])

  const [formData, setFormData] = useState({
    invoice_id: '',
    client: '',
    amount: '',
    status: 'Pending',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Zahlungsdaten beim Laden der Seite abrufen
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/api/payments/${id}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Fehler beim Laden der Zahlungsdaten.');
        return res.json();
      })
      .then((payment: Payment) => {
        setFormData({
          invoice_id: payment.invoice_id,
          client: payment.client,
          amount: payment.amount.toString(),
          status: payment.status,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  // Formular absenden (Änderungen speichern)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`http://localhost:3001/api/payments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          client: formData.client,
          amount: parseFloat(formData.amount),
          status: formData.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der Zahlung.');
      }

      // Nach erfolgreichem Speichern zurück zur Payments-Übersicht
      router.push('/payments');
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Ein unerwarteter Fehler ist aufgetreten.'
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Lade Zahlungsdetails...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">
          Rechnung bearbeiten #{formData.invoice_id}
        </h1>
        <a
          href="/payments"
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
        >
          &larr; Zurück zu Payments
        </a>
      </header>

      {/* Form Content */}
      <div className="p-8 max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Zahlungsdaten anpassen
          </h2>

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Invoice ID (Gesperrt)
              </label>
              <input
                type="text"
                disabled
                value={formData.invoice_id}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Client Name
              </label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <a
                href="/payments"
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
              >
                Abbrechen
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
