import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star, Target, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface ResultState {
  lessonTitle: string;
  totalExercises: number;
  correctAnswers: number;
  xpEarned: number;
  passed: boolean;
  lessonId?: string;
  nextLessonId?: string;
  nextLessonTitle?: string;
}

const LessonResult = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { markComplete } = useLessonProgress();
  const state = location.state as ResultState | null;

  useEffect(() => {
    if (state?.passed && state?.lessonId) {
      markComplete(state.lessonId, state.xpEarned);
    }
  }, [state?.passed, state?.lessonId, state?.xpEarned, markComplete]);

  if (!state) {
    navigate("/dashboard");
    return null;
  }

  const { lessonTitle, totalExercises, correctAnswers, xpEarned, passed, nextLessonId, nextLessonTitle } =
    state;
  const accuracy = Math.round((correctAnswers / totalExercises) * 100);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/0.18),transparent_30%),radial-gradient(circle_at_80%_90%,hsl(var(--secondary)/0.14),transparent_34%),radial-gradient(circle_at_20%_80%,hsl(var(--accent)/0.12),transparent_30%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <Card className="overflow-hidden border border-border/70 bg-card/90 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] ${
                passed ? "bg-primary/15" : "bg-destructive/15"
              }`}
            >
              {passed ? (
                <Trophy className="h-12 w-12 text-primary" />
              ) : (
                <Target className="h-12 w-12 text-destructive" />
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 font-display text-3xl font-bold text-foreground"
            >
              {passed ? t("lesson.complete") : t("lesson.keepPracticing")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-muted-foreground"
            >
              {lessonTitle}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
            >
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <Star className="mx-auto h-6 w-6 text-secondary" />
                <p className="mt-2 font-display text-2xl font-bold text-foreground">
                  {xpEarned}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("lesson.xpEarned")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <Target className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 font-display text-2xl font-bold text-foreground">
                  {accuracy}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("lesson.accuracy")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <Trophy className="mx-auto h-6 w-6 text-accent" />
                <p className="mt-2 font-display text-2xl font-bold text-foreground">
                  {correctAnswers}/{totalExercises}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("lesson.correct")}
                </p>
              </div>
            </motion.div>

                        {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-col gap-3"
            >
              {passed && nextLessonId ? (
                <>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
                    <p className="text-sm font-semibold text-foreground">Ready for the next lesson?</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You passed this lesson. Choose when to continue.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/lesson/${nextLessonId}`)}
                    size="lg"
                    className="w-full gap-2 rounded-2xl"
                  >
                    Continue to {nextLessonTitle || "Next Lesson"} <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl"
                  >
                    Not now — back to dashboard
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="w-full gap-2 rounded-2xl"
                >
                  {passed ? "Back to Dashboard" : t("app.continue")} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {!passed && (
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 rounded-2xl"
                >
                  <RotateCcw className="h-4 w-4" /> {t("app.tryAgain")}
                </Button>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LessonResult;
