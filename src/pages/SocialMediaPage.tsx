import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SocialMediaPage = () => {
  const [productDetails, setProductDetails] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [content, setContent] = useState<{
    instagramCaption: string;
    hashtags: string[];
    reelScript: string;
    marketingMessage: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!productDetails.trim()) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("social-media", {
        body: { productDetails },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setContent(data);
      toast.success("Social media content generated!");
    } catch (e: any) {
      console.error("Social media error:", e);
      toast.error(e.message || "Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copyText(text, id)} className="text-muted-foreground hover:text-primary transition-colors">
      {copied === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Social Media Marketing</h1>
          <p className="text-muted-foreground mt-1">Generate Instagram captions, hashtags, and reel ideas for your crafts.</p>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Describe your product... e.g. 'Handmade Madhubani painting on cotton canvas, 12x18 inches'"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
          />
          <Button variant="hero" onClick={handleGenerate} disabled={generating || !productDetails.trim()} className="gap-2">
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Share2 className="w-4 h-4" /> Generate Marketing Content</>
            )}
          </Button>
        </div>

        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border space-y-6"
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Generated Marketing Content</span>
            </div>

            {/* Instagram Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Instagram Caption</label>
                <CopyBtn text={content.instagramCaption} id="caption" />
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content.instagramCaption}</p>
            </div>

            <hr className="border-border" />

            {/* Hashtags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Hashtags</label>
                <CopyBtn text={content.hashtags.map(h => `#${h}`).join(" ")} id="hashtags" />
              </div>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Reel Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Reel Script Idea</label>
                <CopyBtn text={content.reelScript} id="reel" />
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content.reelScript}</p>
            </div>

            <hr className="border-border" />

            {/* Marketing Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">WhatsApp Marketing Message</label>
                <CopyBtn text={content.marketingMessage} id="whatsapp" />
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content.marketingMessage}</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaPage;
