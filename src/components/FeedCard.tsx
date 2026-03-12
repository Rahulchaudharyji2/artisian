"use client";

import { Heart, MessageCircle, Send, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface FeedCardProps {
    postId: string;
    artisanName: string;
    location: string;
    avatarUrl: string;
    mediaUrl: string;
    caption: string;
    likes: string;
    comments: string;
    price?: number;
    title?: string;
    craftName?: string;
}

export default function FeedCard({ postId, artisanName, location, avatarUrl, mediaUrl, caption, likes, comments, price, title, craftName }: FeedCardProps) {
    const router = useRouter();
    const { addToCart, isInCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);
    const alreadyInCart = isInCart(postId);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({
            postId,
            title: title || caption?.slice(0, 60) || 'Handcrafted Item',
            artisanName,
            imageUrl: mediaUrl,
            price: price || 0,
            craftName: craftName || 'Handmade Craft',
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    const goToDetail = () => router.push(`/post/${postId}`);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] border border-stone-100 mb-8 overflow-hidden transition-all duration-500"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6">
                <div className="flex items-center gap-4 cursor-pointer" onClick={goToDetail}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-qala-gold to-qala-saffron rounded-full blur-[6px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <img src={avatarUrl} alt={artisanName} className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-stone-900 leading-tight group-hover:text-qala-gold transition-colors">{artisanName}</h3>
                        <p className="text-xs font-medium text-stone-500 flex items-center gap-1 mt-0.5">
                            {location}
                        </p>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-widest rounded-full transition-colors border border-stone-200">
                    <Sparkles className="w-3 h-3 text-qala-gold" />
                    Follow
                </button>
            </div>

            {/* Media — clickable to detail page */}
            <div className="w-full aspect-square bg-stone-100 overflow-hidden relative cursor-pointer" onClick={goToDetail}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img src={mediaUrl} alt={title || "Product"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                {/* Price badge */}
                {price && price > 0 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-stone-900 font-black text-xs px-3 py-1.5 rounded-full shadow-lg border border-stone-100 z-20">
                        ₹{price.toLocaleString('en-IN')}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                        <button className="text-stone-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all">
                            <Heart size={28} strokeWidth={1.5} />
                        </button>
                        <button className="text-stone-400 hover:text-stone-900 hover:scale-110 active:scale-95 transition-all">
                            <MessageCircle size={28} strokeWidth={1.5} />
                        </button>
                        <button className="text-stone-400 hover:text-stone-900 hover:scale-110 active:scale-95 transition-all -mt-1">
                            <Send size={28} strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            className={`px-4 py-2 rounded-full font-bold flex items-center gap-1.5 transition-all text-sm border active:scale-95 ${
                                alreadyInCart || justAdded
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                            }`}
                        >
                            {alreadyInCart || justAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                            {alreadyInCart || justAdded ? 'Added' : 'Cart'}
                        </button>
                        <button
                            onClick={goToDetail}
                            className="bg-stone-900 hover:bg-black text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-stone-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm group/btn"
                        >
                            <Sparkles size={14} className="text-qala-gold group-hover/btn:rotate-12 transition-transform" />
                            View
                        </button>
                    </div>
                </div>

                <div className="font-bold text-sm text-stone-900 mb-3">{likes} likes</div>

                <p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
                    <span className="font-black text-stone-900 mr-2 cursor-pointer hover:underline" onClick={goToDetail}>{artisanName}</span>
                    <span className="font-light">{caption}</span>
                </p>

                <button className="text-stone-400 text-sm mt-3 font-medium hover:text-stone-600 transition-colors">
                    View all {comments} comments
                </button>
            </div>
        </motion.div>
    );
}
