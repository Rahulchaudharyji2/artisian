import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UploadProductPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [imageDescription, setImageDescription] = useState("");
  const [manualPrice, setManualPrice] = useState(500);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 50, max: 50000 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [listing, setListing] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string[];
    price: string;
  } | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setListing(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  // Parse AI price suggestion to set slider default
  const parsePrice = (priceStr: string): number => {
    const matches = priceStr.match(/[\d,]+/g);
    if (!matches) return 500;
    const nums = matches.map((m) => parseInt(m.replace(/,/g, ""), 10));
    return nums.length >= 2 ? Math.round((nums[0] + nums[1]) / 2) : nums[0];
  };

  const handleGenerate = async () => {
    if (!imageDescription.trim()) {
      toast.error("Please describe your craft product");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-listing", {
        body: { imageDescription },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setListing(data);
      setManualPrice(parsePrice(data.price));
      toast.success("AI listing generated!");
    } catch (e: any) {
      console.error("Generate listing error:", e);
      toast.error(e.message || "Failed to generate listing");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!listing) return;
    setPublishing(true);
    try {
      const { error } = await supabase.from("products" as any).insert({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        tags: listing.tags,
        price: `₹${manualPrice.toLocaleString("en-IN")}`,
        image_description: imageDescription,
      } as any);
      if (error) throw error;
      toast.success("Product published successfully!");
      setListing(null);
      setPreview(null);
      setImageDescription("");
    } catch (e: any) {
      console.error("Publish error:", e);
      toast.error(e.message || "Failed to publish product");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Upload Product</h1>
          <p className="text-muted-foreground mt-1">Upload a craft photo and let AI create your listing.</p>
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
              <img src={preview} alt="Product preview" className="max-h-64 mx-auto rounded-lg object-contain" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setPreview(null); setListing(null); }}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer space-y-4 block">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Drop your craft image here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
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

        {/* Description input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Describe your craft product</label>
          <Input
            placeholder="e.g. Handmade terracotta clay pot with traditional firing patterns"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Describe what's in the image so AI can generate an accurate listing.</p>
        </div>

        {/* Generate button */}
        {!listing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              variant="hero"
              size="lg"
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={generating || !imageDescription.trim()}
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating Listing...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate AI Listing</>
              )}
            </Button>
          </motion.div>
        )}

        {/* AI Generated Listing */}
        {listing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Generated Listing</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Title</label>
              <p className="text-lg font-semibold text-foreground">{listing.title}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Description</label>
              <p className="text-sm text-foreground leading-relaxed">{listing.description}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Category</label>
                <p className="text-sm font-medium text-foreground">{listing.category}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">AI Suggested Price</label>
                <p className="text-sm text-muted-foreground">{listing.price}</p>
              </div>
            </div>

            {/* Manual Price Adjustment */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Your Price</label>
                <span className="text-lg font-bold text-primary">₹{manualPrice.toLocaleString("en-IN")}</span>
              </div>
              <Slider
                value={[manualPrice]}
                onValueChange={(v) => setManualPrice(v[0])}
                min={50}
                max={50000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹50</span>
                <span>₹50,000</span>
              </div>
              <Input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(Math.max(50, Math.min(50000, Number(e.target.value))))}
                className="w-32"
                min={50}
                max={50000}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {listing.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="hero"
                className="flex-1 gap-2"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : (
                  <><Check className="w-4 h-4" /> Publish Product</>
                )}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setListing(null)}>Regenerate</Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadProductPage;
