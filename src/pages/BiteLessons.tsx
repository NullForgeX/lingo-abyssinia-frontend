import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, Headphones, Languages, Volume2 } from "lucide-react";
import { biteLanguageNames, biteLessons, BiteLanguage, BiteLessonItem } from "@/data/biteLessons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { playElevenLabsSpeech, speakWithBrowserFallback } from "@/api/voice";

const isBiteLanguage = (language?: string): language is BiteLanguage =>
  language === "amharic" || language === "oromo" || language === "tigrinya";

const displayTarget = (item: BiteLessonItem) =>
  item.script ? `${item.target} / ${item.script}` : item.target;

const BiteLessons = () => {
  const { user, updateUser } = useAuth();
  const initialLanguage = isBiteLanguage(user?.selectedLanguage) ? user.selectedLanguage : "amharic";
  const [language, setLanguage] = useState<BiteLanguage>(initialLanguage);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [speakingKey, setSpeakingKey] = useState("");
  const [voiceError, setVoiceError] = useState("");

  const lessons = biteLessons[language];
  const activeLesson = lessons[lessonIndex];
  const activeItem = activeLesson.items[itemIndex];
  const progress = Math.round(((itemIndex + 1) / activeLesson.items.length) * 100);

  const nextLabel = useMemo(() => {
    if (itemIndex < activeLesson.items.length - 1) return "Next phrase";
    if (lessonIndex < lessons.length - 1) return "Next lesson";
    return "Review again";
  }, [activeLesson.items.length, itemIndex, lessonIndex, lessons.length]);

  const changeLanguage = async (nextLanguage: BiteLanguage) => {
    setLanguage(nextLanguage);
    setLessonIndex(0);
    setItemIndex(0);
    if (user && nextLanguage !== user.selectedLanguage) {
      await updateUser({ selectedLanguage: nextLanguage });
    }
  };

  const speak = async (text: string, keySuffix: string) => {
    const key = `${activeLesson.id}-${keySuffix}`;
    setSpeakingKey(key);
    setVoiceError("");
    try {
      await playElevenLabsSpeech(text);
    } catch (error) {
      console.error("Lesson voice playback failed; using browser fallback", error);
      setVoiceError("Using browser voice fallback until ElevenLabs responds.");
      await speakWithBrowserFallback(text);
    } finally {
      setSpeakingKey("");
    }
  };

  const goPrevious = () => {
    if (itemIndex > 0) {
      setItemIndex((current) => current - 1);
      return;
    }
    if (lessonIndex > 0) {
      const previousLesson = lessons[lessonIndex - 1];
      setLessonIndex((current) => current - 1);
      setItemIndex(previousLesson.items.length - 1);
    }
  };

  const goNext = () => {
    if (itemIndex < activeLesson.items.length - 1) {
      setItemIndex((current) => current + 1);
      return;
    }
    if (lessonIndex < lessons.length - 1) {
      setLessonIndex((current) => current + 1);
      setItemIndex(0);
      return;
    }
    setLessonIndex(0);
    setItemIndex(0);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-20 md:pb-0">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative p-5 sm:p-6 md:p-8">
          <div className="absolute right-6 top-6 hidden rounded-full bg-primary/10 p-5 text-primary md:block">
            <BookOpenCheck className="h-10 w-10" />
          </div>
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
              <Headphones className="h-3.5 w-3.5" /> Bite-sized lessons
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Learn first, quiz later.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Short interactive lessons for real phrases, correct usage, script, examples, and audio practice in all three languages.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Languages className="h-4 w-4 text-primary" /> Language
            </div>
            <div className="grid gap-2">
              {(Object.keys(biteLessons) as BiteLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                    language === lang
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {biteLanguageNames[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold text-foreground">Lesson path</p>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setLessonIndex(index);
                    setItemIndex(0);
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition-all ${
                    lessonIndex === index
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">{lesson.level}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {lesson.items.length} cards
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-1 font-semibold text-foreground">{lesson.title}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{activeLesson.level}</span>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{activeLesson.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{activeLesson.goal}</p>
            </div>
            <div className="rounded-2xl bg-muted px-3 py-2 text-sm font-semibold text-foreground">
              {lessonIndex + 1}/{lessons.length} · {itemIndex + 1}/{activeLesson.items.length}
            </div>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <motion.div
            key={`${activeLesson.id}-${itemIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-background p-5 text-center sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{activeItem.title}</p>
            <p className="mt-3 text-lg text-muted-foreground">{activeItem.english}</p>
            <h3 className="mt-2 font-display text-3xl font-black text-foreground md:text-5xl">
              {displayTarget(activeItem)}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{activeItem.note}</p>

            {activeItem.example && (
              <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Example</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{activeItem.example}</p>
                <p className="mt-1 text-xs text-muted-foreground">Hear the word first, then hear it inside a useful sentence.</p>
              </div>
            )}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => speak(activeItem.target, `${itemIndex}-target`)} size="lg" className="gap-2">
                <Volume2 className={`h-5 w-5 ${speakingKey.endsWith("target") ? "animate-pulse" : ""}`} />
                Hear word
              </Button>
              {activeItem.example && (
                <Button onClick={() => speak(activeItem.example ?? activeItem.target, `${itemIndex}-example`)} size="lg" variant="outline" className="gap-2">
                  <Headphones className={`h-5 w-5 ${speakingKey.endsWith("example") ? "animate-pulse" : ""}`} />
                  Hear example
                </Button>
              )}
            </div>

            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={goPrevious} size="lg" variant="ghost" className="gap-2" disabled={lessonIndex === 0 && itemIndex === 0}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button onClick={goNext} size="lg" variant="secondary" className="gap-2">
                <CheckCircle2 className="h-4 w-4" /> Got it · {nextLabel} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {voiceError && <p className="mt-3 text-xs text-muted-foreground">{voiceError}</p>}
          </motion.div>

          <div className="mt-5 rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-foreground">
            <span className="font-bold text-primary">Usage tip: </span>
            {activeLesson.tip}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BiteLessons;
