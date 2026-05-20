import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Target, Flame, Trophy, ArrowRight, PlayCircle, Compass, Sparkles, History } from "lucide-react";
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
  const langName = user?.selectedLanguage ? langLabels[user.selectedLanguage] : "your selected language";

  const course = getCourse(user?.selectedLanguage || "amharic");
  const allLessons = course.units.flatMap((unit) => unit.lessons);
  const totalLessons = allLessons.length;
  const courseLessonIds = new Set(allLessons.map((lesson) => lesson.id));
  const completedForCourse = completedLessons.filter((lessonId) => courseLessonIds.has(lessonId));
  const completedCount = completedForCourse.length;
  const completion = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const nextLesson = allLessons.find((lesson) => !completedLessons.includes(lesson.id));

  const suggested = useMemo(() => {
    const remaining = allLessons.filter((l) => !completedLessons.includes(l.id));
    const highXp = [...remaining].sort((a, b) => b.xpReward - a.xpReward).slice(0, 2);
    const recentUnit = course.units.find((u) => u.lessons.some((l) => completedLessons.includes(l.id)));
    const continuity = recentUnit?.lessons.find((l) => !completedLessons.includes(l.id));
    const suggestions = [nextLesson, continuity, ...highXp].filter(Boolean);
    const dedup = Array.from(new Map(suggestions.map((s) => [s!.id, s])).values()).slice(0, 3);
    return dedup;
  }, [allLessons, completedLessons, course.units, nextLesson]);

  const achievements = useMemo(() => {
    const list: Array<{ title: string; desc: string }> = [];
    if (completedCount >= 1) list.push({ title: "First Lesson Complete", desc: "You started your language journey." });
    if (completedCount >= 10) list.push({ title: "10 Lessons Milestone", desc: "Great consistency in learning." });
    if ((user?.streak ?? 0) >= 5) list.push({ title: "5-Day Streak", desc: "You practiced 5 days in a row." });
    if ((user?.gems ?? 0) >= 100) list.push({ title: "100 Gems", desc: "You earned strong performance rewards." });
    return list;
  }, [completedCount, user?.gems, user?.streak]);

  return (
    <div className="pb-20 md:pb-0" aria-label="Learn page">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary)/0.22),transparent_42%),radial-gradient(circle_at_8%_85%,hsl(var(--primary)/0.2),transparent_35%),linear-gradient(140deg,hsl(var(--card))_0%,hsl(var(--card)/0.92)_50%,hsl(var(--background))_100%)] p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative z-10">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">Learn {langName}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Clear start: continue your next unlocked lesson, then follow the roadmap below.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Current streak</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-foreground"><Flame className="h-4 w-4 text-accent" />{user?.streak ?? 0} days</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-foreground"><BookOpen className="h-4 w-4 text-primary" />{completedCount}/{totalLessons} lessons</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Daily goal</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-foreground"><Target className="h-4 w-4 text-secondary" />{user?.dailyGoal ?? 15} min</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {nextLesson ? (
              <Link to={`/lesson/${nextLesson.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105" aria-label="Start next lesson">
                <PlayCircle className="h-4 w-4" />
                {t("learn.startNext")}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground"><Trophy className="h-4 w-4 text-secondary" />{t("learn.courseCompleted")}</span>
            )}
            <Link to="/language-selection" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-card"><Compass className="h-4 w-4" />{t("learn.changeLanguage")}</Link>
            <Link to="/home" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-card">{t("learn.backHome")} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{t("dashboard.overallProgress")}</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="mt-3 h-3 bg-muted" />
        <p className="mt-2 text-sm text-muted-foreground">Completed {completedCount} of {totalLessons} lessons in {langName}.</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm" aria-label="Suggested lessons">
          <h3 className="font-semibold text-foreground inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Suggested lessons</h3>
          <p className="mt-1 text-sm text-muted-foreground">Personalized from your progress and remaining path.</p>
          <div className="mt-4 space-y-2">
            {suggested.length === 0 ? (
              <p className="text-sm text-muted-foreground">No suggestions right now. You have completed everything.</p>
            ) : (
              suggested.map((lesson) => (
                <Link key={lesson.id} to={`/lesson/${lesson.id}`} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{lesson.xpReward} XP</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">Start</span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm" aria-label="Achievements and history">
          <h3 className="font-semibold text-foreground inline-flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Achievements & history</h3>
          <p className="mt-1 text-sm text-muted-foreground">Milestones unlocked from your current account progress.</p>
          <div className="mt-4 space-y-2">
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Complete your first lesson to unlock achievements.</p>
            ) : (
              achievements.map((a, idx) => (
                <div key={idx} className="rounded-lg border border-border/70 p-3">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-10">
        <CourseRoadmap />
      </div>
    </div>
  );
};

export default Dashboard;

