import mongoose, { Schema, Document } from 'mongoose';

export interface IArtisan extends Document {
    name: string;
    email?: string;
    password?: string;
    role: 'user' | 'artisan';
    region?: string;
    culture?: string;
    language?: string;
    craft?: string;
    image: string;
    portfolio?: string[];
    story?: string;
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
    role: { type: String, enum: ['user', 'artisan'], default: 'user' },
    region: { type: String },
    culture: { type: String },
    language: { type: String },
    craft: { type: String },
    image: { type: String, required: true },
    portfolio: [{ type: String }],
    story: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    tags: [{ type: String }],
}, {
    timestamps: true
});

export default mongoose.models.Artisan || mongoose.model<IArtisan>('Artisan', ArtisanSchema);
