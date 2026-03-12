"use client";

import { User, Compass as DiscoverIcon, PlusSquare, Sparkles, LogOut, ShoppingBag, Clapperboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    const navItems = [
        { path: '/discover', icon: DiscoverIcon, label: 'Discover', badge: 0 },
        { path: '/reels', icon: Clapperboard, label: 'Qala Reels', badge: 0 },
        ...(user?.role === 'artisan' ? [{ 
            path: '/create-post', 
            icon: Sparkles, 
            label: 'AI Studio', 
            badge: 0 
        }] : []),
        { path: '/cart', icon: ShoppingBag, label: 'My Cart', badge: cartCount },
        { path: '/profile', icon: User, label: 'My Profile', badge: 0 },
    ];

    return (
        <aside className="w-64 h-screen border-r border-stone-200/80 bg-stone-50/50 backdrop-blur-md flex flex-col pt-8 sticky top-0">
            {/* Logo */}
            <div className="px-8 mb-12 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/discover')}>
                <div className="relative flex items-center justify-center w-8 h-8 bg-stone-900 rounded-lg overflow-hidden shadow-sm">
                    <Sparkles size={14} className="text-qala-gold z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-qala-gold/20 to-transparent opacity-50"></div>
                </div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tighter">
                    QALA <span className="text-qala-gold">.</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname.includes(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-white text-stone-900 font-bold shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100'
                                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 font-medium border border-transparent'
                                }`}
                        >
                            <div className="relative">
                                <item.icon
                                    size={20}
                                    className={`transition-colors ${isActive ? 'text-qala-gold' : 'group-hover:text-stone-700'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-qala-gold text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase">{item.label}</span>
                            {item.badge > 0 && (
                                <span className="ml-auto bg-qala-gold/10 text-qala-gold text-[10px] font-black px-2 py-0.5 rounded-full border border-qala-gold/20">{item.badge}</span>
                            )}
                        </button>
                    );
                })}
                
                <div className="pt-4 mt-6 border-t border-stone-200/50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-stone-400 hover:bg-red-50/50 hover:text-rose-600 transition-all group border border-transparent hover:border-red-100"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold tracking-widest uppercase">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Create Post FAB - Artisan Only */}
            {user?.role === 'artisan' && (
                <div className="p-6">
                    <button
                        onClick={() => router.push('/create-post')}
                        className="w-full relative group overflow-hidden bg-stone-900 text-white font-bold rounded-2xl p-4 shadow-lg shadow-stone-900/10 hover:shadow-xl hover:shadow-stone-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-md flex items-center justify-center gap-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-qala-gold via-qala-saffron to-qala-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <PlusSquare size={18} className="relative z-10 transition-colors" /> 
                        <span className="relative z-10 text-xs font-bold uppercase tracking-widest">Create Post</span>
                    </button>
                </div>
            )}

            {/* User Mini Profile */}
            <div className="p-4 mt-auto">
                <button
                    onClick={() => router.push('/profile')}
                    className="w-full flex items-center gap-3 p-3 bg-white hover:bg-stone-100 border border-stone-100 hover:border-stone-200 rounded-2xl transition-all text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border border-stone-200 shadow-sm shrink-0">
                        <img 
                            src={user?.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=100&q=80"} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-black text-stone-900 text-xs truncate uppercase tracking-tight">{user?.name || 'Artisan'}</div>
                        <div className="text-stone-400 text-[10px] font-medium tracking-wide uppercase mt-0.5 truncate">View Profile</div>
                    </div>
                </button>
            </div>
        </aside>
    );
}
