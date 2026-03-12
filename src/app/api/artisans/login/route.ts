import { NextResponse } from 'next/server';
import Artisan from '@/models/Artisan';
import connectDB from '@/lib/db';

// Artisan login
export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const artisan = await Artisan.findOne({ email });
        if (!artisan) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        if (artisan.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        return NextResponse.json({
            message: 'Login successful',
            artisan: {
                _id: artisan._id,
                name: artisan.name,
                email: artisan.email,
                image: artisan.image,
                role: artisan.role || 'user'
            }
        });
    } catch (error) {
        console.error("Artisan login error:", error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
