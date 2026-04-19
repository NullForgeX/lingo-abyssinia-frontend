import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { mockLogin } from "@/api/mockAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import InteractiveGeezBackground from "@/components/InteractiveGeezBackground";
import ThemeToggle from "@/components/ThemeToggle";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await mockLogin(data.email, data.password);
      login(result.user, result.token);
      navigate("/dashboard");
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

      {/* Left decorative panel */}
      <div className="hidden md:flex md:w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <InteractiveGeezBackground count={16} className="opacity-60" />
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
          <span className="text-8xl block mb-6">🇪🇹</span>
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            {t("auth.welcomeBack")}
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg">
            {t("auth.loginSubtitle")}
          </p>
        </motion.div>
      </div>

      {/* Form */}
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
            {t("auth.loginTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("auth.loginSubtitle")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
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
                {...register("password")}
                className="mt-1.5"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.signUpLink")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
