import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  Languages,
  Flame,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { getCourse } from "@/data/courseContent";

const Home = () => {
  const { user } = useAuth();
  const { completedLessons } = useLessonProgress();

  const course = getCourse(user?.selectedLanguage ?? "amharic");
  const totalLessons = course.units.flatMap((u) => u.lessons).length;
  const completion = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const quickLinks = [
    {
      title: "Language Selection",
      desc: "Pick or update your learning language.",
      to: "/language-selection",
      icon: Languages,
      accent: "from-primary/20 to-primary/5",
    },
    {
      title: "Streak History",
      desc: "See your daily practice consistency.",
      to: "/progress/streaks",
      icon: Flame,
      accent: "from-accent/20 to-accent/5",
    },
    {
      title: "Badge History",
      desc: "Review badges and milestones earned.",
      to: "/progress/badges",
      icon: BadgeCheck,
      accent: "from-secondary/20 to-secondary/5",
    },
    {
      title: "Per-Skill Chart",
      desc: "Track progress across core skills.",
      to: "/progress/skills",
      icon: BarChart3,
      accent: "from-primary/10 to-secondary/10",
    },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-secondary/10 to-background p-6 md:p-8"
      >
        <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HomeIcon className="h-3.5 w-3.5" />
              HOME
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-foreground md:text-4xl">
              Welcome back, {user?.name ?? "Learner"}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your central hub for language tools, progress insights, and shortcuts.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
          >
            Go to Learn
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{user?.streak ?? 0} days</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Lessons Complete</p>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {completedLessons.length}/{totalLessons}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Gems Earned</p>
            <Trophy className="h-5 w-5 text-secondary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{user?.gems ?? 0}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-foreground">Quick Access</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {quickLinks.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={item.to}
                className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold text-foreground">General Info</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Daily goal: {user?.dailyGoal ?? 15} minutes. Overall completion: {completion}%. Continue from Learn to keep your streak active and unlock more badges.
        </p>
      </section>
    </div>
  );
};

export default Home;
