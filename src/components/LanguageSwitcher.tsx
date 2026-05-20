import { Languages } from "lucide-react";
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

  const options: Array<{ value: UILanguage; code: string }> = [
    { value: "english", code: "EN" },
    { value: "amharic", code: "AM" },
    { value: "oromo", code: "OR" },
    { value: "tigrinya", code: "TG" },
  ];

  const current = options.find((opt) => opt.value === uiLanguage);

  return (
    <Select value={uiLanguage} onValueChange={(value) => setUiLanguage(value as UILanguage)}>
      <SelectTrigger
        className={`h-9 rounded-xl border border-border/70 bg-card/80 px-3 text-sm font-semibold shadow-sm focus:ring-1 focus:ring-primary/40 ${iconOnly ? "w-10 justify-center px-0" : "w-[150px]"} ${className}`}
        aria-label="Interface language"
      >
        {iconOnly ? (
          <Languages className="h-4 w-4 text-primary" />
        ) : (
          <div className="flex items-center gap-2 overflow-hidden">
            <Languages className="h-4 w-4 shrink-0 text-primary" />
            <span className="shrink-0 text-xs text-primary">{current?.code}</span>
            <SelectValue placeholder="Language" />
          </div>
        )}
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/70 bg-popover/95 p-1 backdrop-blur-md">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg py-2.5 pl-3 pr-2"
          >
            <span className="flex items-center gap-2">
              <span className="w-7 text-xs font-bold text-primary">{option.code}</span>
              <span>{languageLabel(option.value)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
      <span className="sr-only" aria-live="polite">
        {languageLabel(uiLanguage)} selected
      </span>
    </Select>
  );
};

export default LanguageSwitcher;
