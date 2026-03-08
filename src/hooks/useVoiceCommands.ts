import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VoiceCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

export const useVoiceCommands = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [matchedCommand, setMatchedCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const commands: VoiceCommand[] = [
    {
      keywords: ["upload", "new product", "add product", "upload product", "pottery", "craft"],
      action: () => navigate("/dashboard/upload"),
      description: "Upload Product",
    },
    {
      keywords: ["dashboard", "home", "go home", "main"],
      action: () => navigate("/dashboard"),
      description: "Dashboard",
    },
    {
      keywords: ["my products", "products", "show products", "list products"],
      action: () => navigate("/dashboard/products"),
      description: "My Products",
    },
    {
      keywords: ["story", "brand story", "generate story", "tell story"],
      action: () => navigate("/dashboard/story"),
      description: "Story Generator",
    },
    {
      keywords: ["social", "social media", "instagram", "facebook", "post"],
      action: () => navigate("/dashboard/social"),
      description: "Social Media",
    },
    {
      keywords: ["market", "markets", "discovery", "global market", "demand"],
      action: () => navigate("/dashboard/markets"),
      description: "Market Discovery",
    },
    {
      keywords: ["pricing", "price", "smart pricing", "cost", "how much"],
      action: () => navigate("/dashboard/pricing"),
      description: "Smart Pricing",
    },
  ];

  const matchCommand = useCallback(
    (text: string): VoiceCommand | null => {
      const lower = text.toLowerCase();
      // Score each command by number of keyword matches
      let bestMatch: VoiceCommand | null = null;
      let bestScore = 0;
      for (const cmd of commands) {
        const score = cmd.keywords.filter((kw) => lower.includes(kw)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = cmd;
        }
      }
      return bestMatch;
    },
    [commands]
  );

  const startListening = useCallback(() => {
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
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;

    setTranscript("");
    setMatchedCommand(null);

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      const currentText = finalText || interimText;
      setTranscript(currentText);

      if (finalText) {
        const matched = matchCommand(finalText);
        if (matched) {
          setMatchedCommand(matched.description);
          toast.success(`Navigating to ${matched.description}`, {
            icon: "🎙️",
          });
          setTimeout(() => {
            matched.action();
            setMatchedCommand(null);
            setTranscript("");
          }, 600);
        } else {
          toast.info(`Didn't recognize a command in: "${finalText}"`, {
            icon: "🤔",
            description: "Try saying: Upload product, Smart pricing, Market discovery...",
          });
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "network") {
        toast.error("Voice requires internet connection. Please check your network.");
      } else if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone in browser settings.");
      } else if (event.error !== "aborted") {
        toast.error("Voice error: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }, [isListening, matchCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    matchedCommand,
    startListening,
    stopListening,
    commands,
  };
};
