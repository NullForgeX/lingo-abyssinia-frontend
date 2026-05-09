import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Languages, Rocket } from "lucide-react";
import InteractiveGeezBackground from "@/components/InteractiveGeezBackground";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

const languages = [
  {
    language: "Amharic",
    greeting: "ሰላም",
    script: "አ",
    description: "Official language of Ethiopia",
    key: "amharic" as const,
    color: "from-primary/20 to-primary/5",
  },
  {
    language: "Oromo",
    greeting: "Nagaa",
    script: "O",
    description: "Most widely spoken in Ethiopia",
    key: "oromo" as const,
    color: "from-secondary/20 to-secondary/5",
  },
  {
    language: "Tigrinya",
    greeting: "ሰላም",
    script: "ት",
    description: "Spoken in northern Ethiopia & Eritrea",
    key: "tigrinya" as const,
    color: "from-accent/20 to-accent/5",
  },
];

const goals = [
  {
    minutes: 5,
    label: "Casual",
    emoji: "🌱",
    desc: "5 minutes per day",
    subtitle: "Perfect for busy schedules",
  },
  {
    minutes: 15,
    label: "Regular",
    emoji: "🔥",
    desc: "15 minutes per day",
    subtitle: "Recommended for most learners",
  },
  {
    minutes: 30,
    label: "Intense",
    emoji: "🚀",
    desc: "30 minutes per day",
    subtitle: "For serious language goals",
  },
];

const Onboarding = () => {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<
    "amharic" | "oromo" | "tigrinya" | null
  >(null);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const { setPreferences, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const finish = () => {
    if (selectedLang && selectedGoal) {
      setPreferences({ language: selectedLang, dailyGoal: selectedGoal });
      completeOnboarding();
      navigate("/home");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="absolute right-4 top-4 z-30">
        <div className="flex items-center gap-2">
          <ThemeToggle iconOnly className="sm:hidden" />
          <LanguageSwitcher iconOnly className="sm:hidden" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <LanguageSwitcher className="hidden sm:inline-flex" />
        </div>
      </div>
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <InteractiveGeezBackground count={18} className="opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: s === step ? 1.1 : 1,
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display font-bold text-sm transition-colors duration-300 ${
                  s < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : s === step
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </motion.div>
              {s < 2 && (
                <div
                  className={`h-0.5 w-12 rounded-full transition-colors duration-300 ${
                    step > 1 ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                >
                  <Languages className="h-8 w-8 text-primary" />
                </motion.div>
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {t("onboarding.chooseLanguage")}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {t("onboarding.pickOne")}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {languages.map((lang, i) => (
                  <motion.button
                    key={lang.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedLang(lang.key)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                      selectedLang === lang.key
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                    }`}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        selectedLang === lang.key ? "opacity-100" : ""
                      }`}
                    />

                    <div className="relative">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <span
                          className="text-3xl"
                          style={{ fontFamily: "serif" }}
                        >
                          {lang.script}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold text-card-foreground">
                        {lang.language}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lang.description}
                      </p>
                      <p
                        className="mt-3 text-lg font-semibold text-secondary"
                        style={{ fontFamily: "serif" }}
                      >
                        "{lang.greeting}"
                      </p>
                    </div>

                    {selectedLang === lang.key && (
                      <motion.div
                        layoutId="lang-check"
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <Button
                  size="lg"
                  disabled={!selectedLang}
                  onClick={() => setStep(2)}
                  className="gap-2 rounded-xl px-8 py-6 text-base font-bold"
                >
                  {t("onboarding.continue")} <ArrowRight className="h-4 w-4" />
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/15"
                >
                  <span className="text-3xl">⏱</span>
                </motion.div>
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {t("onboarding.setGoal")}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {t("onboarding.commit")}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {goals.map((goal, i) => (
                  <motion.button
                    key={goal.minutes}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedGoal(goal.minutes)}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                      selectedGoal === goal.minutes
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                    }`}
                  >
                    <span className="text-5xl">{goal.emoji}</span>
                    <h3 className="mt-4 font-display text-xl font-bold text-card-foreground">
                      {goal.label}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-primary">
                      {goal.desc}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {goal.subtitle}
                    </p>

                    {selectedGoal === goal.minutes && (
                      <motion.div
                        layoutId="goal-check"
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-10 flex justify-between">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="gap-2 rounded-xl px-6 py-6"
                >
                  <ArrowLeft className="h-4 w-4" /> {t("onboarding.back")}
                </Button>
                <Button
                  size="lg"
                  disabled={!selectedGoal}
                  onClick={finish}
                  className="gap-2 rounded-xl px-8 py-6 text-base font-bold gradient-gold text-gold-foreground"
                >
                  {t("onboarding.startLearning")} <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
