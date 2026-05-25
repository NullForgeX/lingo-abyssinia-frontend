import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BookOpenCheck, MessageSquare, ShieldCheck, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  AdminCommunityPost,
  deleteAdminCommunityPost,
  getAdminCommunityPosts,
  getAdminLeaderboard,
  getAdminLessons,
  getAdminQuizzes,
  getAdminUsersActivity,
  updateAdminCommunityPostStatus,
} from "@/data/adminStore";

const AdminContentHub = () => {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getAdminUsersActivity>>>([]);
  const [posts, setPosts] = useState<AdminCommunityPost[]>([]);
  const [leaderboard, setLeaderboard] = useState<Awaited<ReturnType<typeof getAdminLeaderboard>>>([]);
  const [lessons, setLessons] = useState<Awaited<ReturnType<typeof getAdminLessons>>>([]);
  const [quizzes, setQuizzes] = useState<Awaited<ReturnType<typeof getAdminQuizzes>>>([]);
  const [tab, setTab] = useState<"users" | "community" | "leaderboard" | "content">("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, postsData, leaderboardData, lessonsData, quizzesData] = await Promise.all([
        getAdminUsersActivity(),
        getAdminCommunityPosts(),
        getAdminLeaderboard(),
        getAdminLessons(),
        getAdminQuizzes(),
      ]);
      setUsers(usersData);
      setPosts(postsData);
      setLeaderboard(leaderboardData);
      setLessons(lessonsData);
      setQuizzes(quizzesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin hub.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const languageChart = useMemo(() => (["amharic", "oromo", "tigrinya"] as const).map((language) => ({
    language,
    lessons: lessons.filter((lesson) => lesson.language === language).length,
    quizzes: quizzes.filter((quiz) => quiz.language === language).length,
    posts: posts.filter((post) => post.language === language).length,
  })), [lessons, posts, quizzes]);

  const setPostStatus = async (post: AdminCommunityPost, status: AdminCommunityPost["status"]) => {
    await updateAdminCommunityPostStatus(post.id, status);
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, status } : item));
  };

  const removePost = async (post: AdminCommunityPost) => {
    await deleteAdminCommunityPost(post.id);
    setPosts((current) => current.filter((item) => item.id !== post.id));
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "content", label: "Lessons & Quizzes", icon: BookOpenCheck },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-4xl">Admin Control Hub</h1>
            <p className="mt-2 text-sm text-muted-foreground">See users, community, leaderboard, lessons, quizzes, and content health in one place.</p>
          </div>
          <Button onClick={load} variant="secondary">Refresh data</Button>
        </div>
        {error && <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{users.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Community Posts</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{posts.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Lessons</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{lessons.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Quizzes</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{quizzes.length}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Open Reports</CardTitle></CardHeader><CardContent><p className="font-display text-3xl font-bold">{posts.filter((p) => p.reports > 0).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Content Mix By Language</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{ lessons: { label: "Lessons", color: "hsl(var(--primary))" }, quizzes: { label: "Quizzes", color: "hsl(var(--secondary))" }, posts: { label: "Posts", color: "hsl(var(--accent))" } }} className="h-[260px] w-full">
            <BarChart data={languageChart} margin={{ left: 10, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="language" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="lessons" fill="var(--color-lessons)" radius={6} />
              <Bar dataKey="quizzes" fill="var(--color-quizzes)" radius={6} />
              <Bar dataKey="posts" fill="var(--color-posts)" radius={6} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${tab === item.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted"}`}>
            <item.icon className="h-4 w-4" /> {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading admin hub...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {tab === "users" && (
              <div className="divide-y divide-border">
                {users.map((user) => <div key={user.id} className="grid gap-2 p-4 md:grid-cols-[1fr_140px_140px_140px]"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div><span className="capitalize">{user.role}</span><span>{user.lessonsCompleted} lessons</span><span>{user.streak} day streak</span></div>)}
              </div>
            )}
            {tab === "community" && (
              <div className="divide-y divide-border">
                {posts.map((post) => <div key={post.id} className="space-y-3 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{post.title}</p><p className="text-sm text-muted-foreground">By {post.author} · {post.language} · {post.likes} likes · {post.reports} reports</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase">{post.status}</span></div><p className="line-clamp-2 text-sm text-muted-foreground">{post.body}</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setPostStatus(post, post.status === "open" ? "resolved" : "open")}>{post.status === "open" ? "Resolve" : "Reopen"}</Button><Button size="sm" variant="destructive" onClick={() => removePost(post)}>Delete</Button></div></div>)}
              </div>
            )}
            {tab === "leaderboard" && (
              <div className="divide-y divide-border">
                {leaderboard.map((entry, index) => <div key={entry.id} className="grid gap-2 p-4 md:grid-cols-[70px_1fr_100px_100px_100px]"><strong>#{index + 1}</strong><div><p className="font-semibold">{entry.name}</p><p className="text-sm text-muted-foreground">{entry.email}</p></div><span>{entry.xp} XP</span><span>{entry.gems} gems</span><span>{entry.streak} 🔥</span></div>)}
              </div>
            )}
            {tab === "content" && (
              <div className="grid gap-0 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                <div className="p-4"><h3 className="mb-3 font-bold">All Lessons</h3><div className="space-y-2">{lessons.map((lesson) => <div key={lesson.id} className="rounded-xl border border-border p-3"><p className="font-semibold">{lesson.title}</p><p className="text-sm capitalize text-muted-foreground">{lesson.language} · {lesson.level} · {lesson.status}</p></div>)}</div></div>
                <div className="p-4"><h3 className="mb-3 font-bold">All Quizzes</h3><div className="space-y-2">{quizzes.map((quiz) => <div key={quiz.id} className="rounded-xl border border-border p-3"><p className="font-semibold">{quiz.question}</p><p className="text-sm text-muted-foreground">{quiz.language} · correct: {quiz.correctOption}</p></div>)}</div></div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" /> Admins can review content, moderate posts, inspect rankings, and manage lesson/quiz content from Supabase-backed data.
      </div>
    </div>
  );
};

export default AdminContentHub;
