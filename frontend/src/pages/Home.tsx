import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import StoryBar from '../components/StoryBar';
import FeedCard from '../components/FeedCard';
import RightPanel from '../components/RightPanel';

export default function Home() {
    const [feedPosts, setFeedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // Fetch actual posts from the database instead of using artisans as a proxy
                const response = await fetch('http://localhost:5000/api/posts?limit=20');
                const data = await response.json();

                if (data && Array.isArray(data)) {
                    const formattedPosts = data.map((post: any) => ({
                        id: post._id,
                        artisanName: post.artisanId?.name || "Anonymous Artisan",
                        location: post.artisanId?.region || "India",
                        avatarUrl: post.artisanId?.image || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=100&auto=format&fit=crop",
                        mediaUrl: (post.images && post.images.length > 0) ? post.images[0] : "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop",
                        caption: post.title ? `${post.title}: ${post.description}` : post.description,
                        likes: post.likes?.toLocaleString() || "0",
                        comments: "0"
                    }));
                    setFeedPosts(formattedPosts);
                }
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-karigar-bg">Loading feed...</div>;
    }

    return (
        <div className="flex w-full min-h-screen bg-karigar-bg">
            {/* Left Sidebar (Desktop) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Center Content (Main Feed) */}
            <div className="flex-1 max-w-2xl mx-auto w-full pb-20 md:pb-0 border-r border-stone-200 min-h-screen">
                <StoryBar />

                <div className="p-4 md:p-6">
                    {feedPosts.map(post => (
                        <FeedCard
                            key={post.id}
                            artisanName={post.artisanName}
                            location={post.location}
                            avatarUrl={post.avatarUrl}
                            mediaUrl={post.mediaUrl}
                            caption={post.caption}
                            likes={post.likes}
                            comments={post.comments}
                        />
                    ))}
                </div>
            </div>

            {/* Right Panel (Desktop) */}
            <div className="hidden lg:block border-stone-200">
                <RightPanel />
            </div>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
