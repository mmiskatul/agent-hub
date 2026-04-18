import type { AgentStatus } from "@/lib/data";

export function StatusBadge({ status }: { status: AgentStatus }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`} />
      {isActive ? "Active" : "Draft"}
    </span>
  );
}
