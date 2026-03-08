import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  MapPin,
  Clock,
  Lightbulb,
  Layers,
  Globe,
  Shield,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CraftAnalysis {
  craftType: { name: string; category: string; technique: string; materials: string[] };
  originRegion: { state: string; district: string; country: string; geoTag?: string };
  culturalHistory: { era: string; story: string; significance: string; patronage: string; currentStatus: string };
  funFacts: string[];
  similarCrafts: { name: string; region: string }[];
}

const CraftDetectorPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CraftAnalysis | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setImageBase64(dataUrl);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!imageBase64) {
      toast.error("Please upload a craft image first");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("craft-detector", {
        body: { imageBase64 },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success("Craft analysis complete!");
    } catch (e: any) {
      console.error("Craft detector error:", e);
      toast.error(e.message || "Failed to analyze craft");
    } finally {
      setAnalyzing(false);
    }
  };

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("thriv")) return "text-green-600 bg-green-100";
    if (s.includes("endanger")) return "text-red-600 bg-red-100";
    return "text-amber-600 bg-amber-100";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Cultural Craft Detector</h1>
          <p className="text-muted-foreground mt-1">Upload a craft photo and AI will identify the craft type, origin region, and cultural history.</p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          {preview ? (
            <div className="space-y-4">
              <img src={preview} alt="Craft preview" className="max-h-72 mx-auto rounded-lg object-contain" />
              <div className="flex gap-3 justify-center">
                <Button variant="outline" size="sm" onClick={() => { setPreview(null); setImageBase64(null); setResult(null); }}>
                  Change Image
                </Button>
                <Button
                  variant="hero"
                  size="sm"
                  className="gap-2"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Detect Craft</>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer space-y-4 block">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Drop your craft image here</p>
                <p className="text-sm text-muted-foreground">or click to browse • JPG, PNG supported</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
        </div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Craft Type */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Layers className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg">Craft Type</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                  <p className="text-lg font-semibold text-foreground">{result.craftType.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                  <p className="text-sm font-medium text-foreground">{result.craftType.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Technique</p>
                  <p className="text-sm text-foreground">{result.craftType.technique}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Materials</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.craftType.materials.map((m) => (
                      <span key={m} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Origin Region */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg">Origin Region</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Country</p>
                  <p className="text-sm font-medium text-foreground">{result.originRegion.country}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">State</p>
                  <p className="text-sm font-medium text-foreground">{result.originRegion.state}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">District / City</p>
                  <p className="text-sm font-medium text-foreground">{result.originRegion.district}</p>
                </div>
              </div>
              {result.originRegion.geoTag && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{result.originRegion.geoTag}</span>
                </div>
              )}
            </div>

            {/* Cultural History */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg">Cultural History</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide w-20 shrink-0">Era</span>
                  <span className="text-sm font-medium text-foreground">{result.culturalHistory.era}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Story</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.culturalHistory.story}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Significance</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.culturalHistory.significance}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide w-20 shrink-0">Patronage</span>
                  <span className="text-sm text-foreground">{result.culturalHistory.patronage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide w-20 shrink-0">Status</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(result.culturalHistory.currentStatus)}`}>
                    {result.culturalHistory.currentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Fun Facts & Similar Crafts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Lightbulb className="w-5 h-5" />
                  <h2 className="font-display font-bold text-lg">Fun Facts</h2>
                </div>
                <ul className="space-y-2">
                  {result.funFacts.map((fact, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold shrink-0">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="w-5 h-5" />
                  <h2 className="font-display font-bold text-lg">Similar Crafts</h2>
                </div>
                <ul className="space-y-2">
                  {result.similarCrafts.map((craft, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{craft.name}</span>
                      <span className="text-xs text-muted-foreground">{craft.region}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CraftDetectorPage;
