import { supabase } from "@/lib/supabase";

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

export type AdminCommunityPost = {
  id: string;
  title: string;
  body: string;
  language: "amharic" | "oromo" | "tigrinya";
  type: "question" | "tip";
  status: "open" | "resolved";
  likes: number;
  reports: number;
  author: string;
  createdAt: string;
};

export type AdminQuiz = {
  id: string;
  lessonId: string | null;
  language: "amharic" | "oromo" | "tigrinya";
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  updatedAt: string;
};

export type AdminLeaderboardEntry = {
  id: string;
  name: string;
  email: string;
  streak: number;
  gems: number;
  lessonsCompleted: number;
  xp: number;
};

type LessonRow = {
  id: string;
  title: string;
  language: AdminLesson["language"];
  level: AdminLesson["level"];
  status: AdminLesson["status"];
  updated_at: string;
};

const mapLesson = (row: LessonRow): AdminLesson => ({
  id: row.id,
  title: row.title,
  language: row.language,
  level: row.level,
  status: row.status,
  updatedAt: row.updated_at,
});

export const getAdminLessons = async (): Promise<AdminLesson[]> => {
  const { data, error } = await supabase
    .from("lessons")
    .select("id,title,language,level,status,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as LessonRow[]).map(mapLesson);
};

export const upsertAdminLesson = async (
  lesson: Omit<AdminLesson, "id" | "updatedAt"> & { id?: string },
): Promise<AdminLesson> => {
  const payload: Record<string, unknown> = {
    title: lesson.title,
    language: lesson.language,
    level: lesson.level,
    status: lesson.status,
  };

  if (lesson.id) payload.id = lesson.id;

  const { data, error } = await supabase
    .from("lessons")
    .upsert(payload)
    .select("id,title,language,level,status,updated_at")
    .single();

  if (error) throw error;
  return mapLesson(data as LessonRow);
};

export const deleteAdminLesson = async (id: string) => {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
};

export const getAdminUsersActivity = async (): Promise<AdminUserActivity[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email,role,streak,updated_at,lesson_progress(lesson_id)")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    lessonsCompleted: row.lesson_progress?.length || 0,
    streak: row.streak || 0,
    lastActive: row.updated_at,
  }));
};

export const getAdminLeaderboard = async (): Promise<AdminLeaderboardEntry[]> => {
  const users = await getAdminUsersActivity();
  return users
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      streak: user.streak,
      gems: Math.max(0, user.streak * 3 + user.lessonsCompleted * 5),
      lessonsCompleted: user.lessonsCompleted,
      xp: user.lessonsCompleted * 15 + user.streak * 10,
    }))
    .sort((a, b) => b.xp - a.xp || b.streak - a.streak);
};

export const updateAdminUserRole = async (
  id: string,
  role: AdminUserActivity["role"],
) => {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw error;
};

export const getAdminCommunityPosts = async (): Promise<AdminCommunityPost[]> => {
  const { data, error } = await supabase
    .from("community_posts")
    .select("id,title,body,language,type,status,likes,reports,created_at,profiles(name,email)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    language: row.language,
    type: row.type,
    status: row.status,
    likes: row.likes || 0,
    reports: row.reports || 0,
    author: row.profiles?.name || row.profiles?.email || "Learner",
    createdAt: row.created_at,
  }));
};

export const updateAdminCommunityPostStatus = async (
  id: string,
  status: AdminCommunityPost["status"],
) => {
  const { error } = await supabase.from("community_posts").update({ status }).eq("id", id);
  if (error) throw error;
};

export const deleteAdminCommunityPost = async (id: string) => {
  const { error } = await supabase.from("community_posts").delete().eq("id", id);
  if (error) throw error;
};

const mapQuiz = (row: any): AdminQuiz => ({
  id: row.id,
  lessonId: row.lesson_id,
  language: row.language,
  question: row.question,
  optionA: row.option_a,
  optionB: row.option_b,
  optionC: row.option_c,
  optionD: row.option_d,
  correctOption: row.correct_option,
  explanation: row.explanation || "",
  updatedAt: row.updated_at,
});

export const getAdminQuizzes = async (): Promise<AdminQuiz[]> => {
  const { data, error } = await supabase
    .from("admin_quizzes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapQuiz);
};

export const upsertAdminQuiz = async (
  quiz: Omit<AdminQuiz, "id" | "updatedAt"> & { id?: string },
): Promise<AdminQuiz> => {
  const { data: userData } = await supabase.auth.getUser();
  const payload = {
    id: quiz.id,
    lesson_id: quiz.lessonId || null,
    language: quiz.language,
    question: quiz.question,
    option_a: quiz.optionA,
    option_b: quiz.optionB,
    option_c: quiz.optionC,
    option_d: quiz.optionD,
    correct_option: quiz.correctOption,
    explanation: quiz.explanation,
    created_by: userData.user?.id,
  };

  const { data, error } = await supabase.from("admin_quizzes").upsert(payload).select("*").single();
  if (error) throw error;
  return mapQuiz(data);
};

export const deleteAdminQuiz = async (id: string) => {
  const { error } = await supabase.from("admin_quizzes").delete().eq("id", id);
  if (error) throw error;
};

export const getAdminAuditLogs = async (): Promise<AdminAuditLog[]> => {
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("id,actor,action,target,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    actor: row.actor,
    action: row.action,
    target: row.target,
    timestamp: row.created_at,
  }));
};

export const pushAdminAuditLog = async (
  entry: Omit<AdminAuditLog, "id" | "timestamp">,
) => {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("admin_audit_logs").insert({
    actor_id: userData.user?.id,
    actor: entry.actor,
    action: entry.action,
    target: entry.target,
  });

  if (error) throw error;
};

export const getModerationReports = async (): Promise<ModerationReport[]> => {
  const { data, error } = await supabase
    .from("moderation_reports")
    .select("id,reason,status,created_at,profiles(name),community_posts(title)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    reporter: row.profiles?.name || "Learner",
    reason: row.reason,
    targetPost: row.community_posts?.title || "Community post",
    status: row.status,
    createdAt: row.created_at,
  }));
};

export const saveModerationReportStatus = async (
  id: string,
  status: ModerationReport["status"],
) => {
  const { error } = await supabase
    .from("moderation_reports")
    .update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) throw error;
};
