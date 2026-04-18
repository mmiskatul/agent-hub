import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, MessageSquare, Activity, Plus, LayoutTemplate } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { StatsCard } from "@/components/StatsCard";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { loadAgents, RECENT_CHATS, type Agent } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Dashboard />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Dashboard — AgentLab" }] }),
});

function Dashboard() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    setAgents(loadAgents());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening across your agents today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/templates"><LayoutTemplate className="h-4 w-4" /> Open Templates</Link>
          </Button>
          <Button asChild style={{ background: "var(--gradient-primary)" }}>
            <Link to="/agents/new"><Plus className="h-4 w-4" /> Create New Agent</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Agents" value={agents.length} icon={Bot} hint="Across all templates" />
        <StatsCard label="Total Chats" value={142} icon={MessageSquare} hint="+12% this week" />
        <StatsCard label="Recent Activity" value="8 events" icon={Activity} hint="In the last 24h" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Agents</h2>
          <Link to="/agents" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {agents.slice(0, 4).map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent Chats</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <ul className="divide-y divide-border">
            {RECENT_CHATS.map((c, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {c.agent[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{c.agent}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.preview}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
