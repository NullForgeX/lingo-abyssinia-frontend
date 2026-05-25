import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Shield,
  LayoutDashboard,
  BookOpenCheck,
  Users,
  ChartNoAxesCombined,
  PanelsTopLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminShell = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/admin" },
    { label: "Control Hub", icon: PanelsTopLeft, path: "/admin/hub" },
    { label: "Lessons (CRUD)", icon: BookOpenCheck, path: "/admin/lessons" },
    { label: "User Activity", icon: Users, path: "/admin/users" },
    { label: "Analytics", icon: ChartNoAxesCombined, path: "/admin/analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-background md:h-screen md:overflow-hidden">
      <aside className="hidden md:flex md:w-72 md:flex-col border-r border-border bg-card/70 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">Admin Console</h1>
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h1 className="font-display text-xl font-bold">Admin Console</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1.5 px-3 py-4">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                      active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 md:px-8">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <p className="text-sm text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{user?.email}</span>
          </p>
          <Link to="/home" className="text-sm font-medium text-primary hover:underline">
            Learner App
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
