import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import kalaLogo from "@/assets/kala-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  image_url: string | null;
  created_at: string;
  user_id: string | null;
}

interface Profile {
  id: string;
  name: string;
  location: string;
  craft_type: string;
}

const BrowseProductsPage = () => {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: prods } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (prods) {
        setProducts(prods);
        const userIds = [...new Set(prods.map((p) => p.user_id).filter(Boolean))] as string[];
        if (userIds.length > 0) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, name, location, craft_type")
            .in("id", userIds);
          if (profileData) {
            const map: Record<string, Profile> = {};
            profileData.forEach((p) => (map[p.id] = p));
            setProfiles(map);
          }
        }
      }
      setLoading(false);
    };
    fetch();
  }, []);

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
            <Link to="/products" className="text-sm font-medium text-foreground">Products</Link>
            <Link to="/stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</Link>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link to="/dashboard">
                <Button variant="hero" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                <Link to="/signup"><Button variant="hero" size="sm">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Explore Crafts</h1>
        <p className="text-muted-foreground mb-10">Discover handmade products from artisans around the world.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No products yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => {
              const owner = p.user_id ? profiles[p.user_id] : null;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/products/${p.id}`}
                    className="block bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground leading-tight">{p.title}</h3>
                        <span className="text-sm font-bold text-primary whitespace-nowrap ml-2">{p.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-muted">{p.category}</span>
                        {owner && (
                          <>
                            <span>·</span>
                            <span>by {owner.name || "Artisan"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProductsPage;
