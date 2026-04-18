import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteAgent, loadAgents, type Agent } from "@/lib/data";

export const Route = createFileRoute("/agents/")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <AgentsPage />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "My Agents — AgentLab" }] }),
});

function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setAgents(loadAgents());
  }, []);

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.role.toLowerCase().includes(q.toLowerCase());
      const matchesF =
        filter === "all" ||
        (filter === "active" && a.status === "active") ||
        (filter === "draft" && a.status === "draft") ||
        a.template === filter;
      return matchesQ && matchesF;
    });
  }, [agents, q, filter]);

  const onDelete = (id: string) => {
    if (!confirm("Delete this agent?")) return;
    deleteAgent(id);
    setAgents(loadAgents());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Agents</h1>
          <p className="mt-1 text-muted-foreground">Manage and iterate on your AI agents.</p>
        </div>
        <Button asChild style={{ background: "var(--gradient-primary)" }}>
          <Link to="/agents/new"><Plus className="h-4 w-4" /> Create Agent</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents..." className="pl-9" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="smm">SMM Template</SelectItem>
            <SelectItem value="sales">Sales Template</SelectItem>
            <SelectItem value="support">Support Template</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No agents match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AgentCard key={a.id} agent={a} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
