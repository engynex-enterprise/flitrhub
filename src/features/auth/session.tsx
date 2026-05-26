"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserRole = "client" | "provider";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  avatar: string;
  role: UserRole;
}

interface SessionContextValue {
  user: SessionUser | null;
  isLoggedIn: boolean;
  isClient: boolean;
  isProvider: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: () => void;
}

const STORAGE_KEY = "flitrhub:session";

// Mock users — distinct names per role so the UI feels real.
const MOCK_CLIENT: SessionUser = {
  id: "u_client_carlos",
  name: "Carlos Andrés",
  email: "carlos.andres@flitrhub.com",
  phone: "+57 310 987 6543",
  city: "Bogotá",
  age: 32,
  avatar: "https://i.pravatar.cc/100?img=12",
  role: "client",
};

const MOCK_PROVIDER: SessionUser = {
  id: "u_provider_mia",
  name: "Mia Camila",
  email: "mia.camila@flitrhub.com",
  phone: "+57 300 123 4567",
  city: "Bogotá",
  age: 24,
  avatar: "https://i.pravatar.cc/100?img=47",
  role: "provider",
};

function readStored(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (!parsed || !parsed.role) return null;
    return parsed.role === "provider" ? MOCK_PROVIDER : MOCK_CLIENT;
  } catch {
    return null;
  }
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(readStored());
  }, []);

  const persist = (u: SessionUser | null) => {
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: u.role }));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const login = useCallback((role: UserRole) => {
    const next = role === "provider" ? MOCK_PROVIDER : MOCK_CLIENT;
    setUser(next);
    persist(next);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const switchRole = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = prev.role === "provider" ? MOCK_CLIENT : MOCK_PROVIDER;
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      isClient: user?.role === "client",
      isProvider: user?.role === "provider",
      login,
      logout,
      switchRole,
    }),
    [user, login, logout, switchRole]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
