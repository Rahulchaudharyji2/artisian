"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ArrowLeft, Eye, EyeOff, Camera, User, Palette, Globe, MapPin, MessageSquare, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const INDIAN_REGIONS = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const INDIAN_CULTURES = [
    "Assamese", "Bengali", "Bhojpuri", "Bodo", "Chhattisgarhi",
    "Dogri", "Goan", "Gujarati", "Haryanvi", "Himachali", "Kashmiri",
    "Kannadiga", "Konkani", "Maithil", "Malayali", "Manipuri",
    "Marathi", "Marwari", "Mizo", "Naga", "Odia", "Punjabi", "Rajasthani",
    "Sikkimese", "Sindhi", "Tamil", "Telugu", "Tribal/Adivasi"
];

const ART_FORMS = [
    "Ajrakh Printing", "Applique Work", "Bagh Printing", "Bamboo Craft", "Bandhani (Tie & Dye)",
    "Banjara Embroidery", "Bastar Iron Craft", "Bidriware", "Block Printing", "Blue Pottery",
    "Brass Craft", "Bronze Casting", "Carpet Weaving", "Chanderi Weaving", "Chikankari Embroidery",
    "Dhokra Art", "Filigree (Tarakasi)", "Gond Art", "Ikat Weaving", "Kalamkari",
    "Kantha Embroidery", "Kashmiri Embroidery", "Kutch Embroidery", "Leather Craft",
    "Madhubani Painting", "Marble Inlay", "Metal Craft", "Miniature Painting", "Mural Painting",
    "Pattachitra", "Pashmina Weaving", "Phulkari Embroidery", "Pichwai Painting",
    "Pottery & Ceramics", "Rogan Art", "Stone Carving", "Tanjore Painting", "Terracotta",
    "Warli Art", "Wood Carving", "Zardosi Embroidery", "Other"
];

const INDIAN_LANGUAGES = [
    "Assamese", "Bengali", "Bhojpuri", "English", "Gujarati", "Hindi", "Kannada",
    "Kashmiri", "Malayalam", "Marathi", "Odia", "Punjabi", "Sanskrit",
    "Tamil", "Telugu", "Urdu", "Other"
];

