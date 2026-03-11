import { useState, useEffect } from 'react';
import { Settings, MapPin, PlaySquare, Bookmark, LayoutGrid, Heart, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<'products' | 'reels' | 'saved'>('products');
    const [profileData, setProfileData] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editImage, setEditImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user?._id) return;

        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/artisans/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    story: editBio,
                    imageBase64: editImage?.startsWith('data:image') ? editImage : null
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setProfileData({
                    ...profileData,
                    name: updated.name,
                    bio: updated.story,
                    image: updated.image
                });
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const startEditing = () => {
        setEditName(profileData.name);
        setEditBio(profileData.bio);
        setEditImage(profileData.image);
        setIsEditing(true);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user?._id) {
                    setIsLoading(false);
                    return;
                }

                const res = await fetch(`http://localhost:5000/api/artisans/${user._id}`);
                let artisan = null;
                
                if (res.ok) {
                    artisan = await res.json();
                }

                if (artisan) {
                    setProfileData({
                        name: artisan.name,
                        username: `@${artisan.name.toLowerCase().replace(/\s+/g, '_')}`,
                        location: artisan.region,
                        bio: artisan.story || "Passionate about preserving traditional Indian crafts. ✨",
                        stats: {
                            followers: artisan.likes || "0",
                            following: "0",
                            products: artisan.craft,
                            rating: "0.0"
                        },
                        image: artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop"
                    });

                    // Fetch artisan's posts
                    try {
                        const postsRes = await fetch(`http://localhost:5000/api/posts/artisan/${artisan._id}`);
                        if (postsRes.ok) {
                            const postsData = await postsRes.json();
                            setProducts(postsData);
                        }
                    } catch (err) {
                        console.error("Failed to fetch artisan posts:", err);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-karigar-bg">Loading profile...</div>;
    }

    if (!profileData) {
        return (
            <div className="flex w-full min-h-screen bg-karigar-bg">
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6 pb-24 md:pb-6 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-qala-earth/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-qala-gold/10 rounded-full blur-3xl -z-10 animate-pulse delay-750"></div>

                    <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-stone-100 max-w-md w-full text-center relative z-10">
                        <div className="w-20 h-20 mx-auto bg-stone-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-6 relative">
                            <UserPlus size={32} className="text-qala-gold" />
                            <Sparkles size={16} className="text-karigar-primary absolute -top-1 -right-1" />
                        </div>

                        <h2 className="text-2xl font-black text-stone-900 mb-3">Claim Your Profile</h2>
                        <p className="text-stone-500 mb-8 leading-relaxed text-sm">
                            Join our community of master artisans. Showcase your craft, sell your products, and tell your unique story to the world.
                        </p>

                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full bg-gradient-to-r from-stone-900 to-black hover:from-black hover:to-black text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            Create Artisan Account
                            <Sparkles size={18} className="text-qala-gold group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>
                <div className="md:hidden">
                    <BottomNav />
                </div>
            </div>
        );
    }

    // Empty states for now as we haven't built out reel API fetching yet
    const highlights: any[] = [];

    return (
        <div className="flex w-full min-h-screen bg-karigar-bg">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Center Content (Profile) */}
            <div className="flex-1 max-w-3xl mx-auto w-full pb-20 md:pb-0 min-h-screen bg-white md:border-r border-stone-200">
                {/* Header Top Bar */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-3 border-b border-stone-200 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-stone-900">{profileData.username || "Profile"}</h2>
                    <button className="text-stone-700 hover:text-karigar-primary">
                        <Settings size={24} />
                    </button>
                </div>

                {/* Profile Info Section */}
                <div className="p-4 md:p-8">
                    <div className="flex items-center gap-6 md:gap-10 mb-6">
                        {/* Avatar */}
                        <div className="shrink-0 relative group">
                            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-karigar-accent to-karigar-primary relative">
                                <img
                                    src={isEditing ? (editImage || profileData.image) : profileData.image}
                                    alt={profileData.name}
                                    className={`w-full h-full object-cover rounded-full border-4 border-white ${isEditing ? 'opacity-50' : ''}`}
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-white">
                                        <Sparkles size={24} className="drop-shadow-lg" />
                                        <span className="text-[10px] font-bold uppercase drop-shadow-lg">Change</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Stats - Desktop only row, Mobile wraps */}
                        <div className="flex-1 flex justify-around md:justify-start md:gap-8 items-center text-center">
                            <div className="flex flex-col">
                                <span className="font-black text-xl md:text-2xl text-stone-900">{profileData.stats?.products || "0"}</span>
                                <span className="text-xs md:text-sm text-stone-500">Products</span>
                            </div>
                        </div>
                    </div>
                    {/* Bio */}
                    <div className="mb-6">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full border-b-2 border-stone-200 focus:border-karigar-primary outline-none py-1 font-bold text-lg text-stone-900 bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">About / Bio</label>
                                    <textarea
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        rows={3}
                                        className="w-full border-2 border-stone-100 rounded-xl p-3 focus:border-karigar-primary outline-none text-sm text-stone-800 bg-stone-50"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="font-bold text-lg text-stone-900">{profileData.name}</h1>
                                <p className="text-sm text-karigar-primary flex items-center gap-1 mb-2 mt-1">
                                    <MapPin size={14} /> {profileData.location || "Location not set"}
                                </p>
                                <p className="whitespace-pre-line text-sm text-stone-800 leading-relaxed">
                                    {profileData.bio || "No bio added yet."}
                                </p>
                            </>
                        )}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mb-8">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-[2] bg-karigar-primary hover:bg-[#A84A2A] text-white py-2 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 py-2 rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={startEditing} className="flex-1 bg-karigar-primary hover:bg-[#A84A2A] text-white py-2 rounded-xl font-bold transition-colors shadow-sm">
                                    Edit Profile
                                </button>
                                <button className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-900 py-2 rounded-xl font-bold transition-colors">
                                    Share Profile
                                </button>
                                <button className="flex-1 border-2 border-karigar-primary text-karigar-primary hover:bg-karigar-bg py-2 rounded-xl font-bold transition-colors">
                                    View Shop
                                </button>
                            </>
                        )}
                    </div>

                    {/* Story Highlights */}
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-4 border-b border-stone-200">
                        {highlights.length > 0 ? highlights.map(highlight => (
                            <div key={highlight.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-max">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] border border-stone-300">
                                    <img
                                        src={highlight.image}
                                        alt={highlight.title}
                                        className="w-full h-full object-cover rounded-full border-2 border-white"
                                    />
                                </div>
                                <span className="text-xs font-medium text-stone-800 tracking-tight">{highlight.title}</span>
                            </div>
                        )) : (
                            <div className="text-xs text-stone-400 italic py-2">No story highlights yet.</div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-around border-b border-stone-200 sticky top-[57px] bg-white z-30">
                    <TabButton
                        icon={<LayoutGrid size={24} />}
                        label="PRODUCTS"
                        isActive={activeTab === 'products'}
                        onClick={() => setActiveTab('products')}
                    />
                    <TabButton
                        icon={<PlaySquare size={24} />}
                        label="REELS"
                        isActive={activeTab === 'reels'}
                        onClick={() => setActiveTab('reels')}
                    />
                    <TabButton
                        icon={<Bookmark size={24} />}
                        label="SAVED"
                        isActive={activeTab === 'saved'}
                        onClick={() => setActiveTab('saved')}
                    />
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2">
                    {activeTab === 'products' && (products.length > 0 ? products.map(product => (
                        <div key={product._id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-stone-100">
                            {product.images && product.images.length > 0 && (
                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-4">
                                <span className="text-white text-xs font-bold w-full text-center truncate px-2">{product.title}</span>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-white font-black md:text-xl drop-shadow-md">₹{product.price}</span>
                                    <button className="bg-karigar-primary hover:bg-white hover:text-karigar-primary text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1 shadow-lg">
                                        <Heart size={14} /> Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 py-20 flex flex-col items-center justify-center text-stone-400">
                            <LayoutGrid className="w-16 h-16 mb-4 opacity-30 stroke-1" />
                            <h3 className="font-bold text-lg text-stone-600 mb-1">No products yet</h3>
                            <p className="text-sm">When artisan adds products, they will appear here.</p>
                        </div>
                    ))}

                    {activeTab === 'reels' && (
                        <div className="col-span-3 py-20 flex flex-col items-center justify-center text-stone-400">
                            <PlaySquare className="w-16 h-16 mb-4 opacity-30 stroke-1" />
                            <h3 className="font-bold text-lg text-stone-600 mb-1">No reels yet</h3>
                            <p className="text-sm">When artisan posts a reel, it will appear here.</p>
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="col-span-3 py-20 flex flex-col items-center justify-center text-stone-400">
                            <Bookmark className="w-16 h-16 mb-4 opacity-50 stroke-1" />
                            <h3 className="font-bold text-lg text-stone-600 mb-1">Only you can see what you've saved</h3>
                            <p className="text-sm">Save products and reels to viewing them later.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}

function TabButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex md:flex-row flex-col items-center justify-center gap-1 md:gap-2 py-4 border-t-2 transition-colors ${isActive ? 'border-karigar-primary text-karigar-primary' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
        >
            {icon}
            <span className="text-[10px] md:text-xs font-bold tracking-wider hidden md:block">{label}</span>
        </button>
    );
}
