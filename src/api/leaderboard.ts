import { supabase } from "@/lib/supabase";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  language: string;
  xp: number;
  streak: number;
  badge: string;
  color?: string;
};

const labels: Record<string, string> = {
  amharic: "Amharic",
  oromo: "Afan Oromoo",
  tigrinya: "Tigrinya",
};

const badges: Record<string, string> = {
  amharic: "አ",
  oromo: "O",
  tigrinya: "ት",
};

const fallbackEntries: LeaderboardEntry[] = [
  { rank: 1, name: "Mira T.", language: "Amharic", xp: 1840, streak: 12, badge: "አ", color: "from-yellow-300/50 to-yellow-100/30" },
  { rank: 2, name: "Tesfaye K.", language: "Tigrinya", xp: 1320, streak: 8, badge: "ት", color: "from-zinc-300/50 to-zinc-100/30" },
  { rank: 3, name: "Amina S.", language: "Afan Oromoo", xp: 980, streak: 6, badge: "O", color: "from-orange-300/45 to-orange-100/30" },
  { rank: 4, name: "Yonas H.", language: "Amharic", xp: 640, streak: 4, badge: "አ" },
  { rank: 5, name: "Rahel M.", language: "Afan Oromoo", xp: 410, streak: 3, badge: "O" },
  { rank: 6, name: "Selam T.", language: "Tigrinya", xp: 280, streak: 2, badge: "ት" },
];

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,selected_language,streak,lesson_progress(xp_earned)")
    .eq("role", "learner");

  if (error || !data || data.length === 0) {
    return fallbackEntries;
  }

  const live = (data || [])
    .map((row: any) => ({
      name: row.name || "Learner",
      language: labels[row.selected_language] || "Amharic",
      xp: (row.lesson_progress || []).reduce((sum: number, item: any) => sum + (item.xp_earned || 0), 0),
      streak: row.streak || 0,
      badge: badges[row.selected_language] || "አ",
    }))
    .sort((a, b) => b.xp - a.xp || b.streak - a.streak)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      color: index === 0 ? "from-yellow-300/50 to-yellow-100/30" : index === 1 ? "from-zinc-300/50 to-zinc-100/30" : "from-orange-300/45 to-orange-100/30",
    }));

  return live.length >= 3 ? live : [...live, ...fallbackEntries.slice(live.length)].slice(0, 6);
};
