"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const pathname = usePathname();

    // Studio route — artisan goes to create-post, shopper goes to ai-tools
    const studioHref = user?.role === 'artisan' ? '/create-post' : '/ai-tools';

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-200/50 flex justify-around items-center py-2 px-4 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-6">
            <NavItem href="/discover" icon={<Home size={22} />} isActive={pathname === '/discover'} label="Home" />

            {user?.role === 'artisan' && (
                <NavItem href="#" icon={<Clapperboard size={22} />} isActive={false} label="Reels" />
            )}

            {/* Studio — shown to EVERYONE */}
            <NavItem
                href={studioHref}
                icon={<Sparkles size={22} />}
                isActive={pathname === '/create-post' || pathname === '/ai-tools'}
                label="Studio"
                isUpload
            />

            <NavItem
                href="/cart"
                icon={
                    <div className="relative">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 min-w-[16px] h-4 bg-qala-gold text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none px-0.5">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>
                }
                isActive={pathname === '/cart'}
                label="Cart"
            />
            <NavItem href="/profile" icon={<User size={22} />} isActive={pathname === '/profile'} label="Profile" />
        </div>
    );
}

function NavItem({
    href, icon, isActive, isUpload, label
}: {
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
    isUpload?: boolean;
    label?: string;
}) {
    if (isUpload) {
        return (
            <Link
                href={href}
                className="flex flex-col items-center gap-0.5 group"
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg -mt-5 border-4 border-white ${isActive ? 'bg-qala-gold text-white shadow-qala-gold/30' : 'bg-stone-900 text-qala-gold shadow-stone-900/20 group-hover:bg-black'}`}>
                    {icon}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isActive ? 'text-qala-gold' : 'text-stone-400'}`}>{label}</span>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-0.5 group"
        >
            <div className={`transition-all duration-300 ${isActive ? 'text-qala-gold scale-110' : 'text-stone-400 hover:text-qala-terracotta'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-qala-gold' : 'text-stone-400'}`}>{label}</span>
        </Link>
    );
}