const FEATURES = [
    { icon: "🎨", text: "AI-powered craft analysis" },
    { icon: "📸", text: "Professional photo enhancement" },
    { icon: "🛍️", text: "Direct buyer connections" },
    { icon: "✨", text: "Premium artisan marketplace" },
];

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [culture, setCulture] = useState('');
    const [art, setArt] = useState('');
    const [language, setLanguage] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [role, setRole] = useState<'user' | 'artisan'>('user');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const { login } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                const response = await fetch('/api/artisans/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    login(data.artisan);
                    router.push('/discover');
                    return;
                } else {
                    setError(data.error || 'Invalid login credentials');
                }
            } else {
                const response = await fetch('/api/artisans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name, email, password, role,
                        region, culture, art, language,
                        story: bio, imageBase64: profilePic
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || 'Failed to create account');
                    return;
                }
                login({ _id: data._id, name: data.name, email: data.email, image: data.image, role: data.role || role });
                router.push('/discover');
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen">
            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex relative w-[45%] xl:w-1/2 min-h-screen flex-col overflow-hidden bg-stone-950">
                <img
                    src="/h1.jpg"
                    alt="Artisan crafting"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-950/80 via-stone-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                {/* Decorative gold orb */}
                <div className="absolute top-1/3 -right-20 w-72 h-72 bg-qala-gold/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-10 w-48 h-48 bg-qala-saffron/15 rounded-full blur-2xl" />

                {/* Logo */}
                <div className="relative z-10 p-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                        <Sparkles size={18} className="text-qala-gold" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">QALA<span className="text-qala-gold">.</span></span>
                </div>

                {/* Main copy */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-qala-gold/15 border border-qala-gold/30 text-qala-gold text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                            <Sparkles size={12} />
                            AI-Powered Artisan Platform
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] mb-5">
                            Where Craft<br />Meets the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-qala-gold to-qala-saffron">Digital Age</span>
                        </h1>
                        <p className="text-stone-300 font-light text-lg leading-relaxed max-w-sm">
                            Empowering India's finest artisans with AI tools, global reach, and a community that values tradition.
                        </p>
                    </motion.div>

                    {/* Feature list */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-10 space-y-3"
                    >
                        {FEATURES.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-white/8 border border-white/10 rounded-lg flex items-center justify-center text-sm backdrop-blur-sm">{f.icon}</span>
                                <span className="text-stone-300 text-sm font-medium">{f.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom testimonial */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 m-8 p-5 bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl"
                >
                    <p className="text-stone-300 text-sm font-light italic leading-relaxed">
                        "QALA transformed my small pottery studio into a nationwide brand. My sales tripled in just 3 months."
                    </p>
                    <div className="flex items-center gap-2.5 mt-3">
                        <div className="w-7 h-7 rounded-full bg-qala-gold/30 border border-qala-gold/40 flex items-center justify-center text-xs font-bold text-qala-gold">P</div>
                        <div>
                            <p className="text-white text-xs font-bold">Priya Sharma</p>
                            <p className="text-stone-400 text-[10px]">Blue Pottery Artist, Rajasthan</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                            {[1,2,3,4,5].map(s => <span key={s} className="text-qala-gold text-xs">★</span>)}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 flex flex-col min-h-screen bg-white relative overflow-y-auto">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                            <Sparkles size={14} className="text-qala-gold" />
                        </div>
                        <span className="text-lg font-black text-stone-900">QALA<span className="text-qala-gold">.</span></span>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={16} /> Home
                    </button>
                </div>

                {/* Desktop back button */}
                <div className="hidden lg:flex absolute top-6 right-6 z-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-stone-400 hover:text-stone-700 text-sm font-medium transition-colors bg-stone-50 hover:bg-stone-100 px-4 py-2 rounded-full border border-stone-200"
                    >
                        <ArrowLeft size={14} /> Back to home
                    </button>
                </div>

                {/* Form container */}
                <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
                    <motion.div
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-md"
                    >
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p className="text-stone-400 mt-2 font-light">
                                {isLogin ? 'Sign in to your Qala account.' : 'Join thousands of Indian artisans.'}
                            </p>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium flex items-start gap-2"
                                >
                                    <span className="mt-0.5">⚠️</span> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* SIGNUP ONLY FIELDS */}
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden space-y-4"
                                    >
                                        {/* Role toggle */}
                                        <div className="p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1">
                                            <button type="button" onClick={() => setRole('user')}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'user' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                                            >
                                                🛍️ Shopper
                                            </button>
                                            <button type="button" onClick={() => setRole('artisan')}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'artisan' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                                            >
                                                ✨ Artisan
                                            </button>
                                        </div>

                                        {/* Name */}
                                        <div className="relative group">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                            <input
                                                type="text" value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white transition-all text-stone-900 placeholder-stone-400"
                                                placeholder="Full name"
                                                required={!isLogin}
                                            />
                                        </div>

                                        {/* Profile picture */}
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-4 p-4 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-qala-gold/60 hover:bg-qala-gold/5 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 border-2 border-stone-300 group-hover:border-qala-gold transition-colors shrink-0 flex items-center justify-center">
                                                {profilePic
                                                    ? <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                                                    : <Camera size={18} className="text-stone-400 group-hover:text-qala-gold transition-colors" />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-700 group-hover:text-qala-gold transition-colors">
                                                    {profilePic ? 'Photo selected ✓' : 'Upload profile photo'}
                                                </p>
                                                <p className="text-xs text-stone-400 mt-0.5">Optional · JPG, PNG</p>
                                            </div>
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </div>

                                        {/* Artisan-only fields */}
                                        <AnimatePresence>
                                            {role === 'artisan' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden space-y-4"
                                                >
                                                    <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
                                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Artisan Details</p>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="relative group">
                                                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                                            <select value={region} onChange={(e) => setRegion(e.target.value)}
                                                                className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white text-stone-700 text-sm appearance-none transition-all"
                                                            >
                                                                <option value="">Region</option>
                                                                {INDIAN_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="relative group">
                                                            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                                            <select value={culture} onChange={(e) => setCulture(e.target.value)}
                                                                className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white text-stone-700 text-sm appearance-none transition-all"
                                                            >
                                                                <option value="">Culture</option>
                                                                {INDIAN_CULTURES.map(c => <option key={c} value={c}>{c}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="relative group">
                                                            <Palette size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                                            <select value={art} onChange={(e) => setArt(e.target.value)} required
                                                                className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white text-stone-700 text-sm appearance-none transition-all"
                                                            >
                                                                <option value="">Art/Craft *</option>
                                                                {ART_FORMS.map(a => <option key={a} value={a}>{a}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="relative group">
                                                            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                                            <select value={language} onChange={(e) => setLanguage(e.target.value)}
                                                                className="w-full pl-9 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white text-stone-700 text-sm appearance-none transition-all"
                                                            >
                                                                <option value="">Language</option>
                                                                {INDIAN_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="relative group">
                                                        <MessageSquare size={14} className="absolute left-3 top-3.5 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                                                            className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white text-stone-700 text-sm resize-none transition-all"
                                                            placeholder="Tell your artisan story... (optional)"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white transition-all text-stone-900 placeholder-stone-400"
                                    placeholder="Email address" required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-qala-gold transition-colors" />
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold/50 focus:border-qala-gold focus:bg-white transition-all text-stone-900 placeholder-stone-400"
                                    placeholder="Password" required
                                />
                                <button type="button" onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={isLoading}
                                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-all duration-200 mt-2 ${
                                    isLoading
                                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                        : 'bg-stone-900 hover:bg-black text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Switch mode */}
                        <div className="mt-7 text-center">
                            <p className="text-stone-400 font-medium text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                    className="text-stone-900 font-black hover:text-qala-gold transition-colors ml-1"
                                >
                                    {isLogin ? 'Sign up →' : 'Log in →'}
                                </button>
                            </p>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-6">
                            {['🔒 Secure', '🇮🇳 Made in India', '⚡ Instant Access'].map((badge, i) => (
                                <span key={i} className="text-xs text-stone-400 font-medium">{badge}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile background overlay */}
            <div className="lg:hidden fixed inset-0 -z-10 bg-white" />
        </div>
    );
}
