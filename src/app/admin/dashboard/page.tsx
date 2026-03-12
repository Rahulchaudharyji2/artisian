"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Users } from 'lucide-react';

interface Artisan {
    _id: string;
    name: string;
    region: string;
    craft: string;
    likes: number;
    createdAt: string;
}

export default function AdminDashboard() {
    const [artisans, setArtisans] = useState<Artisan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchArtisans = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                const response = await fetch('/api/admin/artisans', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setArtisans(data);
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin/login');
                } else {
                    setError('Failed to fetch artisans');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchArtisans();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    if (loading) return <div className="p-8 text-center text-stone-500">Loading dashbaord...</div>;

    return (
        <div className="flex-1 flex flex-col bg-stone-50 w-full min-h-screen">
            <header className="bg-white p-6 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between shadow-sm z-10 w-full max-w-full">
                <div className="flex items-center gap-3">
                    <Users className="text-qala-gold" size={28} />
                    <h1 className="text-2xl font-black text-stone-900">Admin Dashboard</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="flex-1 p-6 overflow-x-auto w-full max-w-full">
                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden w-full max-w-full">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="p-4 font-bold text-stone-600">Name</th>
                                    <th className="p-4 font-bold text-stone-600">Region</th>
                                    <th className="p-4 font-bold text-stone-600">Craft</th>
                                    <th className="p-4 font-bold text-stone-600">Likes</th>
                                    <th className="p-4 font-bold text-stone-600">Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artisans.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-stone-500">
                                            No artisans registered yet.
                                        </td>
                                    </tr>
                                ) : (
                                    artisans.map(artisan => (
                                        <tr key={artisan._id} className="border-b border-stone-100 hover:bg-stone-50">
                                            <td className="p-4 font-medium text-stone-900">{artisan.name}</td>
                                            <td className="p-4 text-stone-600">{artisan.region || 'N/A'}</td>
                                            <td className="p-4 text-stone-600">{artisan.craft || 'N/A'}</td>
                                            <td className="p-4 text-stone-600">{artisan.likes || 0}</td>
                                            <td className="p-4 text-stone-600">
                                                {new Date(artisan.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
