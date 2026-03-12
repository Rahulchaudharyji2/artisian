"use client";

import { useState, useEffect } from 'react';

export default function RightPanel() {
    const [suggested, setSuggested] = useState<any[]>([]);
    const [trendingCrafts, setTrendingCrafts] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/artisans?limit=10');
                const data = await response.json();

                if (data && data.length > 0) {
                    const startIndex = data.length > 1 ? 1 : 0;
                    const profiles = data.slice(startIndex, startIndex + 3).map((artisan: any) => ({
                        id: artisan._id,
                        name: artisan.name,
                        craft: artisan.craft,
                        img: artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=100&auto=format&fit=crop"
                    }));
                    setSuggested(profiles);

                    const allCrafts = data.map((artisan: any) => artisan.craft).filter(Boolean);
                    const uniqueCrafts = Array.from(new Set(allCrafts)).slice(0, 6) as string[];
                    setTrendingCrafts(uniqueCrafts);
                }
            } catch (error) {
                console.error("Failed to fetch right panel data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="hidden lg:block w-80 sticky top-0 h-screen overflow-y-auto px-8 py-10 bg-stone-50/50 backdrop-blur-md border-l border-stone-200">
            {/* Suggested Artisans */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest">Suggested Artisans</h2>
                    <button className="text-xs font-bold text-stone-900 hover:text-qala-terracotta transition-colors">See All</button>
                </div>

                <div className="space-y-4">
                    {suggested.length > 0 ? (
                        suggested.map(profile => (
                            <SuggestedProfile key={profile.id} name={profile.name} craft={profile.craft} img={profile.img} />
                        ))
                    ) : (
                        <p className="text-xs text-stone-500">More artisans coming soon!</p>
                    )}
                </div>
            </div>

            {/* Trending Crafts */}
            <div className="mb-12">
                <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">Trending Crafts</h2>

                <div className="flex flex-wrap gap-2">
                    {trendingCrafts.length > 0 ? (
                        trendingCrafts.map((craft, i) => (
                            <Tag key={i} label={craft} />
                        ))
                    ) : (
                        <p className="text-xs text-stone-500">Crafts will appear here soon.</p>
                    )}
                </div>
            </div>

            <div className="text-xs text-stone-400 mt-auto pt-8 border-t border-stone-200/60">
                <p>&copy; 2026 Qala Inc. All rights reserved.</p>
                <div className="flex gap-3 mt-3 font-medium">
                    <a href="#" className="hover:text-stone-700 transition-colors">About</a>
                    <span>&middot;</span>
                    <a href="#" className="hover:text-stone-700 transition-colors">Help</a>
                    <span>&middot;</span>
                    <a href="#" className="hover:text-stone-700 transition-colors">Terms</a>
                </div>
            </div>
        </div>
    );
}

function SuggestedProfile({ name, craft, img }: { name: string, craft: string, img: string }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                    <div className="absolute inset-0 bg-qala-gold/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src={img} alt={name} className="relative w-10 h-10 rounded-full object-cover border border-stone-200 group-hover:border-qala-gold/30 transition-colors" />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-qala-terracotta transition-colors">{name}</h4>
                    <p className="text-xs text-stone-500 font-medium">{craft}</p>
                </div>
            </div>
            <button className="text-xs font-bold text-qala-gold hover:text-qala-saffron transition-colors">Follow</button>
        </div>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <button className="px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold text-stone-600 hover:border-qala-gold hover:text-qala-gold hover:shadow-sm hover:-translate-y-0.5 transition-all focus:outline-none">
            {label}
        </button>
    );
}
