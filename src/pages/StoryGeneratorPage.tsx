import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StoryGeneratorPage = () => {
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<{
    brandStory: string;
    aboutSection: string;
    instagramCaption: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-story", {
        body: { story: input },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setStory(data);
      toast.success("Brand content generated!");
    } catch (e: any) {
      console.error("Generate story error:", e);
      toast.error(e.message || "Failed to generate story");
    } finally {
      setGenerating(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const Section = ({ title, content, id }: { title: string; content: string; id: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground uppercase tracking-wide">{title}</label>
        <button onClick={() => copyText(content, id)} className="text-muted-foreground hover:text-primary transition-colors">
          {copied === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">AI Story Generator</h1>
          <p className="text-muted-foreground mt-1">Turn your craft journey into compelling brand content.</p>
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Tell us about your craft journey... e.g. 'My family has been making Madhubani paintings for three generations in Bihar.'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button variant="hero" onClick={handleGenerate} disabled={generating || !input.trim()} className="gap-2">
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Story</>
            )}
          </Button>
        </div>

        {story && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 shadow-card border border-border space-y-6"
          >
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Generated Content</span>
            </div>
            <Section title="Brand Story" content={story.brandStory} id="brand" />
            <hr className="border-border" />
            <Section title="Website About Section" content={story.aboutSection} id="about" />
            <hr className="border-border" />
            <Section title="Instagram Caption" content={story.instagramCaption} id="instagram" />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StoryGeneratorPage;
