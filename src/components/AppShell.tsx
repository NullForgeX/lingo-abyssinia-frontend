import { Link, useLocation, Outlet } from "react-router-dom";
import {
  House,
  BookOpen,
  GraduationCap,
  Trophy,
  User,
  Flame,
  Diamond,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

const AppShell = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: t("app.home"), icon: House, path: "/home" },
    { label: "Lessons", icon: GraduationCap, path: "/bite-lessons" },
    { label: t("app.learn"), icon: BookOpen, path: "/dashboard" },
    { label: t("app.community"), icon: MessageSquare, path: "/community" },
    { label: t("app.leaderboard"), icon: Trophy, path: "/leaderboard" },
    { label: t("app.profile"), icon: User, path: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-background md:h-screen md:overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:h-screen md:w-72 md:shrink-0 md:flex-col md:overflow-hidden border-r border-sidebar-border/60 bg-[linear-gradient(180deg,hsl(var(--sidebar-background))_0%,hsl(var(--sidebar-background)/0.92)_100%)]">
        <div className="flex items-center gap-2 border-b border-sidebar-border/70 px-6 py-5">
          <img
            src="/lingo_abyssinia_final.png"
            alt="Lingo Abyssinia"
            className="h-8 w-8 rounded-md object-cover"
          />
          <h1 className="font-display text-xl font-bold text-sidebar-foreground">
            LingoAbyssinia
          </h1>
        </div>
        <nav className="flex-1 overflow-hidden px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary shadow-lg shadow-black/10"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-0.5"
                }`}
              >
                {active && (
                  <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-sidebar-primary" />
                )}
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border/70 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-5 w-5" />
            {t("app.logout")}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[min(18rem,85vw)] bg-sidebar shadow-xl">
            <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-5">
              <div className="flex items-center gap-2">
                <img
                  src="/lingo_abyssinia_final.png"
                  alt="Lingo Abyssinia"
                  className="h-8 w-8 rounded-md object-cover"
                />
                <h1 className="font-display text-xl font-bold text-sidebar-foreground">
                  LingoAbyssinia
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1.5">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-sidebar-border p-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <LogOut className="h-5 w-5" />
                {t("app.logout")}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
        {/* Stats header */}
        <header className="flex items-center justify-between border-b border-border bg-card/70 px-3 py-3 backdrop-blur-sm sm:px-4 md:px-8">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1 text-xs font-medium sm:gap-1.5 sm:text-sm">
              <Flame className="h-5 w-5 text-accent" />
              <span>{user?.streak ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium sm:gap-1.5 sm:text-sm">
              <Diamond className="h-5 w-5 text-secondary" />
              <span>{user?.gems ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle iconOnly />
            <LanguageSwitcher iconOnly />
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <ThemeToggle iconOnly />
            <LanguageSwitcher iconOnly />
            <span className="text-sm text-muted-foreground">
              {user?.name ?? "Learner"}
            </span>
          </div>
        </header>

        <main
          data-scroll-container
          className="flex-1 overflow-y-auto p-3 pb-24 sm:p-4 sm:pb-24 md:p-8"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-border bg-background md:hidden z-40">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="max-w-[68px] truncate text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppShell;
