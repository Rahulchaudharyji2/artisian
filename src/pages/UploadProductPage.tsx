import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Loader2, Check, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [listing, setListing] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string[];
    price: string;
  } | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [imageDescription]);

  // Voice input using Web Speech API
  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;

    let finalTranscript = imageDescription;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setImageDescription(finalTranscript + (interim ? " " + interim : ""));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "network") {
        toast.error("Voice input requires a stable internet connection. Please check your network and try again, or type your description instead.");
      } else if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone permission in your browser settings.");
      } else {
        toast.error("Voice input error: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    toast.success("Listening... Speak now!");
  }, [isListening, imageDescription]);

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

  // Parse AI price suggestion to set slider default and range
  const parsePrice = (priceStr: string): { mid: number; min: number; max: number } => {
    const matches = priceStr.match(/[\d,]+/g);
    if (!matches) return { mid: 500, min: 100, max: 5000 };
    const nums = matches.map((m) => parseInt(m.replace(/,/g, ""), 10));
    if (nums.length >= 2) {
      const low = Math.min(nums[0], nums[1]);
      const high = Math.max(nums[0], nums[1]);
      const mid = Math.round((low + high) / 2);
      return { mid, min: Math.max(50, Math.round(low * 0.5)), max: Math.round(high * 2) };
    }
    return { mid: nums[0], min: Math.max(50, Math.round(nums[0] * 0.5)), max: Math.round(nums[0] * 3) };
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
      const parsed = parsePrice(data.price);
      setManualPrice(parsed.mid);
      setPriceRange({ min: parsed.min, max: parsed.max });
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
      let imageUrl: string | null = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, selectedFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
      const { error } = await supabase.from("products" as any).insert({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        tags: listing.tags,
        price: `₹${manualPrice.toLocaleString("en-IN")}`,
        image_description: imageDescription,
        image_url: imageUrl,
      } as any);
      if (error) throw error;
      toast.success("Product published successfully!");
      setListing(null);
      setPreview(null);
      setImageDescription("");
      setSelectedFile(null);
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
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="e.g. Handmade terracotta clay pot with traditional firing patterns. Made using local red clay with intricate hand-painted motifs..."
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              className="pr-12 resize-none overflow-hidden min-h-[80px]"
              rows={2}
            />
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop listening" : "Describe with voice"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Describe what's in the image so AI can generate an accurate listing. You can also use the mic to speak your description.</p>
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
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹{priceRange.min.toLocaleString("en-IN")}</span>
                <span>₹{priceRange.max.toLocaleString("en-IN")}</span>
              </div>
              <Input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(Math.max(priceRange.min, Math.min(priceRange.max, Number(e.target.value))))}
                className="w-32"
                min={priceRange.min}
                max={priceRange.max}
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
