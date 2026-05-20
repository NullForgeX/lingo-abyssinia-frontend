import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  getCurrentSession,
  getProfile,
  signOut,
  updatePreferences,
  updateProfile,
} from "@/api/supabaseAuth";
import { User, UserPreferences } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setSessionUser: (user: User, token: string | null, onboarded: boolean) => void;
  logout: () => Promise<void>;
  setPreferences: (prefs: UserPreferences) => Promise<void>;
  updateUser: (
    updates: Partial<
      Pick<User, "name" | "email" | "selectedLanguage" | "dailyGoal">
    >,
  ) => Promise<void>;
  needsOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const session = await getCurrentSession();
      setToken(session?.access_token ?? null);

      if (session?.user) {
        const profile = await getProfile(session.user);
        setUser(profile.user);
        setNeedsOnboarding(
          profile.user.role === "learner" && !profile.onboarded,
        );
      } else {
        setUser(null);
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error("Failed to load Supabase session", error);
      setUser(null);
      setToken(null);
      setNeedsOnboarding(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null);
      if (!session?.user) {
        setUser(null);
        setNeedsOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadSession]);

  const setSessionUser = useCallback(
    (nextUser: User, nextToken: string | null, onboarded: boolean) => {
      setUser(nextUser);
      setToken(nextToken);
      setNeedsOnboarding(nextUser.role === "learner" && !onboarded);
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setToken(null);
    setNeedsOnboarding(false);
  }, []);

  const setPreferences = useCallback(
    async (prefs: UserPreferences) => {
      if (!user) return;
      try {
        const updated = await updatePreferences(user.id, prefs);
        setUser(updated);
      } catch (error) {
        console.error("Failed to persist preferences", error);
        setUser((prev) => prev ? { ...prev, selectedLanguage: prefs.language, dailyGoal: prefs.dailyGoal } : prev);
      }
    },
    [user],
  );

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    try {
      const updated = await updateProfile(user.id, { onboarded: true });
      setUser(updated);
    } catch (error) {
      console.error("Failed to persist onboarding", error);
    }
    setNeedsOnboarding(false);
  }, [user]);

  const updateUser = useCallback(
    async (
      updates: Partial<
        Pick<User, "name" | "email" | "selectedLanguage" | "dailyGoal">
      >,
    ) => {
      if (!user) return;
      try {
        const updated = await updateProfile(user.id, updates);
        setUser(updated);
      } catch (error) {
        console.error("Failed to persist profile update", error);
        setUser((prev) => prev ? { ...prev, ...updates } : prev);
      }
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        setSessionUser,
        logout,
        setPreferences,
        updateUser,
        needsOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

