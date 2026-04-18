import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaded && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loaded, navigate]);

  if (!loaded || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
