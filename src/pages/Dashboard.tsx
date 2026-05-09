import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Target,
  Flame,
  Trophy,
  Activity,
  ArrowRight,
  Timer,
} from "lucide-react";
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
    oromo: "Oromo",
    tigrinya: "Tigrinya",
  };
  const langName = user?.selectedLanguage
    ? langLabels[user.selectedLanguage]
    : "your selected language";

  const course = getCourse(user?.selectedLanguage || "amharic");
  const allLessons = course.units.flatMap((unit) => unit.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.length;
  const completion =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const nextLesson = allLessons.find(
    (lesson) => !completedLessons.includes(lesson.id),
  );

  return (
    <div className="pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-secondary/10 to-background p-6 md:p-8"
      >
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Activity className="h-3.5 w-3.5" />
              {t("dashboard.momentum")}
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground md:text-4xl">
              {t("dashboard.welcome")}, {user?.name ?? "Learner"}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {t("dashboard.keepGoing")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={nextLesson ? `/lesson/${nextLesson.id}` : "/dashboard"}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
            >
              {t("dashboard.continueLearning")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground">
              <Timer className="h-4 w-4 text-accent" />
              {user?.dailyGoal ?? 15} min
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: t("dashboard.currentStreak"),
            value: `${user?.streak ?? 0} days`,
            icon: Flame,
            color: "text-accent",
          },
          {
            label: t("dashboard.dailyGoal"),
            value: `${user?.dailyGoal ?? 15} min`,
            icon: Target,
            color: "text-primary",
          },
          {
            label: t("dashboard.gemsEarned"),
            value: `${user?.gems ?? 0}`,
            icon: Trophy,
            color: "text-secondary",
          },
          {
            label: t("dashboard.lessonsDone"),
            value: `${completedCount}/${totalLessons}`,
            icon: BookOpen,
            color: "text-primary",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/progress/streaks" className="text-sm font-medium text-primary hover:underline">
          View streak history
        </Link>
        <Link to="/progress/badges" className="text-sm font-medium text-primary hover:underline">
          View badge history
        </Link>
        <Link to="/progress/skills" className="text-sm font-medium text-primary hover:underline">
          View per-skill chart
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              {t("dashboard.overallProgress")}
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {completion}% complete
            </span>
          </div>
          <Progress value={completion} className="mt-4 h-3 bg-muted" />
          <p className="mt-3 text-sm text-muted-foreground">
            Completed {completedCount} of {totalLessons} lessons in your{" "}
            {langName} course.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm"
        >
          <h2 className="font-display text-xl font-bold text-foreground">
            {t("dashboard.nextUp")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {nextLesson
              ? `Continue with ${nextLesson.title}.`
              : "You have finished all available lessons."}
          </p>
          {nextLesson && (
            <Link
              to={`/lesson/${nextLesson.id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Start next lesson
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            to="/language-selection"
            className="mt-3 block text-sm font-medium text-primary hover:underline"
          >
            Change language preference
          </Link>
        </motion.div>
      </div>

      {/* Course Roadmap */}
      <div className="mt-10">
        <CourseRoadmap />
      </div>
    </div>
  );
};

export default Dashboard;
