"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function StoryBar() {
    const { user } = useAuth();
    const [stories, setStories] = useState<any[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('/api/artisans?limit=12');
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    const formattedStories = data.map((artisan: any) => ({
                        id: artisan._id,
                        name: artisan.name.split(' ')[0], 
                        craft: artisan.craft,
                        image: artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=200&auto=format&fit=crop"
                    }));
                    setStories(formattedStories);
                }
            } catch (error) {
                console.error("Failed to fetch story artisans:", error);
            }
        };

        fetchStories();
    }, []);

    return (
        <div className="w-full bg-white md:bg-transparent overflow-x-auto border-b border-stone-200 md:border-none flex items-center gap-4 py-4 px-4 scrollbar-hide">
            {user?.role === 'artisan' && (
                <div className="flex flex-col items-center gap-1 cursor-pointer min-w-max">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-2 border-stone-200 relative group hover:border-qala-gold transition-colors">
                        <span className="text-2xl text-stone-400 group-hover:text-qala-gold transition-colors">+</span>
                    </div>
                    <span className="text-xs font-medium text-stone-700 mt-1">Your Story</span>
                </div>
            )}

            {stories.map(story => (
                <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer min-w-max">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-karigar-accent to-karigar-primary">
                        <img
                            src={story.image}
                            alt={story.name}
                            className="w-full h-full object-cover rounded-full border-2 border-white"
                        />
                    </div>
                    <span className="text-xs font-medium text-stone-800 tracking-tight">{story.name}</span>
                </div>
            ))}
        </div>
    );
}
