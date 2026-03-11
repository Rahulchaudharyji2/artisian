import { Router, Request, Response } from 'express';
import Artisan from '../models/Artisan';
import ImageKit from 'imagekit';

const router = Router();

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

// Get recent artisans for feed and discovery
router.get('/', async (req: Request, res: Response) => {
    try {
        let limit = parseInt(req.query.limit as string) || 10;
        let artisans = await Artisan.find().sort({ createdAt: -1 }).limit(limit);
        res.json(artisans);
    } catch (error) {
        console.error("Error fetching artisans:", error);
        res.status(500).json({ error: 'Failed to fetch artisans' });
    }
});

// Register a new artisan with ImageKit support
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password, region, culture, art, language, imageBase64, portfolioBase64, story } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existing = await Artisan.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Upload Profile Image to ImageKit if provided
        let imageUrl = "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=400&auto=format&fit=crop";
        if (imageBase64) {
            try {
                const uploadRes = await imagekit.upload({
                    file: imageBase64,
                    fileName: `artisan_${Date.now()}_profile.jpg`,
                    folder: '/qala_artisans/profiles/'
                });
                imageUrl = uploadRes.url;
            } catch (err) {
                console.error("Profile Image upload failed:", err);
            }
        }

        // Upload Portfolio Images to ImageKit if provided
        let portfolioUrls: string[] = [];
        if (portfolioBase64 && Array.isArray(portfolioBase64)) {
            const portfolioPromises = portfolioBase64.map(async (base64: string, idx: number) => {
                try {
                    const uploadRes = await imagekit.upload({
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
            region: region || "India",
            culture: culture || "",
            craft: art || "Traditional Craft",
            language: language || "",
            image: imageUrl,
            portfolio: portfolioUrls,
            story: story || `Hi! I'm ${name}, an artisan specializing in ${art || "traditional crafts"}. Welcome to my Qala profile! ✨`,
            tags: [art, culture, region, "artisan"].filter(Boolean).map(t => t?.toLowerCase()),
            likes: 0,
            comments: 0
        });

        await newArtisan.save();
        res.status(201).json(newArtisan);
    } catch (error) {
        console.error("Error registering artisan:", error);
        res.status(500).json({ error: 'Failed to register artisan' });
    }
});

// Get a specific artisan by ID (for profile page)
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const artisan = await Artisan.findById(req.params.id);
        if (!artisan) {
            return res.status(404).json({ error: 'Artisan not found' });
        }
        res.json(artisan);
    } catch (error) {
        console.error(`Error fetching artisan ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to fetch artisan details' });
    }
});

// Update artisan profile (Bio, Name, Profile Pic)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { name, story, imageBase64 } = req.body;
        const artisan = await Artisan.findById(req.params.id);

        if (!artisan) {
            return res.status(404).json({ error: 'Artisan not found' });
        }

        if (name) artisan.name = name;
        if (story) artisan.story = story;

        if (imageBase64) {
            try {
                const uploadRes = await imagekit.upload({
                    file: imageBase64,
                    fileName: `artisan_${req.params.id}_updated_${Date.now()}.jpg`,
                    folder: '/qala_artisans/profiles/'
                });
                artisan.image = uploadRes.url;
            } catch (err) {
                console.error("Updated Profile Image upload failed:", err);
            }
        }

        await artisan.save();
        res.json(artisan);
    } catch (error) {
        console.error("Error updating artisan:", error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Artisan login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const artisan = await Artisan.findOne({ email });
        if (!artisan) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Simplistic password check (should use hashing in production)
        if (artisan.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful',
            artisan: {
                _id: artisan._id,
                name: artisan.name,
                email: artisan.email,
                image: artisan.image
            }
        });
    } catch (error) {
        console.error("Artisan login error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
