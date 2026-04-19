import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquareQuote,
  PenLine,
  Lightbulb,
  Send,
  Users,
  ThumbsUp,
} from "lucide-react";

type PostType = "question" | "tip";

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
};

const seedPosts: ForumPost[] = [
  {
    id: 1,
    name: "Mira T.",
    initials: "MT",
    type: "question",
    title: "How do you remember ተ vs ቸ quickly?",
    body: "I keep mixing the shapes in writing drills. Any trick that helped you remember them faster?",
    language: "Amharic",
    likes: 28,
    time: "2m ago",
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
  },
];

const typeMeta: Record<
  PostType,
  { label: string; icon: typeof MessageSquareQuote; className: string }
> = {
  question: {
    label: "Question",
    icon: MessageSquareQuote,
    className: "bg-secondary/15 text-secondary-foreground",
  },
  tip: {
    label: "Tip",
    icon: Lightbulb,
    className: "bg-primary/15 text-primary",
  },
};

const CommunityForum = () => {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftType, setDraftType] = useState<PostType>("question");
  const [posts, setPosts] = useState(seedPosts);

  const stats = useMemo(
    () => [
      { label: "Active learners", value: "1.2k" },
      { label: "Tips shared", value: "356" },
      { label: "Questions answered", value: "91%" },
    ],
    [],
  );

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
    };

    setPosts((prev) => [newPost, ...prev]);
    setDraftTitle("");
    setDraftBody("");
    setDraftType("question");
  };

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Users className="h-3.5 w-3.5" />
            Community Forum
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
            Ask, share, and help others learn faster
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-right shadow-sm"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-display text-lg font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-xl backdrop-blur-sm">
        <CardHeader className="border-b border-border/70 bg-gradient-to-r from-primary/10 via-secondary/10 to-background">
          <CardTitle className="flex items-center gap-2 text-xl">
            <PenLine className="h-5 w-5 text-primary" />
            Post a question or language tip
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-5 md:p-6">
          <div className="grid gap-3 md:grid-cols-[160px_1fr]">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </span>
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-background p-2">
                {(["question", "tip"] as PostType[]).map((type) => {
                  const meta = typeMeta[type];
                  const Icon = meta.icon;
                  const active = draftType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDraftType(type)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title
              </span>
              <Input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Ask about pronunciation, grammar, or share a learning tip"
              />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Details
            </span>
            <Textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              placeholder="Write your question or tip in a friendly, helpful tone..."
              className="min-h-[120px] resize-none rounded-2xl border-border/70 bg-background"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {["Speaking", "Writing", "Vocabulary", "Grammar"].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              className="gap-2 rounded-2xl px-6 shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
              Share to community
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-4">
        {posts.map((post, index) => {
          const meta = typeMeta[post.type];
          const Icon = meta.icon;
          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 font-bold text-foreground">
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{post.name}</p>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider"
                    >
                      {post.language}
                    </Badge>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.className}`}
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.time}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.body}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {post.likes}
                    </button>
                    <button className="rounded-full bg-muted/80 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default CommunityForum;
