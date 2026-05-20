import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export type PostType = "question" | "tip";
export type CommunityLanguage = "Amharic" | "Afan Oromoo" | "Tigrinya";
export type LanguageCode = "amharic" | "oromo" | "tigrinya";

export type CommunityReply = {
  id: string;
  author: string;
  body: string;
  time: string;
};

export type CommunityPost = {
  id: string;
  name: string;
  initials: string;
  type: PostType;
  title: string;
  body: string;
  language: CommunityLanguage;
  languageCode: LanguageCode;
  likes: number;
  time: string;
  status: "open" | "resolved";
  replies: CommunityReply[];
  reports: number;
};

type PostRow = {
  id: string;
  author_id: string;
  type: PostType;
  title: string;
  body: string;
  language: LanguageCode;
  status: "open" | "resolved";
  likes: number | null;
  reports: number | null;
  created_at: string;
};

type ReplyRow = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
};

const languageLabels: Record<LanguageCode, CommunityLanguage> = {
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "LA";

const relativeTime = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const fallbackPosts: CommunityPost[] = [
  {
    id: "seed-1",
    name: "Mira T.",
    initials: "MT",
    type: "question",
    title: "How do I remember greetings faster?",
    body: "Selam is sticking, but I still mix up thank-you phrases. Any mnemonic tips?",
    language: "Amharic",
    languageCode: "amharic",
    likes: 8,
    time: "12m ago",
    status: "open",
    replies: [
      { id: "seed-1-r1", author: "Tesfaye", body: "I link greetings to morning routine words.", time: "8m ago" },
      { id: "seed-1-r2", author: "Rahel", body: "Flashcards with audio helped me a lot.", time: "5m ago" },
    ],
    reports: 0,
  },
  {
    id: "seed-2",
    name: "Amina S.",
    initials: "AS",
    type: "tip",
    title: "Practice one short sentence every day",
    body: "A 10-second spoken intro in Afan Oromoo has made my pronunciation much better.",
    language: "Afan Oromoo",
    languageCode: "oromo",
    likes: 5,
    time: "35m ago",
    status: "open",
    replies: [{ id: "seed-2-r1", author: "Mekonnen", body: "Same here — recording myself showed my progress.", time: "18m ago" }],
    reports: 0,
  },
  {
    id: "seed-3",
    name: "Selam T.",
    initials: "ST",
    type: "question",
    title: "Which Tigrinya lesson should I start with?",
    body: "I’m new and want a good first lesson path that feels practical.",
    language: "Tigrinya",
    languageCode: "tigrinya",
    likes: 4,
    time: "1h ago",
    status: "open",
    replies: [{ id: "seed-3-r1", author: "Martha", body: "Start with greetings, then numbers and family words.", time: "42m ago" }],
    reports: 0,
  },
];

const profileName = (profile?: ProfileRow, fallback = "Learner") =>
  profile?.name || profile?.email?.split("@")[0] || fallback;

export const ensureCommunityProfile = async (user: User) => {
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: user.name || user.email.split("@")[0] || "Learner",
    email: user.email,
    role: user.role || "learner",
    selected_language: user.selectedLanguage || "amharic",
    daily_goal: user.dailyGoal || 15,
    streak: user.streak || 0,
    gems: user.gems || 0,
  });

  if (error) throw error;
};

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  const { data: postRows, error: postError } = await supabase
    .from("community_posts")
    .select("id,author_id,type,title,body,language,status,likes,reports,created_at")
    .order("created_at", { ascending: false });

  if (postError) throw postError;
  if (!postRows || postRows.length === 0) return fallbackPosts;

  const posts = postRows as PostRow[];
  const postIds = posts.map((post) => post.id);
  const authorIds = Array.from(new Set(posts.map((post) => post.author_id)));

  const [{ data: replyRows, error: replyError }, { data: profileRows, error: profileError }] = await Promise.all([
    supabase
      .from("community_replies")
      .select("id,post_id,author_id,body,created_at")
      .in("post_id", postIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("id,name,email")
      .in("id", authorIds),
  ]);

  if (replyError) throw replyError;
  if (profileError) throw profileError;

  const replies = (replyRows || []) as ReplyRow[];
  const replyAuthorIds = replies.map((reply) => reply.author_id);
  const missingReplyAuthorIds = replyAuthorIds.filter((id) => !authorIds.includes(id));

  let replyProfiles: ProfileRow[] = [];
  if (missingReplyAuthorIds.length > 0) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,name,email")
      .in("id", Array.from(new Set(missingReplyAuthorIds)));
    if (error) throw error;
    replyProfiles = (data || []) as ProfileRow[];
  }

  const profiles = new Map(
    [...((profileRows || []) as ProfileRow[]), ...replyProfiles].map((profile) => [profile.id, profile]),
  );

  return posts.map((post) => {
    const name = profileName(profiles.get(post.author_id));
    const postReplies = replies.filter((reply) => reply.post_id === post.id);
    return {
      id: post.id,
      name,
      initials: initials(name),
      type: post.type,
      title: post.title,
      body: post.body,
      language: languageLabels[post.language] || "Amharic",
      languageCode: post.language,
      likes: post.likes || 0,
      time: relativeTime(post.created_at),
      status: post.status,
      reports: post.reports || 0,
      replies: postReplies.map((reply) => ({
        id: reply.id,
        author: profileName(profiles.get(reply.author_id)),
        body: reply.body,
        time: relativeTime(reply.created_at),
      })),
    };
  });
};

export const createCommunityPost = async (
  user: User,
  input: { type: PostType; title: string; body: string },
): Promise<CommunityPost> => {
  await ensureCommunityProfile(user);

  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: user.id,
      type: input.type,
      title: input.title,
      body: input.body,
      language: user.selectedLanguage,
    })
    .select("id,author_id,type,title,body,language,status,likes,reports,created_at")
    .single();

  if (error) throw error;

  const post = data as PostRow;
  return {
    id: post.id,
    name: user.name || "You",
    initials: initials(user.name || "You"),
    type: post.type,
    title: post.title,
    body: post.body,
    language: languageLabels[post.language] || "Amharic",
    languageCode: post.language,
    likes: post.likes || 0,
    time: "just now",
    status: post.status,
    replies: [],
    reports: post.reports || 0,
  };
};

export const createCommunityReply = async (
  user: User,
  postId: string,
  body: string,
): Promise<CommunityReply> => {
  await ensureCommunityProfile(user);

  const { data, error } = await supabase
    .from("community_replies")
    .insert({
      post_id: postId,
      author_id: user.id,
      body,
    })
    .select("id,body,created_at")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    author: user.name || "You",
    body: data.body,
    time: "just now",
  };
};

export const updateCommunityPostStatus = async (
  postId: string,
  status: CommunityPost["status"],
) => {
  const { error } = await supabase
    .from("community_posts")
    .update({ status })
    .eq("id", postId);

  if (error) throw error;
};

export const reportCommunityPost = async (user: User, post: CommunityPost) => {
  await ensureCommunityProfile(user);

  const { error } = await supabase.from("moderation_reports").insert({
    reporter_id: user.id,
    post_id: post.id,
    reason: "Reported by learner",
  });

  if (error) throw error;
};

export const likeCommunityPost = async (post: CommunityPost) => {
  const { error } = await supabase
    .from("community_posts")
    .update({ likes: post.likes + 1 })
    .eq("id", post.id);

  if (error) throw error;
};
