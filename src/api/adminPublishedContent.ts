import { supabase } from "@/lib/supabase";
import type { Lesson } from "@/data/courseContent";

type Language = "amharic" | "oromo" | "tigrinya";

type PublishedLessonRow = {
  id: string;
  title: string;
  language: Language;
  level: "beginner" | "intermediate" | "advanced";
  updated_at: string;
};

type QuizRow = {
  id: string;
  lesson_id: string | null;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
};

const correctOptionValue = (quiz: QuizRow) => {
  const options = {
    A: quiz.option_a,
    B: quiz.option_b,
    C: quiz.option_c,
    D: quiz.option_d,
  };
  return options[quiz.correct_option];
};

const mapAdminLesson = (lesson: PublishedLessonRow, quizzes: QuizRow[]): Lesson => ({
  id: `admin-${lesson.id}`,
  title: lesson.title,
  description: `Admin-created ${lesson.level} practice lesson.`,
  xpReward: Math.max(10, quizzes.length * 5),
  exercises: quizzes.map((quiz) => {
    const options = [quiz.option_a, quiz.option_b, quiz.option_c, quiz.option_d].filter(Boolean);
    return {
      id: `admin-quiz-${quiz.id}`,
      type: "multiple-choice",
      question: quiz.question,
      options,
      correctAnswer: correctOptionValue(quiz),
    };
  }),
});

async function fetchPublishedRows(language: Language) {
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id,title,language,level,updated_at")
    .eq("language", language)
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (lessonsError) throw lessonsError;

  const lessonRows = (lessons || []) as PublishedLessonRow[];
  if (lessonRows.length === 0) return [];

  const lessonIds = lessonRows.map((lesson) => lesson.id);
  const { data: quizzes, error: quizzesError } = await supabase
    .from("admin_quizzes")
    .select("id,lesson_id,question,option_a,option_b,option_c,option_d,correct_option,explanation")
    .eq("language", language)
    .in("lesson_id", lessonIds);

  if (quizzesError) throw quizzesError;

  const quizRows = (quizzes || []) as QuizRow[];
  return lessonRows
    .map((lesson) =>
      mapAdminLesson(
        lesson,
        quizRows.filter((quiz) => quiz.lesson_id === lesson.id),
      ),
    )
    .filter((lesson) => lesson.exercises.length > 0);
}

export async function getPublishedAdminLessons(language: string): Promise<Lesson[]> {
  if (language !== "amharic" && language !== "oromo" && language !== "tigrinya") return [];

  try {
    return await fetchPublishedRows(language);
  } catch (error) {
    console.error("Failed to load published admin lessons", error);
    return [];
  }
}

export async function getPublishedAdminLesson(
  language: string,
  lessonId: string,
): Promise<Lesson | undefined> {
  if (!lessonId.startsWith("admin-")) return undefined;
  const lessons = await getPublishedAdminLessons(language);
  return lessons.find((lesson) => lesson.id === lessonId);
}
