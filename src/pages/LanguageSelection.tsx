import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import LanguageCard from "@/components/LanguageCard";

const languages = [
  {
    key: "amharic" as const,
    language: "Amharic",
    greeting: "Selam",
    script: "A",
    description: "Official language of Ethiopia",
  },
  {
    key: "oromo" as const,
    language: "Oromo",
    greeting: "Nagaa",
    script: "O",
    description: "Most widely spoken in Ethiopia",
  },
  {
    key: "tigrinya" as const,
    language: "Tigrinya",
    greeting: "Selam",
    script: "T",
    description: "Spoken in northern Ethiopia and Eritrea",
  },
];

const LanguageSelection = () => {
  const { user, updateUser } = useAuth();
  const { languageLabel } = useI18n();
  const [selected, setSelected] = useState<"amharic" | "oromo" | "tigrinya">(
    user?.selectedLanguage ?? "amharic",
  );
  const [saved, setSaved] = useState(false);

  const saveLanguage = () => {
    updateUser({ selectedLanguage: selected });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="mx-auto max-w-5xl pb-20 md:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Language Selection</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the language you want to focus on.
          </p>
        </div>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {languages.map((lang) => (
          <LanguageCard
            key={lang.key}
            language={lang.language}
            greeting={lang.greeting}
            script={lang.script}
            description={lang.description}
            selected={selected === lang.key}
            onClick={() => setSelected(lang.key)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={saveLanguage}>Save Language</Button>
        <p className="text-sm text-muted-foreground">Current: {languageLabel(user?.selectedLanguage ?? "amharic")}</p>
      </div>

      {saved && <p className="mt-3 text-sm text-primary">Language updated successfully.</p>}
    </div>
  );
};

export default LanguageSelection;
