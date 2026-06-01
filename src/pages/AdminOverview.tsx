import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  FilePenLine,
  Languages,
  LayoutDashboard,
  PanelsTopLeft,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";
import { AdminMetricCard, AdminPageHeader } from "@/components/admin/AdminDashboardUi";
import { getAdminAuditLogs, getAdminLessons, getAdminUsersActivity } from "@/data/adminStore";

const AdminOverview = () => {
  const [lessons, setLessons] = useState<Awaited<ReturnType<typeof getAdminLessons>>>([]);
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getAdminUsersActivity>>>([]);
  const [audit, setAudit] = useState<Awaited<ReturnType<typeof getAdminAuditLogs>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [lessonsData, usersData, auditData] = await Promise.all([
          getAdminLessons(),
          getAdminUsersActivity(),
          getAdminAuditLogs(),
        ]);
        setLessons(lessonsData);
        setUsers(usersData);
        setAudit(auditData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load admin overview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const published = lessons.filter((lesson) => lesson.status === "published").length;
  const drafts = lessons.filter((lesson) => lesson.status === "draft").length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const languageReadiness = (["amharic", "oromo", "tigrinya"] as const).map((language) => {
    const languageLessons = lessons.filter((lesson) => lesson.language === language);
    const liveLessons = languageLessons.filter((lesson) => lesson.status === "published").length;
    return {
      language,
      label: language === "oromo" ? "Afan Oromoo" : language.charAt(0).toUpperCase() + language.slice(1),
      liveLessons,
      totalLessons: languageLessons.length,
      readiness: languageLessons.length ? Math.round((liveLessons / languageLessons.length) * 100) : 0,
    };
  });

  const cards = [
    { label: "Total lessons", value: lessons.length, helper: `${published} live in the learner app`, icon: BookOpenCheck, tone: "primary" as const },
    { label: "Published", value: published, helper: `${drafts} drafts awaiting review`, icon: LayoutDashboard, tone: "emerald" as const },
    { label: "Registered users", value: users.length, helper: `${adminUsers} administrator${adminUsers === 1 ? "" : "s"}`, icon: Users, tone: "secondary" as const },
    { label: "Draft lessons", value: drafts, helper: drafts ? "Ready for editorial review" : "All content is published", icon: FilePenLine, tone: "accent" as const },
  ];

  const quickActions = [
    { title: "Manage lessons", path: "/admin/lessons", description: "Publish content and maintain quizzes.", icon: FilePenLine },
    { title: "Open control hub", path: "/admin/hub", description: "Review community and platform health.", icon: PanelsTopLeft },
    { title: "Explore analytics", path: "/admin/analytics", description: "Track content and learner engagement.", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Operations center"
        title="Welcome to your admin workspace"
        description="Monitor learner activity, maintain course content, and keep the community healthy from one connected dashboard."
        icon={Sparkles}
        error={error}
        actions={(
          <Link to="/admin/hub" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
            Open control hub <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      />

      {loading ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">Loading workspace data...</div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <AdminMetricCard key={card.label} {...card} />)}
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Shortcuts</p>
                <h2 className="mt-1 font-display text-xl font-bold text-foreground">Move quickly across operations</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((item, index) => (
                <motion.div key={item.path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                  <Link to={item.path} className="group flex h-full items-start gap-4 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">{item.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Learning catalog</p>
                <h3 className="mt-1 inline-flex items-center gap-2 font-display text-lg font-bold text-foreground"><Languages className="h-5 w-5 text-secondary" /> Content readiness</h3>
              </div>
              <div className="mt-5 space-y-4">
                {languageReadiness.map((item, index) => (
                  <motion.div key={item.language} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + index * 0.08 }}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.liveLessons} of {item.totalLessons} lessons published</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{item.readiness}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.readiness}%` }} transition={{ delay: 0.2 + index * 0.08, duration: 0.55, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Accountability</p>
                <h3 className="mt-1 inline-flex items-center gap-2 font-display text-lg font-bold text-foreground"><ScrollText className="h-5 w-5 text-primary" /> Recent audit activity</h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {audit.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background/45 p-3.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{entry.action}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.actor} · {entry.target}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
                {audit.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No audit logs yet.</p>}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
