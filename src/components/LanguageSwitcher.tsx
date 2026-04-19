import { Globe2 } from "lucide-react";
import { UILanguage, useI18n } from "@/contexts/I18nContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  className?: string;
  iconOnly?: boolean;
};

const LanguageSwitcher = ({ className = "", iconOnly = false }: Props) => {
  const { uiLanguage, setUiLanguage, languageLabel } = useI18n();

  const options: Array<{ value: UILanguage; flag: string }> = [
    { value: "english", flag: "EN" },
    { value: "amharic", flag: "አማ" },
    { value: "oromo", flag: "OR" },
    { value: "tigrinya", flag: "ትግ" },
  ];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 p-1.5 text-sm text-foreground shadow-sm backdrop-blur-md transition hover:border-primary/40 hover:shadow-md ${className}`}
    >
      {!iconOnly && (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
          <Globe2 className="h-4 w-4" />
        </span>
      )}
      <Select
        value={uiLanguage}
        onValueChange={(value) => setUiLanguage(value as UILanguage)}
      >
        <SelectTrigger
          className={`h-8 rounded-xl border-none bg-transparent text-sm font-semibold shadow-none focus:ring-1 focus:ring-primary/40 ${iconOnly ? "w-8 p-0" : "min-w-[160px] px-2"}`}
          aria-label="Interface language"
        >
          {iconOnly ? (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
              <Globe2 className="h-4 w-4" />
            </span>
          ) : (
            <SelectValue placeholder="Language" />
          )}
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/70 bg-popover/95 backdrop-blur-md">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg py-2.5 pl-3 pr-2"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-md bg-primary/10 px-1.5 text-[10px] font-bold tracking-wide text-primary">
                  {option.flag}
                </span>
                <span>{languageLabel(option.value)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="sr-only" aria-live="polite">
        {languageLabel(uiLanguage)} selected
      </span>
    </div>
  );
};

export default LanguageSwitcher;
