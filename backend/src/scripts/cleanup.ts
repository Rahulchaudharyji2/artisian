import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artisan from '../models/Artisan';
import Post from '../models/Post';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'admin@kala-ai.com';

async function cleanup() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI not found in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for cleanup...");

        // Find all artisans except the admin
        const artisansToDelete = await Artisan.find({ email: { $ne: ADMIN_EMAIL } });
        const artisanIds = artisansToDelete.map(a => a._id);

        console.log(`Found ${artisansToDelete.length} non-admin artisans to delete.`);

        // Delete their posts first
        const postsResult = await Post.deleteMany({ artisanId: { $in: artisanIds } });
        console.log(`Deleted ${postsResult.deletedCount} posts.`);

        // Delete the artisans
        const artisanResult = await Artisan.deleteMany({ email: { $ne: ADMIN_EMAIL } });
        console.log(`Deleted ${artisanResult.deletedCount} artisans.`);

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
