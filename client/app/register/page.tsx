"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Nach erfolgreicher Registrierung direkt zur Login-Seite weiterleiten
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50 font-sans text-slate-800">
            <div className="w-full max-w-md p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
                
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign up for your Expense Tracker account</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 font-medium hover:underline">
                        Sign in here
                    </Link>
                </div>

            </div>
        </div>
    );
}
    