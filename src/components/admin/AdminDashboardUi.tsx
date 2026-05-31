import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  error?: string;
};

export const AdminPageHeader = ({
  eyebrow = "Admin workspace",
  title,
  description,
  icon: Icon,
  actions,
  error,
}: AdminPageHeaderProps) => (
  <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-secondary/10 p-6 shadow-sm md:p-8">
    <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
    <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
    <div className="relative flex flex-wrap items-start justify-between gap-5">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {Icon && <Icon className="h-4 w-4" />}
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
      </div>
      {actions && <div className="relative flex items-center gap-2">{actions}</div>}
    </div>
    {error && <p className="relative mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
  </section>
);

type AdminMetricCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  helper?: string;
  tone?: "primary" | "secondary" | "accent" | "emerald";
};

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent",
  emerald: "bg-emerald-500/10 text-emerald-500",
};

export const AdminMetricCard = ({ label, value, icon: Icon, helper, tone = "primary" }: AdminMetricCardProps) => (
  <div className="group rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">{value}</p>
        {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
      </div>
      <span className={cn("grid h-11 w-11 place-items-center rounded-2xl transition-transform group-hover:scale-105", toneClasses[tone])}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </div>
);
