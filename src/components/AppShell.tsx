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
  PanelLeftClose,
  PanelLeftOpen,
  X,
  MessageSquare,
  MessageCircle,
  Bot,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const AppShell = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarHidden, setDesktopSidebarHidden] = useState(false);
  const learnerName = user?.name || user?.email?.split("@")[0] || t("app.learner");
  const learnerInitial = learnerName.charAt(0).toUpperCase();

  // Mobile bottom nav items (only main navigation)
  const mobileNavItems = [
    { label: t("app.home"), icon: House, path: "/home" },
    { label: t("app.lessons"), icon: GraduationCap, path: "/bite-lessons" },
    { label: t("app.learn"), icon: BookOpen, path: "/dashboard" },
    { label: t("app.community"), icon: MessageSquare, path: "/community" },
    { label: t("app.leaderboard"), icon: Trophy, path: "/leaderboard" },
  ];

  // Sidebar / hamburger menu items (includes Profile and AI Chat)
  const sidebarNavItems = [
    { label: t("app.home"), icon: House, path: "/home" },
    { label: t("app.lessons"), icon: GraduationCap, path: "/bite-lessons" },
    { label: t("app.learn"), icon: BookOpen, path: "/dashboard" },
    { label: t("app.community"), icon: MessageSquare, path: "/community" },
    { label: t("app.leaderboard"), icon: Trophy, path: "/leaderboard" },
    { label: t("app.profile"), icon: User, path: "/profile" },
    { label: t("app.aiChat"), icon: MessageCircle, path: "/chat" },
  ];

  // Only show floating button on /home page
  const showFloatingChat = location.pathname === "/home";

  return (
    <div className="flex min-h-screen bg-background md:h-screen md:overflow-hidden">
      {/* Desktop Sidebar */}
      {!desktopSidebarHidden && <aside className="relative hidden overflow-hidden border-r border-amber-200/60 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--muted)/0.62)_52%,hsl(var(--background))_100%)] shadow-[10px_0_35px_hsl(var(--foreground)/0.06)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.20),transparent_34%),linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--muted)/0.28)_50%,hsl(var(--background))_100%)] dark:shadow-[10px_0_40px_hsl(0_0%_0%/0.32)] md:flex md:w-72 md:shrink-0 md:flex-col">
        <div className="pointer-events-none absolute inset-x-4 top-20 h-28 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="relative border-b border-amber-200/60 px-5 py-5 dark:border-stone-800/80">
          <div className="flex items-center gap-3">
            <img
              src="/lingo_abyssinia_final.png"
              alt="Lingo Abyssinia"
              className="h-10 w-10 rounded-xl object-cover shadow-md shadow-primary/15 ring-1 ring-primary/15"
            />
            <div>
              <p className="font-display text-lg font-bold leading-tight text-foreground">Lingo Abyssinia</p>
            </div>
          </div>
        </div>
        <nav className="relative flex-1 space-y-1.5 px-3 py-4">
          {sidebarNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                  active
                    ? "bg-primary/14 text-primary shadow-md shadow-primary/10 ring-1 ring-primary/10"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground hover:shadow-sm dark:hover:bg-white/5"
                }`}
              >
                {active && (
                  <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />
                )}
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${active ? "bg-primary/15" : "bg-background/70 group-hover:bg-background dark:bg-white/5 dark:group-hover:bg-white/10"}`}>
                  <item.icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-5">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="relative border-t border-amber-200/60 p-3 dark:border-stone-800/80">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 shadow-sm backdrop-blur dark:bg-white/5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {learnerInitial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{learnerName}</p>
              <p className="text-[11px] text-muted-foreground">Learner access</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
              aria-label={t("app.logout")}
              title={t("app.logout")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(19rem,88vw)] flex-col border-r border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <div className="flex items-center gap-2">
                <img
                  src="/lingo_abyssinia_final.png"
                  alt="Lingo Abyssinia"
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div>
                  <p className="font-display font-bold text-foreground">Lingo Abyssinia</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-foreground hover:bg-muted"
                aria-label={t("app.closeSidebar")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {sidebarNavItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"}`}
                  >
                    {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />}
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${active ? "bg-primary/15" : "bg-muted/60 group-hover:bg-background"}`}>
                      <item.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/70 p-3">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/55 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {learnerInitial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{learnerName}</p>
                  <p className="text-[11px] text-muted-foreground">Learner access</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                  aria-label={t("app.logout")}
                  title={t("app.logout")}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
        {/* Stats header */}
        <header className="flex items-center justify-between border-b border-border bg-card/70 px-3 py-3 backdrop-blur-sm sm:px-4 md:px-8">
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label={t("app.openSidebar")}>
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setDesktopSidebarHidden((hidden) => !hidden)}
              className="hidden rounded-xl border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
              aria-label={desktopSidebarHidden ? t("app.showSidebar") : t("app.hideSidebar")}
              title={desktopSidebarHidden ? t("app.showSidebar") : t("app.hideSidebar")}
            >
              {desktopSidebarHidden ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
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
              {user?.name ?? t("app.learner")}
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

      {/* Floating AI Chat Button - Bottom Right */}
      <AnimatePresence>
        {showFloatingChat && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8"
          >
            <Link
              to="/chat"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-black/25 hover:scale-105 active:scale-95 transition-transform"
            >
              <Bot className="h-6 w-6 text-white" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-border bg-background md:hidden z-40">
        {mobileNavItems.map((item) => {
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
