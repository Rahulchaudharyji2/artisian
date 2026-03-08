import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Button } from "@/components/ui/button";

const VoiceAssistantFAB = () => {
  const { isListening, transcript, matchedCommand, startListening, stopListening, commands } =
    useVoiceCommands();

  return (
    <>
      {/* Expanded command panel */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                </span>
                <span className="text-sm font-medium text-foreground">Listening...</span>
              </div>
              <button onClick={stopListening} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live transcript */}
            <div className="min-h-[40px] p-3 rounded-lg bg-muted/50 border border-border">
              {transcript ? (
                <p className="text-sm text-foreground italic">"{transcript}"</p>
              ) : (
                <p className="text-sm text-muted-foreground">Say a command...</p>
              )}
            </div>

            {matchedCommand && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-primary font-medium"
              >
                <span>→ Navigating to {matchedCommand}</span>
              </motion.div>
            )}

            {/* Command suggestions */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Try saying:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {commands.slice(0, 5).map((cmd) => (
                  <span
                    key={cmd.description}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    "{cmd.keywords[0]}"
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileTap={{ scale: 0.9 }}>
        <Button
          onClick={isListening ? stopListening : startListening}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg ${
            isListening
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-destructive"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </>
  );
};

export default VoiceAssistantFAB;
