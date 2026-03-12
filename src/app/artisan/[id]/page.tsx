"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Sparkles, UserCheck, UserPlus, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

export default function ArtisanPublicProfile({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [artisan, setArtisan] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artisanRes, postsRes] = await Promise.all([
                    fetch(`/api/artisans/${params.id}`),
                    fetch(`/api/posts/artisan/${params.id}`)
                ]);

                const artisanData = await artisanRes.json();
                const postsData = await postsRes.json();

                if (artisanRes.ok) {
                    setArtisan(artisanData);
                    setFollowerCount(artisanData.followers?.length || 0);
                    // Check if current user is already following
                    if (user?._id) {
                        setIsFollowing(
                            artisanData.followers?.some((id: string) => id.toString() === user._id)
                        );
                    }
                }
                if (postsRes.ok && Array.isArray(postsData)) {
                    setPosts(postsData);
                }
            } catch (err) {
                console.error('Error loading artisan profile:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id, user?._id]);

    const handleFollow = async () => {
        if (!user) {
            router.push('/auth');
            return;
        }
        setFollowLoading(true);
        try {
            const res = await fetch(`/api/artisans/${params.id}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: user._id }),
            });
            const data = await res.json();
            if (res.ok) {
                setIsFollowing(data.following);
                setFollowerCount(data.followerCount);
            }
        } catch (err) {
            console.error('Follow error:', err);
        } finally {
            setFollowLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-200 border-t-qala-gold rounded-full animate-spin" />
                    <p className="text-stone-500 font-medium animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center">
                    <p className="text-stone-500 font-medium">Artisan not found</p>
                    <button onClick={() => router.push('/discover')} className="mt-4 text-qala-gold font-bold">← Back to Discover</button>
                </div>
            </div>
        );
    }

    const isOwnProfile = user?._id === params.id;

    return (
        <div className="flex w-full min-h-screen bg-stone-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-1 pb-24 md:pb-0">
                <div className="max-w-3xl mx-auto w-full min-h-screen bg-white border-x border-stone-200 shadow-sm">
                    {/* Header */}
                    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-stone-100 flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="font-black text-stone-900 text-base leading-none">{artisan.name}</h1>
                            <p className="text-xs text-stone-400 mt-0.5">{posts.length} posts</p>
                        </div>
                    </div>

                    {/* Cover + Avatar */}
                    <div className="relative">
                        <div className="h-44 md:h-56 bg-stone-900 overflow-hidden">
                            <img
                                src={artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=900&q=80"}
                                alt="Cover"
                                className="w-full h-full object-cover opacity-50 blur-sm scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        <div className="absolute -bottom-16 left-5 flex items-end justify-between w-[calc(100%-2.5rem)]">
                            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-stone-200 shadow-xl">
                                <img src={artisan.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=200&q=80"} alt={artisan.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-2 mb-1">
                                {isOwnProfile ? (
                                    <button onClick={() => router.push('/profile')}
                                        className="px-5 py-2.5 bg-stone-100 text-stone-900 font-bold text-sm rounded-full border border-stone-200 hover:bg-stone-200 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                        className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-full transition-all shadow-lg ${
                                            isFollowing
                                                ? 'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                                : 'bg-stone-900 text-white hover:bg-black shadow-stone-900/20'
                                        } ${followLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        {followLoading ? (
                                            <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        ) : isFollowing ? (
                                            <UserCheck size={15} />
                                        ) : (
                                            <UserPlus size={15} />
                                        )}
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 px-5 pb-5 border-b border-stone-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-stone-900">{artisan.name}</h2>
                                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${artisan.role === 'artisan' ? 'bg-qala-gold/10 text-qala-gold border border-qala-gold/20' : 'bg-stone-100 text-stone-600'}`}>
                                        {artisan.role === 'artisan' ? <><Sparkles size={11} className="fill-current" /> Verified Artisan</> : 'Shopper'}
                                    </span>
                                    {artisan.region && (
                                        <span className="flex items-center text-xs text-stone-500 font-medium gap-1">
                                            <MapPin size={11} /> {artisan.region}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-5">
                            <div className="text-center">
                                <div className="text-xl font-black text-stone-900">{posts.length}</div>
                                <div className="text-xs text-stone-400 font-medium uppercase tracking-wide mt-0.5">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-stone-900">{followerCount.toLocaleString()}</div>
                                <div className="text-xs text-stone-400 font-medium uppercase tracking-wide mt-0.5">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-stone-900">{artisan.following?.length || 0}</div>
                                <div className="text-xs text-stone-400 font-medium uppercase tracking-wide mt-0.5">Following</div>
                            </div>
                        </div>

                        {/* Craft + Story */}
                        {(artisan.craft || artisan.art) && (
                            <p className="text-sm font-semibold text-qala-gold mt-3">{artisan.craft || artisan.art}</p>
                        )}
                        {artisan.story && (
                            <p className="text-sm text-stone-600 font-light leading-relaxed mt-2">{artisan.story}</p>
                        )}
                    </div>

                    {/* Posts Grid */}
                    <div className="p-1">
                        <div className="flex px-4 pt-4 pb-2 border-b border-stone-100">
                            <button className="text-stone-900 font-bold border-b-2 border-qala-gold pb-2 px-2 text-xs uppercase tracking-widest">Gallery</button>
                        </div>
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                                {posts.map((post: any) => (
                                    <motion.div
                                        key={post._id}
                                        whileHover={{ opacity: 0.85 }}
                                        onClick={() => router.push(`/post/${post._id}`)}
                                        className="aspect-square bg-stone-100 relative overflow-hidden cursor-pointer group"
                                    >
                                        <img
                                            src={(post.images && post.images[0]) || "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400"}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">❤️ {post.likes || 0}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center text-center px-8">
                                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon size={28} className="text-stone-300" />
                                </div>
                                <h3 className="font-bold text-stone-900 mb-1">No posts yet</h3>
                                <p className="text-stone-400 text-sm font-light">This artisan hasn't shared any creations yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
