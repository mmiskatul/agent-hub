import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Target, LifeBuoy, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  type Agent,
  type AgentTemplate,
  deleteAgent,
  newAgentId,
  TEMPLATES,
  upsertAgent,
} from "@/lib/data";

const ICONS = { smm: Sparkles, sales: Target, support: LifeBuoy } as const;

export function AgentForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Agent;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [purpose, setPurpose] = useState(initial?.purpose ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [template, setTemplate] = useState<AgentTemplate>(initial?.template ?? "custom");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [welcome, setWelcome] = useState(initial?.welcome ?? "");
  const [active, setActive] = useState((initial?.status ?? "draft") === "active");

  const save = (status: "draft" | "active") => {
    const id = initial?.id ?? newAgentId();
    const agent: Agent = {
      id,
      name: name || "Untitled Agent",
      role: role || "Assistant",
      purpose,
      description,
      template,
      instructions,
      welcome,
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    upsertAgent(agent);
    navigate({ to: "/agents" });
  };

  const handleDelete = () => {
    if (!initial) return;
    if (!confirm("Delete this agent?")) return;
    deleteAgent(initial.id);
    navigate({ to: "/agents" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "create" ? "Create new agent" : `Edit ${initial?.name}`}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Define your agent's purpose, behavior, and template.
          </p>
        </div>
        <div className="flex gap-2">
          {initial && (
            <Button variant="outline" asChild>
              <Link to="/chat" search={{ agent: initial.id }}>
                <MessageSquare className="h-4 w-4" /> Test Agent
              </Link>
            </Button>
          )}
          <Button variant="ghost" onClick={() => save("draft")}>Save Draft</Button>
          <Button onClick={() => save(active ? "active" : "draft")} style={{ background: "var(--gradient-primary)" }}>
            Save Agent
          </Button>
        </div>
      </div>

      <Section title="Basic Info" subtitle="Identify your agent.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Agent Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Brandi" />
          </Field>
          <Field label="Role">
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Social Media Manager" />
          </Field>
        </div>
        <Field label="Purpose">
          <Textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is this agent meant to do?" rows={3} />
        </Field>
        <Field label="Description (optional)">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add extra context or notes..." rows={2} />
        </Field>
      </Section>

      <Section title="Template" subtitle="Start from a preset or go fully custom.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEMPLATES.map((t) => {
            const Icon = ICONS[t.id as keyof typeof ICONS] ?? Sparkles;
            const selected = template === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  selected
                    ? "border-primary bg-accent shadow-[var(--shadow-glow)]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold">{t.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Custom Instructions" subtitle="Define how your agent should behave.">
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={8}
          placeholder="Define how your agent should behave..."
          className="font-mono text-sm"
        />
      </Section>

      <Section title="Optional Settings">
        <Field label="Welcome message">
          <Input value={welcome} onChange={(e) => setWelcome(e.target.value)} placeholder="Hi! How can I help you today?" />
        </Field>
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="font-medium">Status</p>
            <p className="text-xs text-muted-foreground">{active ? "Active — visible in Test Chat" : "Draft — hidden until activated"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Draft</span>
            <Switch checked={active} onCheckedChange={setActive} />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
        </div>
      </Section>

      {mode === "edit" && (
        <div className="flex justify-end">
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Delete Agent
          </Button>
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
