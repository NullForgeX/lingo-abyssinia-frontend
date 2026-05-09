import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Lightbulb, MessageCircleReply, MessageSquareQuote, Search, Send, ShieldAlert, ThumbsUp, TriangleAlert, Users } from "lucide-react";

type PostType = "question" | "tip";

type Reply = {
  id: number;
  author: string;
  body: string;
  time: string;
};

type ForumPost = {
  id: number;
  name: string;
  initials: string;
  type: PostType;
  title: string;
  body: string;
  language: "Amharic" | "Afan Oromoo" | "Tigrinya";
  likes: number;
  time: string;
  status: "open" | "resolved";
  replies: Reply[];
  reports: number;
};

type NotificationItem = {
  id: number;
  message: string;
  time: string;
  unread: boolean;
};

const seedPosts: ForumPost[] = [
  {
    id: 1,
    name: "Mira T.",
    initials: "MT",
    type: "question",
    title: "How do you remember ? vs ? quickly?",
    body: "I keep mixing the shapes in writing drills. Any trick that helped you remember them faster?",
    language: "Amharic",
    likes: 28,
    time: "2m ago",
    status: "open",
    reports: 0,
    replies: [
      { id: 11, author: "Rahel", body: "I group them by sound families and write short pairs.", time: "1m ago" },
      { id: 12, author: "Amanuel", body: "Try 3-minute visual flashcards before sleep.", time: "just now" },
    ],
  },
  {
    id: 2,
    name: "Dawit S.",
    initials: "DS",
    type: "tip",
    title: "Use daily voice notes to lock in pronunciation",
    body: "I record a 20-second self-intro every morning. It has helped my confidence a lot.",
    language: "Tigrinya",
    likes: 41,
    time: "12m ago",
    status: "resolved",
    reports: 0,
    replies: [{ id: 21, author: "Martha", body: "This helped me too. I compare weekly recordings.", time: "9m ago" }],
  },
  {
    id: 3,
    name: "Amanuel G.",
    initials: "AG",
    type: "tip",
    title: "Study one root word and branch from it",
    body: "For Afan Oromoo, one root can unlock several related words. It makes vocab stick better.",
    language: "Afan Oromoo",
    likes: 19,
    time: "25m ago",
    status: "open",
    reports: 1,
    replies: [],
  },
];

const seedNotifications: NotificationItem[] = [
  { id: 1, message: "Rahel replied to your post", time: "2m ago", unread: true },
  { id: 2, message: "Your tip received 5 likes", time: "10m ago", unread: true },
  { id: 3, message: "A thread you follow was marked resolved", time: "1h ago", unread: false },
];

const typeMeta: Record<PostType, { label: string; icon: typeof MessageSquareQuote; className: string }> = {
  question: { label: "Question", icon: MessageSquareQuote, className: "bg-secondary/15 text-secondary-foreground" },
  tip: { label: "Tip", icon: Lightbulb, className: "bg-primary/15 text-primary" },
};

