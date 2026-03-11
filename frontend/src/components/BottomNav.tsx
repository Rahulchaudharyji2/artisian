import { Link } from 'react-router-dom';
import { Home, PlaySquare, PlusSquare, ShoppingBag, User } from 'lucide-react';

export default function BottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around items-center py-3 px-6 z-50 md:hidden">
            <NavItem to="/discover" icon={<Home size={24} />} isActive />
            <NavItem to="#" icon={<PlaySquare size={24} />} />
            <NavItem to="#" icon={<PlusSquare size={28} />} isUpload />
            <NavItem to="#" icon={<ShoppingBag size={24} />} />
            <NavItem to="/profile" icon={<User size={24} />} />
        </div>
    );
}

function NavItem({ to, icon, isActive, isUpload }: { to: string, icon: React.ReactNode, isActive?: boolean, isUpload?: boolean }) {
    if (isUpload) {
        return (
            <Link
                to={to}
                className="text-karigar-primary hover:text-[#A84A2A] transition-colors"
                style={{ strokeWidth: 2.5 }}
            >
                {icon}
            </Link>
        );
    }

    return (
        <Link
            to={to}
            className={`transition-colors ${isActive ? 'text-karigar-primary' : 'text-stone-500 hover:text-karigar-primary'
                }`}
        >
            {icon}
        </Link>
    );
}
