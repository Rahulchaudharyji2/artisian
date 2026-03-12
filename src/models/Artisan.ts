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
    art?: string;
    image: string;
    portfolio?: string[];
    story?: string;
    likes: number;
    comments: number;
    tags: string[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
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
    art: { type: String },
    image: { type: String, required: true },
    portfolio: [{ type: String }],
    story: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    tags: [{ type: String }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'Artisan' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'Artisan' }],
}, {
    timestamps: true
});

// Text index for search
ArtisanSchema.index({ name: 'text', craft: 'text', art: 'text', region: 'text', tags: 'text' });

export default mongoose.models.Artisan || mongoose.model<IArtisan>('Artisan', ArtisanSchema);
