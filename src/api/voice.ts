import { supabase } from "@/lib/supabase";

const audioCache = new Map<string, string>();

export const playElevenLabsSpeech = async (text: string) => {
  const normalized = text.trim();
  if (!normalized) return;

  let audioUrl = audioCache.get(normalized);

  if (!audioUrl) {
    const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
      body: { text: normalized },
    });

    if (error) throw error;

    const blob = data instanceof Blob ? data : new Blob([data], { type: "audio/mpeg" });
    audioUrl = URL.createObjectURL(blob);
    audioCache.set(normalized, audioUrl);
  }

  const audio = new Audio(audioUrl);
  await audio.play();
};

export const speakWithBrowserFallback = (text: string) =>
  new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    const voices = speechSynthesis.getVoices();
    const amharicVoice = voices.find((voice) => voice.lang.startsWith("am"));
    if (amharicVoice) utterance.voice = amharicVoice;

    speechSynthesis.speak(utterance);
  });

