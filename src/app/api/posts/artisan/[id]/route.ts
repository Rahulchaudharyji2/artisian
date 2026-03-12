import { NextResponse } from 'next/server';
import Post from '@/models/Post';
import connectDB from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const posts = await Post.find({ artisanId: params.id }).sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error) {
        console.error(`Error fetching posts for artisan ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch artisan posts' }, { status: 500 });
    }
}
