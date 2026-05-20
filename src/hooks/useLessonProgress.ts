import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [completedLessons, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setCompleted([]);
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
        .select("lesson_id")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.error("Failed to load lesson progress", error);
        setCompleted(cached);
        return;
      }

      const remote = (data || []).map((row) => row.lesson_id as string);
      const merged = Array.from(new Set([...cached, ...remote]));
      writeCachedProgress(user.id, merged);
      setCompleted(merged);
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const markComplete = useCallback(
    async (lessonId: string, xpEarned = 0) => {
      if (!user) return;

      const nextCompleted = Array.from(new Set([...readCachedProgress(user.id), lessonId]));
      writeCachedProgress(user.id, nextCompleted);
      setCompleted(nextCompleted);

      const { error } = await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );

      if (error) console.error("Failed to save lesson progress", error);
    },
    [user],
  );

  return { completedLessons, markComplete };
}
