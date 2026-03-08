import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Loader2, IndianRupee, DollarSign, BarChart3, Target, Lightbulb, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PricingAnalysis = {
  recommendedPrice: {
    domestic: string;
    international: string;
    wholesale: string;
  };
  pricingTiers: {
    tier: string;
    priceRange: string;
    features: string;
  }[];
  costBreakdown: {
    component: string;
    estimatedCost: string;
    percentage: number;
  }[];
  marketDemand: string;
  globalTrends: {
    trend: string;
    impact: string;
  }[];
  competitorPricing: string;
  pricingStrategy: string;
  profitMargin: string;
};

const SmartPricingPage = () => {
  const [craftType, setCraftType] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<PricingAnalysis | null>(null);

  const handleGenerate = async () => {
    if (!craftType.trim() || !materialType.trim()) {
      toast.error("Please fill in craft type and material type");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-pricing", {
        body: { craftType, materialType, productDescription, targetMarket },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      toast.success("Pricing analysis complete!");
    } catch (e: any) {
      console.error("Smart pricing error:", e);
      toast.error(e.message || "Failed to analyze pricing");
    } finally {
      setGenerating(false);
    }
  };

  const tierColors = ["border-muted-foreground/30", "border-primary/50", "border-yellow-500/50"];
  const tierBg = ["bg-muted/30", "bg-primary/5", "bg-yellow-500/5"];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Smart Pricing</h1>
          <p className="text-muted-foreground mt-1">AI-powered pricing based on craft type, materials, market demand & global trends.</p>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Craft Type *</label>
            <Input placeholder="e.g. Madhubani Painting, Terracotta, Block Print" value={craftType} onChange={(e) => setCraftType(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Material Type *</label>
            <Input placeholder="e.g. Cotton, Clay, Silk, Wood, Brass" value={materialType} onChange={(e) => setMaterialType(e.target.value)} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Product Description <span className="text-muted-foreground">(optional)</span></label>
            <Textarea
              placeholder="Describe your product — size, technique, uniqueness, time to make..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Target Market <span className="text-muted-foreground">(optional)</span></label>
            <Input placeholder="e.g. USA, Europe, Domestic India, Global" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} />
          </div>
        </div>

        <Button variant="hero" onClick={handleGenerate} disabled={generating || !craftType.trim() || !materialType.trim()} className="gap-2">
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Price...</>
          ) : (
            <><TrendingUp className="w-4 h-4" /> Get Smart Price</>
          )}
        </Button>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Recommended Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-primary">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Domestic</span>
                </div>
                <p className="text-xl font-bold text-foreground">{analysis.recommendedPrice.domestic}</p>
              </div>
              <div className="bg-card rounded-xl p-5 shadow-card border border-primary/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-primary">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">International</span>
                </div>
                <p className="text-xl font-bold text-foreground">{analysis.recommendedPrice.international}</p>
              </div>
              <div className="bg-card rounded-xl p-5 shadow-card border border-border text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Wholesale</span>
                </div>
                <p className="text-xl font-bold text-foreground">{analysis.recommendedPrice.wholesale}</p>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <div className="flex items-center gap-2 text-primary mb-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Expected Profit Margin</span>
              </div>
              <p className="text-sm text-foreground">{analysis.profitMargin}</p>
            </div>

            {/* Pricing Tiers */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">Pricing Tiers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysis.pricingTiers.map((tier, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${tierColors[i] || tierColors[0]} ${tierBg[i] || tierBg[0]} space-y-2`}>
                    <p className="font-semibold text-foreground">{tier.tier}</p>
                    <p className="text-lg font-bold text-primary">{tier.priceRange}</p>
                    <p className="text-xs text-muted-foreground">{tier.features}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Cost Breakdown</span>
              </div>
              <div className="space-y-3">
                {analysis.costBreakdown.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.component}</span>
                      <span className="text-muted-foreground">{item.estimatedCost} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Demand */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Market Demand Analysis</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.marketDemand}</p>
            </div>

            {/* Global Trends */}
            {analysis.globalTrends && analysis.globalTrends.length > 0 && (
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Global Trends Impacting Price</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.globalTrends.map((trend, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium text-sm text-foreground">{trend.trend}</p>
                      <p className="text-xs text-muted-foreground mt-1">{trend.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitor Pricing */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Competitor Pricing</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.competitorPricing}</p>
            </div>

            {/* Pricing Strategy */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Recommended Pricing Strategy</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.pricingStrategy}</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SmartPricingPage;
