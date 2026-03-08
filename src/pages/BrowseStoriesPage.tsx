import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import kalaLogo from "@/assets/kala-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  location: string;
  craft_type: string;
  years_of_experience: number;
  story: string;
}

const BrowseStoriesPage = () => {
  const { session } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("story", "")
        .order("updated_at", { ascending: false });
      if (data) setProfiles(data);
      setLoading(false);
    };
    fetch();
  }, []);

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
            <Link to="/stories" className="text-sm font-medium text-foreground">Stories</Link>
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

      <div className="container pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Artisan Stories</h1>
        <p className="text-muted-foreground mb-10">Discover the journeys and traditions behind each craft.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No stories shared yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/artisan/${p.id}`}
                  className="block bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {(p.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{p.name || "Artisan"}</h3>
                  {p.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {p.location}
                    </div>
                  )}
                  {p.craft_type && (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {p.craft_type}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.story}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseStoriesPage;
