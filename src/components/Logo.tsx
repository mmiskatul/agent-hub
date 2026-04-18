export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight">AgentLab</span>
    </div>
  );
}
