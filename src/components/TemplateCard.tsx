import { Sparkles, Target, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentTemplate } from "@/lib/data";

const ICONS = { Sparkles, Target, LifeBuoy } as const;

export function TemplateCard({
  icon,
  title,
  description,
  example,
  onUse,
}: {
  icon: keyof typeof ICONS;
  title: string;
  description: string;
  example?: string;
  onUse?: () => void;
}) {
  const Icon = ICONS[icon];
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-card)]">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {example && (
        <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Example: </span>
          {example}
        </p>
      )}
      <Button onClick={onUse} className="mt-5 w-full" variant="outline">
        Use Template
      </Button>
    </div>
  );
}

export function templateIconFor(t: AgentTemplate): keyof typeof ICONS {
  if (t === "smm") return "Sparkles";
  if (t === "sales") return "Target";
  return "LifeBuoy";
}
