import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpenCheck, Users, ChartNoAxesCombined, ArrowRight } from "lucide-react";
import { getAdminLessons, getAdminUsersActivity } from "@/data/adminStore";

const AdminOverview = () => {
  const lessons = getAdminLessons();
  const users = getAdminUsersActivity();

  const published = lessons.filter((l) => l.status === "published").length;
  const drafts = lessons.filter((l) => l.status === "draft").length;

  const cards = [
    { label: "Total Lessons", value: lessons.length, icon: BookOpenCheck },
    { label: "Published", value: published, icon: LayoutDashboard },
    { label: "Drafts", value: drafts, icon: ChartNoAxesCombined },
    { label: "Active Users", value: users.length, icon: Users },
  ];

  const quick = [
    { title: "Manage Lessons", path: "/admin/lessons", desc: "Create, update, and remove lessons." },
    { title: "User Activity", path: "/admin/users", desc: "Review learners and engagement." },
    { title: "Analytics", path: "/admin/analytics", desc: "Track platform performance." },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-6 md:p-8"
      >
        <h1 className="font-display text-2xl font-bold md:text-4xl">Admin Overview</h1>
        <p className="mt-2 text-muted-foreground">Control content, monitor user activity, and analyze engagement from one console.</p>
      </motion.div>

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
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
