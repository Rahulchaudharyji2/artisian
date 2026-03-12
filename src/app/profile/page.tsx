"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit3, Image as ImageIcon, MapPin, Globe, Sparkles, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import FeedCard from '@/components/FeedCard';

export default function Profile() {
    const { user, logout, updateUser } = useAuth();
    const router = useRouter();
    
    const [profileData, setProfileData] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Edit Form State
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editRegion, setEditRegion] = useState('');
    const [editArt, setEditArt] = useState('');
    const [editImage, setEditImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) {
            router.push('/auth');
            return;
        }

        const fetchProfileData = async () => {
            try {
                // Determine the correct endpoint based on role
                const endpoint = user.role === 'artisan' 
                    ? `/api/artisans/${user._id}`
                    : `/api/users/${user._id}`; // assuming we have a generic users endpoint or just use localStorage data for shoppers

                const response = await fetch(endpoint);
                const data = await response.json();
                
                if (response.ok && data) {
                    setProfileData(data);
                    // Initialize edit state
                    setEditName(data.name || '');
                    setEditBio(data.story || data.bio || '');
                    setEditRegion(data.region || '');
                    setEditArt(data.art || '');
                    setEditImage(data.image || null);
                } else if (!response.ok && user.role === 'user') {
                    // Fallback for shopper users if there is no distinct backend table yet
                    setProfileData(user);
                    setEditName(user.name || '');
                }

                // Fetch posts if artisan
                if (user.role === 'artisan') {
                    const postsResponse = await fetch(`/api/posts/artisan/${user._id}`);
                    const postsData = await postsResponse.json();
                    if (postsResponse.ok && Array.isArray(postsData)) {
                         setPosts(postsData.map((post: any) => ({
                            id: post._id,
                            mediaUrl: (post.images && post.images.length > 0) ? post.images[0] : "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop",
                            caption: post.title ? `${post.title}: ${post.description}` : post.description,
                            likes: post.likes || 0,
                        })));
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [user, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/artisans/${user?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    story: editBio,
                    region: editRegion,
                    art: editArt,
                    imageBase64: editImage !== profileData.image ? editImage : undefined
                }),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setProfileData(updatedData);
                updateUser(updatedData); // Update context
                setIsEditing(false);
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (isLoading && !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-qala-gold rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-medium animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profileData) return null;

    return (
        <div className="flex w-full min-h-screen bg-stone-50 selection:bg-qala-gold/30 pb-24 md:pb-0">
            {/* Desktop Center Container */}
            <div className="flex-1 max-w-3xl mx-auto w-full min-h-screen overflow-x-hidden relative bg-white border-x border-stone-200 shadow-sm">
                
                {/* Header Navbar */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 px-6 py-4 border-b border-stone-100 flex justify-between items-center transition-all">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-stone-900 hover:bg-stone-100 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-stone-900 tracking-tight">Profile</h1>
                    </div>
                    {user?.role === 'artisan' && (
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="p-2 text-stone-600 hover:text-qala-gold transition-colors rounded-full hover:bg-stone-50"
                        >
                            {isEditing ? <Settings size={24} className="text-stone-300" /> : <Edit3 size={24} />}
                        </button>
                    )}
                </div>

                {/* Profile Header Cover & Avatar */}
                <div className="relative">
                    {/* Cover Photo */}
                    <div className="h-48 md:h-64 w-full bg-stone-900 relative overflow-hidden">
                         <img 
                            src={profileData.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop"} 
                            alt="Cover" 
                            className="w-full h-full object-cover opacity-60 blur-sm scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    {/* Avatar Container */}
                    <div className="absolute -bottom-16 left-6 flex items-end justify-between w-[calc(100%-3rem)]">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-stone-100 shadow-xl relative z-10">
                                <img 
                                    src={isEditing && editImage ? editImage : (profileData.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=200&auto=format&fit=crop")}
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                                {isEditing && (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ImageIcon className="text-white w-8 h-8 drop-shadow-md" />
                                    </button>
                                )}
                            </div>
                            {user?.role === 'artisan' && (
                                <div className="absolute bottom-2 right-2 bg-qala-gold text-white p-1.5 rounded-full border-2 border-white shadow-sm z-20">
                                    <Sparkles size={14} className="fill-white" />
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons right of avatar */}
                        {!isEditing && (
                             <div className="flex gap-3 relative z-10 mb-2">
                                <button 
                                    onClick={() => router.push('/ai-tools')}
                                    className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-full shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                                >
                                    <Sparkles size={16} /> <span className="hidden sm:inline">AI Lab</span>
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-colors border border-red-100 flex items-center gap-2"
                                >
                                    <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                                </button>
                             </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                {/* Profile Info Section */}
                <div className="pt-20 px-6 pb-8 border-b border-stone-100">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Display Name</label>
                                    <input 
                                        type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                        className="w-full text-2xl font-black text-stone-900 p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold focus:bg-white transition-all shadow-sm"
                                        placeholder="Your Name"
                                    />
                                </div>
                                {user?.role === 'artisan' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Region</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                                                    <input 
                                                        type="text" value={editRegion} onChange={(e) => setEditRegion(e.target.value)}
                                                        className="w-full pl-9 p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold focus:bg-white shadow-sm text-sm font-medium"
                                                        placeholder="Your State"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Craft</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                                                    <input 
                                                        type="text" value={editArt} onChange={(e) => setEditArt(e.target.value)}
                                                        className="w-full pl-9 p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold focus:bg-white shadow-sm text-sm font-medium"
                                                        placeholder="Your Craft"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Your Story</label>
                                            <textarea 
                                                value={editBio} onChange={(e) => setEditBio(e.target.value)}
                                                rows={4}
                                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold focus:bg-white shadow-sm resize-none text-stone-700"
                                                placeholder="Tell the world about your journey..."
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="flex-1 bg-stone-900 text-white py-3.5 rounded-2xl font-bold hover:bg-black transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Profile'}
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3.5 bg-white text-stone-900 border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">{profileData.name}</h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${user?.role === 'artisan' ? 'bg-qala-gold/10 text-qala-gold border border-qala-gold/20' : 'bg-stone-100 text-stone-600'}`}>
                                            {user?.role === 'artisan' ? 'Verified Artisan' : 'Connoisseur'}
                                        </span>
                                        {profileData.region && (
                                            <span className="flex items-center text-sm text-stone-500 font-medium">
                                                <MapPin className="w-4 h-4 mr-1 text-stone-400" /> {profileData.region}
                                            </span>
                                        )}
                                        {profileData.art && (
                                            <span className="flex items-center text-sm text-stone-500 font-medium">
                                                <Globe className="w-4 h-4 mr-1 text-stone-400" /> {profileData.art}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {profileData.story && (
                                    <p className="text-stone-600 leading-relaxed font-light mt-4">
                                        {profileData.story}
                                    </p>
                                )}
                                
                                {/* Stats Banner */}
                                {user?.role === 'artisan' && (
                                    <div className="flex bg-stone-50 rounded-2xl border border-stone-100 p-4 mt-6">
                                        <div className="flex-1 text-center border-r border-stone-200">
                                            <div className="text-2xl font-black text-stone-900">{posts.length}</div>
                                            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mt-1">Creations</div>
                                        </div>
                                        <div className="flex-1 text-center border-r border-stone-200">
                                            <div className="text-2xl font-black text-stone-900">{(posts.reduce((acc, p) => acc + (p.likes || 0), 0) + 1200).toLocaleString()}</div>
                                            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mt-1">Admirers</div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <div className="text-2xl font-black text-qala-gold">4.9</div>
                                            <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mt-1">Rating</div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Artisan Portfolio Grid */}
                {user?.role === 'artisan' && !isEditing && (
                    <div className="p-1">
                        {/* Tabs */}
                        <div className="flex px-6 pt-4 pb-2">
                            <button className="text-stone-900 font-bold border-b-2 border-qala-gold pb-2 px-2 text-sm uppercase tracking-widest">Gallery</button>
                            <button className="text-stone-400 font-medium pb-2 px-4 hover:text-stone-600 transition-colors text-sm uppercase tracking-widest">Store (Coming Soon)</button>
                        </div>
                        
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1 md:gap-2 p-1">
                                {posts.map(post => (
                                    <div key={post.id} className="aspect-square bg-stone-100 relative group overflow-hidden cursor-pointer">
                                        <img 
                                            src={post.mediaUrl} 
                                            alt={post.caption} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <div className="text-white font-bold flex gap-4 drop-shadow-md">
                                                 <span>❤️ {post.likes}</span>
                                             </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon className="w-10 h-10 text-stone-300" />
                                </div>
                                <h3 className="text-lg font-bold text-stone-900 mb-2">No creations yet</h3>
                                <p className="text-stone-500 font-light max-w-sm">Share your first masterpiece with the community and start building your legacy.</p>
                                <button 
                                    onClick={() => router.push('/ai-tools')}
                                    className="mt-6 px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-black transition-colors"
                                >
                                    Create Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
