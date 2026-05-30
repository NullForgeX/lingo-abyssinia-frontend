import { motion } from "framer-motion";

interface LanguageCardProps {
  language: string;
  greeting?: string;
  script?: string;
  description: string;
  theme?: "emerald" | "gold" | "rose";
  action?: string;
  onClick?: () => void;
  selected?: boolean;
}

const themeStyles = {
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
    glow: "from-emerald-500/20 via-primary/10 to-transparent",
    ring: "group-hover:border-emerald-400/70",
  },
  gold: {
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
    glow: "from-amber-400/25 via-secondary/15 to-transparent",
    ring: "group-hover:border-amber-400/70",
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-200",
    glow: "from-rose-400/20 via-accent/15 to-transparent",
    ring: "group-hover:border-rose-400/70",
  },
};

const languageCode = (language: string) => {
  if (language.toLowerCase().includes("amharic")) return "AM";
  if (language.toLowerCase().includes("orom")) return "AO";
  if (language.toLowerCase().includes("tigrinya")) return "TG";
  return language.slice(0, 2).toUpperCase();
};

const LanguageCard = ({
  language,
  description,
  theme = "emerald",
  action = "Start this path",
  onClick,
  selected,
}: LanguageCardProps) => {
  const style = themeStyles[theme];

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative min-h-[250px] overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-500 ${
        selected
          ? "border-primary bg-primary/10 shadow-2xl shadow-primary/15"
          : `border-border/85 bg-card/90 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 ${style.ring}`
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <motion.div
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-black ${style.badge}`}>
          {languageCode(language)}
        </div>
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary">
          {action}
        </span>
      </div>

      <h3 className="relative mt-5 font-display text-2xl font-bold text-card-foreground tracking-tight">
        {language}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: "26%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.button>
  );
};

export default LanguageCard;