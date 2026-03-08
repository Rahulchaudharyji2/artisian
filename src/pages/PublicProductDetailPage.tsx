import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Loader2, MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import kalaLogo from "@/assets/kala-logo.png";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  image_url: string | null;
  image_description: string | null;
  created_at: string;
  user_id: string | null;
}

interface Profile {
  id: string;
  name: string;
  location: string;
  craft_type: string;
  years_of_experience: number;
  story: string;
}

const PublicProductDetailPage = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (data) {
        setProduct(data);
        if (data.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user_id)
            .single();
          if (profile) setOwner(profile);
        }
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
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !product ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Product not found.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full rounded-xl object-cover aspect-square" />
              ) : (
                <div className="w-full rounded-xl bg-muted flex items-center justify-center aspect-square">
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.title}</h1>
                <p className="text-2xl font-bold text-primary">{product.price}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">{product.category}</span>
                <p className="text-foreground leading-relaxed">{product.description}</p>
                {product.image_description && (
                  <p className="text-sm text-muted-foreground italic">{product.image_description}</p>
                )}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Listed {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Owner details */}
            {owner && (
              <Link
                to={`/artisan/${owner.id}`}
                className="block bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">About the Artisan</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {(owner.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-lg">{owner.name || "Artisan"}</p>
                    {owner.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" /> {owner.location}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {owner.craft_type && <span>{owner.craft_type}</span>}
                      {owner.years_of_experience > 0 && <span>· {owner.years_of_experience} yrs experience</span>}
                    </div>
                  </div>
                </div>
                {owner.story && (
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-3">{owner.story}</p>
                )}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicProductDetailPage;
