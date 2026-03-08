import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, Loader2, TrendingUp, Calendar, ShieldCheck, Target, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type MarketAnalysis = {
  topMarkets: {
    country: string;
    reason: string;
    demandLevel: string;
    estimatedMarketSize: string;
    bestPlatforms: string[];
  }[];
  trendingKeywords: string[];
  buyerPersona: string;
  pricingRange: string;
  seasonalTrends: {
    season: string;
    months: string;
    insight: string;
  }[];
  competitorInsights: string;
  marketingTips: string[];
  exportReadiness: string;
};

const MarketDiscoveryPage = () => {
  const [category, setCategory] = useState("");
  const [craftType, setCraftType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);

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
    if (level === "High") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (level === "Medium") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
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
                  <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{market.country}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${demandColor(market.demandLevel)}`}>
                            {market.demandLevel} Demand
                          </span>
                          <span className="text-xs text-muted-foreground">{market.estimatedMarketSize}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">{market.reason}</p>
                    <div className="flex gap-2 ml-8 flex-wrap">
                      {market.bestPlatforms.map((platform) => (
                        <span key={platform} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Trends */}
            {analysis.seasonalTrends && analysis.seasonalTrends.length > 0 && (
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Seasonal Demand Trends</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.seasonalTrends.map((trend, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground">{trend.season}</span>
                        <span className="text-xs text-primary font-medium">{trend.months}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{trend.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <p className="text-lg font-bold text-foreground">{analysis.pricingRange}</p>
                <label className="text-xs text-muted-foreground uppercase tracking-wide mt-4 block">Buyer Persona</label>
                <p className="text-sm text-foreground leading-relaxed">{analysis.buyerPersona}</p>
              </div>
            </div>

            {/* Competitor Insights */}
            {analysis.competitorInsights && (
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Competitor Landscape</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.competitorInsights}</p>
              </div>
            )}

            {/* Marketing Tips */}
            {analysis.marketingTips && analysis.marketingTips.length > 0 && (
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">Marketing Strategies</span>
                </div>
                <ul className="space-y-2">
                  {analysis.marketingTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Export Readiness */}
            {analysis.exportReadiness && (
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Export Readiness</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{analysis.exportReadiness}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketDiscoveryPage;
