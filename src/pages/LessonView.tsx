import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, Headphones, Home, Volume2 } from "lucide-react";
import { biteLessons, biteLanguageNames, BiteLanguage, BiteLesson, BiteLessonItem } from "@/data/biteLessons";
import { Button } from "@/components/ui/button";
import { playElevenLabsSpeech, speakWithBrowserFallback } from "@/api/voice";
import { useNavigate, useParams } from "react-router-dom";

const isBiteLanguage = (language?: string): language is BiteLanguage =>
  language === "amharic" || language === "oromo" || language === "tigrinya";

const displayTarget = (item: BiteLessonItem) =>
  item.script ? `${item.target} / ${item.script}` : item.target;

const LessonView = () => {
  const { language, lessonId } = useParams<{ language: string; lessonId: string }>();
  const navigate = useNavigate();

  const allLessons = language && isBiteLanguage(language) ? biteLessons[language] : [];
  const lesson = allLessons.find((l) => l.id === lessonId);

  const currentIndex = lesson ? allLessons.findIndex((l) => l.id === lesson.id) : 0;
  const [itemIndex, setItemIndex] = useState(0);
  const [speakingKey, setSpeakingKey] = useState("");
  const [voiceError, setVoiceError] = useState("");

  if (!lesson || !language || !isBiteLanguage(language)) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h2 className="text-xl font-bold">Lesson not found</h2>
        <Button onClick={() => navigate("/bite-lessons")} className="mt-4" variant="outline">
          Back to lessons
        </Button>
      </div>
    );
  }

  const activeItem = lesson.items[itemIndex];
  const progress = Math.round(((itemIndex + 1) / lesson.items.length) * 100);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const nextLabel = useMemo(() => {
    if (itemIndex < lesson.items.length - 1) return "Next phrase";
    if (nextLesson) return "Next lesson";
    return "Finish lesson";
  }, [lesson.items.length, itemIndex, nextLesson]);

  const speak = async (text: string, keySuffix: string) => {
    const key = `${lesson.id}-${keySuffix}`;
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
    }
  };

  const goNext = () => {
    if (itemIndex < lesson.items.length - 1) {
      setItemIndex((current) => current + 1);
      return;
    }
    if (nextLesson) {
      navigate(`/bite-lesson/${language}/${nextLesson.id}`);
    }
  };

  const isFirst = currentIndex === 0 && itemIndex === 0;
  const isLastItem = itemIndex === lesson.items.length - 1;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate("/bite-lessons")} className="gap-2">
          <Home className="h-4 w-4" />
          All lessons
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-muted-foreground">{biteLanguageNames[language as keyof typeof biteLanguageNames]}</span>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-primary">{lesson.level}</span>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{lesson.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{lesson.goal}</p>
          </div>
          <div className="rounded-2xl bg-muted px-3 py-2 text-sm font-semibold text-foreground">
            {currentIndex + 1}/{allLessons.length} · {itemIndex + 1}/{lesson.items.length}
          </div>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          key={`${lesson.id}-${itemIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
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
            <Button onClick={goPrevious} size="lg" variant="ghost" className="gap-2" disabled={isFirst}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button onClick={goNext} size="lg" variant="secondary" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {isLastItem ? (nextLesson ? "Continue to next lesson" : "Finish") : "Got it · Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {voiceError && <p className="mt-3 text-xs text-muted-foreground">{voiceError}</p>}
        </motion.div>

        <div className="mt-5 rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-foreground">
          <span className="font-bold text-primary">Usage tip: </span>
          {lesson.tip}
        </div>
      </motion.section>

      {nextLesson && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Up next</p>
          <Button variant="outline" className="w-full justify-between" onClick={() => navigate(`/bite-lesson/${language}/${nextLesson.id}`)}>
            <div className="text-left">
              <span className="text-xs font-bold uppercase text-primary">{nextLesson.level}</span>
              <p className="font-semibold">{nextLesson.title}</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default LessonView;
