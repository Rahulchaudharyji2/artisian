"use client";

import { Heart, MessageCircle, Send, ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedCardProps {
    artisanName: string;
    location: string;
    avatarUrl: string;
    mediaUrl: string;
    caption: string;
    likes: string;
    comments: string;
}

export default function FeedCard({ artisanName, location, avatarUrl, mediaUrl, caption, likes, comments }: FeedCardProps) {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] border border-stone-100 mb-8 overflow-hidden transition-all duration-500"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6">
                <div className="flex items-center gap-4">
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

            {/* Media */}
            <div className="w-full aspect-square bg-stone-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                <img src={mediaUrl} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
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
                    <button className="bg-stone-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-stone-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm group/btn">
                        <ShoppingBag size={16} className="text-qala-gold group-hover/btn:rotate-12 transition-transform" />
                        Buy Now
                    </button>
                </div>

                <div className="font-bold text-sm text-stone-900 mb-3">{likes} likes</div>

                <p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
                    <span className="font-black text-stone-900 mr-2">{artisanName}</span>
                    <span className="font-light">{caption}</span>
                </p>

                <button className="text-stone-400 text-sm mt-3 font-medium hover:text-stone-600 transition-colors">
                    View all {comments} comments
                </button>
            </div>
        </motion.div>
    );
}
