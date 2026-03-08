import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Camera, Globe, MessageSquare, TrendingUp, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import heroCrafts from "@/assets/hero-crafts.jpg";
import kalaLogo from "@/assets/kala-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Camera,
    title: "Image → Listing",
    desc: "Upload a craft photo, get a complete product listing with title, description, tags & pricing.",
    path: "/dashboard/upload",
  },
  {
    icon: Sparkles,
    title: "AI Story Generator",
    desc: "Turn your craft journey into compelling brand stories, Instagram captions & marketing copy.",
    path: "/dashboard/story",
  },
  {
    icon: Globe,
    title: "Global Market Discovery",
    desc: "Find the best countries and buyer personas for your craft category worldwide.",
    path: "/dashboard/markets",
  },
  {
    icon: MessageSquare,
    title: "Social Media Content",
    desc: "Generate Instagram captions, hashtags, reel scripts and marketing messages instantly.",
    path: "/dashboard/social",
  },
  {
    icon: TrendingUp,
    title: "Smart Pricing AI",
    desc: "Get fair price suggestions based on craft type, materials, demand & global trends.",
    path: "/dashboard/pricing",
  },
  {
    icon: Mic,
    title: "Voice Assistant",
    desc: "Speak commands in your language. Upload products, generate listings — hands-free.",
    path: "/dashboard",
  },
];

const LandingPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = (path: string) => {
    if (session) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={kalaLogo} alt="KALA AI" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">KALA AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered for Artisans
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl md:text-6xl font-bold leading-tight text-foreground"
              >
                Your Craft Deserves a{" "}
                <span className="text-gradient">Global Stage</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg text-muted-foreground max-w-lg"
              >
                KALA AI turns your handmade creations into professional listings,
                compelling brand stories, and marketing content — so you can focus
                on what you do best: creating.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="gap-2">
                    Start Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="heroOutline" size="lg">
                    See Features
                  </Button>
                </a>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-xs text-muted-foreground">Artisans</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">50K+</p>
                  <p className="text-xs text-muted-foreground">Listings Created</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">30+</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-warm">
                <img
                  src={heroCrafts}
                  alt="Indian handmade crafts — pottery, paintings, textiles, jewelry"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Generated</p>
                    <p className="text-xs text-muted-foreground">Listing ready in seconds</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-card">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Craft Business Needs
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              From product photography to global market analysis — KALA AI handles your entire digital presence.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group bg-background rounded-xl p-6 shadow-card border border-border hover:shadow-warm transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Steps to Go Global
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Craft", desc: "Take a photo of your handmade product and upload it." },
              { step: "02", title: "AI Does the Work", desc: "Get instant listings, stories, pricing & marketing content." },
              { step: "03", title: "Reach the World", desc: "Publish and connect with buyers across 30+ countries." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-6xl font-display font-bold text-gradient mb-4">{s.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="gradient-indigo rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              Ready to Share Your Craft With the World?
            </h2>
            <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of artisans already using KALA AI to grow their craft business.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="lg" className="gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={kalaLogo} alt="KALA AI" className="h-8 w-8" />
            <span className="font-display font-bold text-foreground">KALA AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 KALA AI. Empowering artisans worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
