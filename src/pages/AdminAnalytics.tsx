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

  const published = lessons.filter((l) => l.status === "published").length;

  const languageBreakdown = [
    "amharic",
    "oromo",
    "tigrinya",
  ].map((lang) => ({
    language: lang,
    count: lessons.filter((l) => l.language === lang).length,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">Analytics</h1>
      <p className="mt-2 text-sm text-muted-foreground">Platform performance, content health, and user engagement trends.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Published Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">{published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">76%</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityConfig} className="h-[280px] w-full">
              <LineChart data={engagementData} margin={{ left: 10, right: 10 }}>
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
          <CardHeader>
            <CardTitle>Lessons by Language</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Lessons", color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
              <BarChart data={languageBreakdown} margin={{ left: 10, right: 10 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="language" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
