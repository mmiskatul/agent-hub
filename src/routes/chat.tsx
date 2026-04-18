import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadAgents, type Agent } from "@/lib/data";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/chat")({
  validateSearch: (s: Record<string, unknown>) => ({
    agent: typeof s.agent === "string" ? s.agent : undefined,
  }),
  component: () => (
    <RequireAuth>
      <AppShell>
        <ChatPage />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Test Chat — AgentLab" }] }),
});

function ChatPage() {
  const search = Route.useSearch();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(search.agent);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = loadAgents();
    setAgents(list);
    if (!activeId && list.length) setActiveId(list[0].id);
  }, [activeId]);

  const active = useMemo(() => agents.find((a) => a.id === activeId), [agents, activeId]);

  useEffect(() => {
    if (!active) return;
    setMessages([
      {
        id: "w",
        role: "assistant",
        content: active.welcome || `Hi, I'm ${active.name}. How can I help?`,
      },
    ]);
  }, [active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !active) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", content: input };
    const reply: Msg = {
      id: String(Date.now() + 1),
      role: "assistant",
      content: `(${active.name}) Thanks! Here's a draft response based on your prompt: "${input}". I'd refine the tone for your audience and add a clear CTA.`,
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  const clear = () => {
    if (!active) return;
    setMessages([
      { id: "w", role: "assistant", content: active.welcome || `Hi, I'm ${active.name}. How can I help?` },
    ]);
  };

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] lg:h-[calc(100vh-5rem)]">
      <aside className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] lg:flex lg:flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-semibold">Agents</h2>
          <p className="text-xs text-muted-foreground">{agents.length} total</p>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {agents.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => setActiveId(a.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  a.id === activeId ? "bg-accent" : "hover:bg-muted/60"
                }`}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {a.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              {active?.name[0] ?? "?"}
            </div>
            <div>
              <p className="font-semibold leading-tight">{active?.name ?? "Select an agent"}</p>
              <p className="text-xs text-muted-foreground">{active?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={activeId ?? ""}
              onChange={(e) => setActiveId(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm lg:hidden"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} />
            ))}
          </div>
        </div>

        <div className="border-t border-border bg-background/60 p-3 sm:p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${active?.name ?? "agent"}...`}
              className="h-11"
            />
            <Button onClick={send} className="h-11" style={{ background: "var(--gradient-primary)" }}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-soft)] ${
            isUser
              ? "text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          }`}
          style={isUser ? { background: "var(--gradient-primary)" } : undefined}
        >
          {msg.content}
        </div>
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
            <button className="rounded-md p-1 hover:bg-muted" aria-label="Like"><ThumbsUp className="h-3.5 w-3.5" /></button>
            <button className="rounded-md p-1 hover:bg-muted" aria-label="Dislike"><ThumbsDown className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
