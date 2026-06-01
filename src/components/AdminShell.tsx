import { Link, Outlet, useLocation } from "react-router-dom";
import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpenCheck,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const AdminPageLoader = () => (
  <div className="space-y-6" aria-label="Loading admin page">
    <div className="h-44 animate-pulse rounded-3xl border border-primary/10 bg-card/80" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-28 animate-pulse rounded-2xl border border-border/70 bg-card/70" />
      ))}
    </div>
    <div className="h-56 animate-pulse rounded-2xl border border-border/70 bg-card/70" />
  </div>
);

const AdminShell = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarHidden, setDesktopSidebarHidden] = useState(false);

  const navItems = [
    { label: "Overview", description: "Workspace snapshot", icon: LayoutDashboard, path: "/admin" },
    { label: "Control Hub", description: "Platform operations", icon: PanelsTopLeft, path: "/admin/hub" },
    { label: "Lessons", description: "Content and quizzes", icon: BookOpenCheck, path: "/admin/lessons" },
    { label: "Users", description: "Activity and roles", icon: Users, path: "/admin/users" },
    { label: "Analytics", description: "Growth and engagement", icon: BarChart3, path: "/admin/analytics" },
  ];

  const isActive = (path: string) => path === "/admin"
    ? location.pathname === path
    : location.pathname.startsWith(path);
  const currentSection = navItems.find((item) => isActive(item.path)) ?? navItems[0];
  const adminName = user?.name || user?.email?.split("@")[0] || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const navigation = (closeOnSelect = false) => (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeOnSelect ? () => setSidebarOpen(false) : undefined}
            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
              active
                ? "bg-primary/12 text-primary shadow-sm shadow-primary/5"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />}
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${active ? "bg-primary/15" : "bg-muted/60 group-hover:bg-background"}`}>
              <item.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{item.description}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarFooter = (
    <div className="border-t border-border/70 p-3">
      <div className="flex items-center gap-3 rounded-2xl bg-muted/55 p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {adminInitial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{adminName}</p>
          <p className="text-[11px] text-muted-foreground">Administrator access</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background md:h-screen md:overflow-hidden">
      {!desktopSidebarHidden && (
        <aside className="hidden border-r border-border/70 bg-card/80 backdrop-blur-xl md:flex md:w-72 md:shrink-0 md:flex-col">
          <div className="border-b border-border/70 px-5 py-5">
            <div className="flex items-center gap-3">
              <img src="/lingo_abyssinia_final.png" alt="Lingo Abyssinia" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
              <div>
                <p className="font-display text-lg font-bold leading-tight text-foreground">Lingo Abyssinia</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  <ShieldCheck className="h-3 w-3" /> Admin workspace
                </p>
              </div>
            </div>
          </div>
          {navigation()}
          {sidebarFooter}
        </aside>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[min(19rem,88vw)] flex-col border-r border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <div className="flex items-center gap-3">
                <img src="/lingo_abyssinia_final.png" alt="Lingo Abyssinia" className="h-9 w-9 rounded-xl object-cover" />
                <div>
                  <p className="font-display font-bold">Lingo Abyssinia</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Admin workspace</p>
                </div>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="Close sidebar">
                <X className="h-5 w-5" />
              </button>
            </div>
            {navigation(true)}
            {sidebarFooter}
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/70 bg-card/70 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg p-1.5 hover:bg-muted md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setDesktopSidebarHidden((hidden) => !hidden)}
              className="hidden rounded-xl border border-border bg-background/70 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
              aria-label={desktopSidebarHidden ? "Show sidebar" : "Hide sidebar"}
              title={desktopSidebarHidden ? "Show sidebar" : "Hide sidebar"}
            >
              {desktopSidebarHidden ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Admin Console</p>
              <h2 className="font-display text-lg font-bold leading-tight text-foreground">{currentSection.label}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 sm:flex">
              <Sparkles className="h-3.5 w-3.5" /> Live workspace
            </div>
            <ThemeToggle iconOnly />
            <Link to="/home" className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/70 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
              <span className="hidden sm:inline">Learner app</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </header>
        <main data-scroll-container className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-7 lg:p-8">
          <Suspense fallback={<AdminPageLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
