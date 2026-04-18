import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { name: string; email: string };

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loaded: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "agentlab.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, _password: string) => {
    const name = email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) || "User";
    persist({ name, email });
  };

  const register = async (name: string, email: string, _password: string) => {
    persist({ name, email });
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, loaded }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
