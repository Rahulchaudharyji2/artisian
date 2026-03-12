"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const INDIAN_REGIONS = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const INDIAN_CULTURES = [
    "Assamese", "Awadhi", "Bengali", "Bhojpuri", "Bodo", "Bundeli", "Chhattisgarhi",
    "Dogri", "Garhwali", "Garo", "Goan", "Gujarati", "Haryanvi", "Himachali", "K Kashmiri",
    "Kannadiga", "Khasi", "Konkani", "Kumaoni", "Maithil", "Malayali", "Manipuri",
    "Marathi", "Marwari", "Mizo", "Naga", "Odia", "Pahari", "Punjabi", "Rajasthani",
    "Sikkimese", "Sindhi", "Tamil", "Telugu", "Tribal/Adivasi"
];

const ART_FORMS = [
    "Ajrakh Printing", "Applique Work", "Bagh Printing", "Bamboo Craft", "Bandhani (Tie & Dye)",
    "Banjara Embroidery", "Bastar Iron Craft", "Bidriware", "Block Printing", "Blue Pottery",
    "Bone & Horn Craft", "Brass Craft", "Bronze Casting", "Cane Craft", "Carpet Weaving",
    "Chamba Rumal", "Chanderi Weaving", "Chikankari Embroidery", "Coir Craft", "Dhokra Art",
    "Filigree (Tarakasi)", "Gond Art", "Ikat Weaving", "Jute Craft", "Kalamkari",
    "Kantha Embroidery", "Kashmiri Embroidery", "Kondapalli Toys", "Kutch Embroidery",
    "Leather Puppetry", "Leather Craft", "Longpi Pottery", "Macrame", "Madhubani Painting",
    "Marble Inlay", "Metal Craft", "Miniature Painting", "Muga Silk Weaving", "Mural Painting",
    "Naga Weaving", "Pattachitra", "Pashmina Weaving", "Phad Painting", "Phulkari Embroidery",
    "Pichwai Painting", "Pottery & Ceramics", "Rogan Art", "Sabuwa Weaving", "Sanjhi Art",
    "Shell Craft", "Shola Pith Craft", "Sitalpati", "Stone Carving", "Suar Wood Carving",
    "Sujini Embroidery", "Tanjore Painting", "Terracotta", "Toda Embroidery", "Warli Art",
    "Wood Carving", "Zardosi Embroidery", "Other"
];

const INDIAN_LANGUAGES = [
    "Assamese", "Bengali", "Bhojpuri", "Bodo", "Chhattisgarhi", "Dogri", "English",
    "Gujarati", "Hindi", "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam",
    "Manipuri", "Marathi", "Marwari", "Nepali", "Odia", "Punjabi", "Rajasthani",
    "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Tulu", "Urdu", "Other"
];

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [culture, setCulture] = useState('');
    const [art, setArt] = useState('');
    const [language, setLanguage] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [role, setRole] = useState<'user' | 'artisan'>('user'); // Default to normal user
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const { login } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                // Artisan Login check
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
                // Signup flow
                const response = await fetch('/api/artisans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        password, 
                        role,
                        region, 
                        culture, 
                        art, 
                        language, 
                        story: bio,
                        imageBase64: profilePic 
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to create account');
                    return;
                }

                // Success! Log the user in
                login({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    image: data.image,
                    role: data.role || role
                });
                
                // Redirect to Profile or Discover based on role
                router.push(role === 'artisan' ? '/profile' : '/discover');
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            {/* Left Box - Image Section */}
            <div className="hidden lg:flex relative w-1/2 h-full bg-stone-900 overflow-hidden">
                <img
                    src="/h1.jpg"
                    alt="Artisan crafting"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    onError={(e) => {
                        // Fallback gradient if user hasn't copied the image yet
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                <div className="absolute inset-0 flex items-center justify-center -z-0">
                    <div className="w-full h-full bg-qala-earth/20" />
                </div>

                <div className="relative z-20 flex flex-col justify-end p-12 pb-24 h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-black text-white leading-tight mb-4 flex items-center gap-2">
                            QALA <Sparkles className="text-qala-gold h-12 w-12" />
                        </h1>
                        <p className="text-2xl font-light text-stone-200 max-w-md leading-relaxed">
                            Empowering Indian artisans. Discover, connect, and support the roots of traditional craftsmanship.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Box - Auth Form Section */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-8 bg-stone-50 overflow-y-auto relative">
                
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium z-10 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200"
                >
                    <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Back</span>
                </button>

                <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border border-stone-100 my-auto mt-16 sm:mt-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-stone-900">
                            {isLogin ? 'Welcome Back' : 'Join Qala'}
                        </h2>
                        <p className="text-stone-500 mt-2">
                            {isLogin ? 'Sign in to continue your journey.' : 'Start discovering unique artisans today.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="signup-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-4"
                                >
                                    {/* Role Selector Tabs */}
                                    <div className="flex p-1 bg-stone-100 rounded-2xl mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setRole('user')}
                                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === 'user' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                                        >
                                            Join as Shopper
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('artisan')}
                                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === 'artisan' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                                        >
                                            Join as Artisan
                                        </button>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-sm font-bold text-stone-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow"
                                            placeholder="Arjun Sharma"
                                            required={!isLogin}
                                        />
                                    </div>
                                    {/* Artisan Only Fields */}
                                    <AnimatePresence>
                                        {role === 'artisan' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 pb-2"
                                            >
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-stone-700">Region <span className="text-stone-400 font-normal">(Optional)</span></label>
                                                        <select
                                                            value={region}
                                                            onChange={(e) => setRegion(e.target.value)}
                                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow text-stone-700 text-sm"
                                                        >
                                                            <option value="">Select Region</option>
                                                            {INDIAN_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-stone-700">Culture <span className="text-stone-400 font-normal">(Optional)</span></label>
                                                        <select
                                                            value={culture}
                                                            onChange={(e) => setCulture(e.target.value)}
                                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow text-stone-700 text-sm"
                                                        >
                                                            <option value="">Select Culture</option>
                                                            {INDIAN_CULTURES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                    
                                                <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-stone-700">Art/Craft</label>
                                                    <select
                                                        value={art}
                                                        onChange={(e) => setArt(e.target.value)}
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow text-stone-700 text-sm"
                                                        required
                                                    >
                                                        <option value="">Select Art Form</option>
                                                        {ART_FORMS.map(a => <option key={a} value={a}>{a}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-stone-700">Language <span className="text-stone-400 font-normal">(Optional)</span></label>
                                                    <select
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value)}
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow text-stone-700 text-sm"
                                                    >
                                                        <option value="">Select Language</option>
                                                        {INDIAN_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                                    </select>
                                                </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700">Profile Picture</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center overflow-hidden">
                                                {profilePic ? (
                                                    <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Sparkles className="text-stone-300" />
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="flex-1 text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-black cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {role === 'artisan' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <label className="text-sm font-bold text-stone-700">About You / Bio</label>
                                                <textarea
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    rows={3}
                                                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow text-sm"
                                                    placeholder="Tell your story as an artisan..."
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-qala-gold transition-shadow"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full p-4 mt-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black hover:shadow-lg transition-all active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')} {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                        <p className="text-stone-500 font-medium">
                            {isLogin ? "Don't have an account?" : "Already possess an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-qala-gold font-bold hover:underline focus:outline-none"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile background fallback */}
            <div className="lg:hidden absolute inset-0 -z-10 bg-stone-900">
                <img
                    src="/h1.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
        </div>
    );
}
