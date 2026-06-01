import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import LanguageCard from "@/components/LanguageCard";
import InteractiveGeezBackground from "@/components/InteractiveGeezBackground";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Zap, Volume2 } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import ThemeToggle from "@/components/ThemeToggle";

const languages = [
  {
    language: "Amharic",
    theme: "emerald" as const,
    action: "Script + speech",
    description:
      "A warm entry into everyday expression, reading practice, and Ethiopian cultural context.",
  },
  {
    language: "Afan Oromoo",
    theme: "gold" as const,
    action: "Conversation first",
    description:
      "A practical path for greetings, daily dialogue, listening, and confident real-world use.",
  },
  {
    language: "Tigrinya",
    theme: "rose" as const,
    action: "Listen + read",
    description:
      "A clear route into useful phrases, pronunciation, stories, and script awareness.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Bite-Sized Lessons",
    desc: "Learn in just 5 minutes a day with focused, interactive exercises.",
  },
  {
    icon: BookOpen,
    title: "Real Scripts",
    desc: "Read and write in authentic Ge'ez and Latin scripts from day one.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    desc: "Earn XP, maintain streaks, and climb the leaderboard.",
  },
  {
    icon: Volume2,
    title: "Audio & Visual",
    desc: "Hear native pronunciation and see beautiful character animations.",
  },
];

const Landing = () => {
  const { t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const [showNav, setShowNav] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowNav(latest > 120);
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <div className="grain-overlay" />

      <motion.nav
        initial={false}
        animate={{ y: showNav ? 0 : -96, opacity: showNav ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed left-0 right-0 top-3 z-50 px-3 sm:px-6"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-xl backdrop-blur-md sm:px-4 sm:py-3">
          <a
            href="#hero"
            className="flex items-center gap-2 font-display text-base font-bold text-foreground sm:text-lg"
          >
            <img
              src="/lingo_abyssinia_final.png"
              alt="Lingo Abyssinia"
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="inline">Lingo Abyssinia</span>
          </a>
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#languages"
              className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Languages
            </a>
            <a
              href="#start"
              className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Start
            </a>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle iconOnly className="sm:hidden" />
            <LanguageSwitcher iconOnly className="sm:hidden" />
            <ThemeToggle className="hidden sm:inline-flex" />
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Button asChild size="sm" className="rounded-xl px-3 sm:px-4">
              <Link to="/signup">Start</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Gradient background layers */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 mesh-veil" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/85" />

        {/* Interactive Ge'ez characters */}
        <InteractiveGeezBackground count={35} />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-4 font-display text-5xl font-extrabold leading-[1.02] text-primary-foreground md:text-7xl"
          >
            {t("landing.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 md:text-xl"
          >
            {t("landing.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden gradient-gold text-gold-foreground font-bold text-base px-10 py-7 rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Link to="/signup">
                <span className="relative z-10">{t("landing.ctaPrimary")}</span>
                <motion.span
                  className="absolute inset-0 bg-secondary/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-primary-foreground border border-primary-foreground/35 backdrop-blur-sm hover:bg-primary-foreground/15 px-8 py-7 rounded-2xl"
            >
              <Link to="/login">{t("landing.ctaSecondary")}</Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 flex items-center justify-center gap-4 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-4 backdrop-blur-sm sm:mt-16 sm:gap-8 sm:px-8 sm:py-5 md:gap-16"
          >
            {[
              { value: "3", label: "Languages" },
              { value: "50+", label: "Lessons" },
              { value: "100%", label: "Free" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--secondary)/0.18),transparent_44%),radial-gradient(circle_at_85%_65%,hsl(var(--primary)/0.16),transparent_42%)]" />
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("landing.why")}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to start learning
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Designed for momentum, crafted with vibrant motion, and built to
              make every lesson feel alive.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  rotate: i % 2 === 0 ? -0.6 : 0.6,
                }}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-primary/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>

                {/* Hover glow */}
                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Cards */}
      <section
        id="languages"
        className="relative overflow-hidden py-24 md:py-32 bg-muted/35"
      >
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Choose Your Path
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              {t("landing.startPath")}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pick one to begin - you can always switch or add more later.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {languages.map((lang, i) => (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ rotate: i === 1 ? 0 : i % 2 === 0 ? -1.5 : 1.5 }}
              >
                <LanguageCard {...lang} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 mesh-veil" />
        <InteractiveGeezBackground count={20} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-primary-foreground md:text-5xl"
          >
            Ready to start your journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-primary-foreground/75"
          >
            Join thousands learning Ethiopian languages the fun way.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button
              asChild
              size="lg"
              className="gradient-gold text-gold-foreground font-bold text-base px-10 py-7 rounded-2xl shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-transform"
            >
              <Link to="/signup">Start Learning for Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/90 backdrop-blur-sm px-6 py-10">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-primary">LA</span>
            <span className="font-display text-lg font-bold text-foreground">
              LingoAbyssinia
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Copyright {t("landing.footer")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
