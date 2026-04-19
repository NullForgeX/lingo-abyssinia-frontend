import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getCourse } from "@/data/courseContent";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, PlayCircle, Star, Route } from "lucide-react";
import { useLessonProgress } from "@/hooks/useLessonProgress";

const CourseRoadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { completedLessons } = useLessonProgress();
  const course = getCourse(user?.selectedLanguage || "amharic");

  const langLabels = {
    amharic: "Amharic",
    oromo: "Oromo",
    tigrinya: "Tigrinya",
  };
  const langName = user?.selectedLanguage
    ? langLabels[user.selectedLanguage]
    : "Amharic";

  // Flatten all lesson IDs to determine lock state
  const allLessons = course.units.flatMap((u) => u.lessons);
  const getStatus = (lessonId: string): "completed" | "active" | "locked" => {
    if (completedLessons.includes(lessonId)) return "completed";
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (idx === 0) return "active";
    const prev = allLessons[idx - 1];
    if (prev && completedLessons.includes(prev.id)) return "active";
    return "locked";
  };

  return (
    <div className="pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/70 to-primary/10 p-6 shadow-xl backdrop-blur-sm"
      >
        <div className="absolute -right-16 -top-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Route className="h-3.5 w-3.5" />
              Learn path
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
              {langName} Course
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Follow the path to fluency with a clear, bite-sized learning flow.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-right md:block">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Progress style
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              Dynamic route
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 space-y-12">
        {course.units.map((unit, unitIdx) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.1 }}
          >
            {/* Unit header */}
            <div className="mb-6 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lg backdrop-blur-sm md:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-display font-bold text-lg shadow-lg shadow-primary/20">
                  {unitIdx + 1}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {unit.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {unit.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson nodes - zigzag path */}
            <div className="relative flex flex-col items-center gap-4">
              {unit.lessons.map((lesson, lessonIdx) => {
                const status = getStatus(lesson.id);
                const offset =
                  lessonIdx % 2 === 0
                    ? "-translate-x-4 sm:-translate-x-7 md:-translate-x-16"
                    : "translate-x-4 sm:translate-x-7 md:translate-x-16";

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                  >
                    {/* Connector line */}
                    {lessonIdx > 0 && (
                      <div className="h-7 w-0.5 rounded-full bg-gradient-to-b from-primary/40 to-secondary/40 mb-1" />
                    )}
                    <motion.button
                      className={`relative flex ${offset} flex-col items-center transition-all duration-200`}
                      onClick={() =>
                        status !== "locked" && navigate(`/lesson/${lesson.id}`)
                      }
                      whileHover={status !== "locked" ? { scale: 1.05 } : {}}
                      whileTap={status !== "locked" ? { scale: 0.97 } : {}}
                      disabled={status === "locked"}
                    >
                      {/* Node circle */}
                      <div
                        className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border-4 shadow-xl transition-all ${
                          status === "completed"
                            ? "border-primary bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-primary/25"
                            : status === "active"
                              ? "border-secondary bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground animate-pulse shadow-secondary/20"
                              : "border-border bg-card text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8" />
                        ) : status === "active" ? (
                          <PlayCircle className="h-7 w-7 md:h-8 md:w-8" />
                        ) : (
                          <Lock className="h-6 w-6 md:h-7 md:w-7" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="mt-2 max-w-[170px] text-center">
                        <p
                          className={`text-sm font-semibold ${status === "locked" ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {lesson.title}
                        </p>
                        <div className="mt-1 inline-flex items-center justify-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          <Star className="h-3 w-3" />
                          {lesson.xpReward} XP
                        </div>
                      </div>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseRoadmap;
