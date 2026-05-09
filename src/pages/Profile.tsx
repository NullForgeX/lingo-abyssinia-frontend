import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Target, BookOpen, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/contexts/I18nContext";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { t, languageLabel } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    selectedLanguage: user?.selectedLanguage ?? "amharic",
    dailyGoal: user?.dailyGoal ?? 15,
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name,
      email: user.email,
      selectedLanguage: user.selectedLanguage,
      dailyGoal: user.dailyGoal,
    });
  }, [user]);

  const handleSave = () => {
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      selectedLanguage: form.selectedLanguage,
      dailyGoal: form.dailyGoal,
    });
    setIsEditing(false);
    setSavedMessage(t("profile.saved"));
    setTimeout(() => setSavedMessage(""), 2200);
  };

  return (
    <div className="mx-auto max-w-lg pb-20 md:pb-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {t("profile.title")}
        </h1>
        {!isEditing && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsEditing(true)}
          >
            <PencilLine className="h-4 w-4" />
            {t("profile.edit")}
          </Button>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card/95 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-card-foreground">
              {form.name || user?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {form.email || user?.email}
            </p>
          </div>
        </div>

        {savedMessage && (
          <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            {savedMessage}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div className="rounded-md bg-muted/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{t("auth.fullName")}</span>
            </div>
            {isEditing ? (
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="text-sm font-medium text-card-foreground">
                {form.name || "—"}
              </p>
            )}
          </div>

          <div className="rounded-md bg-muted/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{t("auth.email")}</span>
            </div>
            {isEditing ? (
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            ) : (
              <p className="text-sm font-medium text-card-foreground">
                {form.email || "—"}
              </p>
            )}
          </div>

          <div className="rounded-md bg-muted/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{t("profile.language")}</span>
            </div>
            {isEditing ? (
              <select
                value={form.selectedLanguage}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    selectedLanguage: e.target.value as
                      | "amharic"
                      | "oromo"
                      | "tigrinya",
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="amharic">{languageLabel("amharic")}</option>
                <option value="oromo">{languageLabel("oromo")}</option>
                <option value="tigrinya">{languageLabel("tigrinya")}</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-card-foreground">
                {languageLabel(form.selectedLanguage)}
              </p>
            )}
          </div>

          <div className="rounded-md bg-muted/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{t("profile.goal")}</span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="goal">{t("profile.goal")}</Label>
                <Input
                  id="goal"
                  type="number"
                  min={5}
                  max={60}
                  value={form.dailyGoal}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      dailyGoal: Number(e.target.value) || 5,
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-sm font-medium text-card-foreground">
                {form.dailyGoal} {t("profile.minutes")}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/language-selection" className="text-sm font-medium text-primary hover:underline">
            Language selection
          </Link>
          <Link to="/progress/streaks" className="text-sm font-medium text-primary hover:underline">
            Streak history
          </Link>
          <Link to="/progress/badges" className="text-sm font-medium text-primary hover:underline">
            Badge history
          </Link>
          <Link to="/progress/skills" className="text-sm font-medium text-primary hover:underline">
            Per-skill chart
          </Link>
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={handleSave}>
              {t("profile.save")}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              {t("profile.cancel")}
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          className="mt-6 w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={logout}
        >
          {t("app.logout")}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
