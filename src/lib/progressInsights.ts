import { Course, Lesson } from "@/data/courseContent";
import { LessonProgressRecord } from "@/hooks/useLessonProgress";

export type StreakDay = {
  key: string;
  label: string;
  active: boolean;
};

export type ProgressBadge = {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
};

export type SkillScore = {
  skill: string;
  score: number;
};

const dateKey = (date: Date) => date.toISOString().slice(0, 10);

const sortedRecords = (records: LessonProgressRecord[]) =>
  [...records].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );

export function buildStreakHistory(
  records: LessonProgressRecord[],
  fallbackStreak = 0,
  days = 14,
): StreakDay[] {
  const activeDates = new Set(
    records.map((record) => dateKey(new Date(record.completedAt))),
  );

  return Array.from({ length: days }, (_, index) => {
    const daysAgo = days - 1 - index;
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    const active =
      activeDates.size > 0 ? activeDates.has(dateKey(date)) : daysAgo < fallbackStreak;

    return {
      key: dateKey(date),
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      active,
    };
  });
}

function earnedByCount(records: LessonProgressRecord[], count: number) {
  return sortedRecords(records)[count - 1]?.completedAt;
}

function earnedByXp(records: LessonProgressRecord[], targetXp: number) {
  let total = 0;
  return sortedRecords(records).find((record) => {
    total += record.xpEarned;
    return total >= targetXp;
  })?.completedAt;
}

export function buildProgressBadges(
  records: LessonProgressRecord[],
  currentStreak: number,
  totalLessons: number,
): ProgressBadge[] {
  const completedCount = records.length;
  const totalXp = records.reduce((sum, record) => sum + record.xpEarned, 0);
  const latestEarned = sortedRecords(records).at(-1)?.completedAt || new Date().toISOString();
  const completion = totalLessons > 0 ? completedCount / totalLessons : 0;

  const badgeRules: Array<ProgressBadge & { earned?: boolean; earnedAt?: string }> = [
    {
      id: "first-lesson",
      name: "First Lesson",
      description: "Complete your first lesson.",
      earned: completedCount >= 1,
      earnedAt: earnedByCount(records, 1),
    },
    {
      id: "five-lessons",
      name: "Momentum Builder",
      description: "Complete 5 lessons.",
      earned: completedCount >= 5,
      earnedAt: earnedByCount(records, 5),
    },
    {
      id: "ten-lessons",
      name: "Consistent Learner",
      description: "Complete 10 lessons.",
      earned: completedCount >= 10,
      earnedAt: earnedByCount(records, 10),
    },
    {
      id: "twenty-five-lessons",
      name: "Lesson Explorer",
      description: "Complete 25 lessons.",
      earned: completedCount >= 25,
      earnedAt: earnedByCount(records, 25),
    },
    {
      id: "three-day-streak",
      name: "3-Day Streak",
      description: "Keep a 3-day practice streak.",
      earned: currentStreak >= 3,
      earnedAt: latestEarned,
    },
    {
      id: "seven-day-streak",
      name: "7-Day Streak",
      description: "Keep a 7-day practice streak.",
      earned: currentStreak >= 7,
      earnedAt: latestEarned,
    },
    {
      id: "xp-50",
      name: "50 XP Club",
      description: "Earn 50 XP from completed lessons.",
      earned: totalXp >= 50,
      earnedAt: earnedByXp(records, 50),
    },
    {
      id: "xp-150",
      name: "150 XP Club",
      description: "Earn 150 XP from completed lessons.",
      earned: totalXp >= 150,
      earnedAt: earnedByXp(records, 150),
    },
    {
      id: "quarter-course",
      name: "Course Pathfinder",
      description: "Finish 25% of your selected course.",
      earned: completion >= 0.25,
      earnedAt: latestEarned,
    },
    {
      id: "half-course",
      name: "Halfway There",
      description: "Finish 50% of your selected course.",
      earned: completion >= 0.5,
      earnedAt: latestEarned,
    },
  ];

  return badgeRules
    .filter((badge) => badge.earned && badge.earnedAt)
    .map(({ earned: _earned, ...badge }) => badge as ProgressBadge)
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
}

function lessonHasType(lesson: Lesson, type: "audio" | "translation") {
  return lesson.exercises.some((exercise) => exercise.type === type);
}

function lessonInUnits(course: Course, lessonId: string, unitNames: string[]) {
  return course.units.some(
    (unit) =>
      unitNames.includes(unit.title) && unit.lessons.some((lesson) => lesson.id === lessonId),
  );
}

function scoreFor(
  course: Course,
  completed: Set<string>,
  predicate: (lesson: Lesson) => boolean,
) {
  const matchingLessons = course.units.flatMap((unit) => unit.lessons).filter(predicate);
  if (matchingLessons.length === 0) return 0;
  const completedMatching = matchingLessons.filter((lesson) => completed.has(lesson.id)).length;
  return Math.round((completedMatching / matchingLessons.length) * 100);
}

export function buildSkillScores(course: Course, completedLessons: string[]): SkillScore[] {
  const completed = new Set(completedLessons);

  return [
    {
      skill: "Vocabulary",
      score: scoreFor(course, completed, () => true),
    },
    {
      skill: "Reading",
      score: scoreFor(course, completed, (lesson) => lessonHasType(lesson, "translation")),
    },
    {
      skill: "Listening",
      score: scoreFor(course, completed, (lesson) => lessonHasType(lesson, "audio")),
    },
    {
      skill: "Writing",
      score: scoreFor(course, completed, (lesson) => lessonHasType(lesson, "translation")),
    },
    {
      skill: "Grammar",
      score: scoreFor(course, completed, (lesson) =>
        lessonInUnits(course, lesson.id, ["Actions and Verbs", "Intermediate Fluency", "Mastery Path"]),
      ),
    },
  ];
}
