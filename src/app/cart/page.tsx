"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, Sparkles, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

    const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : 79;
    const grandTotal = cartTotal + shipping;

    return (
        <div className="flex w-full min-h-screen bg-stone-50">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 max-w-2xl mx-auto w-full pb-28 md:pb-0 border-r border-stone-200 min-h-screen">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/discover')}
                            className="p-2 -ml-2 rounded-full text-stone-900 hover:bg-stone-100 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="font-black text-stone-900 text-lg leading-none">My Cart</h1>
                            <p className="text-xs text-stone-400 font-medium mt-0.5">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors px-3 py-1.5 rounded-full hover:bg-rose-50"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-28 px-8 text-center"
                    >
                        <div className="w-24 h-24 bg-stone-50 border-2 border-dashed border-stone-200 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={36} className="text-stone-300" />
                        </div>
                        <h2 className="text-2xl font-black text-stone-900 mb-2">Cart is empty</h2>
                        <p className="text-stone-400 font-light leading-relaxed max-w-xs">
                            Discover unique handcrafted pieces from Indian artisans and add them to your cart.
                        </p>
                        <Link
                            href="/discover"
                            className="mt-8 px-8 py-3.5 bg-stone-900 text-white rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-stone-900/10"
                        >
                            <Sparkles size={16} className="text-qala-gold" />
                            Explore Artisans
                        </Link>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {/* Cart Items */}
                        <div className="p-4 space-y-0">
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.cartItemId}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex gap-4 py-4 border-b border-stone-50 last:border-0"
                                    >
                                        {/* Product Image */}
                                        <div
                                            className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 cursor-pointer shadow-sm"
                                            onClick={() => router.push(`/post/${item.postId}`)}
                                        >
                                            <img
                                                src={item.imageUrl || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=200'}
                                                alt={item.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-stone-900 text-sm truncate leading-tight">{item.title}</h3>
                                                    <p className="text-xs text-stone-400 font-medium mt-0.5">{item.artisanName}</p>
                                                    <span className="inline-block text-[10px] font-bold text-qala-gold bg-qala-gold/10 px-2 py-0.5 rounded-full mt-1.5 border border-qala-gold/20">
                                                        {item.craftName}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors shrink-0"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>

                                            {/* Price & Quantity */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="font-black text-stone-900 text-base">
                                                    {item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Inquire'}
                                                </div>
                                                <div className="flex items-center gap-1 bg-stone-50 rounded-xl border border-stone-200 p-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="w-6 text-center font-bold text-stone-900 text-sm tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Free Shipping Banner */}
                        {cartTotal < FREE_SHIPPING_THRESHOLD && cartTotal > 0 && (
                            <div className="mx-4 mb-2 px-4 py-3 bg-qala-gold/8 border border-qala-gold/20 rounded-2xl flex items-center gap-3">
                                <Package size={18} className="text-qala-gold shrink-0" />
                                <p className="text-sm font-medium text-stone-700">
                                    Add <span className="font-black text-stone-900">₹{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString('en-IN')}</span> more for <span className="text-qala-gold font-bold">FREE delivery</span>
                                </p>
                            </div>
                        )}
                        {cartTotal >= FREE_SHIPPING_THRESHOLD && (
                            <div className="mx-4 mb-2 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                                <Package size={18} className="text-green-600 shrink-0" />
                                <p className="text-sm font-bold text-green-700">🎉 You have free delivery!</p>
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="p-5 space-y-3">
                            <h3 className="font-black text-stone-900 text-xs uppercase tracking-widest mb-4">Order Summary</h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500 font-medium">Subtotal ({cartCount} items)</span>
                                <span className="font-bold text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500 font-medium">Delivery</span>
                                <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-stone-900'}`}>
                                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="border-t border-stone-100 pt-3 flex justify-between">
                                <span className="font-black text-stone-900">Total</span>
                                <div className="text-right">
                                    <span className="font-black text-stone-900 text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                                    <p className="text-xs text-stone-400 font-medium">Incl. all taxes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout CTA */}
                {items.length > 0 && (
                    <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-stone-100 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
                        <button className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-stone-900/15 hover:shadow-2xl transition-all active:scale-[0.98]">
                            <Sparkles size={18} className="text-qala-gold" />
                            Proceed to Checkout
                            <span className="ml-1 text-qala-gold font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </button>
                        <p className="text-center text-xs text-stone-400 font-medium mt-2.5">Secure checkout · Handcrafted with love</p>
                    </div>
                )}
            </div>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
