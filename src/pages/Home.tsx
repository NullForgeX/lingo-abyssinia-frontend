import { useEffect, useMemo, useState } from "react";
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
  Search,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useI18n } from "@/contexts/I18nContext";
import LanguageCard from "@/components/LanguageCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getCourse } from "@/data/courseContent";
import {
  buildProgressBadges,
  buildSkillScores,
  buildStreakHistory,
} from "@/lib/progressInsights";

const languages = [
  {
    key: "amharic" as const,
    language: "Amharic",
    greeting: "ሰለም",
    script: "አ",
    description: "Official language of Ethiopia with broad media and education coverage.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Ge'ez script", "Formal + daily use", "Large content library"],
  },
  {
    key: "oromo" as const,
    language: "Afan Oromoo",
    greeting: "Nagaa",
    script: "O",
    description: "Most widely spoken language in Ethiopia with vibrant daily conversation usage.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Fast conversational gains", "Rich oral tradition", "Regional variety"],
  },
  {
    key: "tigrinya" as const,
    language: "Tigrinya",
    greeting: "ሰላም",
    script: "ት",
    description: "Semitic language spoken across northern Ethiopia and Eritrea.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Ge'ez script depth", "Strong literary forms", "Cross-region context"],
  },
];

const levels = ["all", "beginner", "intermediate", "advanced"] as const;
type Level = (typeof levels)[number];

const chartConfig: ChartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

const Home = () => {
  const { user, updateUser } = useAuth();
  const { t, languageLabel } = useI18n();
  const { completedLessons, progressRecords } = useLessonProgress();
  const course = getCourse(user?.selectedLanguage ?? "amharic");
  const totalLessons = course?.units?.flatMap((u: { lessons: unknown[] }) => u.lessons).length ?? 0;
  const completion = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const currentStreak = user?.streak ?? 0;
  const streakHistory = useMemo(
    () => buildStreakHistory(progressRecords, currentStreak),
    [progressRecords, currentStreak],
  );
  const badges = useMemo(
    () => buildProgressBadges(progressRecords, currentStreak, totalLessons),
    [progressRecords, currentStreak, totalLessons],
  );
  const skillData = useMemo(
    () => buildSkillScores(course, completedLessons),
    [course, completedLessons],
  );

  // Language selection state
  const [selected, setSelected] = useState<"amharic" | "oromo" | "tigrinya">(
    user?.selectedLanguage ?? "amharic",
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [langLevel, setLangLevel] = useState<Level>("all");
  const [search, setSearch] = useState("");

  const visibleLanguages = useMemo(() => {
    return languages
      .filter((l) => (langLevel === "all" ? true : l.levels.includes(langLevel)))
      .filter(
        (l) =>
          `${l.language} ${l.description} ${l.highlights.join(" ")}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      );
  }, [langLevel, search]);

  useEffect(() => {
    if (user?.selectedLanguage) setSelected(user.selectedLanguage);
  }, [user?.selectedLanguage]);

  const saveLanguage = async () => {
    setSaving(true);
    await updateUser({ selectedLanguage: selected });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="pb-20 md:pb-0 space-y-6">
      {/* Welcome Header */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.22),transparent_40%),radial-gradient(circle_at_12%_90%,hsl(var(--secondary)/0.2),transparent_36%),linear-gradient(140deg,hsl(var(--card))_0%,hsl(var(--card)/0.92)_50%,hsl(var(--background))_100%)] p-6 md:p-8"
      >
        <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HomeIcon className="h-3.5 w-3.5" />
              {t("app.home")}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-foreground md:text-4xl">
              {t("dashboard.welcome")}, {user?.name ?? "Learner"}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your central hub for language tools, progress insights, and shortcuts.
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
          >
            {t("home.goToLearn")}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("dashboard.currentStreak")}</p>
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{user?.streak ?? 0} days</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("dashboard.lessonsDone")}</p>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {completedLessons.length}/{totalLessons}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("dashboard.gemsEarned")}</p>
            <Trophy className="h-5 w-5 text-secondary" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{user?.gems ?? 0}</p>
        </div>
      </section>

      {/* Language Selection Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">{t("home.languageSelection")}</h2>
        </div>

        <div className="mb-4 rounded-xl border border-border/60 bg-background/60 p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by language or highlight"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLangLevel(lvl)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                    langLevel === lvl
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLanguages.map((lang) => (
            <div key={lang.key} className="space-y-2">
              <LanguageCard
                language={lang.language}
                description={lang.description}
                action="Select"
                selected={selected === lang.key}
                onClick={() => setSelected(lang.key)}
              />
              <div className="flex flex-wrap gap-1.5 px-1">
                {lang.levels.map((lvl) => (
                  <Badge key={lvl} variant="outline" className="capitalize text-xs">
                    {lvl}
                  </Badge>
                ))}
                {lang.highlights.map((h) => (
                  <Badge key={h} variant="secondary" className="text-xs">
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={saveLanguage} size="sm" className="gap-2" disabled={saving}>
              <Sparkles className="h-4 w-4" />
              {saving ? "Saving..." : "Save Language"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Current: {languageLabel(user?.selectedLanguage ?? "amharic")}
            </span>
          </div>
          {saved && <span className="text-sm text-primary">Language updated!</span>}
        </div>
      </motion.section>

      {/* Streak History Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          <h2 className="font-display text-lg font-bold text-foreground">{t("home.streakHistory")}</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{t("home.streakHistoryDesc")}</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {streakHistory.map((day) => (
            <div
              key={day.key}
              className={`rounded-lg border px-2 py-3 text-center text-xs ${
                day.active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              <p className="font-semibold">{day.label}</p>
              <p className="mt-0.5 text-[10px]">{day.active ? "Active" : "Missed"}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Badge History Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-secondary" />
          <h2 className="font-display text-lg font-bold text-foreground">{t("home.badgeHistory")}</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{t("home.badgeHistoryDesc")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {badges.slice(0, 4).map((badge) => (
            <div key={badge.id} className="rounded-lg border border-border/60 bg-background/60 px-4 py-3">
              <p className="font-semibold text-foreground">{badge.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{badge.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Earned {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {badges.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-background/60 px-4 py-6 text-sm text-muted-foreground sm:col-span-2">
              Complete your first lesson to earn your first badge.
            </div>
          )}
        </div>
      </motion.section>

      {/* Skill Chart Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">{t("home.skillChart")}</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{t("home.skillChartDesc")}</p>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart accessibilityLayer data={skillData} margin={{ left: 10, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="skill" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="score" radius={8} fill="var(--color-score)" />
          </BarChart>
        </ChartContainer>
      </motion.section>

      {/* General Info Footer */}
      <section className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
        <h2 className="font-display text-lg font-bold text-foreground">{t("home.generalInfo")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Daily goal: {user?.dailyGoal ?? 15} minutes. Overall completion: {completion}%. Continue from
          Practice to keep your streak active and unlock more badges.
        </p>
      </section>
    </div>
  );
};

export default Home;
