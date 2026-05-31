import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "./components/AppShell";
import AdminShell from "./components/AdminShell";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import LanguageSelection from "./pages/LanguageSelection";
import StreakHistory from "./pages/StreakHistory";
import BadgeHistory from "./pages/BadgeHistory";
import SkillProgress from "./pages/SkillProgress";
import BiteLessons from "./pages/BiteLessons";
import LessonView from "./pages/LessonView";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LessonPlayer = lazy(() => import("./pages/LessonPlayer"));
const LessonResult = lazy(() => import("./pages/LessonResult"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminOverview = lazy(() => import("./pages/AdminOverview"));
const AdminLessons = lazy(() => import("./pages/AdminLessons"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminContentHub = lazy(() => import("./pages/AdminContentHub"));
const Chat = lazy(() => import("./pages/Chat"));

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
              <ScrollToTop />
              <Suspense fallback={null}>
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
                      <ChatProvider>
                        <AppShell />
                      </ChatProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route path="/home" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/bite-lessons" element={<BiteLessons />} />
                  <Route path="/bite-lesson/:language/:lessonId" element={<LessonView />} />
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
                  <Route path="/admin/hub" element={<AdminContentHub />} />
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
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
