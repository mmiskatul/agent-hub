import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { AgentForm } from "@/components/AgentForm";

export const Route = createFileRoute("/agents/new")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <AgentForm mode="create" />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Create Agent — AgentLab" }] }),
});
