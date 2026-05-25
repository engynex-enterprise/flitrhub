"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  avatar: string;
}

interface SessionContextValue {
  user: SessionUser | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const STORAGE_KEY = "flitrhub:session";

// Mock user used to demo prefill / auto-login flows. In production this would
// come from the auth provider once flitrhub-api is wired up.
const MOCK_USER: SessionUser = {
  id: "u_mia_camila",
  name: "Mia Camila",
  email: "mia.camila@flitrhub.com",
  phone: "+57 300 123 4567",
  city: "Bogotá",
  age: 24,
  avatar: "https://i.pravatar.cc/100?img=47",
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "1") setUser(MOCK_USER);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(() => {
    setUser(MOCK_USER);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: user !== null, login, logout }),
    [user, login, logout]
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
