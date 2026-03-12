"use client";

import { useState, useEffect, useRef } from 'react';
import { 
    Heart, MessageCircle, Share2, ShoppingBag, 
    Music, ArrowLeft, Sparkles, 
    VolumeX, Volume2, Clapperboard, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface ReelPost {
    _id: string;
    artisanId: { _id: string; name: string; image: string } | string;
    images: string[];
    craftName: string;
    title: string;
    description: string;
    story: string;
    price: number;
    likes: number;
    reelScript?: string;
}

export default function ReelsPage() {
    const [reels, setReels] = useState<ReelPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [muted, setMuted] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => { fetchReels(); }, []);

    const fetchReels = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            const posts = (data.posts || []).sort(() => Math.random() - 0.5);
            setReels(posts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const idx = Math.round(containerRef.current.scrollTop / window.innerHeight);
        setActiveIdx(idx);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="animate-spin text-qala-gold" size={48} />
                    <span className="font-black tracking-widest uppercase text-xs">Curating Qala Reels...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 relative">
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-xl font-black tracking-tighter">Reels</h1>
                    </div>
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button onClick={() => setMuted(m => !m)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                        </button>
                        {user?.role === 'artisan' && (
                            <button
                                onClick={() => router.push('/create-post')}
                                className="bg-white text-black px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 hover:bg-qala-gold hover:text-white transition-colors"
                            >
                                <Plus size={14} /> CREATE
                            </button>
                        )}
                    </div>
                </div>

                {/* Scroll Feed */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar"
                    style={{ scrollSnapType: 'y mandatory' }}
                >
                    {reels.length > 0 ? reels.map((reel, idx) => (
                        <ReelCard
                            key={reel._id + idx}
                            reel={reel}
                            isActive={idx === activeIdx}
                        />
                    )) : (
                        <div className="h-screen flex flex-col items-center justify-center gap-6 text-center px-10">
                            <div className="w-24 h-24 bg-stone-900 rounded-[32px] flex items-center justify-center">
                                <Clapperboard size={48} className="text-stone-700" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">No Reels Yet</h2>
                            <p className="text-stone-500 font-medium">Artisans haven't created reels yet. Check back soon!</p>
                            {user?.role === 'artisan' && (
                                <button
                                    onClick={() => router.push('/create-post')}
                                    className="bg-qala-gold text-white px-8 py-4 rounded-2xl font-black mt-4 hover:bg-yellow-600 transition-colors"
                                >
                                    Create First Reel
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:hidden">
                    <BottomNav />
                </div>
            </main>
        </div>
    );
}

function ReelCard({ reel, isActive }: { reel: ReelPost; isActive: boolean }) {
    const { addToCart, isInCart } = useCart();
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reel.likes || 0);

    // Resolve artisan details from populated or raw id
    const artisanObj = typeof reel.artisanId === 'object' && reel.artisanId !== null
        ? reel.artisanId
        : { _id: String(reel.artisanId), name: 'Artisan', image: '' };

    const inCart = isInCart(reel._id);

    const handleAddToCart = () => {
        addToCart({
            postId: reel._id,
            title: reel.title,
            artisanName: artisanObj.name,
            imageUrl: reel.images[0] || '',
            price: reel.price || 0,
            craftName: reel.craftName || 'Handmade',
        });
    };

    return (
        <div
            className="h-screen w-full relative flex items-end overflow-hidden"
            style={{ scrollSnapAlign: 'start' }}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={reel.images[0]}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            </div>

            {/* AI Script Overlay (center) */}
            {isActive && reel.reelScript && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none px-8"
                >
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-[28px] max-w-sm text-center">
                        <Sparkles className="text-qala-gold mx-auto mb-3" size={28} />
                        <p className="text-base font-black italic leading-snug">"{reel.reelScript}"</p>
                    </div>
                </motion.div>
            )}

            {/* Bottom Content */}
            <div className="relative z-10 w-full pb-28 md:pb-12 px-4 flex items-end justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                    <div
                        onClick={() => router.push(`/artisan/${artisanObj._id}`)}
                        className="flex items-center gap-3 mb-3 cursor-pointer group w-fit"
                    >
                        <div className="w-10 h-10 rounded-full border-2 border-qala-gold overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            <img
                                src={artisanObj.image || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80&q=80'}
                                alt={artisanObj.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="font-black tracking-tight text-sm drop-shadow-md">{artisanObj.name}</span>
                    </div>

                    <h3 className="font-black text-lg leading-tight drop-shadow-lg mb-1 truncate">{reel.title}</h3>
                    <p className="text-stone-300 text-sm line-clamp-2 font-medium mb-3">{reel.description}</p>

                    {reel.craftName && (
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                            <Music size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{reel.craftName} · Heritage</span>
                        </div>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-5 items-center shrink-0">
                    <button onClick={() => { setLiked(p => !p); setLikesCount(p => liked ? p - 1 : p + 1); }}
                        className="flex flex-col items-center gap-1 group">
                        <div className={`p-3 rounded-full transition-all ${liked ? 'bg-rose-500' : 'bg-white/10 group-hover:bg-rose-500/30'}`}>
                            <Heart size={22} fill={liked ? 'white' : 'none'} className="text-white" />
                        </div>
                        <span className="text-xs font-black">{likesCount}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1">
                        <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                            <MessageCircle size={22} />
                        </div>
                        <span className="text-xs font-black">0</span>
                    </button>

                    <button className="flex flex-col items-center gap-1">
                        <div className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                            <Share2 size={22} />
                        </div>
                        <span className="text-xs font-black">Share</span>
                    </button>

                    <button
                        onClick={handleAddToCart}
                        className={`flex flex-col items-center gap-1 group transition-all`}
                    >
                        <div className={`p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${inCart ? 'bg-emerald-500' : 'bg-qala-gold'}`}>
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${inCart ? 'text-emerald-400' : 'text-qala-gold'}`}>
                            {inCart ? 'Added' : 'Buy'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
