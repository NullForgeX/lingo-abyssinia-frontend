import { supabase } from "@/lib/supabase";

const audioCache = new Map<string, string>();
let activeAudio: HTMLAudioElement | null = null;
let activeAudioResolve: (() => void) | null = null;
let activeSpeechRun = 0;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_TTS_MODEL =
  (import.meta.env.VITE_GEMINI_TTS_MODEL as string | undefined) ||
  "gemini-3.1-flash-tts-preview";

type SpeechLanguage = "amharic" | "oromo" | "tigrinya";

const languageNames: Record<SpeechLanguage, string> = {
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

const makeWavBlob = (pcm: Uint8Array, sampleRate = 24000) => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.byteLength, true);

  return new Blob([header, pcm], { type: "audio/wav" });
};

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const splitSpeechText = (text: string, maxLength = 260) => {
  const parts = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?።፧፨])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const part of parts.length ? parts : [text.trim()]) {
    if (part.length <= maxLength) {
      chunks.push(part);
      continue;
    }

    const words = part.split(" ");
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLength && current) {
        chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) chunks.push(current);
  }

  return chunks;
};

const playAudioUrl = async (audioUrl: string, runId = activeSpeechRun) => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudioResolve?.();
    activeAudioResolve = null;
  }

  const audio = new Audio(audioUrl);
  activeAudio = audio;

  await new Promise<void>((resolve, reject) => {
    activeAudioResolve = resolve;
    audio.onended = () => {
      activeAudioResolve = null;
      resolve();
    };
    audio.onerror = () => reject(new Error("Audio playback failed."));
    audio.play().catch(reject);
  });

  if (activeAudio === audio && runId === activeSpeechRun) {
    activeAudio = null;
  }
};

const getGeminiAudioUrl = async (
  text: string,
  options: { language?: SpeechLanguage; voiceName?: string } = {},
) => {
  const normalized = text.trim();
  if (!normalized || !GEMINI_API_KEY) return null;

  const voiceName = options.voiceName || "Kore";
  const cacheKey = `gemini:${GEMINI_TTS_MODEL}:${voiceName}:${options.language || "any"}:${normalized}`;
  let audioUrl = audioCache.get(cacheKey);

  if (!audioUrl) {
    const languageHint = options.language
      ? ` in clear ${languageNames[options.language]} pronunciation`
      : "";
    const prompt = `Read this text aloud${languageHint}. Speak naturally and clearly, with a warm tutor voice. Text: ${normalized}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini TTS failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const audioBase64 =
      data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
      data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;

    if (!audioBase64) {
      throw new Error("Gemini TTS did not return audio data.");
    }

    audioUrl = URL.createObjectURL(makeWavBlob(decodeBase64(audioBase64)));
    audioCache.set(cacheKey, audioUrl);
  }

  return audioUrl;
};

export const playGeminiSpeech = async (
  text: string,
  options: { language?: SpeechLanguage; voiceName?: string } = {},
) => {
  const audioUrl = await getGeminiAudioUrl(text, options);
  if (!audioUrl) return false;

  activeSpeechRun += 1;
  await playAudioUrl(audioUrl, activeSpeechRun);
  return true;
};

export const playElevenLabsSpeech = async (text: string) => {
  const normalized = text.trim();
  if (!normalized) return;

  const cacheKey = `elevenlabs:${normalized}`;
  let audioUrl = audioCache.get(cacheKey);

  if (!audioUrl) {
    const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
      body: { text: normalized },
    });

    if (error) throw error;

    const blob = data instanceof Blob ? data : new Blob([data], { type: "audio/mpeg" });
    audioUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, audioUrl);
  }

  activeSpeechRun += 1;
  await playAudioUrl(audioUrl, activeSpeechRun);
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

export const playAppSpeech = async (
  text: string,
  options: {
    language?: SpeechLanguage;
    useElevenLabsFallback?: boolean;
    chunkLongText?: boolean;
    onPlaybackStart?: () => void;
  } = {},
) => {
  const runId = activeSpeechRun + 1;
  activeSpeechRun = runId;

  try {
    if (options.chunkLongText) {
      const chunks = splitSpeechText(text);
      const audioUrls = chunks.map((chunk, index) =>
        index === 0
          ? getGeminiAudioUrl(chunk, { language: options.language })
          : undefined,
      );

      for (let index = 0; index < chunks.length; index += 1) {
        if (runId !== activeSpeechRun) return;
        const audioUrl =
          (await audioUrls[index]) ||
          (await getGeminiAudioUrl(chunks[index], { language: options.language }));
        if (!audioUrl) break;

        if (index + 1 < chunks.length && !audioUrls[index + 1]) {
          audioUrls[index + 1] = getGeminiAudioUrl(chunks[index + 1], {
            language: options.language,
          });
        }

        options.onPlaybackStart?.();
        await playAudioUrl(audioUrl, runId);
      }
      return;
    }

    const audioUrl = await getGeminiAudioUrl(text, { language: options.language });
    if (audioUrl) {
      options.onPlaybackStart?.();
      await playAudioUrl(audioUrl, runId);
      return;
    }
  } catch (error) {
    console.error("Gemini TTS failed; trying fallback speech", error);
  }

  if (options.useElevenLabsFallback !== false) {
    try {
      await playElevenLabsSpeech(text);
      return;
    } catch (error) {
      console.error("ElevenLabs playback failed; using browser speech fallback", error);
    }
  }

  await speakWithBrowserFallback(text);
};

export const pauseAppSpeech = () => {
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
    return true;
  }
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    return true;
  }
  return false;
};

export const resumeAppSpeech = async () => {
  if (activeAudio?.paused) {
    await activeAudio.play();
    return true;
  }
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    return true;
  }
  return false;
};

export const stopAppSpeech = () => {
  activeSpeechRun += 1;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
    activeAudioResolve?.();
    activeAudioResolve = null;
  }
  speechSynthesis.cancel();
};
