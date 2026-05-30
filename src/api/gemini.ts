const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || "gemini-3-flash-preview";

export type SupportedLanguage = "amharic" | "oromo" | "tigrinya";

export type MessageRole = "user" | "model";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
};

export type ConversationScenario =
  | "greetings"
  | "market"
  | "travel"
  | "family"
  | "directions"
  | "restaurant"
  | "health"
  | "free";

export type LanguageLevel = "beginner" | "intermediate" | "advanced";

type GeminiPart = {
  text: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiRequest = {
  contents: GeminiContent[];
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
  };
};

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  amharic: "Amharic (አማርኛ)",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya (ትግርኛ)",
};

const SCENARIO_PROMPTS: Record<ConversationScenario, string> = {
  greetings: "Practice common greetings and introductions.",
  market: "Practice buying and bargaining at a market.",
  travel: "Practice asking for directions and using transport.",
  family: "Practice talking about family members.",
  directions: "Practice giving and asking for directions.",
  restaurant: "Practice ordering food and drinks.",
  health: "Practice explaining how you feel and asking for help.",
  free: "Have a free conversation on any topic.",
};

function buildSystemPrompt(
  language: SupportedLanguage,
  level: LanguageLevel,
  scenario: ConversationScenario,
): string {
  const langName = LANGUAGE_NAMES[language];
  const scenarioDesc = SCENARIO_PROMPTS[scenario];

  const levelInstructions: Record<LanguageLevel, string> = {
    beginner:
      "Keep sentences simple and short. Use common vocabulary. Translate key phrases slowly. Be very patient and encouraging.",
    intermediate:
      "Use moderate complexity. Mix simple and compound sentences. Gently introduce new vocabulary. Offer mild corrections.",
    advanced:
      "Use natural, fluent language. Include idioms and cultural context. Give subtle corrections. Challenge the learner.",
  };

  return `You are a friendly, patient language tutor helping a learner practice ${langName}.

CONTEXT:
- The learner is at ${level} level
- Practice scenario: ${scenarioDesc}
- Default language: ${langName} (always use this unless the user explicitly asks for English)
- User's selected language is ${langName} - always respond in this language first

CRITICAL RULES - ALWAYS FOLLOW THESE:
1. When a user asks ANY question or says ANYTHING, you MUST respond in ${langName} FIRST, then briefly explain in English if needed. NEVER default to English-only answers.
2. NEVER use markdown formatting like asterisks (*), hashes (#), or bullet points. Use plain text only.

EXAMPLES:
- If user asks "how are you?" → Respond in ${langName}, give the phrase for "I am fine" in ${langName}
- If user asks "what is X?" → Give the answer in ${langName} script/text
- If user says "help me learn greetings" → Start with a greeting in ${langName}
- NEVER say "In Tigrinya, X" - just say "X" as if speaking ${langName}

YOUR STYLE:
- ${levelInstructions[level]}
- Be warm, encouraging, and culturally aware
- ALWAYS start conversations in ${langName} with a greeting
- When teaching vocabulary, show the word in ${langName} script first, then explain
- Keep responses conversational (not too long)
- Use a mix of dialogue and brief teaching moments
- Include pronunciation hints in square brackets when useful

FORMAT:
- Always write your response in ${langName} (Fidel script for Amharic/Tigrinya, Latin for Afan Oromoo)
- Show the target language prominently
- If user asks a question, answer it directly in ${langName} without prefixing with English
- Use plain text only. No asterisks, no bullet points, no markdown. Separate items with line breaks.
- If you need to explain grammar or culture, do so briefly in English AFTER the ${langName} content

Remember: You are a ${langName} tutor. Respond in ${langName} as the default! Use NO markdown formatting!`;
}

export async function sendGeminiMessage(
  messages: ChatMessage[],
  language: SupportedLanguage,
  level: LanguageLevel,
  scenario: ConversationScenario,
  signal?: AbortSignal,
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      "Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env.local file.",
    );
  }

  const systemPrompt = buildSystemPrompt(language, level, scenario);

  // Build conversation history for Gemini
  // Gemini expects alternating user/model messages
  const contents: GeminiContent[] = [
    // System instruction as the first model message
    { role: "model", parts: [{ text: systemPrompt }] },
  ];

  // Add conversation history (skipping the system prompt which is in contents[0])
  const historyMessages = messages.filter((m) => m.role === "user");
  for (const msg of historyMessages) {
    contents.push({ role: "user", parts: [{ text: msg.content }] });
    // Note: Gemini expects the previous exchange to be included in context
    // We need to include model responses too for proper context
  }

  // If we have a recent exchange, include it for context
  const recentMessages = messages.slice(-6);
  for (const msg of recentMessages) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  const request: GeminiRequest = {
    contents,
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    },
  };

  const url = `${GEMINI_URL}?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid response from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const SCENARIOS: { value: ConversationScenario; label: string; emoji: string }[] = [
  { value: "greetings", label: "Greetings & Introductions", emoji: "👋" },
  { value: "market", label: "Market & Shopping", emoji: "🛒" },
  { value: "travel", label: "Travel & Directions", emoji: "🚌" },
  { value: "family", label: "Family & People", emoji: "👨‍👩‍👧‍👦" },
  { value: "directions", label: "Asking Directions", emoji: "🗺️" },
  { value: "restaurant", label: "Restaurant & Food", emoji: "🍽️" },
  { value: "health", label: "Health & Help", emoji: "🏥" },
  { value: "free", label: "Free Conversation", emoji: "💬" },
];

export const LEVELS: { value: LanguageLevel; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "Simple sentences, lots of patience" },
  { value: "intermediate", label: "Intermediate", desc: "Moderate complexity, gentle corrections" },
  { value: "advanced", label: "Advanced", desc: "Natural conversation, subtle corrections" },
];
