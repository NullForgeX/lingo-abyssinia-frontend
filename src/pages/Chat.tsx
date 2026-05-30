import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Sparkles, Loader2, X, Settings2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useChat } from "@/contexts/ChatContext";
import { useI18n } from "@/contexts/I18nContext";
import { SCENARIOS, LEVELS, SupportedLanguage } from "@/api/gemini";
import { speakWithBrowserFallback } from "@/api/voice";

const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string; flag: string }[] = [
  { value: "amharic", label: "Amharic", flag: "አ" },
  { value: "oromo", label: "Afan Oromoo", flag: "O" },
  { value: "tigrinya", label: "Tigrinya", flag: "ት" },
];

const ChatMessageBubble = ({ message, onSpeak }: { message: { content: string; role: string }; onSpeak: (text: string) => void }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
          isUser
            ? "gradient-gold text-gold-foreground rounded-br-md"
            : "bg-card border border-border/70 text-foreground rounded-bl-md"
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">AI Tutor</span>
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        {!isUser && (
          <button
            onClick={() => onSpeak(message.content)}
            className="mt-2 flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
          >
            <MessageCircle className="h-3 w-3" />
            Listen
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Chat = () => {
  const { t } = useI18n();
  const {
    messages,
    isLoading,
    error,
    language,
    level,
    scenario,
    sendMessage,
    setLanguage,
    setLevel,
    setScenario,
    clearConversation,
  } = useChat();

  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput("");

    await sendMessage(messageText);
  };

  const handleSpeak = (text: string) => {
    // Extract just the target language text (skip explanations)
    // For now, speak the whole message
    speakWithBrowserFallback(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.value === language);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between gap-3"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI Practice
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Conversation Partner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Practice speaking {currentLang?.label} with your AI tutor
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <Card className="border-border/70 bg-card/90">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-3">
                {/* Language */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Language
                  </label>
                  <div className="flex gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setLanguage(lang.value)}
                        className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                          language === lang.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="text-xs font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Level
                  </label>
                  <div className="flex gap-2">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        onClick={() => setLevel(lvl.value)}
                        className={`flex-1 rounded-xl border-2 p-2 text-center transition-all ${
                          level === lvl.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="text-sm font-semibold">{lvl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scenario */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Scenario
                  </label>
                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value as typeof scenario)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  >
                    {SCENARIOS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.emoji} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden border-border/70 bg-card/90">
        <ScrollArea className="h-[calc(100vh-380px)] p-4 sm:h-[calc(100vh-340px)]">
          <div className="space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Ready to practice?
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Your AI tutor is ready to help you practice {currentLang?.label}. Start with a greeting or ask me anything!
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["selam", "nagaa", "how are you?"].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => sendMessage(phrase)}
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  onSpeak={handleSpeak}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Input */}
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type in ${currentLang?.label} or English...`}
            disabled={isLoading}
            className="flex-1 rounded-2xl border-border/70 bg-card px-4 py-6 text-base"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="lg"
            className="rounded-2xl px-6 gradient-gold text-gold-foreground"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send. Your AI tutor will respond in {currentLang?.label}.
        </p>
      </div>
    </div>
  );
};

export default Chat;