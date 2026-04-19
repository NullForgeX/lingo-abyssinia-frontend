import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, UserPreferences } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  signup: (user: User, token: string) => void;
  logout: () => void;
  setPreferences: (prefs: UserPreferences) => void;
  updateUser: (
    updates: Partial<
      Pick<User, "name" | "email" | "selectedLanguage" | "dailyGoal">
    >,
  ) => void;
  needsOnboarding: boolean;
  completeOnboarding: () => void;
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

  useEffect(() => {
    const savedToken = localStorage.getItem("lingo_token");
    const savedUser = localStorage.getItem("lingo_user");
    const onboarded = localStorage.getItem("lingo_onboarded");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setNeedsOnboarding(onboarded !== "true");
    }
    setLoading(false);
  }, []);

  const login = useCallback((user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("lingo_token", token);
    localStorage.setItem("lingo_user", JSON.stringify(user));
    const onboarded = localStorage.getItem("lingo_onboarded");
    setNeedsOnboarding(onboarded !== "true");
  }, []);

  const signup = useCallback((user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("lingo_token", token);
    localStorage.setItem("lingo_user", JSON.stringify(user));
    setNeedsOnboarding(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("lingo_token");
    localStorage.removeItem("lingo_user");
    localStorage.removeItem("lingo_onboarded");
    setNeedsOnboarding(false);
  }, []);

  const setPreferences = useCallback(
    (prefs: UserPreferences) => {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              selectedLanguage: prefs.language,
              dailyGoal: prefs.dailyGoal,
            }
          : null,
      );
      if (user) {
        const updated = {
          ...user,
          selectedLanguage: prefs.language,
          dailyGoal: prefs.dailyGoal,
        };
        localStorage.setItem("lingo_user", JSON.stringify(updated));
      }
    },
    [user],
  );

  const completeOnboarding = useCallback(() => {
    localStorage.setItem("lingo_onboarded", "true");
    setNeedsOnboarding(false);
  }, []);

  const updateUser = useCallback(
    (
      updates: Partial<
        Pick<User, "name" | "email" | "selectedLanguage" | "dailyGoal">
      >,
    ) => {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...updates };
        localStorage.setItem("lingo_user", JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
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
