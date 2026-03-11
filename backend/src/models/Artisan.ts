import mongoose, { Schema, Document } from 'mongoose';

export interface IArtisan extends Document {
    name: string;
    email?: string;
    password?: string;
    region: string;
    culture?: string;
    language?: string;
    craft: string;
    image: string;
    portfolio: string[];       // Array of ImageKit URLs
    story: string;
    likes: number;
    comments: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ArtisanSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    region: { type: String, required: true },
    culture: { type: String },
    language: { type: String },
    craft: { type: String, required: true },
    image: { type: String, required: true }, // URL to image
    portfolio: [{ type: String }],           // Array of ImageKit URLs
    story: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    tags: [{ type: String }],
}, {
    timestamps: true
});

export default mongoose.model<IArtisan>('Artisan', ArtisanSchema);
