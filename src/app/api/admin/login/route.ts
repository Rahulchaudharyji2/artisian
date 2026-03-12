import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-qala';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const adminEmail = process.env.VITE_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@qala.com';
        const adminPassword = process.env.VITE_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '8h' });
            return NextResponse.json({ token, message: 'Login successful' });
        } else {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
