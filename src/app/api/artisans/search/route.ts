import { NextResponse, NextRequest } from 'next/server';
import Artisan from '@/models/Artisan';
import connectDB from '@/lib/db';

// GET /api/artisans/search?q=...&limit=10
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const q = req.nextUrl.searchParams.get('q') || '';
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

        if (!q.trim()) {
            // Return top artisans if no query
            const artisans = await Artisan.find({ role: 'artisan' })
                .select('name image craft art region followers')
                .sort({ createdAt: -1 })
                .limit(limit);
            return NextResponse.json(artisans);
        }

        const regex = new RegExp(q, 'i');
        const artisans = await Artisan.find({
            $or: [
                { name: regex },
                { craft: regex },
                { art: regex },
                { region: regex },
                { tags: regex },
            ]
        })
            .select('name image craft art region followers')
            .limit(limit);

        return NextResponse.json(artisans);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
