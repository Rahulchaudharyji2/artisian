import { Router, Request, Response } from 'express';
import Post from '../models/Post';
import ImageKit from 'imagekit';

const router = Router();

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

// Create a new post
router.post('/', async (req: Request, res: Response) => {
    try {
        const { artisanId, images, craftName, title, description, story, hashtags, taglines, reelScript, price } = req.body;

        if (!artisanId || !images || images.length === 0 || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields for post' });
        }

        // Upload images to ImageKit
        const uploadPromises = images.map(async (base64Img: string, index: number) => {
            try {
                const response = await imagekit.upload({
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
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get all posts (for feed)
router.get('/', async (req: Request, res: Response) => {
    try {
        let limit = parseInt(req.query.limit as string) || 20;
        const posts = await Post.find().sort({ createdAt: -1 }).limit(limit).populate('artisanId', 'name image region craft');
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get posts for a specific artisan
router.get('/artisan/:id', async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({ artisanId: req.params.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error(`Error fetching posts for artisan ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch artisan posts' });
    }
});

export default router;
