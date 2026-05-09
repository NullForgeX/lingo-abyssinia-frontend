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

export type AdminAuditLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export type ModerationReport = {
  id: string;
  reporter: string;
  reason: string;
  targetPost: string;
  status: "open" | "resolved";
  createdAt: string;
};

const LESSONS_KEY = "lingo_admin_lessons";
const USERS_KEY = "lingo_admin_users";
const AUDIT_KEY = "lingo_admin_audit";
const REPORTS_KEY = "lingo_admin_reports";

const defaultLessons: AdminLesson[] = [
  { id: "les-101", title: "Amharic Basics: Greetings", language: "amharic", level: "beginner", status: "published", updatedAt: new Date().toISOString() },
  { id: "les-201", title: "Oromo Listening: Daily Conversation", language: "oromo", level: "intermediate", status: "draft", updatedAt: new Date().toISOString() },
  { id: "les-301", title: "Tigrinya Grammar Patterns", language: "tigrinya", level: "advanced", status: "published", updatedAt: new Date().toISOString() },
];

const defaultAudit: AdminAuditLog[] = [
  { id: "a-1", actor: "System", action: "Seeded admin data", target: "Initial setup", timestamp: new Date().toISOString() },
];

const defaultReports: ModerationReport[] = [
  { id: "r-1", reporter: "Rahel", reason: "Spam reply", targetPost: "How do you remember characters?", status: "open", createdAt: "2026-05-09" },
  { id: "r-2", reporter: "Abel", reason: "Off-topic", targetPost: "Marketplace links", status: "resolved", createdAt: "2026-05-08" },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getAdminLessons = (): AdminLesson[] => readJSON(LESSONS_KEY, defaultLessons);
export const saveAdminLessons = (lessons: AdminLesson[]) => writeJSON(LESSONS_KEY, lessons);

export const getAdminUsersActivity = (): AdminUserActivity[] => {
  const base: AdminUserActivity[] = readJSON(USERS_KEY, [
    { id: "u-1", name: "Abel", email: "abel@example.com", role: "learner", lessonsCompleted: 14, streak: 5, lastActive: "2026-05-08" },
    { id: "u-2", name: "Rahel", email: "rahel@example.com", role: "learner", lessonsCompleted: 22, streak: 11, lastActive: "2026-05-09" },
    { id: "u-3", name: "System Admin", email: "admin@lingoabyssinia.com", role: "admin", lessonsCompleted: 0, streak: 0, lastActive: "2026-05-09" },
  ]);

  const signedInRaw = localStorage.getItem("lingo_user");
  const signedInUser = signedInRaw ? JSON.parse(signedInRaw) : null;

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
      writeJSON(USERS_KEY, base);
    }
  }

  return base;
};

export const saveAdminUsersActivity = (users: AdminUserActivity[]) => writeJSON(USERS_KEY, users);

export const getAdminAuditLogs = (): AdminAuditLog[] => readJSON(AUDIT_KEY, defaultAudit);

export const pushAdminAuditLog = (entry: Omit<AdminAuditLog, "id" | "timestamp">) => {
  const logs = getAdminAuditLogs();
  const next: AdminAuditLog[] = [
    {
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...logs,
  ].slice(0, 200);
  writeJSON(AUDIT_KEY, next);
};

export const getModerationReports = (): ModerationReport[] => readJSON(REPORTS_KEY, defaultReports);

export const saveModerationReports = (reports: ModerationReport[]) => writeJSON(REPORTS_KEY, reports);
