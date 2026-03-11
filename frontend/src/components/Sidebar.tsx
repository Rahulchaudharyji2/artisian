import { User, Compass as DiscoverIcon, PlusSquare, Sparkles, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/discover', icon: DiscoverIcon, label: 'Discover' },
        { path: '/ai-tools', icon: Sparkles, label: 'AI Photo Lab' },
        { path: '/profile', icon: User, label: 'My Profile' },
    ];

    return (
        <aside className="w-64 h-screen border-r border-stone-100 bg-white flex flex-col pt-8 sticky top-0">
            {/* Logo */}
            <div className="px-8 mb-12 flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                    QALA <span className="text-amber-500">.</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive
                                ? 'bg-stone-50 text-stone-900 font-bold shadow-sm'
                                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900 font-medium'
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={isActive ? 'text-amber-500' : ''}
                                strokeWidth={isActive ? 3 : 2}
                            />
                            <span className="text-sm uppercase tracking-wide">{item.label}</span>
                        </button>
                    );
                })}
                
                <div className="pt-4 mt-4 border-t border-stone-50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-stone-400 hover:bg-red-50 hover:text-red-600 font-medium transition-all group"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-sm uppercase tracking-wide">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Create Post FAB */}
            <div className="p-6">
                <button
                    onClick={() => navigate('/create-post')}
                    className="w-full bg-stone-900 text-white font-bold rounded-2xl p-4 shadow-lg shadow-stone-900/10 hover:bg-black hover:shadow-xl hover:shadow-stone-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-md flex items-center justify-center gap-2 group"
                >
                    <PlusSquare size={18} className="group-hover:text-amber-400 transition-colors" /> 
                    <span className="text-xs uppercase tracking-widest">Create Post</span>
                </button>
            </div>

            {/* User Mini Profile */}
            <div className="p-4 border-t border-stone-100 mt-auto bg-stone-50/50">
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white border border-transparent hover:border-stone-100 rounded-2xl transition-all text-left shadow-sm"
                >
                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img 
                            src={user?.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=100&q=80"} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-black text-stone-900 text-xs truncate uppercase tracking-tight">{user?.name || 'Artisan'}</div>
                        <div className="text-stone-400 text-[10px] truncate">View Profile</div>
                    </div>
                </button>
            </div>
        </aside>
    );
}
