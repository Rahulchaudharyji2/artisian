import { NextResponse } from 'next/server';
import Artisan from '@/models/Artisan';
import connectDB from '@/lib/db';

// POST /api/artisans/[id]/follow
// Body: { followerId: string }
// Toggles follow/unfollow
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { followerId } = await req.json();

        if (!followerId) {
            return NextResponse.json({ error: 'followerId required' }, { status: 400 });
        }

        if (followerId === params.id) {
            return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
        }

        const target = await Artisan.findById(params.id);
        const follower = await Artisan.findById(followerId);

        if (!target || !follower) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const mongoose = (await import('mongoose')).default;
        const targetId = new mongoose.Types.ObjectId(params.id);
        const followerObjId = new mongoose.Types.ObjectId(followerId);

        const isFollowing = target.followers.some(
            (id: mongoose.Types.ObjectId) => id.toString() === followerId
        );

        if (isFollowing) {
            // Unfollow
            target.followers = target.followers.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== followerId
            );
            follower.following = follower.following.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== params.id
            );
        } else {
            // Follow
            target.followers.push(followerObjId);
            follower.following.push(targetId);
        }

        await Promise.all([target.save(), follower.save()]);

        return NextResponse.json({
            following: !isFollowing,
            followerCount: target.followers.length,
        });
    } catch (error) {
        console.error('Follow error:', error);
        return NextResponse.json({ error: 'Failed to update follow' }, { status: 500 });
    }
}
