import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { signUpWithPassword } from "@/api/supabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import InteractiveGeezBackground from "@/components/InteractiveGeezBackground";
import ThemeToggle from "@/components/ThemeToggle";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[a-z]/, "Add at least one lowercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { label: "One symbol for extra strength", test: (value: string) => /[^A-Za-z0-9]/.test(value), optional: true },
];

const strengthLabels = ["Very weak", "Weak", "Okay", "Good", "Strong"];

const Signup = () => {
  const { setSessionUser } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password") || "";
  const strength = useMemo(() => {
    const passed = passwordRules.filter((rule) => rule.test(password)).length;
    const score = Math.min(4, Math.max(0, passed - 1));
    return {
      score,
      label: password ? strengthLabels[score] : "Start typing",
      percent: password ? Math.max(12, ((score + 1) / 5) * 100) : 0,
    };
  }, [password]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setFormError("");
    setMessage("");
    try {
      const result = await signUpWithPassword(data.name, data.email, data.password);
      setSessionUser(result.user, result.session.access_token, result.onboarded);
      navigate("/onboarding");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="absolute right-4 top-4 z-30">
        <div className="flex items-center gap-2">
          <ThemeToggle iconOnly className="sm:hidden" />
          <LanguageSwitcher iconOnly className="sm:hidden" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <LanguageSwitcher className="hidden sm:inline-flex" />
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <InteractiveGeezBackground count={18} className="opacity-60" />
        <motion.div
          className="absolute -left-12 top-10 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-primary-foreground/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-12"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            {t("auth.startLearningToday")}
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg">
            {t("auth.signupSubtitle")}
          </p>
        </motion.div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl backdrop-blur-sm sm:p-8"
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {t("app.backHome")}
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-foreground">
            {t("auth.signupTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("auth.signupSubtitle")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {formError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}
            {message && (
              <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
                {message}
              </p>
            )}
            <div>
              <Label htmlFor="name">{t("auth.fullName")}</Label>
              <Input
                id="name"
                autoComplete="name"
                {...register("name")}
                className="mt-1.5"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="mt-1.5"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className="mt-1.5"
                placeholder="••••••••"
              />
              <div className="mt-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Password strength</span>
                  <span className={strength.score >= 3 ? "text-primary" : "text-muted-foreground"}>{strength.label}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${strength.score >= 3 ? "bg-primary" : strength.score >= 2 ? "bg-secondary" : "bg-destructive"}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <div className="mt-3 grid gap-1.5 text-xs">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <p key={rule.label} className={passed ? "text-primary" : "text-muted-foreground"}>
                        {passed ? "✓" : "○"} {rule.label}{rule.optional ? " (optional)" : ""}
                      </p>
                    );
                  })}
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">
                {t("auth.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="mt-1.5"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? t("auth.creatingAccount") : t("auth.signupButton")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")} {" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.logInLink")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;