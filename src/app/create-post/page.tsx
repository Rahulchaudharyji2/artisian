"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ArrowRight, Sparkles, ImagePlus, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';

type Step = 'upload' | 'context' | 'generating' | 'review';

export default function CreatePost() {
    const [step, setStep] = useState<Step>('upload');
    const [images, setImages] = useState<string[]>([]);
    const [context, setContext] = useState({
        craft: '',
        region: '',
        material: '',
        description: ''
    });

    // AI Generated Data State
    const [aiData, setAiData] = useState<any>(null);
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { user } = useAuth();

    // Handle Image Upload & Convert to Base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Limit to 5 images for MVP
        const validFiles = files.slice(0, 5);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Call Gemini API
    const handleGenerate = async () => {
        if (images.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        setError('');
        setStep('generating');

        try {
            const response = await fetch('/api/ai/generate-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images, context })
            });

            if (!response.ok) {
                if (response.status === 413) {
                    throw new Error('Images are too large to process. Please try a smaller image.');
                }
                const errorData = await response.json().catch(() => ({ error: `Server error (${response.status})` }));
                const detailMsg = errorData.details ? `: ${errorData.details}` : '';
                throw new Error(`${errorData.error || 'Failed to generate content'}${detailMsg}`);
            }

            const result = await response.json();

            setAiData(result.data);
            setStep('review');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error communicating with AI');
            setStep('context'); // Go back so they can try again
        }
    };

    // Final Publish payload
    const handlePublish = async () => {
        if (!price || isNaN(Number(price))) {
            setError('Please enter a valid price');
            return;
        }

        try {
            let artisanId = user?._id;
            
            if (!artisanId) {
                console.log("No artisanId in context, checking fallback...");
                const res = await fetch('/api/artisans?limit=1');
                const data = await res.json();
                if (data && data.length > 0) {
                    artisanId = data[0]._id;
                }
            }

            if (!artisanId) {
                throw new Error('Please sign in as an artisan to publish posts.');
            }

            const payload = {
                artisanId,
                images,
                craftName: aiData.detectedCraft,
                title: aiData.title,
                description: aiData.description,
                story: aiData.story,
                hashtags: aiData.hashtags,
                taglines: aiData.taglines,
                reelScript: aiData.reelScript,
                price: Number(price)
            };

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to publish post');

            // Success, route to profile
            router.push('/profile');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-stone-50 selection:bg-qala-gold/30">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col items-center p-6 pb-24 md:pb-12 max-w-3xl mx-auto w-full">

                {/* Header Header */}
                <div className="w-full text-center mt-6 mb-8">
                    <h1 className="text-3xl font-black text-stone-900 flex items-center justify-center gap-2">
                        Create with Qala AI <Sparkles className="text-qala-gold" />
                    </h1>
                    <p className="text-stone-500 mt-2">Upload your craft and let our AI write the perfect story.</p>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="w-full p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-12">

                    {/* Stepper Progress */}
                    {step !== 'generating' && (
                        <div className="flex border-b border-stone-100">
                            {['upload', 'context', 'review'].map((s, idx) => (
                                <div key={s} className={`flex-1 p-4 text-center text-sm font-bold capitalize transition-colors ${step === s ? 'bg-stone-50 text-qala-gold border-b-2 border-qala-gold'
                                        : 'text-stone-400'
                                    }`}>
                                    {idx + 1}. {s}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: UPLOAD IMAGES */}
                            {step === 'upload' && (
                                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    {/* Image Preview Grid */}
                                    {images.length > 0 ? (
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-stone-200 shadow-sm">
                                                    <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                        className="absolute top-1 right-1 bg-black/60 text-white p-1.5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {images.length < 5 && (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full aspect-square border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-stone-400 hover:border-qala-gold hover:bg-stone-50 cursor-pointer transition-all"
                                                >
                                                    <ImagePlus size={24} className="mb-1" />
                                                    <span className="text-xs font-bold">Add</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full border-2 border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center text-stone-500 hover:border-qala-gold hover:bg-stone-50 cursor-pointer transition-all bg-stone-50/50"
                                        >
                                            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                                <Upload size={32} className="text-stone-400" />
                                            </div>
                                            <p className="font-bold text-stone-700 text-lg">Tap to upload photos</p>
                                            <p className="text-sm mt-2 text-stone-400">PNG, JPG up to 5 images</p>
                                        </div>
                                    )}

                                    <input
                                        type="file" multiple accept="image/*" className="hidden"
                                        ref={fileInputRef} onChange={handleImageUpload}
                                    />

                                    <button
                                        disabled={images.length === 0}
                                        onClick={() => setStep('context')}
                                        className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${images.length > 0 ? 'bg-stone-900 text-white hover:bg-black' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
                                    >
                                        Continue <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: OPTIONAL CONTEXT */}
                            {step === 'context' && (
                                <motion.div key="context" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                    <p className="text-stone-500 text-sm mb-6">Give Qala AI a hint about your product (all fields optional).</p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700">What is this craft?</label>
                                        <input type="text" placeholder="e.g., Terracotta Pot, Pashmina Shawl" value={context.craft} onChange={e => setContext({ ...context, craft: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Region</label>
                                            <input type="text" placeholder="e.g., Khurja, UP" value={context.region} onChange={e => setContext({ ...context, region: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Material</label>
                                            <input type="text" placeholder="e.g., River Clay" value={context.material} onChange={e => setContext({ ...context, material: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700">Any special details?</label>
                                        <textarea placeholder="e.g., Takes 3 days to fire in wood kiln..." value={context.description} onChange={e => setContext({ ...context, description: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm h-24 resize-none" />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setStep('upload')} className="px-6 py-4 rounded-xl font-bold border border-stone-200 text-stone-600 hover:bg-stone-50">Back</button>
                                        <button onClick={handleGenerate} className="flex-1 bg-stone-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all group">
                                            <Sparkles size={20} className="text-qala-gold group-hover:scale-110 transition-transform" /> Generate with AI
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: LOADING GENERATION */}
                            {step === 'generating' && (
                                <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-64 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-qala-gold blur-xl opacity-20 rounded-full animate-pulse"></div>
                                        <Loader2 size={48} className="text-qala-gold animate-spin relative z-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-stone-900">Qala AI is analyzing your craft...</h3>
                                        <p className="text-stone-500 text-sm mt-2 max-w-xs mx-auto">Writing cultural stories, generating hashtags, and optimizing your marketing copy.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: REVIEW & PUBLISH */}
                            {step === 'review' && aiData && (
                                <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
                                        <Check className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <span className="font-bold">Content generated successfully!</span> Review and edit the details below before publishing to your store.
                                        </div>
                                    </div>

                                    {/* Main Image Banner */}
                                    <div className="w-full h-48 bg-stone-100 rounded-xl overflow-hidden relative">
                                        <img src={images[0]} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <div className="flex gap-2 text-white text-xs font-bold drop-shadow-md">
                                                <span className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">{aiData.detectedCraft}</span>
                                                <span className="bg-qala-gold/90 backdrop-blur-md px-2 py-1 rounded-md text-stone-900">AI Enhanced</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Product Title</label>
                                            <input type="text" value={aiData.title} onChange={e => setAiData({ ...aiData, title: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Cultural Story</label>
                                            <textarea value={aiData.story} onChange={e => setAiData({ ...aiData, story: e.target.value })} className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none shadow-sm h-32 resize-none text-stone-600 text-sm leading-relaxed" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-stone-700">Set Your Price (₹)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">₹</span>
                                                <input type="number" placeholder="2500" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 pl-8 bg-white shadow-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-qala-gold outline-none font-bold text-lg" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-stone-700 mb-2 block">Generated Hashtags</label>
                                            <div className="flex flex-wrap gap-2">
                                                {aiData.hashtags.map((tag: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-lg">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-stone-100">
                                        <button onClick={() => setStep('context')} className="px-6 py-4 rounded-xl font-bold border border-stone-200 text-stone-600 hover:bg-stone-50">Edit</button>
                                        <button onClick={handlePublish} className="flex-1 bg-stone-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                                            Publish to Store <Upload size={20} />
                                        </button>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
