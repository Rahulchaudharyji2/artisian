import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Artisan from '@/models/Artisan';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-qala';

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            }
        } catch (error) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const artisans = await Artisan.find().sort({ createdAt: -1 });
        return NextResponse.json(artisans);
    } catch (error) {
        console.error('Failed to fetch artisans', error);
        return NextResponse.json({ error: 'Failed to fetch artisans' }, { status: 500 });
    }
}
