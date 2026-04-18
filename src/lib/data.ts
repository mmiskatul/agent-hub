export type AgentTemplate = "smm" | "sales" | "support" | "custom";
export type AgentStatus = "draft" | "active";

export type Agent = {
  id: string;
  name: string;
  role: string;
  purpose: string;
  description?: string;
  template: AgentTemplate;
  instructions: string;
  welcome?: string;
  status: AgentStatus;
  updatedAt: string;
};

export const TEMPLATES: {
  id: AgentTemplate;
  title: string;
  short: string;
  description: string;
  example: string;
  icon: string;
}[] = [
  {
    id: "smm",
    title: "SMM Agent",
    short: "Content creation",
    description: "Crafts on-brand social posts, captions, and content calendars.",
    example: "Generate a week of LinkedIn posts for a B2B SaaS launch.",
    icon: "Sparkles",
  },
  {
    id: "sales",
    title: "Sales Agent",
    short: "Lead response",
    description: "Qualifies leads and replies with tailored outreach copy.",
    example: "Respond to inbound demo requests with personalized follow-ups.",
    icon: "Target",
  },
  {
    id: "support",
    title: "Support Agent",
    short: "Q&A assistant",
    description: "Answers product questions using a friendly support tone.",
    example: "Resolve common billing and onboarding tickets instantly.",
    icon: "LifeBuoy",
  },
];

export const SEED_AGENTS: Agent[] = [
  {
    id: "a1",
    name: "Brandi",
    role: "Social Media Manager",
    purpose: "Plan and write engaging posts across LinkedIn and X.",
    template: "smm",
    instructions: "You are Brandi, a witty SMM expert. Keep posts under 280 chars.",
    welcome: "Hey! Ready to ship some posts?",
    status: "active",
    updatedAt: "2025-04-12",
  },
  {
    id: "a2",
    name: "Closer",
    role: "Sales SDR",
    purpose: "Reply to inbound leads and book qualified demos.",
    template: "sales",
    instructions: "You are Closer, a concise B2B SDR. Always end with a CTA.",
    status: "active",
    updatedAt: "2025-04-10",
  },
  {
    id: "a3",
    name: "Helpie",
    role: "Customer Support",
    purpose: "Answer product questions in a warm, helpful tone.",
    template: "support",
    instructions: "You are Helpie. Be empathetic and offer next steps.",
    status: "draft",
    updatedAt: "2025-04-08",
  },
  {
    id: "a4",
    name: "Researcher",
    role: "Market Analyst",
    purpose: "Summarize competitors and market positioning.",
    template: "custom",
    instructions: "You are a sharp analyst. Be structured and cite assumptions.",
    status: "active",
    updatedAt: "2025-04-05",
  },
];

const KEY = "agentlab.agents";

export function loadAgents(): Agent[] {
  if (typeof window === "undefined") return SEED_AGENTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED_AGENTS));
      return SEED_AGENTS;
    }
    return JSON.parse(raw) as Agent[];
  } catch {
    return SEED_AGENTS;
  }
}

export function saveAgents(agents: Agent[]) {
  localStorage.setItem(KEY, JSON.stringify(agents));
}

export function upsertAgent(agent: Agent) {
  const list = loadAgents();
  const idx = list.findIndex((a) => a.id === agent.id);
  if (idx >= 0) list[idx] = agent;
  else list.unshift(agent);
  saveAgents(list);
}

export function deleteAgent(id: string) {
  saveAgents(loadAgents().filter((a) => a.id !== id));
}

export function newAgentId() {
  return "a" + Math.random().toString(36).slice(2, 9);
}

export const RECENT_CHATS = [
  { agent: "Brandi", preview: "Drafted 5 LinkedIn posts for the launch...", time: "2h ago" },
  { agent: "Closer", preview: "Sent personalized reply to Acme demo lead.", time: "5h ago" },
  { agent: "Helpie", preview: "Resolved a billing question for user 1284.", time: "1d ago" },
  { agent: "Researcher", preview: "Summary of 3 top competitors ready.", time: "2d ago" },
];
