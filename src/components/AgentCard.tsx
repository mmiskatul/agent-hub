import { Link } from "@tanstack/react-router";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import type { Agent } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";

export function AgentCard({
  agent,
  onDelete,
}: {
  agent: Agent;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            {agent.name[0]}
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{agent.name}</h3>
            <p className="text-xs text-muted-foreground">{agent.role}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{agent.purpose}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground capitalize">
          {agent.template}
        </span>
        <span>· Updated {agent.updatedAt}</span>
      </div>
      <div className="mt-5 flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to="/chat" search={{ agent: agent.id }}>
            <MessageSquare className="h-4 w-4" /> Test
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/agents/$agentId/edit" params={{ agentId: agent.id }}>
            <Pencil className="h-4 w-4" /> Edit
          </Link>
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(agent.id)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
