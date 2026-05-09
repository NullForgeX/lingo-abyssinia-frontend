import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { getAdminLessons, getAdminUsersActivity } from "@/data/adminStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const engagementData = [
  { day: "Mon", activeUsers: 18, lessonsCompleted: 27 },
  { day: "Tue", activeUsers: 22, lessonsCompleted: 34 },
  { day: "Wed", activeUsers: 20, lessonsCompleted: 30 },
  { day: "Thu", activeUsers: 25, lessonsCompleted: 42 },
  { day: "Fri", activeUsers: 27, lessonsCompleted: 45 },
  { day: "Sat", activeUsers: 21, lessonsCompleted: 31 },
  { day: "Sun", activeUsers: 19, lessonsCompleted: 28 },
];

const activityConfig: ChartConfig = {
  activeUsers: { label: "Active Users", color: "hsl(var(--primary))" },
  lessonsCompleted: { label: "Lessons Completed", color: "hsl(var(--secondary))" },
};

const AdminAnalytics = () => {
  const lessons = getAdminLessons();
  const users = getAdminUsersActivity();
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const published = lessons.filter((l) => l.status === "published").length;

  const languageBreakdown = ["amharic", "oromo", "tigrinya"].map((lang) => ({
    language: lang,
    count: lessons.filter((l) => l.language === lang).length,
  }));

  const lineData = useMemo(() => {
    if (range === "30d") {
      return [
        { day: "W1", activeUsers: 91, lessonsCompleted: 140 },
        { day: "W2", activeUsers: 104, lessonsCompleted: 168 },
        { day: "W3", activeUsers: 113, lessonsCompleted: 183 },
        { day: "W4", activeUsers: 121, lessonsCompleted: 195 },
      ];
    }
    return engagementData;
  }, [range]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground">Platform performance, content health, and user engagement trends.</p>
        </div>
        <select aria-label="Analytics range" value={range} onChange={(e) => setRange(e.target.value as "7d" | "30d")} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{users.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Published Lessons</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{published}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Completion Rate</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">76%</p></CardContent></Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{range === "7d" ? "Weekly Engagement" : "Monthly Engagement"}</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={activityConfig} className="h-[280px] w-full">
              <LineChart data={lineData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="activeUsers" stroke="var(--color-activeUsers)" strokeWidth={2} />
                <Line type="monotone" dataKey="lessonsCompleted" stroke="var(--color-lessonsCompleted)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lessons by Language</CardTitle></CardHeader>
          <CardContent>
            {languageBreakdown.every((d) => d.count === 0) ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No lesson distribution data yet.</div>
            ) : (
              <ChartContainer config={{ count: { label: "Lessons", color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
                <BarChart data={languageBreakdown} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="language" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
