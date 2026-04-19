import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLesson } from "@/data/courseContent";
import { Progress } from "@/components/ui/progress";
import MultipleChoice from "@/components/exercises/MultipleChoice";
import TranslationExercise from "@/components/exercises/TranslationExercise";
import AudioExercise from "@/components/exercises/AudioExercise";
import { useI18n } from "@/contexts/I18nContext";
import { Card, CardContent } from "@/components/ui/card";

const MAX_HEARTS = 3;

const LessonPlayer = () => {
  const { t } = useI18n();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lesson = useMemo(
    () => getLesson(user?.selectedLanguage || "amharic", lessonId || ""),
    [user?.selectedLanguage, lessonId],
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("lesson.notFound")}</p>
      </div>
    );
  }

  const exercises = lesson.exercises;
  const progress = (currentIdx / exercises.length) * 100;

  const handleAnswer = (correct: boolean) => {
    setAnswers((prev) => [...prev, correct]);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setHearts((prev) => prev - 1);
    }

    // Check if game over (no hearts)
    if (!correct && hearts <= 1) {
      setTimeout(() => {
        navigate(`/lesson/${lessonId}/result`, {
          state: {
            lessonTitle: lesson.title,
            totalExercises: exercises.length,
            correctAnswers: correctCount,
            xpEarned: 0,
            passed: false,
          },
        });
      }, 500);
      return;
    }

    // Move to next or finish
    setTimeout(() => {
      if (currentIdx + 1 >= exercises.length) {
        const finalCorrect = correctCount + (correct ? 1 : 0);
        const accuracy = finalCorrect / exercises.length;
        const xp = accuracy >= 0.5 ? lesson.xpReward : 0;
        navigate(`/lesson/${lessonId}/result`, {
          state: {
            lessonTitle: lesson.title,
            totalExercises: exercises.length,
            correctAnswers: finalCorrect,
            xpEarned: xp,
            passed: accuracy >= 0.5,
            lessonId: lesson.id,
          },
        });
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 300);
  };

  const currentExercise = exercises[currentIdx];

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_85%_20%,hsl(var(--secondary)/0.12),transparent_32%),radial-gradient(circle_at_50%_85%,hsl(var(--accent)/0.12),transparent_36%)]" />
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-3 py-3 shadow-lg shadow-black/10 sm:gap-4 sm:px-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-border/70 bg-background/80 p-2 text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <Progress value={progress} className="h-3 bg-muted" />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 transition-colors ${
                  i < hearts
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exercise area */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.28 }}
          >
            <Card className="overflow-hidden border border-border/70 bg-card/90 shadow-2xl shadow-black/15 backdrop-blur-sm">
              <CardContent className="p-5 md:p-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Lesson practice
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">
                      Stay sharp, move fast
                    </h1>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Session progress
                    </p>
                    <p className="font-display text-lg font-bold text-foreground">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>

                {currentExercise.type === "multiple-choice" && (
                  <MultipleChoice
                    exercise={currentExercise}
                    onAnswer={handleAnswer}
                  />
                )}
                {currentExercise.type === "translation" && (
                  <TranslationExercise
                    exercise={currentExercise}
                    onAnswer={handleAnswer}
                  />
                )}
                {currentExercise.type === "audio" && (
                  <AudioExercise
                    exercise={currentExercise}
                    onAnswer={handleAnswer}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Exercise counter */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {currentIdx + 1} {t("lesson.of")} {exercises.length}
        </p>
      </div>
    </div>
  );
};

export default LessonPlayer;
