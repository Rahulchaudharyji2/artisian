"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
    Sparkles, ArrowRight, Palette, Globe, HeartHandshake, 
    Mic, Wand2, TrendingUp, BarChart3, Star, Zap
} from 'lucide-react';
import Image from 'next/image';

export default function Landing() {
    const router = useRouter();
    
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const aiFeatures = [
        {
            title: "Voice-First Interface",
            description: "Artisans speak in their native language; AI handles the listings, translations, and chat seamlessly.",
            icon: Mic,
            gradient: "from-qala-gold to-qala-saffron",
            glow: "shadow-[0_0_30px_rgba(212,175,55,0.3)]",
            delay: 0.1
        },
        {
            title: "AI Storyteller",
            description: "Instantly generates rich cultural narratives and engaging product descriptions from a single photo.",
            icon: Wand2,
            gradient: "from-qala-saffron to-qala-terracotta",
            glow: "shadow-[0_0_30px_rgba(255,153,51,0.3)]",
            delay: 0.2
        },
        {
            title: "Trend Intelligence",
            description: "Suggests trending styles, keywords, and dynamic pricing metrics in real-time based on market data.",
            icon: TrendingUp,
            gradient: "from-qala-terracotta to-rose-600",
            glow: "shadow-[0_0_30px_rgba(226,114,91,0.3)]",
            delay: 0.3
        },
        {
            title: "Analytics Dashboard",
            description: "Tracks views, sales, and deep customer insights simply and intuitively for exponential business growth.",
            icon: BarChart3,
            gradient: "from-stone-400 to-stone-600",
            glow: "shadow-[0_0_30px_rgba(168,162,158,0.3)]",
            delay: 0.4
        }
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-stone-50 selection:bg-qala-gold/30">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-5 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="relative flex items-center justify-center w-10 h-10 bg-stone-900 rounded-xl overflow-hidden shadow-lg">
                        <Sparkles className="text-qala-gold h-5 w-5 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-qala-gold/20 to-transparent opacity-50"></div>
                    </div>
                    <span className="text-2xl font-black text-stone-900 tracking-tighter">QALA</span>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.push('/auth')}
                        className="group relative px-6 py-2.5 rounded-full bg-stone-900 text-white font-bold overflow-hidden shadow-lg hover:shadow-xl hover:shadow-stone-900/20 transition-all active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-qala-gold via-qala-saffron to-qala-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            Join Qala <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full h-[100svh] flex items-center overflow-hidden">
                <motion.div 
                    style={{ y: yHero, opacity: opacityHero }}
                    className="absolute inset-0 z-0 origin-top"
                >
                    <img
                        src="/h1.jpg"
                        alt="Indian Artisan Crafting"
                        className="w-full h-full object-cover scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1605814578122-f327bdcb8a14?q=80&w=2940&auto=format&fit=crop";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-stone-900" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20">
                    <div className="w-full lg:w-2/3 xl:w-3/5">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                                <Sparkles className="w-4 h-4 text-qala-gold animate-pulse" />
                                <span className="text-white font-bold text-xs tracking-widest uppercase">The Future of Craftsmanship</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-8xl font-black text-white leading-[1.05] tracking-tighter">
                                Wear the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-qala-gold via-yellow-200 to-qala-saffron drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                                    Heritage.
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl font-light text-stone-300 max-w-2xl leading-relaxed">
                                Join India's most advanced platform for artisans. Connect directly with creators, discover authentic traditions, and experience the power of AI-driven commerce.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                                <button 
                                    onClick={() => router.push('/auth')}
                                    className="w-full sm:w-auto px-8 py-4 bg-qala-gold text-stone-950 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                                >
                                    Start Exploring <ArrowRight className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => router.push('/auth')}
                                    className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md flex items-center justify-center gap-2"
                                >
                                    I am an Artisan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
                >
                    <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Scroll</span>
                    <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
                        <motion.div 
                            animate={{ y: [0, 48] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-full h-1/2 bg-qala-gold absolute top-0"
                        />
                    </div>
                </motion.div>
            </section>

            {/* AI Capabilities Section (NEW) */}
            <section className="py-32 relative bg-stone-950 overflow-hidden">
                {/* Abstract gradients */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-qala-gold/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-qala-terracotta/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-qala-gold/20 bg-qala-gold/5 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                        >
                            <Zap className="w-4 h-4 text-qala-gold" />
                            <span className="text-qala-gold font-bold text-xs tracking-widest uppercase">Next-Gen Technology</span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                        >
                            Supercharged by <span className="text-transparent bg-clip-text bg-gradient-to-r from-qala-gold via-qala-saffron to-qala-terracotta drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">Gen-AI</span>
                        </motion.h2>
                        <p className="text-xl text-stone-400 max-w-3xl mx-auto font-light leading-relaxed">
                            We blend thousands of years of human heritage with state-of-the-art artificial intelligence. Experience unprecedented growth and effortless management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {aiFeatures.map((feature) => (
                            <motion.div 
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: feature.delay, duration: 0.6, ease: "easeOut" }}
                                className="group relative p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-qala-gold/40 hover:to-qala-saffron/10 transition-colors duration-500"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-2xl -z-10 bg-gradient-to-br ${feature.gradient}`} />
                                <div className="h-full bg-stone-950/80 backdrop-blur-xl rounded-[23px] p-8 relative overflow-hidden flex flex-col items-start border border-white/5 group-hover:border-qala-gold/20 transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 ${feature.glow} group-hover:scale-110 transition-transform duration-500 border border-white/20`}>
                                        <feature.icon className="w-6 h-6 text-white drop-shadow-md" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-qala-gold transition-colors duration-300">{feature.title}</h3>
                                    <p className="text-stone-400 leading-relaxed font-light text-base group-hover:text-stone-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features / Value Props Section */}
            <section className="py-32 bg-white relative z-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-5xl md:text-6xl font-black text-stone-900 mb-6 tracking-tighter"
                            >
                                Why Choose <span className="text-qala-primary">Qala?</span>
                            </motion.h2>
                            <p className="text-xl text-stone-500 font-light leading-relaxed">
                                Beyond technology, our core lies in bridging the gap between traditional artisans and modern connoisseurs, ensuring pure authenticity and fair trade.
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-3xl border border-stone-100 min-w-[140px]">
                                 <span className="text-4xl font-black text-qala-gold">10K+</span>
                                 <span className="text-stone-500 text-sm font-bold mt-1">Artisans</span>
                             </div>
                             <div className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-3xl border border-stone-100 min-w-[140px]">
                                 <span className="text-4xl font-black text-stone-900">100%</span>
                                 <span className="text-stone-500 text-sm font-bold mt-1">Authentic</span>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Palette, title: "Authentic Craft", desc: "Every piece tells a story. Discover 100% authentic, handcrafted items directly from verified Indian artisans." },
                            { icon: HeartHandshake, title: "Direct Support", desc: "Cut out the middlemen. Your support goes directly to the artisans, helping them preserve their ancestral heritage." },
                            { icon: Globe, title: "Cultural Heritage", desc: "Explore a diverse range of Indian art forms, from Kashmiri embroidery to Tanjore paintings, all in one place." }
                        ].map((item, idx) => (
                            <motion.div 
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                                className="bg-stone-50 rounded-[2rem] p-10 border border-stone-100 hover:shadow-2xl hover:shadow-qala-gold/10 hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <item.icon className="w-10 h-10 text-stone-900" />
                                </div>
                                <h3 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-stone-500 text-lg leading-relaxed font-light">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial / Impact Section */}
            <section className="py-24 bg-stone-100 border-y border-stone-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-square w-full max-w-md mx-auto">
                            <div className="absolute inset-0 bg-qala-gold/20 rounded-[3rem] rotate-6"></div>
                            <img 
                                src="https://images.pexels.com/photos/3328058/pexels-photo-3328058.jpeg?auto=compress&cs=tinysrgb&w=800" 
                                alt="Happy Artisan" 
                                className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl z-10"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/h1.jpg";
                                }}
                            />
                            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl z-20 max-w-[250px]">
                                <div className="flex gap-1 mb-2">
                                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-qala-gold text-qala-gold" />)}
                                </div>
                                <p className="text-stone-900 font-bold text-lg leading-tight">"Qala's AI helped me reach customers globally in my own language."</p>
                                <p className="text-stone-500 text-sm mt-2">- Rajesh, Master Potter</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 pt-10 md:pt-0">
                         <motion.h2 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-stone-900 mb-6 tracking-tighter leading-tight"
                        >
                            Empowering 10,000+ creators across India.
                        </motion.h2>
                        <p className="text-xl text-stone-500 mb-8 font-light leading-relaxed">
                            We are not just a marketplace. We are a movement dedicated to preserving culture while adapting to the digital future.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Fair pricing driven by market intelligence",
                                "Zero language barriers with Voice AI",
                                "Automated beautiful listings and storytelling"
                            ].map((li, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-bold text-stone-800">
                                    <div className="w-8 h-8 rounded-full bg-qala-gold/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-qala-gold" />
                                    </div>
                                    {li}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-40 relative bg-[#050505] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80wv] h-[80wv] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-qala-gold via-qala-saffron to-qala-terracotta rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                            Join the <br/><span className="italic font-light">Revolution.</span>
                        </h2>
                        <p className="text-2xl text-stone-300 mb-12 font-light max-w-2xl mx-auto">
                            Become part of an elite community connecting the world's finest connoisseurs with India's legendary artisans.
                        </p>
                        <button 
                            onClick={() => router.push('/auth')}
                            className="group relative px-12 py-6 bg-white rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-shadow duration-500"
                        >
                            <span className="relative z-10 text-stone-900 font-black text-2xl tracking-tight flex items-center gap-4 group-hover:scale-105 transition-transform">
                                Create Your Free Account <ArrowRight className="w-6 h-6" />
                            </span>
                        </button>
                    </motion.div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-[#0a0a0a] py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                         <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl">
                            <Sparkles className="text-qala-gold h-5 w-5" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter">QALA</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-stone-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">About</a>
                        <a href="#" className="hover:text-white transition-colors">Artisans</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                    <p className="text-stone-600 font-medium">
                        © {new Date().getFullYear()} Qala Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
