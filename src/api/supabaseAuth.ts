import type { AuthError, Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { User, UserPreferences } from "@/types";

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: User["role"] | null;
  selected_language: User["selectedLanguage"] | null;
  daily_goal: number | null;
  streak: number | null;
  gems: number | null;
  onboarded: boolean | null;
};

const fallbackName = (email?: string | null) =>
  email?.split("@")[0]?.replace(/[._-]/g, " ") || "Learner";

const selectedLanguageStorageKey = (userId: string) => `lingo_selected_language:${userId}`;

const readSavedLanguage = (userId: string): User["selectedLanguage"] | null => {
  const saved = localStorage.getItem(selectedLanguageStorageKey(userId));
  return saved === "amharic" || saved === "oromo" || saved === "tigrinya" ? saved : null;
};

const saveSelectedLanguage = (userId: string, language: User["selectedLanguage"]) => {
  localStorage.setItem(selectedLanguageStorageKey(userId), language);
};

const fallbackUser = (authUser: SupabaseUser): User => ({
  id: authUser.id,
  name:
    typeof authUser.user_metadata?.name === "string"
      ? authUser.user_metadata.name
      : fallbackName(authUser.email),
  email: authUser.email || "",
  role: authUser.email?.toLowerCase() === "admin@lingoabyssinia.com" ? "admin" : "learner",
  selectedLanguage: readSavedLanguage(authUser.id) || "amharic",
  dailyGoal: 15,
  streak: 0,
  gems: 0,
});

const getAuthErrorMessage = (error: AuthError) => {
  const message = error.message.toLowerCase();

  if (error.status === 429) {
    return "Too many attempts. Please wait a few minutes, then try again.";
  }

  if (message.includes("email not confirmed")) {
    return "This existing account is not confirmed. Delete it from Supabase Authentication > Users, then sign up again.";
  }

  if (message.includes("already registered") || error.status === 422) {
    return "This email may already have an account. If the password is correct, use Log In instead.";
  }

  return error.message || "Authentication request failed.";
};

export const mapProfileToUser = (
  profile: ProfileRow,
  authUser?: SupabaseUser | null,
): User => ({
  id: profile.id,
  name: profile.name || fallbackName(profile.email || authUser?.email),
  email: profile.email || authUser?.email || "",
  role: profile.role || "learner",
  selectedLanguage: readSavedLanguage(profile.id) || profile.selected_language || "amharic",
  dailyGoal: profile.daily_goal || 15,
  streak: profile.streak || 0,
  gems: profile.gems || 0,
});

export const getProfile = async (
  authUser: SupabaseUser,
): Promise<{ user: User; onboarded: boolean }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (data) {
    const profile = data as ProfileRow;
    return {
      user: mapProfileToUser(profile, authUser),
      onboarded: Boolean(profile.onboarded),
    };
  }

  const fallback = fallbackUser(authUser);

  if (!error || error.code === "PGRST116") {
    const { data: created } = await supabase
      .from("profiles")
      .upsert({
        id: fallback.id,
        name: fallback.name,
        email: fallback.email,
        role: fallback.role,
        selected_language: fallback.selectedLanguage,
        daily_goal: fallback.dailyGoal,
        streak: fallback.streak,
        gems: fallback.gems,
        onboarded: false,
      })
      .select("*")
      .maybeSingle();

    if (created) {
      return {
        user: mapProfileToUser(created as ProfileRow, authUser),
        onboarded: Boolean((created as ProfileRow).onboarded),
      };
    }
  }

  console.warn("Using local profile fallback because Supabase profile lookup failed", error);
  return { user: fallback, onboarded: false };
};

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  if (!data.user || !data.session) throw new Error("Login failed.");

  const profile = await getProfile(data.user);
  return { ...profile, session: data.session };
};

export const signUpWithPassword = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    if (error.status === 422) {
      return signInWithPassword(email, password);
    }
    throw new Error(getAuthErrorMessage(error));
  }

  if (!data.user) throw new Error("Signup failed.");

  if (data.session) {
    const profile = await getProfile(data.user);
    return { ...profile, session: data.session };
  }

  return signInWithPassword(email, password);
};

export const requestPasswordReset = async (email: string) => {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw new Error(getAuthErrorMessage(error));

  return {
    message: "If that email exists, Supabase has sent a password reset link.",
  };
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(getAuthErrorMessage(error));
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Pick<User, "name" | "selectedLanguage" | "dailyGoal" | "streak" | "gems">> & {
    email?: string;
    onboarded?: boolean;
  },
) => {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.selectedLanguage !== undefined) {
    saveSelectedLanguage(userId, updates.selectedLanguage);
    payload.selected_language = updates.selectedLanguage;
  }
  if (updates.dailyGoal !== undefined) payload.daily_goal = updates.dailyGoal;
  if (updates.streak !== undefined) payload.streak = updates.streak;
  if (updates.gems !== undefined) payload.gems = updates.gems;
  if (updates.onboarded !== undefined) payload.onboarded = updates.onboarded;

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...payload })
    .select("*")
    .maybeSingle();

  if (error || !data) throw error || new Error("Could not update profile.");

  return mapProfileToUser(data as ProfileRow);
};

export const updatePreferences = async (
  userId: string,
  prefs: UserPreferences,
) =>
  updateProfile(userId, {
    selectedLanguage: prefs.language,
    dailyGoal: prefs.dailyGoal,
  });

export const signOut = () => supabase.auth.signOut();

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

