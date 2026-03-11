import { Heart, MessageCircle, Send, ShoppingBag } from 'lucide-react';

interface FeedCardProps {
    artisanName: string;
    location: string;
    avatarUrl: string;
    mediaUrl: string;
    caption: string;
    likes: string;
    comments: string;
}

export default function FeedCard({ artisanName, location, avatarUrl, mediaUrl, caption, likes, comments }: FeedCardProps) {
    return (
        <div className="bg-white md:rounded-2xl md:shadow-sm md:border border-stone-200 mb-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img src={avatarUrl} alt={artisanName} className="w-10 h-10 rounded-full object-cover border border-stone-100" />
                    <div>
                        <h3 className="font-bold text-sm text-stone-900 leading-tight">{artisanName}</h3>
                        <p className="text-xs text-stone-500">{location}</p>
                    </div>
                </div>
                <button className="text-karigar-primary font-bold text-sm hover:text-[#A84A2A] transition-colors">
                    Follow
                </button>
            </div>

            {/* Media */}
            <div className="w-full aspect-square bg-stone-100">
                <img src={mediaUrl} alt="Product" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <button className="text-stone-700 hover:text-karigar-primary transition-colors">
                            <Heart size={26} />
                        </button>
                        <button className="text-stone-700 hover:text-karigar-primary transition-colors">
                            <MessageCircle size={26} />
                        </button>
                        <button className="text-stone-700 hover:text-karigar-primary transition-colors">
                            <Send size={26} />
                        </button>
                    </div>
                    <button className="bg-karigar-primary hover:bg-[#A84A2A] text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm text-sm">
                        <ShoppingBag size={16} />
                        Buy Now
                    </button>
                </div>

                <div className="font-bold text-sm text-stone-900 mb-2">{likes} likes</div>

                <p className="text-sm text-stone-800 whitespace-pre-line leading-relaxed">
                    <span className="font-bold mr-2">{artisanName}</span>
                    {caption}
                </p>

                <button className="text-stone-500 text-sm mt-2 font-medium">
                    View all {comments} comments
                </button>
            </div>
        </div>
    );
}
