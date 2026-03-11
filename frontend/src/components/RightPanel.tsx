import { useState, useEffect } from 'react';

export default function RightPanel() {
    const [suggested, setSuggested] = useState<any[]>([]);
    const [trendingCrafts, setTrendingCrafts] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch a larger subset to get varied crafts, but we'll slice for suggestions
                const response = await fetch('http://localhost:5000/api/artisans?limit=10');
                const data = await response.json();

                if (data && data.length > 0) {
                    // For suggestions, just take a few. If we only have 1 (the seed), show it.
                    // If we have many, skip the first one assuming they are the current user.
                    const startIndex = data.length > 1 ? 1 : 0;
                    const profiles = data.slice(startIndex, startIndex + 3).map((artisan: any) => ({
                        id: artisan._id,
                        name: artisan.name,
                        craft: artisan.craft,
                        img: artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=100&auto=format&fit=crop"
                    }));
                    setSuggested(profiles);

                    // Extract unique crafts for the Trending Crafts section
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
        <div className="hidden lg:block w-80 sticky top-0 h-screen overflow-y-auto px-6 py-8">
            {/* Suggested Artisans */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Suggested Artisans</h2>
                    <button className="text-xs font-bold text-stone-900 hover:text-karigar-primary">See All</button>
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
            <div className="mb-10">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Trending Crafts</h2>

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

            <div className="text-xs text-stone-400 mt-auto pt-8 border-t border-stone-200">
                <p>&copy; 2026 KarigarAI. All rights reserved.</p>
                <div className="flex gap-2 mt-2">
                    <a href="#" className="hover:text-karigar-primary">About</a>
                    <span>&middot;</span>
                    <a href="#" className="hover:text-karigar-primary">Help</a>
                    <span>&middot;</span>
                    <a href="#" className="hover:text-karigar-primary">Terms</a>
                </div>
            </div>
        </div>
    );
}

function SuggestedProfile({ name, craft, img }: { name: string, craft: string, img: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer">
                <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover border border-stone-200" />
                <div>
                    <h4 className="font-bold text-sm text-stone-900 hover:underline">{name}</h4>
                    <p className="text-xs text-stone-500">{craft}</p>
                </div>
            </div>
            <button className="text-xs font-bold text-karigar-primary hover:text-karigar-accent transition-colors">Follow</button>
        </div>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <button className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-700 hover:border-karigar-primary hover:text-karigar-primary transition-colors focus:outline-none focus:ring-1 focus:ring-karigar-primary">
            {label}
        </button>
    );
}
