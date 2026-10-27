"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCategory() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; 

    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/categories/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name); 
                }
            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }) 
            });

            if (response.ok) {
                setTimeout(() => {
                    router.push('/categories'); 
                }, 120);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-slate-50">Loading data...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-900">Edit Category</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/categories')}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-2xl mx-auto w-full mt-8">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                    New Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
