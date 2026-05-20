import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Lightbulb, MessageCircleReply, MessageSquareQuote, Search, Send, ShieldAlert, ThumbsUp, TriangleAlert, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityPost, PostType, createCommunityPost, createCommunityReply, getCommunityPosts, reportCommunityPost, updateCommunityPostStatus, likeCommunityPost } from "@/api/community";

type NotificationItem = {
  id: number;
  message: string;
  time: string;
  unread: boolean;
};

const seedNotifications: NotificationItem[] = [
  { id: 1, message: "Welcome to the community", time: "just now", unread: true },
];

const typeMeta: Record<PostType, { label: string; icon: typeof MessageSquareQuote; className: string }> = {
  question: { label: "Question", icon: MessageSquareQuote, className: "bg-secondary/15 text-secondary-foreground" },
  tip: { label: "Tip", icon: Lightbulb, className: "bg-primary/15 text-primary" },
};

const CommunityForum = () => {
  const { user } = useAuth();
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftType, setDraftType] = useState<PostType>("question");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [search, setSearch] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [postStatus, setPostStatus] = useState<"idle" | "posting" | "posted">("idle");
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await getCommunityPosts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load community posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const stats = useMemo(() => [
    { label: "Active learners", value: "Live" },
    { label: "Open threads", value: `${posts.filter((p) => p.status === "open").length}` },
    { label: "Resolved", value: `${posts.filter((p) => p.status === "resolved").length}` },
  ], [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => `${p.title} ${p.body} ${p.language} ${p.name}`.toLowerCase().includes(q));
  }, [search, posts]);

  const handleSubmit = async () => {
    setError("");
    if (!user) {
      setError("Please log in before posting to the community.");
      return;
    }
    if (!draftTitle.trim() || !draftBody.trim()) {
      setError("Add both a title and a message before posting.");
      return;
    }

    setPostStatus("posting");
    try {
      const newPost = await createCommunityPost(user, {
        type: draftType,
        title: draftTitle.trim(),
        body: draftBody.trim(),
      });
      setPosts((prev) => [newPost, ...prev.filter((post) => !post.id.startsWith("seed-"))]);
      setNotifications((prev) => [{ id: Date.now() + 10, message: "Your post is now live", time: "just now", unread: true }, ...prev]);
      setDraftTitle("");
      setDraftBody("");
      setDraftType("question");
      loadPosts().catch((err) => {
        console.error("Posted, but could not refresh community posts", err);
      });
      setPostStatus("posted");
      window.setTimeout(() => setPostStatus("idle"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create post.");
    } finally {
    }
  };

  const addReply = async (postId: string) => {
    setError("");
    if (!user) {
      setError("Please log in before replying.");
      return;
    }
    const text = replyDrafts[postId]?.trim();
    if (!text) {
      setError("Write a reply before submitting.");
      return;
    }

    setReplyingPostId(postId);
    try {
      const reply = postId.startsWith("seed-")
        ? { id: `local-${Date.now()}`, author: user.name || "You", body: text, time: "just now" }
        : await createCommunityReply(user, postId, text);

      setPosts((prev) => prev.map((post) => post.id === postId ? {
        ...post,
        replies: [...post.replies, reply],
      } : post));
      setReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      setNotifications((prev) => [{ id: Date.now() + 20, message: "Reply added successfully", time: "just now", unread: true }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add reply.");
    } finally {
      setReplyingPostId(null);
    }
  };

  const toggleResolved = async (post: CommunityPost) => {
    const status = post.status === "open" ? "resolved" : "open";
    try {
      if (!post.id.startsWith("seed-")) {
        await updateCommunityPostStatus(post.id, status);
      }
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update thread.");
    }
  };

  const likePost = async (post: CommunityPost) => {
    try {
      if (!post.id.startsWith("seed-")) {
        await likeCommunityPost(post);
      }
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not like post.");
    }
  };

  const reportPost = async (post: CommunityPost) => {
    if (!user) return;
    try {
      if (!post.id.startsWith("seed-")) {
        await reportCommunityPost(user, post);
      }
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, reports: p.reports + 1 } : p));
      setNotifications((prev) => [{ id: Date.now() + 30, message: "Report sent to moderators", time: "just now", unread: true }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not report post.");
    }
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
          {error && <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
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
              <div className="relative hidden w-[220px] sm:block">
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
            <Textarea value={draftBody} onChange={(e) => setDraftBody(e.target.value)} placeholder="Write your question or study tip..." className="min-h-[110px] resize-none" />
            <Button onClick={handleSubmit} disabled={postStatus === "posting"} className="gap-2 rounded-2xl"><Send className="h-4 w-4" /> {postStatus === "posting" ? "Posting..." : postStatus === "posted" ? "Posted" : "Post to community"}</Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg"><span className="inline-flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /> Notifications</span><Badge>{unreadCount} new</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`rounded-xl border px-3 py-2 text-sm ${n.unread ? "border-primary/30 bg-primary/5" : "border-border/70"}`}>
                <p className="font-medium">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No posts found. Start the first thread.</div>
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
                      <button onClick={() => likePost(post)} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"><ThumbsUp className="h-3.5 w-3.5" />{post.likes}</button>
                      <button onClick={() => toggleResolved(post)} className="rounded-full bg-muted/80 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted">{post.status === "open" ? "Mark resolved" : "Re-open"}</button>
                      <button onClick={() => reportPost(post)} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive"><TriangleAlert className="h-3.5 w-3.5" />Report ({post.reports})</button>
                    </div>

                    <div className="mt-4 rounded-xl border border-border/70 bg-background/70 p-3">
                      <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><MessageCircleReply className="h-3.5 w-3.5" /> Thread replies ({post.replies.length})</p>
                      <div className="space-y-2">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm">
                            <p className="font-medium">{reply.author}</p>
                            <p className="text-muted-foreground">{reply.body}</p>
                          </div>
                        ))}
                        {post.replies.length === 0 && <p className="text-sm text-muted-foreground">No replies yet. Be the first.</p>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Input aria-label={`Reply to ${post.title}`} value={replyDrafts[post.id] || ""} onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))} placeholder="Write a reply..." />
                        <Button onClick={() => addReply(post.id)} disabled={replyingPostId === post.id} size="sm">{replyingPostId === post.id ? "Replying..." : "Reply"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-card/90 p-4 text-sm text-muted-foreground">
        <ShieldAlert className="h-4 w-4 text-primary" /> Moderation enabled: reported threads are flagged for admin review.
      </div>
    </section>
  );
};

export default CommunityForum;
