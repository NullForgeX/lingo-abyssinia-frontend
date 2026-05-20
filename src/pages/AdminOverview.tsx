import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, ChartNoAxesCombined, LayoutDashboard, ScrollText, ShieldAlert, Users } from "lucide-react";
import { getAdminAuditLogs, getAdminLessons, getAdminUsersActivity, getModerationReports } from "@/data/adminStore";

const AdminOverview = () => {
  const [lessons, setLessons] = useState<Awaited<ReturnType<typeof getAdminLessons>>>([]);
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getAdminUsersActivity>>>([]);
  const [audit, setAudit] = useState<Awaited<ReturnType<typeof getAdminAuditLogs>>>([]);
  const [reports, setReports] = useState<Awaited<ReturnType<typeof getModerationReports>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [lessonsData, usersData, auditData, reportsData] = await Promise.all([
          getAdminLessons(),
          getAdminUsersActivity(),
          getAdminAuditLogs(),
          getModerationReports(),
        ]);
        setLessons(lessonsData);
        setUsers(usersData);
        setAudit(auditData);
        setReports(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load admin overview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const published = lessons.filter((l) => l.status === "published").length;
  const drafts = lessons.filter((l) => l.status === "draft").length;
  const openReports = reports.filter((r) => r.status === "open").length;

  const cards = [
    { label: "Total Lessons", value: lessons.length, icon: BookOpenCheck },
    { label: "Published", value: published, icon: LayoutDashboard },
    { label: "Drafts", value: drafts, icon: ChartNoAxesCombined },
    { label: "Active Users", value: users.length, icon: Users },
  ];

  const quick = [
    { title: "Manage Lessons", path: "/admin/lessons", desc: "Create, update, and remove lessons." },
    { title: "User Activity", path: "/admin/users", desc: "Review learners and manage roles." },
    { title: "Analytics", path: "/admin/analytics", desc: "Track platform performance." },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold md:text-4xl">Admin Overview</h1>
        <p className="mt-2 text-muted-foreground">Production-focused controls for content, users, moderation, and auditability.</p>
        {error && <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      </motion.div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading admin data...</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-2 font-display text-3xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {quick.map((item) => (
              <Link key={item.path} to={item.path} className="group rounded-2xl border border-border bg-card/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/95 p-5">
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 font-semibold text-foreground"><ShieldAlert className="h-4 w-4 text-accent" /> Moderation Queue</h3>
                <span className="text-sm text-muted-foreground">{openReports} open</span>
              </div>
              <div className="mt-3 space-y-2">
                {reports.slice(0, 4).map((r) => (
                  <div key={r.id} className="rounded-lg border border-border/70 p-3 text-sm">
                    <p className="font-medium">{r.targetPost}</p>
                    <p className="text-muted-foreground">{r.reason} by {r.reporter}</p>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-sm text-muted-foreground">No reports yet.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/95 p-5">
              <h3 className="inline-flex items-center gap-2 font-semibold text-foreground"><ScrollText className="h-4 w-4 text-primary" /> Recent Audit Logs</h3>
              <div className="mt-3 space-y-2">
                {audit.slice(0, 6).map((a) => (
                  <div key={a.id} className="rounded-lg border border-border/70 p-3 text-sm">
                    <p className="font-medium">{a.action}</p>
                    <p className="text-muted-foreground">{a.actor} - {a.target}</p>
                  </div>
                ))}
                {audit.length === 0 && <p className="text-sm text-muted-foreground">No audit logs yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
