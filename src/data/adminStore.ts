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

export const updateAdminUserRole = async (
  id: string,
  role: AdminUserActivity["role"],
) => {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
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
