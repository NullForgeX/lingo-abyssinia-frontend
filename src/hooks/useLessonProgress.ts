import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type LessonProgressRecord = {
  lessonId: string;
  completedAt: string;
  xpEarned: number;
};

const progressKey = (userId: string) => `lingo_completed_lessons_${userId}`;
const PROGRESS_EVENT = "lingo:lesson-progress";

const readCachedProgress = (userId: string) => {
  try {
    const raw = localStorage.getItem(progressKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const writeCachedProgress = (userId: string, lessons: string[]) => {
  const uniqueLessons = Array.from(new Set(lessons));
  localStorage.setItem(progressKey(userId), JSON.stringify(uniqueLessons));
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { userId, lessons: uniqueLessons } }));
};

export function useLessonProgress() {
  const { user, updateUser } = useAuth();
  const [completedLessons, setCompleted] = useState<string[]>([]);
  const [progressRecords, setProgressRecords] = useState<LessonProgressRecord[]>([]);

  useEffect(() => {
    if (!user) {
      setCompleted([]);
      setProgressRecords([]);
      return;
    }

    setCompleted(readCachedProgress(user.id));

    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: string; lessons: string[] }>).detail;
      if (detail?.userId === user.id) setCompleted(detail.lessons);
    };

    window.addEventListener(PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PROGRESS_EVENT, onProgress);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!user) return;

      const cached = readCachedProgress(user.id);
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id,completed_at,xp_earned")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed to load lesson progress", error);
        setCompleted(cached);
        return;
      }

      const records = (data || []).map((row) => ({
        lessonId: row.lesson_id as string,
        completedAt: (row.completed_at as string | null) || new Date().toISOString(),
        xpEarned: Number(row.xp_earned || 0),
      }));
      const remote = records.map((row) => row.lessonId);
      const merged = Array.from(new Set([...cached, ...remote]));
      writeCachedProgress(user.id, merged);
      setCompleted(merged);
      setProgressRecords(records);
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const markComplete = useCallback(
    async (lessonId: string, xpEarned = 0) => {
      if (!user) return;

      const previousCompleted = readCachedProgress(user.id);
      const alreadyCompleted = previousCompleted.includes(lessonId);
      const nextCompleted = Array.from(new Set([...previousCompleted, lessonId]));
      const completedAt = new Date().toISOString();
      writeCachedProgress(user.id, nextCompleted);
      setCompleted(nextCompleted);
      setProgressRecords((current) => {
        if (current.some((record) => record.lessonId === lessonId)) return current;
        return [...current, { lessonId, completedAt, xpEarned }];
      });

      if (!alreadyCompleted) {
        await updateUser({
          streak: Math.max(1, (user.streak || 0) + 1),
          gems: (user.gems || 0) + Math.max(1, Math.round(xpEarned / 5)),
        });
      }

      const { error } = await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          xp_earned: xpEarned,
          completed_at: completedAt,
        },
        { onConflict: "user_id,lesson_id" },
      );

      if (error) console.error("Failed to save lesson progress", error);
    },
    [user, updateUser],
  );

  return { completedLessons, progressRecords, markComplete };
}
