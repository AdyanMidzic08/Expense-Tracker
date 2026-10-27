"use client"
import { Category } from "@/types";
import { requestToBodyStream } from "next/dist/server/body-streams";
import { use, useEffect, useState } from "react";

export default function categories() {

        const [categories, setCategories] = useState<Category[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/categories')
        .then((response) => {
            if(!response.ok) {
                throw new Error("Failed to load Categories from the server"
                )
            }
            return response.json();
        })
        .then((data) => {
            setCategories(data)
        })
        .catch((err) => {
            console.error(err);
        })
    })

    return (
        <>
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold text-slate-900">All Categories</h1>
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
                    href="/categories/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                    >
                    + New Category
                    </a>
                </div>
                </header>

                 <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-6">ID</th>
                      <th className="py-3 px-6">name</th>
                      <th className="py-3 px-6">created at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No categories found. Create your first invoice!
                        </td>
                      </tr>
                    ) : (
                      categories.map((categorie) => (
                        <tr key={categorie.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-medium text-slate-900">{categorie.id}</td>
                          <td className="py-4 px-6 text-slate-600">{categorie.name}</td>
                          <td className="py-4 px-6">
                              {new Date(categorie.created_at).toLocaleDateString('de-AT', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">

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

            </main>
        </div>
        </>
    );
}