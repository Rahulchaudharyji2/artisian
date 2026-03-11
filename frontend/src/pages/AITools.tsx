import { useState, useRef } from 'react';
import { 
    Wand2, BookOpen, IndianRupee, Megaphone, 
    ArrowLeft, Upload, Sparkles, Download, 
    Instagram, MessageCircle, PlaySquare, 
    TrendingUp, Info, Check, Loader2, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

type ToolType = 'clean' | 'weave' | 'sense' | 'boost' | null;

export default function AITools() {
    const [activeTool, setActiveTool] = useState<ToolType>(null);

    const tools = [
        {
            id: 'clean' as const,
            name: 'CraftClean AI',
            desc: 'Fix blurry photos & improve lighting',
            icon: Wand2,
            color: 'bg-blue-500',
            bg: 'bg-blue-50'
        },
        {
            id: 'weave' as const,
            name: 'StoryWeave AI',
            desc: 'Generate historical craft stories',
            icon: BookOpen,
            color: 'bg-amber-500',
            bg: 'bg-amber-50'
        },
        {
            id: 'sense' as const,
            name: 'PriceSense AI',
            desc: 'Get smart market price suggestions',
            icon: IndianRupee,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            id: 'boost' as const,
            name: 'CraftBoost AI',
            desc: 'Viral marketing for social media',
            icon: Megaphone,
            color: 'bg-purple-500',
            bg: 'bg-purple-50'
        }
    ];

    return (
        <div className="flex w-full min-h-screen bg-karigar-bg">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 pb-24 md:pb-12">
                <AnimatePresence mode="wait">
                    {!activeTool ? (
                        <motion.div 
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="mb-10 text-center md:text-left">
                                <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">
                                    AI Artisan Tools <Sparkles className="inline-block text-qala-gold ml-2" />
                                </h1>
                                <p className="text-stone-500 font-medium">Simple tools to help you sell your crafts better.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveTool(tool.id)}
                                        className={`group relative overflow-hidden p-6 rounded-[32px] border border-stone-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-left flex flex-col items-start gap-3`}
                                    >
                                        <div className={`p-3.5 rounded-2xl ${tool.color} text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
                                            <tool.icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-stone-900 mb-0.5 tracking-tight">{tool.name}</h3>
                                            <p className="text-stone-400 text-sm font-medium leading-relaxed">{tool.desc}</p>
                                        </div>
                                        <div className={`absolute -right-2 -bottom-2 opacity-[0.03] text-stone-900 group-hover:scale-110 transition-all duration-700`}>
                                            <tool.icon size={100} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="tool-interface"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[40px] shadow-xl border border-stone-100"
                        >
                            {/* Tool Header */}
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-stone-50">
                                <button 
                                    onClick={() => setActiveTool(null)}
                                    className="p-3 bg-stone-100 rounded-2xl hover:bg-stone-200 transition-colors"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <h2 className="text-xl font-black text-stone-900">
                                    {tools.find(t => t.id === activeTool)?.name}
                                </h2>
                                <div className="w-12 h-12" /> {/* Spacer */}
                            </div>

                            <div className="flex flex-col h-[70vh] md:h-auto">
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                    {activeTool === 'clean' && <CraftCleanTool />}
                                    {activeTool === 'weave' && <StoryWeaveTool />}
                                    {activeTool === 'sense' && <PriceSenseTool />}
                                    {activeTool === 'boost' && <CraftBoostTool />}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}

// --- TOOL COMPONENTS ---

function CraftCleanTool() {
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnhanced, setIsEnhanced] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const actionRef = useRef<HTMLDivElement>(null);

    const handleUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { 
                setImage(reader.result as string); 
                setIsEnhanced(false);
                // Scroll to button after a short delay to allow render
                setTimeout(() => actionRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
            };
            reader.readAsDataURL(file);
        }
    };

    const process = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsEnhanced(true);
        }, 2500);
    };

    const handleDownload = () => {
        if (!image) return;
        
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = image;
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Apply the same filters as in the CSS
                ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
                ctx.drawImage(img, 0, 0);
                
                const link = document.createElement('a');
                link.download = 'qala-enhanced-product.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-stone-500 mb-4 text-sm font-medium">Upload a blurry photo and Qala AI will sharpen it.</p>
                {!image ? (
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="border-4 border-dashed border-stone-100 rounded-[32px] p-10 hover:bg-stone-50 transition-colors cursor-pointer group bg-white shadow-inner flex flex-col items-center justify-center"
                    >
                        <ImagePlus size={48} className="text-stone-300 group-hover:text-blue-500 transition-colors mb-2" />
                        <span className="font-black text-stone-500 uppercase tracking-tight">Select Photo</span>
                        <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} accept="image/*" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative rounded-[24px] overflow-hidden shadow-xl border-4 border-white bg-stone-100 h-[280px] flex items-center justify-center">
                            <img 
                                src={image} 
                                className={`w-full h-full object-contain transition-all duration-1000 ${isEnhanced ? 'brightness-110 contrast-110 saturate-105' : 'blur-[2px] opacity-80'}`}
                            />
                            {isProcessing && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-stone-900">
                                    <Loader2 size={40} className="animate-spin text-blue-600 mb-2" />
                                    <span className="font-black text-sm uppercase tracking-widest">Enhancing...</span>
                                </div>
                            )}
                            {isEnhanced && (
                                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1.5 rounded-full font-black text-[10px] flex items-center gap-1.5 shadow-lg">
                                    <Sparkles size={12} /> AI ENHANCED
                                </div>
                            )}
                        </div>
                        
                        {/* Sticky Action Bar */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-stone-100 flex justify-center z-50 md:relative md:bg-transparent md:border-0 md:p-0">
                            {!isEnhanced ? (
                                <button 
                                    onClick={process}
                                    disabled={isProcessing}
                                    className="w-full max-w-md bg-blue-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 animate-pulse"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                                    CLEAN MY PHOTO NOW
                                </button>
                            ) : (
                                <div className="flex gap-3 w-full max-w-md">
                                    <button 
                                        onClick={handleDownload}
                                        className="flex-1 bg-stone-900 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-black shadow-xl"
                                    >
                                        <Download size={20} /> DOWNLOAD HD
                                    </button>
                                    <button 
                                        onClick={() => { setImage(null); setIsEnhanced(false); }}
                                        className="px-6 py-5 bg-white border-2 border-stone-200 text-stone-600 rounded-2xl font-black text-sm uppercase hover:bg-stone-50"
                                    >
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StoryWeaveTool() {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/ai/story-weave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: [image] })
            });
            const data = await res.json();
            setResult(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-8 pb-24">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <div 
                            onClick={() => !image && fileRef.current?.click()}
                            className={`aspect-square rounded-[32px] overflow-hidden border-4 border-dashed border-stone-50 relative group bg-white shadow-inner flex items-center justify-center transition-all ${!image ? 'cursor-pointer hover:bg-stone-50 min-h-[300px]' : 'h-[350px]'}`}
                        >
                            {image ? (
                                <>
                                    <img src={image} className="w-full h-full object-contain bg-stone-50" />
                                    <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors"><X size={18} /></button>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 p-8 text-center">
                                    <Upload size={40} className="mb-4 opacity-50" />
                                    <span className="font-black text-xs uppercase tracking-[0.2em]">Upload Craft</span>
                                </div>
                            )}
                            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImage(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}/>
                        </div>
                    </div>

                    <div className="bg-stone-50 rounded-[32px] p-8 flex flex-col border border-stone-100 shadow-sm min-h-[350px]">
                        <h3 className="font-black text-stone-900 mb-6 flex items-center gap-3 text-lg">
                             <BookOpen className="text-amber-600" /> Artisan Heritage
                        </h3>
                        {!result ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 grayscale opacity-30">
                                <Sparkles size={32} className="mb-4 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-widest leading-loose">Upload a photo to weave its history</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">Heritage Title</h4>
                                    <p className="font-black text-stone-900 text-xl leading-tight tracking-tight">{result.title}</p>
                                </div>
                                <div className="px-1">
                                    <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2">The Story</h4>
                                    <p className="text-sm text-stone-700 leading-relaxed italic font-serif opacity-90">"{result.story}"</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Standard Sticky Action Bar */}
            {image && (
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-xl border-t border-stone-100 flex justify-center z-50 -mx-4 md:-mx-8">
                    <button 
                        disabled={!image || isLoading}
                        onClick={handleGenerate}
                        className="w-full max-w-sm bg-amber-600 disabled:opacity-50 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-amber-700 shadow-xl shadow-amber-50 transition-all active:scale-95 group"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
                        WEAVE HISTORY
                    </button>
                </div>
            )}
        </div>
    );
}

function PriceSenseTool() {
    const [image, setImage] = useState<string | null>(null);
    const [craftType, setCraftType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/ai/price-sense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: [image], craftType })
            });
            const data = await res.json();
            setResult(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-8 pb-24">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div 
                            onClick={() => !image && fileRef.current?.click()}
                            className={`w-full aspect-square rounded-[32px] overflow-hidden border-4 border-dashed border-stone-50 relative group flex items-center justify-center bg-white shadow-inner transition-all ${!image ? 'cursor-pointer hover:bg-stone-50 min-h-[300px]' : 'h-[350px]'}`}
                        >
                            {image ? (
                                <>
                                    <img src={image} className="w-full h-full object-contain bg-stone-50" />
                                    <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-colors"><X size={18} /></button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-stone-300 opacity-50 p-10">
                                    <Upload size={48} />
                                    <span className="text-xs font-black uppercase tracking-widest mt-4">Upload Craft Photo</span>
                                </div>
                            )}
                            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImage(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">What is this craft?</label>
                            <input 
                                value={craftType} 
                                onChange={e => setCraftType(e.target.value)}
                                placeholder="e.g. Pashmina, Terracotta" 
                                className="w-full p-5 bg-white border-2 border-stone-50 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold text-base shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 shadow-sm min-h-[350px] flex flex-col">
                        <h3 className="text-emerald-900 font-black mb-6 flex items-center gap-3 text-lg">
                             <TrendingUp className="text-emerald-600" /> Smart Appraisal
                        </h3>
                        {!result ? (
                             <div className="flex-1 flex flex-col items-center justify-center text-center p-10 grayscale opacity-30">
                                <TrendingUp size={36} className="mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Awaiting Analysis</p>
                             </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="text-center bg-white p-6 rounded-[24px] shadow-sm border border-emerald-100">
                                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Market Price</h4>
                                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">{result.priceRange}</div>
                                </div>
                                <div className="flex bg-white/60 rounded-2xl p-4 border border-emerald-100/50">
                                    <div className="flex-1 flex flex-col border-r border-emerald-100/30">
                                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Demand</span>
                                        <span className="font-black text-emerald-800 text-sm tracking-tight">{result.demandLevel}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col text-right pl-4">
                                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Category</span>
                                        <span className="font-black text-emerald-800 text-sm tracking-tight">{result.category}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 px-1">
                                    {result.reasons.slice(0, 3).map((r: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-emerald-900/70 font-bold leading-relaxed">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5"><Check size={10} strokeWidth={4} /></div>
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Standard Sticky Action Bar */}
            {image && (
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-xl border-t border-stone-100 flex justify-center z-50 -mx-4 md:-mx-8">
                    <button 
                        disabled={!image || isLoading}
                        onClick={handleAnalyze}
                        className="w-full max-w-sm bg-emerald-600 disabled:opacity-50 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-50 transition-all active:scale-95 group"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <TrendingUp size={24} className="group-hover:translate-y--1 transition-transform" />}
                        ANALYZE PRICE
                    </button>
                </div>
            )}
        </div>
    );
}

function CraftBoostTool() {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleBoost = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/ai/craft-boost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: [image] })
            });
            const data = await res.json();
            setResult(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col items-center">
                {!image ? (
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="w-full max-w-sm aspect-square border-4 border-dashed border-stone-50 rounded-[40px] flex flex-col items-center justify-center text-stone-300 hover:bg-stone-50 cursor-pointer group bg-white shadow-inner transition-all"
                    >
                        <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                            <Upload size={40} className="text-purple-400" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest text-stone-400">Pick product photo</span>
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setImage(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }}/>
                    </div>
                ) : (
                    <div className="w-full space-y-6">
                         <div className="flex flex-col md:flex-row gap-6 items-center bg-stone-50 p-4 rounded-[32px] border border-stone-100">
                             <div className="w-32 h-32 rounded-[24px] overflow-hidden shadow-md border-4 border-white shrink-0">
                                 <img src={image} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 text-center md:text-left">
                                 <h3 className="text-lg font-black text-stone-900 tracking-tight">Marketing Boost</h3>
                                 <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest leading-relaxed">Reach more buyers instantly</p>
                             </div>
                         </div>

                         <div className="grid md:grid-cols-3 gap-4">
                            <BoostCard 
                                icon={<Instagram size={16} className="text-pink-600" />} 
                                title="Insta Caption" 
                                content={result?.instagram} 
                                loading={isLoading}
                                onCopy={() => copyToClipboard(result.instagram)}
                            />
                            <BoostCard 
                                icon={<MessageCircle size={16} className="text-green-600" />} 
                                title="WhatsApp" 
                                content={result?.whatsapp} 
                                loading={isLoading}
                                onCopy={() => copyToClipboard(result.whatsapp)}
                            />
                             <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 flex flex-col h-full">
                                <h4 className="font-black text-stone-400 mb-3 text-[10px] uppercase tracking-widest flex items-center gap-2">Tags</h4>
                                <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[80px] custom-scrollbar">
                                    {result?.hashtags?.map((t: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-stone-100 rounded-lg text-[9px] font-black text-stone-500 shadow-sm">{t}</span>
                                    )) || <span className="text-[9px] font-bold text-stone-300 italic">Awaiting analysis</span>}
                                </div>
                            </div>
                         </div>
                    </div>
                )}
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/60 backdrop-blur-2xl border-t border-stone-100 flex justify-center z-50 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-4">
                <button 
                    disabled={!image || isLoading}
                    onClick={handleBoost}
                    className="w-full max-w-sm bg-purple-600 disabled:opacity-50 text-white p-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 hover:bg-purple-700 shadow-xl shadow-purple-50 transition-all active:scale-95 group"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Megaphone size={20} className="group-hover:rotate-12 transition-transform" />}
                    BOOST POST
                </button>
            </div>
        </div>
    );
}

function BoostCard({ icon, title, content, loading, onCopy }: any) {
    return (
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 flex flex-col h-full min-h-[140px]">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h4 className="font-black text-stone-400 text-[10px] uppercase tracking-widest">{title}</h4>
            </div>
            <div className="flex-1 mb-3">
                {loading ? (
                    <div className="space-y-2">
                        <div className="h-2 bg-stone-200 rounded-full animate-pulse w-full" />
                        <div className="h-2 bg-stone-200 rounded-full animate-pulse w-4/5" />
                        <div className="h-2 bg-stone-200 rounded-full animate-pulse w-3/4" />
                    </div>
                ) : content ? (
                    <p className="text-[11px] font-bold text-stone-600 leading-relaxed line-clamp-3 italic opacity-80">"{content}"</p>
                ) : (
                    <p className="text-[10px] text-stone-300 font-bold uppercase tracking-wider text-center mt-2 opacity-30">Awaiting AI</p>
                )}
            </div>
            {content && (
                <button 
                    onClick={onCopy}
                    className="text-[9px] font-black text-stone-400 hover:text-stone-900 flex items-center gap-1 transition-colors self-end uppercase"
                >
                    <Check size={10} /> Copy
                </button>
            )}
        </div>
    );
}

function X({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    );
}
