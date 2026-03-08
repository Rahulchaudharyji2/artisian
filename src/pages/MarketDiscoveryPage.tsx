import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MarketDiscoveryPage = () => {
  const [category, setCategory] = useState("");
  const [craftType, setCraftType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<{
    topMarkets: { country: string; reason: string; demandLevel: string }[];
    trendingKeywords: string[];
    buyerPersona: string;
    pricingRange: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!category.trim() || !craftType.trim()) {
      toast.error("Please fill in both fields");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-analysis", {
        body: { productCategory: category, craftType },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      toast.success("Market analysis complete!");
    } catch (e: any) {
      console.error("Market analysis error:", e);
      toast.error(e.message || "Failed to analyze market");
    } finally {
      setGenerating(false);
    }
  };

  const demandColor = (level: string) => {
    if (level === "High") return "bg-green-100 text-green-800";
    if (level === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Global Market Discovery</h1>
          <p className="text-muted-foreground mt-1">Find the best international markets for your crafts.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Product Category</label>
            <Input placeholder="e.g. Home Decor, Jewelry, Textiles" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Craft Type</label>
            <Input placeholder="e.g. Madhubani Painting, Terracotta" value={craftType} onChange={(e) => setCraftType(e.target.value)} />
          </div>
        </div>

        <Button variant="hero" onClick={handleGenerate} disabled={generating || !category.trim() || !craftType.trim()} className="gap-2">
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Markets...</>
          ) : (
            <><Globe className="w-4 h-4" /> Discover Markets</>
          )}
        </Button>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Markets */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Top Markets</span>
              </div>
              <div className="space-y-3">
                {analysis.topMarkets.map((market, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-lg font-bold text-primary">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{market.country}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${demandColor(market.demandLevel)}`}>
                          {market.demandLevel} Demand
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{market.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Trending Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.trendingKeywords.map((kw) => (
                    <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">International Pricing</label>
                <p className="text-xl font-bold text-foreground">{analysis.pricingRange}</p>
                <label className="text-xs text-muted-foreground uppercase tracking-wide mt-4 block">Buyer Persona</label>
                <p className="text-sm text-foreground leading-relaxed">{analysis.buyerPersona}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketDiscoveryPage;
