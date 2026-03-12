import { NextResponse } from 'next/server';
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

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const artisan = await Artisan.findById(params.id);
        if (!artisan) {
            return NextResponse.json({ error: 'Artisan not found' }, { status: 404 });
        }
        return NextResponse.json(artisan);
    } catch (error) {
        console.error(`Error fetching artisan ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch artisan details' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, story, imageBase64 } = body;
        
        const artisan = await Artisan.findById(params.id);
        if (!artisan) {
            return NextResponse.json({ error: 'Artisan not found' }, { status: 404 });
        }

        if (name) artisan.name = name;
        if (story) artisan.story = story;

        if (imageBase64) {
            try {
                const ik = getImageKit();
                const uploadRes = await ik.upload({
                    file: imageBase64,
                    fileName: `artisan_${params.id}_updated_${Date.now()}.jpg`,
                    folder: '/qala_artisans/profiles/'
                });
                artisan.image = uploadRes.url;
            } catch (err) {
                console.error("Updated Profile Image upload failed:", err);
            }
        }

        await artisan.save();
        return NextResponse.json(artisan);
    } catch (error) {
        console.error("Error updating artisan:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
