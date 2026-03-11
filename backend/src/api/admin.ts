import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Artisan from '../models/Artisan';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-qala';

// Admin Login Route
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const adminEmail = process.env.VITE_ADMIN_EMAIL;
    const adminPassword = process.env.VITE_ADMIN_PASSWORD;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (email === adminEmail && password === adminPassword) {
        // Issue JWT token
        const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, message: 'Login successful' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Admin Route to get all Artisans (Protected)
router.get('/artisans', requireAdmin, async (req: Request, res: Response) => {
    try {
        const artisans = await Artisan.find().sort({ createdAt: -1 });
        res.json(artisans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artisans' });
    }
});

export default router;
