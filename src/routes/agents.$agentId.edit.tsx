import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { AgentForm } from "@/components/AgentForm";
import { loadAgents, type Agent } from "@/lib/data";

export const Route = createFileRoute("/agents/$agentId/edit")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <EditWrapper />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Edit Agent — AgentLab" }] }),
});

function EditWrapper() {
  const { agentId } = useParams({ from: "/agents/$agentId/edit" });
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    setAgent(loadAgents().find((a) => a.id === agentId) ?? null);
  }, [agentId]);

  if (!agent) {
    return <p className="text-muted-foreground">Agent not found.</p>;
  }
  return <AgentForm mode="edit" initial={agent} />;
}
