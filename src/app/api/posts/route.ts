import { NextResponse, NextRequest } from 'next/server';
import Post from '@/models/Post';
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

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { artisanId, images, craftName, title, description, story, hashtags, taglines, reelScript, price } = body;

        if (!artisanId || !images || images.length === 0 || !title || !description) {
            return NextResponse.json({ error: 'Missing required fields for post' }, { status: 400 });
        }

        const uploadPromises = images.map(async (base64Img: string, index: number) => {
            try {
                const ik = getImageKit();
                const response = await ik.upload({
                    file: base64Img,
                    fileName: `artisan_${artisanId}_post_${Date.now()}_${index}.jpg`,
                    folder: '/qala_posts/'
                });
                return response.url;
            } catch (err: any) {
                console.error("ImageKit upload error:", err);
                throw new Error(`Failed to upload image ${index + 1}`);
            }
        });

        const imageUrls = await Promise.all(uploadPromises);

        const newPost = new Post({
            artisanId,
            images: imageUrls,
            craftName,
            title,
            description,
            story,
            hashtags,
            taglines,
            reelScript,
            price
        });

        await newPost.save();
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const limitStr = searchParams.get('limit');
        let limit = limitStr ? parseInt(limitStr) : 20;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('artisanId', 'name image region craft');
            
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