const CommunityForum = () => {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftType, setDraftType] = useState<PostType>("question");
  const [posts, setPosts] = useState(seedPosts);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [search, setSearch] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});

  const stats = useMemo(() => [
    { label: "Active learners", value: "1.2k" },
    { label: "Open threads", value: `${posts.filter((p) => p.status === "open").length}` },
    { label: "Resolved", value: `${posts.filter((p) => p.status === "resolved").length}` },
  ], [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => `${p.title} ${p.body} ${p.language} ${p.name}`.toLowerCase().includes(q));
  }, [search, posts]);

  const handleSubmit = () => {
    if (!draftTitle.trim() || !draftBody.trim()) return;

    const newPost: ForumPost = {
      id: Date.now(),
      name: "You",
      initials: "YO",
      type: draftType,
      title: draftTitle.trim(),
      body: draftBody.trim(),
      language: "Amharic",
      likes: 0,
      time: "just now",
      status: "open",
      replies: [],
      reports: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNotifications((prev) => [{ id: Date.now() + 10, message: "Your post is now live", time: "just now", unread: true }, ...prev]);
    setDraftTitle("");
    setDraftBody("");
    setDraftType("question");
  };

  const addReply = (postId: number) => {
    const text = replyDrafts[postId]?.trim();
    if (!text) return;

    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, replies: [...p.replies, { id: Date.now(), author: "You", body: text, time: "just now" }] } : p));
    setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
    setNotifications((prev) => [{ id: Date.now() + 20, message: "Reply added successfully", time: "just now", unread: true }, ...prev]);
  };

  const toggleResolved = (postId: number) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status: p.status === "open" ? "resolved" : "open" } : p));
  };

  const reportPost = (postId: number) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, reports: p.reports + 1 } : p));
    setNotifications((prev) => [{ id: Date.now() + 30, message: "Report sent to moderators", time: "just now", unread: true }, ...prev]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Users className="h-3.5 w-3.5" />
            Community Hub
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">Discuss, reply in threads, and learn together</h2>
        </div>
        <div className="hidden gap-2 md:flex">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-right shadow-sm">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-xl backdrop-blur-sm">
          <CardHeader className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-secondary/10 to-background">
            <CardTitle className="flex items-center justify-between gap-2 text-xl">
              <span className="inline-flex items-center gap-2"><MessageSquareQuote className="h-5 w-5 text-primary" /> Start a thread</span>
              <div className="relative w-[220px] hidden sm:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input aria-label="Search community posts" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="pl-8" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5 md:p-6">
            <div className="grid gap-3 md:grid-cols-[160px_1fr]">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</span>
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-background p-2">
                  {(["question", "tip"] as PostType[]).map((type) => {
                    const meta = typeMeta[type];
                    const Icon = meta.icon;
                    const active = draftType === type;
                    return (
                      <button key={type} type="button" onClick={() => setDraftType(type)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}>
                        <Icon className="h-4 w-4" />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</span>
                <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Ask about pronunciation, grammar, or share a learning tip" />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</span>
              <Textarea value={draftBody} onChange={(e) => setDraftBody(e.target.value)} placeholder="Write your question or tip in a friendly, helpful tone..." className="min-h-[120px] resize-none rounded-2xl border-border/70 bg-background" />
            </label>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Threading, moderation, and notifications enabled</p>
              <Button onClick={handleSubmit} className="gap-2 rounded-2xl px-6 shadow-lg shadow-primary/20"><Send className="h-4 w-4" /> Share to community</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between"><span className="inline-flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /> Notifications</span><Badge>{unreadCount} new</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className={`rounded-xl border p-3 text-sm ${n.unread ? "border-primary/30 bg-primary/5" : "border-border/70"}`}>
                <p className="font-medium">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No posts found for your search. Try a different keyword.</div>
        ) : (
          filteredPosts.map((post, index) => {
            const meta = typeMeta[post.type];
            const Icon = meta.icon;
            return (
              <motion.article key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20"><AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 font-bold text-foreground">{post.initials}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{post.name}</p>
                      <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider">{post.language}</Badge>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.className}`}><Icon className="h-3 w-3" />{meta.label}</span>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                      <Badge variant={post.status === "resolved" ? "secondary" : "outline"}>{post.status}</Badge>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-foreground">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"><ThumbsUp className="h-3.5 w-3.5" />{post.likes}</button>
                      <button onClick={() => toggleResolved(post.id)} className="rounded-full bg-muted/80 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted">{post.status === "open" ? "Mark resolved" : "Re-open"}</button>
                      <button onClick={() => reportPost(post.id)} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive"><TriangleAlert className="h-3.5 w-3.5" />Report ({post.reports})</button>
                    </div>

                    <div className="mt-4 rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1"><MessageCircleReply className="h-3.5 w-3.5" /> Thread replies ({post.replies.length})</p>
                      <div className="space-y-2">
                        {post.replies.map((r) => (
                          <div key={r.id} className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm">
                            <p className="font-medium">{r.author}</p>
                            <p className="text-muted-foreground">{r.body}</p>
                          </div>
                        ))}
                        {post.replies.length === 0 && <p className="text-sm text-muted-foreground">No replies yet. Be the first.</p>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Input aria-label={`Reply to ${post.title}`} value={replyDrafts[post.id] || ""} onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))} placeholder="Write a reply..." />
                        <Button onClick={() => addReply(post.id)} size="sm">Reply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/90 p-4 text-sm text-muted-foreground inline-flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-primary" /> Moderation enabled: reported threads are flagged for admin review.
      </div>
    </section>
  );
};

export default CommunityForum;
