import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  ChatMessage,
  LanguageLevel,
  SupportedLanguage,
  ConversationScenario,
  sendGeminiMessage,
  generateMessageId,
} from "@/api/gemini";
import { useAuth } from "@/contexts/AuthContext";

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  language: SupportedLanguage;
  level: LanguageLevel;
  scenario: ConversationScenario;
  sendMessage: (content: string) => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
  setLevel: (level: LanguageLevel) => void;
  setScenario: (scenario: ConversationScenario) => void;
  clearConversation: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>(
    (user?.selectedLanguage as SupportedLanguage) || "amharic",
  );
  const [level, setLevel] = useState<LanguageLevel>("beginner");
  const [scenario, setScenario] = useState<ConversationScenario>("free");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsLoading(true);

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        const allMessages = [...messages, userMessage];
        const response = await sendGeminiMessage(
          allMessages,
          language,
          level,
          scenario,
          abortControllerRef.current.signal,
        );

        const modelMessage: ChatMessage = {
          id: generateMessageId(),
          role: "model",
          content: response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, modelMessage]);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            // User cancelled, don't show error
            return;
          }
          setError(err.message);
        } else {
          setError("Failed to get response. Please try again.");
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, language, level, scenario],
  );

  const clearConversation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
