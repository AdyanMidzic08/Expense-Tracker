'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Category } from '@/types';
import { Payment } from '../page';

const COLORS = [
  '#4f46e5',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

export default function DiagramsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/payments').then((res) => {
        if (!res.ok) throw new Error('Failed to load payments');
        return res.json();
      }),
      fetch('http://localhost:3001/api/categories').then((res) => {
        if (!res.ok) throw new Error('Failed to load categories');
        return res.json();
      }),
    ])
      .then(([paymentData, categoryData]) => {
        setPayments(paymentData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-8 text-slate-500">Loading chart data...</div>;
  if (error) return <div className="p-8 text-rose-600">Error: {error}</div>;

  // Process data: Calculate total amount per category
  const categoryDataMap: { [key: string]: number } = {};

  payments.forEach((payment) => {
    const matchedCategory = categories.find(
      (cat) => cat.id === payment.category_id
    );
    const categoryName = matchedCategory ? matchedCategory.name : 'General';

    if (!categoryDataMap[categoryName]) {
      categoryDataMap[categoryName] = 0;
    }
    categoryDataMap[categoryName] += Number(payment.amount);
  });

  const chartData = Object.keys(categoryDataMap).map((name) => ({
    name: name,
    amount: categoryDataMap[name],
  }));

  return (
    <div className="flex flex-col w-full">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">
          Financial Analytics
        </h1>
      </header>

      <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Expenses by Category */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 text-base mb-6">
              Expenses by Category (Bar Chart)
            </h2>
            <div style={{ width: '100%', height: '320px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart: Category Share */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 text-base mb-6">
              Category Distribution (Share)
            </h2>
            <div style={{ width: '100%', height: '320px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
