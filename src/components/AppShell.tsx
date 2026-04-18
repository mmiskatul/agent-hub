import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Bot, LayoutTemplate, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "My Agents", icon: Bot },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/chat", label: "Test Chat", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--gradient-subtle)" }}>
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block min-h-screen sticky top-0 h-screen">
          {SidebarInner}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar shadow-xl">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-md p-2 hover:bg-sidebar-accent"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              {SidebarInner}
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:hidden">
            <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <Logo />
          </header>
          <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
