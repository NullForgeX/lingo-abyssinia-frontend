import { motion } from "framer-motion";
import { Crown, Flame, Medal, Trophy } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const Leaderboard = () => {
  const { t } = useI18n();
  const topThree = [
    {
      name: "Mimi Tesfaye",
      xp: 4820,
      streak: 46,
      badge: "አ",
      color: "from-yellow-300/50 to-yellow-100/30",
    },
    {
      name: "Nahom A.",
      xp: 4510,
      streak: 39,
      badge: "ት",
      color: "from-zinc-300/50 to-zinc-100/30",
    },
    {
      name: "Sena Bulti",
      xp: 4290,
      streak: 34,
      badge: "O",
      color: "from-orange-300/45 to-orange-100/30",
    },
  ];

  const tableRows = [
    { rank: 4, name: "Kal Mulu", language: "Amharic", xp: 4010, streak: 28 },
    {
      rank: 5,
      name: "Rahel M.",
      language: "Afan Oromoo",
      xp: 3950,
      streak: 25,
    },
    { rank: 6, name: "Meron H.", language: "Tigrinya", xp: 3820, streak: 23 },
    { rank: 7, name: "Yonatan K.", language: "Amharic", xp: 3705, streak: 20 },
  ];

  return (
    <div className="relative pb-20 md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,hsl(var(--secondary)/0.16),transparent_38%),radial-gradient(circle_at_88%_24%,hsl(var(--primary)/0.12),transparent_36%)]" />

      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
        {t("leaderboard.title")}
      </h1>
      <p className="mt-1 text-muted-foreground">{t("leaderboard.subtitle")}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {topThree.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br ${entry.color} p-6 shadow-lg backdrop-blur-sm`}
          >
            <div className="absolute right-4 top-4 text-muted-foreground/80">
              #{i + 1}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card/80 text-xl font-bold text-primary">
                {entry.badge}
              </div>
              {i === 0 ? (
                <Crown className="h-5 w-5 text-yellow-600" />
              ) : (
                <Medal className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="mt-4 font-display text-xl font-bold text-foreground">
              {entry.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.xp.toLocaleString()} XP
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-xs font-semibold text-foreground">
              <Flame className="h-3.5 w-3.5 text-accent" />
              {entry.streak} day streak
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-7 overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-4 sm:px-5">
          <h2 className="font-display text-lg font-bold text-foreground">
            Weekly Climbers
          </h2>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Live Demo
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {tableRows.map((row) => (
            <div
              key={row.rank}
              className="grid grid-cols-2 items-center gap-x-3 gap-y-2 px-4 py-4 text-sm sm:grid-cols-[60px_1fr_120px_90px] sm:gap-x-0 sm:gap-y-0 sm:px-5"
            >
              <p className="font-bold text-muted-foreground sm:col-auto">
                #{row.rank}
              </p>
              <div className="sm:col-auto">
                <p className="font-semibold text-foreground">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.language}</p>
              </div>
              <p className="font-semibold text-foreground sm:col-auto">
                {row.xp.toLocaleString()} XP
              </p>
              <p className="inline-flex items-center justify-start gap-1.5 font-semibold text-accent sm:col-auto">
                <Flame className="h-4 w-4" />
                {row.streak}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-5 text-center text-xs text-muted-foreground">
        {t("leaderboard.comingSoon")} - full real-time rankings and friend
        challenges are next.
      </div>
    </div>
  );
};

export default Leaderboard;
