"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlaySquare, PlusSquare, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const { user } = useAuth();
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-200/50 flex justify-around items-center py-4 px-6 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-6">
            <NavItem href="/discover" icon={<Home size={24} />} isActive={pathname === '/discover'} />
            
            {user?.role === 'artisan' && (
                <NavItem href="#" icon={<PlaySquare size={24} />} isActive={pathname === '/reels'} />
            )}
            
            {user?.role === 'artisan' && (
                <NavItem href="/create-post" icon={<PlusSquare size={24} />} isUpload />
            )}
            
            <NavItem href="#" icon={<ShoppingBag size={24} />} isActive={pathname === '/cart'} />
            <NavItem href="/profile" icon={<User size={24} />} isActive={pathname === '/profile'} />
        </div>
    );
}

function NavItem({ href, icon, isActive, isUpload }: { href: string, icon: React.ReactNode, isActive?: boolean, isUpload?: boolean }) {
    if (isUpload) {
        return (
            <Link
                href={href}
                className="text-qala-gold hover:text-qala-saffron transition-transform active:scale-95 bg-stone-900 p-3 rounded-full shadow-lg shadow-stone-900/20 -mt-6 border-4 border-white"
            >
                {icon}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className={`transition-all duration-300 ${isActive ? 'text-qala-gold scale-110 drop-shadow-sm' : 'text-stone-400 hover:text-qala-terracotta'
                }`}
        >
            {icon}
        </Link>
    );
}
