import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeMode } from "@/contexts/ThemeContext";

type Props = {
  className?: string;
  iconOnly?: boolean;
};

const ThemeToggle = ({ className = "", iconOnly = false }: Props) => {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className={`group rounded-xl border-border/60 bg-card/70 text-foreground shadow-sm backdrop-blur-md transition hover:border-primary/40 hover:bg-card ${iconOnly ? "h-8 w-8 p-0" : "h-8 px-2.5"} ${className}`}
      aria-label="Toggle light and dark theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className={`inline-flex items-center ${iconOnly ? "justify-center" : "gap-2 text-xs font-semibold uppercase tracking-[0.14em]"}`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-primary" />
        ) : (
          <SunMedium className="h-4 w-4 text-primary" />
        )}
        {!iconOnly && (isDark ? "Dark" : "Light")}
      </span>
    </Button>
  );
};

export default ThemeToggle;
