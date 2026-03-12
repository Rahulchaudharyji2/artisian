"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, ChevronLeft, ChevronRight, MapPin, Sparkles, Share2, Check, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

export default function PostDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addToCart, isInCart } = useCart();
    const [post, setPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${params.id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                    setLikeCount(data.likes || 0);
                    setAddedToCart(isInCart(params.id));
                }
            } catch (err) {
                console.error('Error fetching post:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [params.id, isInCart]);

    const handleAddToCart = () => {
        if (!post) return;
        addToCart({
            postId: post._id,
            title: post.title,
            artisanName: post.artisanId?.name || 'Artisan',
            imageUrl: post.images?.[0] || '',
            price: post.price || 0,
            craftName: post.craftName || 'Handmade Craft',
        });
        setAddedToCart(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    const handleLike = () => {
        setLiked(prev => !prev);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const images = post?.images?.length > 0 ? post.images : ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop'];
    const artisan = post?.artisanId;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-qala-gold rounded-full animate-spin" />
                    <p className="text-stone-500 font-medium animate-pulse">Loading creation...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <p className="text-stone-500 font-medium">Post not found</p>
                    <button onClick={() => router.push('/discover')} className="mt-4 text-qala-gold font-bold">← Back to Discover</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-screen bg-stone-50">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 max-w-2xl mx-auto w-full pb-24 md:pb-0 border-r border-stone-200 min-h-screen relative bg-white">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -60 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-stone-900 text-white px-6 py-3.5 rounded-full shadow-2xl font-semibold text-sm"
                    >
                        <Check size={16} className="text-qala-gold" />
                        Added to cart!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto bg-white min-h-screen border-x border-stone-200 shadow-sm">
                {/* Sticky Header */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/discover')}
                        className="p-2 -ml-2 rounded-full text-stone-900 hover:bg-stone-100 transition-colors"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="font-bold text-stone-900 text-base truncate max-w-[200px]">{post.title}</h1>
                    <button className="p-2 rounded-full text-stone-500 hover:bg-stone-100 transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Image Gallery */}
                <div className="relative w-full aspect-square bg-stone-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.03 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </AnimatePresence>

                    {/* Image Nav Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md transition-opacity ${currentImageIndex === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex(i => Math.min(images.length - 1, i + 1))}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md transition-opacity ${currentImageIndex === images.length - 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                            {/* Dot indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_: string, i: number) => (
                                    <button key={i} onClick={() => setCurrentImageIndex(i)}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 md:p-7 space-y-6">
                    {/* Artisan Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-stone-100 bg-stone-200 shrink-0 shadow-sm">
                            <img
                                src={artisan?.image || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=100&q=80'}
                                alt={artisan?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                                {artisan?.name || 'Artisan'}
                                <Sparkles size={12} className="text-qala-gold fill-qala-gold" />
                            </div>
                            {artisan?.region && (
                                <div className="text-xs text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                                    <MapPin size={11} /> {artisan.region}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 transition-all active:scale-110 ${liked ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'}`}
                        >
                            <Heart size={22} strokeWidth={1.5} fill={liked ? 'currentColor' : 'none'} />
                            <span className="text-sm font-bold tabular-nums">{likeCount}</span>
                        </button>
                    </div>

                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-stone-900 leading-tight">{post.title}</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-qala-gold bg-qala-gold/10 px-3 py-1 rounded-full border border-qala-gold/20">
                                    <Tag size={11} /> {post.craftName || 'Handmade Craft'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            {post.price && post.price > 0 ? (
                                <>
                                    <div className="text-2xl font-black text-stone-900">
                                        ₹{post.price.toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-xs text-stone-400 font-medium mt-0.5">Incl. taxes</div>
                                </>
                            ) : (
                                <div className="text-lg font-bold text-stone-400">Price on request</div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">About this piece</h3>
                        <p className="text-stone-700 leading-relaxed font-light text-[15px]">{post.description}</p>
                    </div>

                    {/* Story */}
                    {post.story && (
                        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Sparkles size={12} className="text-qala-gold" /> Artisan's Story
                            </h3>
                            <p className="text-stone-700 leading-relaxed font-light text-sm italic">"{post.story}"</p>
                        </div>
                    )}

                    {/* Hashtags */}
                    {post.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.hashtags.map((tag: string, i: number) => (
                                <span key={i} className="text-xs text-qala-terracotta font-semibold bg-qala-terracotta/8 px-3 py-1 rounded-full">
                                    #{tag.replace('#', '')}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sticky Buy Bar */}
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-stone-100 p-4 md:p-5 flex gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.97] ${
                            addedToCart
                                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                : 'bg-stone-100 text-stone-900 hover:bg-stone-200 border-2 border-stone-200'
                        }`}
                    >
                        {addedToCart ? <Check size={17} className="text-green-600" /> : <ShoppingBag size={17} />}
                        {addedToCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={() => {
                            handleAddToCart();
                            router.push('/cart');
                        }}
                        className="flex-1 py-3.5 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-stone-900/15 hover:shadow-xl transition-all active:scale-[0.97]"
                    >
                        <Sparkles size={16} className="text-qala-gold" />
                        Buy Now
                    </button>
                </div>
            </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
