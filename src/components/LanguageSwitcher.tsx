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
    { value: "oromo", code: "AO" },
    { value: "tigrinya", code: "TG" },
  ];

  return (
    <div className={`inline-flex ${className}`}>
      <Select value={uiLanguage} onValueChange={(value) => setUiLanguage(value as UILanguage)}>
        <SelectTrigger
          className={`${iconOnly ? "h-9 w-12" : "h-9 w-16"} rounded-lg border border-border/70 bg-card px-2 text-xs font-bold text-foreground shadow-sm focus:ring-1 focus:ring-primary/40`}
          aria-label="Interface language"
        >
          <SelectValue placeholder="EN" />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-[128px] rounded-lg border-border/70 bg-popover p-1">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="rounded-md py-2 pl-3 pr-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-6 text-xs font-bold text-primary">{option.code}</span>
                <span>{languageLabel(option.value)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
        <span className="sr-only" aria-live="polite">
          {languageLabel(uiLanguage)} selected
        </span>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;