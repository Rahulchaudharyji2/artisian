import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MapPin, Package, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import kalaLogo from "@/assets/kala-logo.png";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  id: string;
  name: string;
  location: string;
  craft_type: string;
  years_of_experience: number;
  story: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string | null;
  category: string;
}

const ArtisanProfilePage = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id!)
        .single();
      if (prof) {
        setProfile(prof);
        const { data: prods } = await supabase
          .from("products")
          .select("id, title, price, image_url, category")
          .eq("user_id", id!)
          .order("created_at", { ascending: false });
        if (prods) setProducts(prods);
      }
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={kalaLogo} alt="KALA AI" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">KALA AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</Link>
            <Link to="/stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</Link>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link to="/dashboard"><Button variant="hero" size="sm">Dashboard</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                <Link to="/signup"><Button variant="hero" size="sm">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container pt-24 pb-16 max-w-4xl">
        <Link to="/stories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !profile ? (
          <div className="text-center py-20">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Artisan not found.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-card border border-border rounded-xl p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {(profile.name || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profile.name || "Artisan"}</h1>
                  {profile.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {profile.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.craft_type && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{profile.craft_type}</span>
                )}
                {profile.years_of_experience > 0 && (
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                    {profile.years_of_experience} years experience
                  </span>
                )}
              </div>
              {profile.story && (
                <div>
                  <h2 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Their Story</h2>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{profile.story}</p>
                </div>
              )}
            </div>

            {/* Artisan's products */}
            {products.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Products by {profile.name || "this Artisan"}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-muted flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{p.category}</span>
                          <span className="text-sm font-bold text-primary">{p.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtisanProfilePage;
