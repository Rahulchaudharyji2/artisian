"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Sparkles, User, Search, MapPin } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import StoryBar from '@/components/StoryBar';
import FeedCard from '@/components/FeedCard';
import RightPanel from '@/components/RightPanel';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Discover() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [feedPosts, setFeedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await fetch('/api/posts?limit=20');
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    const formattedPosts = data.map((post: any) => ({
                        id: post._id,
                        artisanId: post.artisanId?._id || post.artisanId,
                        artisanName: post.artisanId?.name || "Anonymous Artisan",
                        location: post.artisanId?.region || "India",
                        avatarUrl: post.artisanId?.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=100&auto=format&fit=crop",
                        mediaUrl: (post.images && post.images.length > 0) ? post.images[0] : "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop",
                        caption: post.description || post.title || '',
                        likes: post.likes?.toLocaleString() || "0",
                        comments: "0",
                        price: post.price || 0,
                        title: post.title || '',
                        craftName: post.craftName || 'Handmade Craft',
                    }));
                    setFeedPosts(formattedPosts);
                }
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeed();
    }, []);

    // Debounced search
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (searchTimer.current) clearTimeout(searchTimer.current);

        if (!q.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        searchTimer.current = setTimeout(async () => {
            setIsSearching(true);
            setShowDropdown(true);
            try {
                const res = await fetch(`/api/artisans/search?q=${encodeURIComponent(q)}&limit=8`);
                const data = await res.json();
                setSearchResults(Array.isArray(data) ? data : []);
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    }, []);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-qala-gold rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-medium animate-pulse">Curating your feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-screen bg-stone-50 selection:bg-qala-gold/30">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Center Content (Main Feed) */}
            <div className="flex-1 max-w-2xl mx-auto w-full pb-20 md:pb-0 border-r border-stone-200 min-h-screen overflow-x-hidden relative">

                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-md z-40 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push('/discover')}
                    >
                        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                            <Sparkles size={14} className="text-qala-gold z-10" />
                        </div>
                        <h1 className="text-xl font-black text-stone-900 tracking-tighter">
                            QALA <span className="text-qala-gold">.</span>
                        </h1>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-stone-700 hover:text-qala-gold transition-colors">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 z-50 md:hidden"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col pt-6 px-6"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-sm font-black text-stone-400 uppercase tracking-widest">Menu</h2>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-900 bg-stone-50 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {user?.role === 'artisan' && (
                                        <button
                                            onClick={() => { setIsMobileMenuOpen(false); router.push('/ai-tools'); }}
                                            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-stone-50 text-stone-900 font-bold border border-stone-100 hover:border-qala-gold transition-colors"
                                        >
                                            <Sparkles size={20} className="text-qala-gold" />
                                            <span className="text-xs uppercase tracking-widest">AI Photo Lab</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); router.push('/profile'); }}
                                        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-stone-600 font-bold hover:bg-stone-50 transition-colors"
                                    >
                                        <User size={20} />
                                        <span className="text-xs uppercase tracking-widest">Profile Settings</span>
                                    </button>
                                </div>
                                <div className="mt-auto mb-8 pt-6 border-t border-stone-100">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
                                        <LogOut size={20} />
                                        <span className="text-xs uppercase tracking-widest">Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <StoryBar />

                <div className="p-4 md:p-8 pt-6">
                    {/* ── SEARCH BAR ── */}
                    <div className="mb-6 relative" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Search size={18} className={`transition-colors ${searchQuery ? 'text-qala-gold' : 'text-stone-400'}`} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => searchQuery && setShowDropdown(true)}
                            placeholder="Search artisans, crafts, regions..."
                            className="w-full bg-white border border-stone-200 text-stone-900 text-sm rounded-2xl focus:ring-2 focus:ring-qala-gold focus:border-qala-gold focus:outline-none pl-11 pr-4 py-3.5 shadow-sm transition-all"
                        />

                        {/* Search Dropdown */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                                >
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-8 gap-3">
                                            <div className="w-4 h-4 border-2 border-stone-200 border-t-qala-gold rounded-full animate-spin" />
                                            <span className="text-stone-400 text-sm font-medium">Searching...</span>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="py-1.5">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 pt-2 pb-1.5">Artisans</p>
                                            {searchResults.map((artisan) => (
                                                <motion.button
                                                    key={artisan._id}
                                                    whileHover={{ backgroundColor: 'rgb(250 250 249)' }}
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        setSearchQuery('');
                                                        router.push(`/artisan/${artisan._id}`);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                                        <img
                                                            src={artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80"}
                                                            alt={artisan.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-stone-900 text-sm truncate">{artisan.name}</p>
                                                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                                            {(artisan.craft || artisan.art) && (
                                                                <span className="text-[11px] font-medium text-qala-gold">{artisan.craft || artisan.art}</span>
                                                            )}
                                                            {artisan.region && (
                                                                <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
                                                                    <MapPin size={9} /> {artisan.region}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-[11px] text-stone-400 font-medium">{artisan.followers?.length || 0} followers</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <p className="text-stone-400 text-sm font-medium">No results for "{searchQuery}"</p>
                                            <p className="text-stone-300 text-xs mt-1">Try searching by name, craft, or region</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Welcome Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 p-6 bg-white rounded-3xl border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-qala-gold/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0] || 'Friend'} <span className="text-xl">✨</span>
                        </h2>
                        <p className="text-stone-500 font-light mt-1">Discover what artisans are creating today.</p>
                    </motion.div>

                    {/* Feed Posts */}
                    <div className="space-y-8">
                        {feedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: Math.min(index * 0.1, 1) }}
                            >
                                <FeedCard
                                    postId={post.id}
                                    artisanId={post.artisanId}
                                    artisanName={post.artisanName}
                                    location={post.location}
                                    avatarUrl={post.avatarUrl}
                                    mediaUrl={post.mediaUrl}
                                    caption={post.caption}
                                    likes={post.likes}
                                    comments={post.comments}
                                    price={post.price}
                                    title={post.title}
                                    craftName={post.craftName}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel (Desktop) */}
            <div className="hidden lg:block border-stone-200">
                <RightPanel />
            </div>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
