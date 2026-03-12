import { NextResponse, NextRequest } from 'next/server';
import Artisan from '@/models/Artisan';
import connectDB from '@/lib/db';
import ImageKit from 'imagekit';

// Lazy initialization block
let imagekit: ImageKit | null = null;
function getImageKit() {
    if (!imagekit) {
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy'
        });
    }
    return imagekit;
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const searchParams = req.nextUrl.searchParams;
        const limitStr = searchParams.get('limit');
        let limit = limitStr ? parseInt(limitStr) : 10;
        
        let artisans = await Artisan.find().sort({ createdAt: -1 }).limit(limit);
        return NextResponse.json(artisans);
    } catch (error) {
        console.error("Error fetching artisans:", error);
        return NextResponse.json({ error: 'Failed to fetch artisans' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, password, role, region, culture, art, language, imageBase64, portfolioBase64, story } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }

        const existing = await Artisan.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        let imageUrl = "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop";
        if (imageBase64) {
            try {
                const ik = getImageKit();
                const uploadRes = await ik.upload({
                    file: imageBase64,
                    fileName: `artisan_${Date.now()}_profile.jpg`,
                    folder: '/qala_artisans/profiles/'
                });
                imageUrl = uploadRes.url;
            } catch (err) {
                console.error("Profile Image upload failed:", err);
            }
        }

        let portfolioUrls: string[] = [];
        if (portfolioBase64 && Array.isArray(portfolioBase64)) {
            const portfolioPromises = portfolioBase64.map(async (base64: string, idx: number) => {
                try {
                    const ik = getImageKit();
                    const uploadRes = await ik.upload({
                        file: base64,
                        fileName: `artisan_${Date.now()}_portfolio_${idx}.jpg`,
                        folder: '/qala_artisans/portfolio/'
                    });
                    return uploadRes.url;
                } catch (err) {
                    console.error(`Portfolio image ${idx} upload failed:`, err);
                    return null;
                }
            });
            portfolioUrls = (await Promise.all(portfolioPromises)).filter((url): url is string => url !== null);
        }

        const newArtisan = new Artisan({
            name,
            email,
            password,
            role: role || 'user',
            region: region || "",
            culture: culture || "",
            craft: art || "",
            language: language || "",
            image: imageUrl,
            portfolio: portfolioUrls,
            story: story || "",
            tags: [art, culture, region, "artisan"].filter(Boolean).map(t => t?.toLowerCase()),
            likes: 0,
            comments: 0
        });

        await newArtisan.save();
        return NextResponse.json(newArtisan, { status: 201 });
    } catch (error) {
        console.error("Error registering artisan:", error);
        return NextResponse.json({ error: 'Failed to register artisan' }, { status: 500 });
    }
}
