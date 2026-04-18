import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { TemplateCard, templateIconFor } from "@/components/TemplateCard";
import { TEMPLATES } from "@/lib/data";

export const Route = createFileRoute("/templates")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <TemplatesPage />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Templates — AgentLab" }] }),
});

function TemplatesPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="mt-1 text-muted-foreground">
          Jump-start your next agent with a battle-tested template.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <TemplateCard
            key={t.id}
            icon={templateIconFor(t.id)}
            title={t.title}
            description={t.description}
            example={t.example}
            onUse={() => navigate({ to: "/agents/new" })}
          />
        ))}
      </div>
    </div>
  );
}
