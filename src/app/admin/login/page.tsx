"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Is the backend running?');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-50 min-h-screen w-full">
            <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-stone-100 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-stone-900">Admin Login</h1>
                    <p className="text-stone-500">Secure access for Qala administrators.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold text-stone-900"
                            placeholder="admin@kala-ai.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold text-stone-900"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-black transition-colors"
                    >
                        Sign In
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full p-2 bg-transparent text-stone-500 rounded-2xl font-bold hover:text-stone-700 transition-colors mt-2 text-sm"
                    >
                        Back to Site
                    </button>
                </form>
            </div>
        </div>
    );
}
