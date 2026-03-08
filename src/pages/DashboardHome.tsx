import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Package, BookOpen, Share2, Globe, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

const quickActions = [
  { icon: Upload, label: "Upload Product", desc: "Create AI listing from photo", path: "/dashboard/upload", color: "gradient-hero" },
  { icon: BookOpen, label: "Generate Story", desc: "Tell your craft story", path: "/dashboard/story", color: "gradient-indigo" },
  { icon: Share2, label: "Social Content", desc: "Marketing posts & captions", path: "/dashboard/social", color: "gradient-hero" },
  { icon: Globe, label: "Market Insights", desc: "Find global buyers", path: "/dashboard/markets", color: "gradient-indigo" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

const DashboardHome = () => {
  const [productCount, setProductCount] = useState(0);
  const [listingCount, setListingCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [priceCount, setPriceCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: products } = await supabase.from("products").select("id, description, category, price");
      if (products) {
        setProductCount(products.length);
        setListingCount(products.filter(p => p.description && p.description.length > 50).length);
        setCategoryCount(new Set(products.map(p => p.category)).size);
        setPriceCount(products.filter(p => p.price && parseFloat(p.price) > 0).length);
      }
    };
    fetchStats();

    const channel = supabase
      .channel("products-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const stats = [
    { label: "Products", value: productCount.toString(), icon: Package },
    { label: "AI Listings", value: listingCount.toString(), icon: BookOpen },
    { label: "Categories", value: categoryCount.toString(), icon: Globe },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Welcome, Artisan! 🎨
          </h1>
          <p className="text-muted-foreground mt-1">
            Your AI-powered digital manager is ready to help.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-xl p-5 shadow-card border border-border"
            >
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.map((a, i) => (
              <motion.div key={a.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4}>
                <Link
                  to={a.path}
                  className="group flex items-center gap-4 bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-warm transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                    <a.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{a.label}</p>
                    <p className="text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
