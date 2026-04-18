import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — AgentLab" }] }),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      <div className="hidden flex-1 flex-col justify-between p-12 text-primary-foreground lg:flex" style={{ background: "var(--gradient-hero)" }}>
        <Logo className="text-primary-foreground [&_span]:text-primary-foreground" />
        <div>
          <h2 className="text-4xl font-bold leading-tight">Build, test and ship your AI agents in one place.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            AgentLab gives you a clean workspace to create custom agents, iterate on prompts, and chat with them instantly.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">© AgentLab</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your AgentLab workspace.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox /> Remember me
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full" disabled={loading} style={{ background: "var(--gradient-primary)" }}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
