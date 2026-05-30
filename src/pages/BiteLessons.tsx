import { motion } from "framer-motion";
import { BookOpenCheck, ChevronRight, Headphones, Languages } from "lucide-react";
import { biteLessons, biteLanguageNames, BiteLanguage, BiteLesson } from "@/data/biteLessons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const isBiteLanguage = (language?: string): language is BiteLanguage =>
  language === "amharic" || language === "oromo" || language === "tigrinya";

const levelColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Building: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Useful: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LessonCard = ({ lesson, language }: { lesson: BiteLesson; language: BiteLanguage }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      variants={item}
      onClick={() => navigate(`/bite-lesson/${language}/${lesson.id}`)}
      className="group w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${levelColors[lesson.level] || ""}`}>
          {lesson.level}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          <Headphones className="h-3 w-3" />
          {lesson.items.length} phrases
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary">
        {lesson.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{lesson.goal}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Start learning <ChevronRight className="h-4 w-4" />
      </div>
    </motion.button>
  );
};

const BiteLessons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const language = isBiteLanguage(user?.selectedLanguage) ? user.selectedLanguage : "amharic";
  const lessons = biteLessons[language];

  const totalPhrases = useMemo(() => lessons.reduce((acc, l) => acc + l.items.length, 0), [lessons]);

  const lessonsByLevel = useMemo(() => {
    const grouped: Record<string, BiteLesson[]> = {};
    lessons.forEach((lesson) => {
      if (!grouped[lesson.level]) grouped[lesson.level] = [];
      grouped[lesson.level].push(lesson);
    });
    return grouped;
  }, [lessons]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 md:pb-0">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
      >
        <div className="relative p-5 sm:p-6 md:p-8">
          <div className="absolute right-6 top-6 hidden rounded-full bg-primary/10 p-5 text-primary md:block">
            <BookOpenCheck className="h-10 w-10" />
          </div>
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
              <Headphones className="h-3.5 w-3.5" /> Bite-sized lessons
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Pick a lesson and start learning.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Short interactive lessons covering real phrases, correct usage, script, examples, and audio practice in {biteLanguageNames[language]}.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{lessons.length}</strong> lessons</span>
              <span><strong className="text-foreground">{totalPhrases}</strong> phrases</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {Object.entries(lessonsByLevel).map(([level, levelLessons]) => (
          <div key={level} className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <Languages className="h-5 w-5 text-primary" />
              {level}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {levelLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} language={language} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BiteLessons;