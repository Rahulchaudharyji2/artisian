import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles } from "lucide-react";

const posts = [
    {
        id: 1,
        artisan: "Meera Devi",
        region: "Madhubani, Bihar",
        craft: "Madhubani Painting",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop",
        story: "Passed down through generations, this painting tells the story of the cosmic union between earth and sky. Meera uses natural dyes from turmeric and flowers.",
        likes: "1.2k",
        comments: 45,
    },
    {
        id: 2,
        artisan: "Rajesh Karigar",
        region: "Sanganer, Rajasthan",
        craft: "Hand Block Printing",
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop",
        story: "Every block is hand-carved from seasoned teak wood. This pattern represents the 'Buti' or the budding flower, a symbol of growth and prosperity.",
        likes: "850",
        comments: 22,
    },
];

const stories = [
    { id: 1, name: "Meera", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    { id: 2, name: "Rajesh", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
    { id: 3, name: "Anjali", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { id: 4, name: "Kiran", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
];

export default function Feed() {
    return (
        <div className="flex-1 bg-stone-50 overflow-y-auto pb-20">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 glass-panel p-4 flex items-center justify-between border-b border-stone-200">
                <h1 className="text-2xl font-black text-qala-gold tracking-tight">QALA</h1>
                <div className="flex gap-4 text-stone-600">
                    <Heart size={24} />
                    <MessageCircle size={24} />
                </div>
            </header>

            {/* Stories Section */}
            <div className="p-4 flex gap-4 overflow-x-auto no-scrollbar bg-white mb-2">
                {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-qala-gold via-qala-saffron to-qala-terracotta">
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                                <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-stone-500">{story.name}</span>
                    </div>
                ))}
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white border-y border-stone-100">
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                                    {/* Placeholder avatar */}
                                    <div className="w-full h-full bg-qala-indigo/10 flex items-center justify-center text-qala-indigo font-bold">{post.artisan[0]}</div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900">{post.artisan}</h3>
                                    <p className="text-[11px] text-stone-500">{post.region}</p>
                                </div>
                            </div>
                            <MoreHorizontal size={20} className="text-stone-400" />
                        </div>

                        {/* Post Image */}
                        <div className="aspect-square w-full relative group">
                            <img src={post.image} alt={post.craft} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-bold">
                                <Sparkles size={12} className="text-qala-gold" /> AI Enhanced
                            </div>
                        </div>

                        {/* Post Actions */}
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <Heart size={24} className="text-stone-700" />
                                    <MessageCircle size={24} className="text-stone-700" />
                                    <Share2 size={24} className="text-stone-700" />
                                </div>
                                <Bookmark size={24} className="text-stone-700" />
                            </div>

                            {/* Story/Caption */}
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{post.likes} likes</p>
                                <p className="text-sm text-stone-800 leading-relaxed">
                                    <span className="font-bold mr-2">{post.artisan}</span>
                                    {post.story}
                                </p>
                                <p className="text-xs text-stone-400 font-medium">View all {post.comments} comments</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 inline-block px-2 py-0.5 rounded">#TraditionalCraft #{post.craft.replace(/\s/g, '')}</p>
                            </div>
                        </div>

                        {/* Shop Action */}
                        <div className="px-4 pb-4">
                            <button className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors">
                                Support this Artisan - Buy Now
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* Bottom Nav Mockup */}
            <nav className="fixed bottom-0 w-full max-w-md mx-auto h-16 bg-white border-t border-stone-200 flex items-center justify-around z-[100]">
                {/* Simple icon placeholders for nav */}
                <div className="w-10 h-10 rounded-full bg-stone-100" />
                <div className="w-10 h-10 rounded-full bg-stone-100" />
                <div className="w-12 h-12 rounded-2xl bg-qala-gold flex items-center justify-center text-white shadow-lg shadow-qala-gold/20 -mt-6">
                    <Sparkles size={24} />
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100" />
                <div className="w-10 h-10 rounded-full bg-stone-100" />
            </nav>
        </div>
    );
}
