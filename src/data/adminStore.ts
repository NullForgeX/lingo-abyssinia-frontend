export type AdminLesson = {
  id: string;
  title: string;
  language: "amharic" | "oromo" | "tigrinya";
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published";
  updatedAt: string;
};

export type AdminUserActivity = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "admin";
  lessonsCompleted: number;
  streak: number;
  lastActive: string;
};

const LESSONS_KEY = "lingo_admin_lessons";

const defaultLessons: AdminLesson[] = [
  {
    id: "les-101",
    title: "Amharic Basics: Greetings",
    language: "amharic",
    level: "beginner",
    status: "published",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "les-201",
    title: "Oromo Listening: Daily Conversation",
    language: "oromo",
    level: "intermediate",
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "les-301",
    title: "Tigrinya Grammar Patterns",
    language: "tigrinya",
    level: "advanced",
    status: "published",
    updatedAt: new Date().toISOString(),
  },
];

export const getAdminLessons = (): AdminLesson[] => {
  try {
    const raw = localStorage.getItem(LESSONS_KEY);
    if (!raw) {
      localStorage.setItem(LESSONS_KEY, JSON.stringify(defaultLessons));
      return defaultLessons;
    }
    return JSON.parse(raw) as AdminLesson[];
  } catch {
    return defaultLessons;
  }
};

export const saveAdminLessons = (lessons: AdminLesson[]) => {
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
};

export const getAdminUsersActivity = (): AdminUserActivity[] => {
  const signedInRaw = localStorage.getItem("lingo_user");
  const signedInUser = signedInRaw ? JSON.parse(signedInRaw) : null;

  const base: AdminUserActivity[] = [
    {
      id: "u-1",
      name: "Abel",
      email: "abel@example.com",
      role: "learner",
      lessonsCompleted: 14,
      streak: 5,
      lastActive: "2026-05-08",
    },
    {
      id: "u-2",
      name: "Rahel",
      email: "rahel@example.com",
      role: "learner",
      lessonsCompleted: 22,
      streak: 11,
      lastActive: "2026-05-09",
    },
    {
      id: "u-3",
      name: "System Admin",
      email: "admin@lingoabyssinia.com",
      role: "admin",
      lessonsCompleted: 0,
      streak: 0,
      lastActive: "2026-05-09",
    },
  ];

  if (signedInUser?.email) {
    const exists = base.some((u) => u.email === signedInUser.email);
    if (!exists) {
      base.unshift({
        id: signedInUser.id ?? `u-${Date.now()}`,
        name: signedInUser.name ?? "Current User",
        email: signedInUser.email,
        role: signedInUser.role ?? "learner",
        lessonsCompleted: 0,
        streak: signedInUser.streak ?? 0,
        lastActive: new Date().toISOString().slice(0, 10),
      });
    }
  }

  return base;
};
