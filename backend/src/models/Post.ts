import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    artisanId: mongoose.Types.ObjectId;
    images: string[];          // Array of image URLs/Base64
    craftName: string;         // E.g., "Terracotta Pot"
    title: string;             // AI generated or user edited
    description: string;       // AI generated
    story: string;             // Cultural context
    hashtags: string[];
    taglines: string[];
    reelScript: string;
    price: number;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema({
    artisanId: { type: Schema.Types.ObjectId, ref: 'Artisan', required: true },
    images: [{ type: String, required: true }],
    craftName: { type: String, default: 'Handmade Craft' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    story: { type: String },
    hashtags: [{ type: String }],
    taglines: [{ type: String }],
    reelScript: { type: String },
    price: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IPost>('Post', PostSchema);
