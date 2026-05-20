import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import LanguageCard from "@/components/LanguageCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Compass, Search, Sparkles } from "lucide-react";

const languages = [
  {
    key: "amharic" as const,
    language: "Amharic",
    greeting: "Selam",
    script: "A",
    description: "Official language of Ethiopia with broad media and education coverage.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Ge'ez script", "Formal + daily use", "Large content library"],
  },
  {
    key: "oromo" as const,
    language: "Afan Oromoo",
    greeting: "Nagaa",
    script: "O",
    description: "Most widely spoken language in Ethiopia with vibrant daily conversation usage.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Fast conversational gains", "Rich oral tradition", "Regional variety"],
  },
  {
    key: "tigrinya" as const,
    language: "Tigrinya",
    greeting: "Selam",
    script: "T",
    description: "Semitic language spoken across northern Ethiopia and Eritrea.",
    levels: ["beginner", "intermediate", "advanced"] as const,
    highlights: ["Ge'ez script depth", "Strong literary forms", "Cross-region context"],
  },
];

const levels = ["all", "beginner", "intermediate", "advanced"] as const;

type Level = (typeof levels)[number];

const LanguageSelection = () => {
  const { user, updateUser } = useAuth();
  const { languageLabel } = useI18n();
  const [selected, setSelected] = useState<"amharic" | "oromo" | "tigrinya">(user?.selectedLanguage ?? "amharic");
  const [saved, setSaved] = useState(false);
  const [level, setLevel] = useState<Level>("all");
  const [search, setSearch] = useState("");

  const saveLanguage = () => {
    updateUser({ selectedLanguage: selected });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const visible = useMemo(() => {
    return languages
      .filter((l) => (level === "all" ? true : l.levels.includes(level)))
      .filter((l) => `${l.language} ${l.description} ${l.highlights.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  }, [level, search]);

  return (
    <div className="mx-auto max-w-6xl pb-20 md:pb-0" aria-label="Language selection page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl inline-flex items-center gap-2"><Compass className="h-5 w-5 text-primary" /> Language Selection</h1>
          <p className="mt-2 text-sm text-muted-foreground">Discover languages by level and learning style, then set your active track.</p>
        </div>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">Back to dashboard</Link>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search languages" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by language or highlight" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => (
              <button key={lvl} onClick={() => setLevel(lvl)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${level === lvl ? "bg-primary text-primary-foreground" : "border border-border bg-background text-foreground"}`}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {visible.length === 0 ? (
          <div className="md:col-span-3 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No languages match your current filters.</div>
        ) : (
          visible.map((lang) => (
            <div key={lang.key} className="space-y-2">
              <LanguageCard
                language={lang.language}
                greeting={lang.greeting}
                script={lang.script}
                description={lang.description}
                selected={selected === lang.key}
                onClick={() => setSelected(lang.key)}
              />
              <div className="flex flex-wrap gap-2 px-1">
                {lang.levels.map((lvl) => (
                  <Badge key={lvl} variant="outline" className="capitalize">{lvl}</Badge>
                ))}
                {lang.highlights.map((h) => (
                  <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
        <Button onClick={saveLanguage} className="gap-2"><Sparkles className="h-4 w-4" /> Save Language</Button>
        <p className="text-sm text-muted-foreground">Current: {languageLabel(user?.selectedLanguage ?? "amharic")}</p>
      </div>

      {saved && <p className="mt-3 text-sm text-primary">Language updated successfully.</p>}
    </div>
  );
};

export default LanguageSelection;
