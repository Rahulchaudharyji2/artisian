import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Loader2,
  MapPin,
  Clock,
  Lightbulb,
  Layers,
  Globe,
  Mic,
  MicOff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CraftAnalysis {
  craftType: {
    name: string;
    category: string;
    technique: string;
    materials: string[];
  };
  originRegion: {
    state: string;
    district: string;
    country: string;
    geoTag?: string;
  };
  culturalHistory: {
    era: string;
    story: string;
    significance: string;
    patronage: string;
    currentStatus: string;
  };
  funFacts: string[];
  similarCrafts: { name: string; region: string }[];
}

const CraftDetectorPage = () => {
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CraftAnalysis | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [description]);

  const toggleVoiceInput = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
    let finalTranscript = description;
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setDescription(finalTranscript + (interim ? " " + interim : ""));
    };
    recognition.onerror = (event: any) => {
      if (event.error === "network") {
        toast.error("Voice recognition needs a direct browser tab. Try publishing your app or opening it in a new tab.", { duration: 5000 });
      } else if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone in browser settings.");
      } else {
        toast.error("Voice error: " + event.error);
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    toast.success("Listening... Speak now!");
  }, [isListening, description]);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      toast.error("Please describe the craft product");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("craft-detector", {
        body: { craftDescription: description },
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
          <h1 className="text-2xl font-display font-bold text-foreground">
            Cultural Craft Detector
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered craft identification — discover the type, origin, and cultural history of any handicraft.
          </p>
        </div>

        {/* Input */}
        <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
          <label className="text-sm font-medium text-foreground">
            Describe the craft product
          </label>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="e.g. A blue and white pottery vase with floral patterns, handmade in Jaipur using traditional techniques..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="pr-12 resize-none overflow-hidden min-h-[80px]"
              rows={3}
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

          <Button
            variant="hero"
            size="lg"
            className="w-full gap-2"
            onClick={handleAnalyze}
            disabled={analyzing || !description.trim()}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Craft...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Detect Craft Culture
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
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
                      <span
                        key={m}
                        className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {m}
                      </span>
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
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{result.originRegion.geoTag}</span>
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
