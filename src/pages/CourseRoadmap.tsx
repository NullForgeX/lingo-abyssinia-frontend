import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getCourse } from "@/data/courseContent";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, PlayCircle, Star, Route, ArrowRight } from "lucide-react";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useI18n } from "@/contexts/I18nContext";

const CourseRoadmap = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { completedLessons } = useLessonProgress();
  const course = getCourse(user?.selectedLanguage || "amharic");

  const langLabels = {
    amharic: "Amharic",
    oromo: "Afan Oromoo",
    tigrinya: "Tigrinya",
  };
  const langName = user?.selectedLanguage ? langLabels[user.selectedLanguage] : "Amharic";

  const allLessons = course.units.flatMap((u) => u.lessons);

  const getStatus = (lessonId: string): "completed" | "active" | "locked" => {
    if (completedLessons.includes(lessonId)) return "completed";

    const unit = course.units.find((courseUnit) =>
      courseUnit.lessons.some((lesson) => lesson.id === lessonId),
    );
    const unitLessonIndex = unit?.lessons.findIndex((lesson) => lesson.id === lessonId) ?? -1;
    if (unitLessonIndex === 0) return "active";

    const previousLesson = unit?.lessons[unitLessonIndex - 1];
    if (previousLesson && completedLessons.includes(previousLesson.id)) return "active";
    return "locked";
  };

  const firstActive = allLessons.find((l) => getStatus(l.id) === "active");

  return (
    <div className="pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/95 via-card/80 to-primary/10 p-6 shadow-xl"
      >
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Route className="h-3.5 w-3.5" />
              {t("app.learn")}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">{langName} Course</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("learn.clearPath")}
            </p>
          </div>
          {firstActive && (
            <button
              onClick={() => navigate(`/lesson/${firstActive.id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
            >
              {t("learn.startNext")}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      <div className="mt-8 space-y-6">
        {course.units.map((unit, unitIdx) => (
          <motion.section
            key={unit.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.03 }}
            className="rounded-2xl border border-border/70 bg-card/95 p-4 shadow-sm md:p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display font-bold text-primary">
                {unitIdx + 1}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{unit.title}</h2>
                <p className="text-sm text-muted-foreground">{unit.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              {unit.lessons.map((lesson) => {
                const status = getStatus(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
                      status === "completed"
                        ? "border-primary/30 bg-primary/5"
                        : status === "active"
                          ? "border-secondary/40 bg-secondary/10"
                          : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {status === "completed" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      {status === "active" && <PlayCircle className="h-5 w-5 text-secondary" />}
                      {status === "locked" && <Lock className="h-5 w-5 text-muted-foreground" />}

                      <div>
                        <p className="text-sm font-semibold text-foreground">{lesson.title}</p>
                        <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {lesson.xpReward} XP
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={status === "locked"}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        status === "locked"
                          ? "cursor-not-allowed bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground hover:brightness-105"
                      }`}
                    >
                      {status === "completed" ? t("learn.review") : status === "active" ? t("learn.start") : t("learn.locked")}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default CourseRoadmap;
