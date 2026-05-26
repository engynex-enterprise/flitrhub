"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ServiceKey } from "@/features/posts/data/services";

interface DiscreetContextValue {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
}

const DiscreetContext = createContext<DiscreetContextValue | null>(null);

const STORAGE_KEY = "flitrhub:discreet";
const BODY_CLASS = "discreet-mode";

export function DiscreetProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setEnabled(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (enabled) document.body.classList.add(BODY_CLASS);
    else document.body.classList.remove(BODY_CLASS);
    try {
      if (enabled) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  const value = useMemo(
    () => ({ enabled, toggle, setEnabled }),
    [enabled, toggle]
  );

  return (
    <DiscreetContext.Provider value={value}>
      {children}
    </DiscreetContext.Provider>
  );
}

export function useDiscreet(): DiscreetContextValue {
  const ctx = useContext(DiscreetContext);
  if (!ctx) throw new Error("useDiscreet must be used inside <DiscreetProvider>");
  return ctx;
}

/**
 * Neutral labels used in discreet mode to disguise the service categories
 * from someone glancing at the user's screen.
 */
const DISCREET_LABELS: Record<ServiceKey, string> = {
  masajes: "Spa & Wellness",
  prepagos: "Premium VIP",
  trans: "Especial",
  "escorts-gay": "Comunidad",
  gigolos: "Acompañamiento",
  webcam: "Streaming",
  strippers: "Eventos",
  parejas: "Dúo",
  despedidas: "Celebraciones",
  fetiches: "Exclusivo",
  contactos: "Networking",
};

export function discreetLabel(key: ServiceKey): string {
  return DISCREET_LABELS[key] ?? "Listing";
}
