import { useState, useCallback } from 'react';

const STORAGE_KEY = 'lingo_completed_lessons';

function getCompleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useLessonProgress() {
  const [completedLessons, setCompleted] = useState<string[]>(getCompleted);

  const markComplete = useCallback((lessonId: string) => {
    setCompleted(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { completedLessons, markComplete };
}
