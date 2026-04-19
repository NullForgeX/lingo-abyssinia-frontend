import { motion } from "framer-motion";

interface LanguageCardProps {
  language: string;
  greeting: string;
  script: string;
  description: string;
  onClick?: () => void;
  selected?: boolean;
}

const LanguageCard = ({
  language,
  greeting,
  script,
  description,
  onClick,
  selected,
}: LanguageCardProps) => {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
          : "border-border/85 bg-card/90 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      }`}
    >
      {/* Background glow on hover */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-3xl" />

      {/* Script character */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
        <span
          className="font-display text-3xl text-primary"
          style={{ fontFamily: "serif" }}
        >
          {script}
        </span>
        {selected && (
          <motion.div
            layoutId="selected-ring"
            className="absolute inset-0 rounded-xl border-2 border-primary"
          />
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-card-foreground tracking-tight">
        {language}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secondary/20 px-3.5 py-1.5 text-sm font-semibold text-secondary-foreground">
        <span style={{ fontFamily: "serif" }}>✦</span> "{greeting}"
      </div>
    </motion.button>
  );
};

export default LanguageCard;
