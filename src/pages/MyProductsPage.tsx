import { useEffect, useState } from "react";
import { Package, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  image_description: string | null;
  created_at: string;
}

const MyProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await (supabase.from as any)("products").select("*").order("created_at", { ascending: false });
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground mt-1">All your published craft listings.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No products published yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden space-y-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground leading-tight">{p.title}</h3>
                  <span className="text-sm font-bold text-primary whitespace-nowrap ml-2">{p.price}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-muted">{p.category}</span>
                  <span>·</span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags?.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProductsPage;
