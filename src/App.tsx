import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import AppShell from "./components/AppShell";
import AdminShell from "./components/AdminShell";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LessonPlayer from "./pages/LessonPlayer";
import LessonResult from "./pages/LessonResult";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LanguageSelection from "./pages/LanguageSelection";
import StreakHistory from "./pages/StreakHistory";
import BadgeHistory from "./pages/BadgeHistory";
import SkillProgress from "./pages/SkillProgress";
import AdminOverview from "./pages/AdminOverview";
import AdminLessons from "./pages/AdminLessons";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  element={
                    <ProtectedRoute allowRoles={["learner"]}>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/home" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="/language-selection"
                    element={<LanguageSelection />}
                  />
                  <Route path="/progress/streaks" element={<StreakHistory />} />
                  <Route path="/progress/badges" element={<BadgeHistory />} />
                  <Route path="/progress/skills" element={<SkillProgress />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoute allowRoles={["admin"]}>
                      <AdminShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin" element={<AdminOverview />} />
                  <Route path="/admin/lessons" element={<AdminLessons />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>
                <Route
                  path="/lesson/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonPlayer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/:lessonId/result"
                  element={
                    <ProtectedRoute>
                      <LessonResult />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
