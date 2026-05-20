import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Flame, Trophy, ArrowRight, PlayCircle } from "lucide-react";
import CourseRoadmap from "./CourseRoadmap";
import { getCourse } from "@/data/courseContent";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/contexts/I18nContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { completedLessons } = useLessonProgress();

  const langLabels = {
    amharic: "Amharic",
    oromo: "Afan Oromoo",
    tigrinya: "Tigrinya",
  };
  const langName = user?.selectedLanguage ? langLabels[user.selectedLanguage] : "your selected language";

  const course = getCourse(user?.selectedLanguage || "amharic");
  const allLessons = course.units.flatMap((unit) => unit.lessons);
  const totalLessons = allLessons.length;
  const courseLessonIds = new Set(allLessons.map((lesson) => lesson.id));
  const completedForCourse = completedLessons.filter((lessonId) => courseLessonIds.has(lessonId));
  const completedCount = completedForCourse.length;
  const completion = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isLessonOpen = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return true;
    const unit = course.units.find((courseUnit) => courseUnit.lessons.some((lesson) => lesson.id === lessonId));
    const unitLessonIndex = unit?.lessons.findIndex((lesson) => lesson.id === lessonId) ?? -1;
    if (unitLessonIndex === 0) return true;
    const previousLesson = unit?.lessons[unitLessonIndex - 1];
    return Boolean(previousLesson && completedLessons.includes(previousLesson.id));
  };
  const nextLesson = allLessons.find((lesson) => !completedLessons.includes(lesson.id) && isLessonOpen(lesson.id));


  return (
    <div className="pb-20 md:pb-0" aria-label="Learn page">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-card/95 p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Learn</p>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{langName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 font-semibold text-foreground"><Flame className="h-4 w-4 text-accent" />{user?.streak ?? 0} days</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-foreground"><BookOpen className="h-4 w-4 text-primary" />{completedCount}/{totalLessons}</span>
            <span className="rounded-full bg-secondary/10 px-3 py-1.5 font-semibold text-foreground">{completion}% complete</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {nextLesson ? (
            <Link to={`/lesson/${nextLesson.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105" aria-label="Start next lesson">
              <PlayCircle className="h-4 w-4" />
              {t("learn.startNext")}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"><Trophy className="h-4 w-4 text-secondary" />{t("learn.courseCompleted")}</span>
          )}
          <Link to="/home" className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/40">{t("learn.backHome")} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </motion.div>

      <div className="mt-5">
        <CourseRoadmap />
      </div>
    </div>
  );
};

export default Dashboard;

