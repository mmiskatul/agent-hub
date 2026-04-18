import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RequireAuth>
      <AppShell>
        <SettingsPage />
      </AppShell>
    </RequireAuth>
  ),
  head: () => ({ meta: [{ title: "Settings — AgentLab" }] }),
});

function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile and account.</p>
      </div>

      <Card title="Profile" subtitle="Your personal information.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button style={{ background: "var(--gradient-primary)" }}>Save changes</Button>
        </div>
      </Card>

      <Card title="Change password" subtitle="Keep your account secure.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Current password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New password</Label>
            <Input type="password" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline">Update password</Button>
        </div>
      </Card>

      <Card title="Account" subtitle="Manage workspace preferences.">
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="font-medium">Email notifications</p>
            <p className="text-sm text-muted-foreground">Get product updates and tips.</p>
          </div>
          <Button variant="outline" size="sm">Enabled</Button>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div>
            <p className="font-medium text-destructive">Delete account</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10">Delete</Button>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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
