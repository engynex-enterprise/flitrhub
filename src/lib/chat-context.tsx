"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface ChatPeer {
  id: string;
  name: string;
  imageUrl: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  at: number;
}

export interface ChatSession {
  peer: ChatPeer;
  messages: ChatMessage[];
  minimized: boolean;
  unread: number;
}

interface ChatContextValue {
  chats: ChatSession[];
  openChat: (peer: ChatPeer) => void;
  closeChat: (id: string) => void;
  toggleMinimize: (id: string) => void;
  sendMessage: (id: string, text: string) => void;
  markRead: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const STORAGE_KEY = "flitrhub:chats";

const AUTO_REPLIES = [
  "¡Hola! 😘 ¿Cómo puedo ayudarte?",
  "Estoy disponible ahora mismo, dime qué buscas.",
  "Claro, podemos coordinar. ¿Para qué horario te queda mejor?",
  "Tengo disponibilidad hoy en la tarde y noche.",
  "Sí, acepto WhatsApp, tarjeta y transferencia.",
  "Mándame tus datos por favor 💋",
];

const GREETING = "¡Hola! 😘 Estoy en línea, escríbeme.";

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function readStorage(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const skipNextWrite = useRef(false);

  // Hydrate from storage and listen to cross-tab updates via `storage` event.
  useEffect(() => {
    setChats(readStorage());

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      skipNextWrite.current = true;
      setChats(e.newValue ? (JSON.parse(e.newValue) as ChatSession[]) : []);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist on every change — except when the change came from another tab.
  useEffect(() => {
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
      /* ignore */
    }
  }, [chats]);

  const openChat = useCallback((peer: ChatPeer) => {
    setChats((prev) => {
      const existing = prev.find((c) => c.peer.id === peer.id);
      if (existing) {
        return [
          { ...existing, minimized: false, unread: 0 },
          ...prev.filter((c) => c.peer.id !== peer.id),
        ];
      }
      const newSession: ChatSession = {
        peer,
        minimized: false,
        unread: 0,
        messages: [
          { id: uid(), from: "them", text: GREETING, at: Date.now() },
        ],
      };
      return [newSession, ...prev];
    });
  }, []);

  const closeChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.peer.id !== id));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.peer.id === id
          ? { ...c, minimized: !c.minimized, unread: c.minimized ? 0 : c.unread }
          : c
      )
    );
  }, []);

  const markRead = useCallback((id: string) => {
    setChats((prev) =>
      prev.map((c) => (c.peer.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  const sendMessage = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setChats((prev) =>
      prev.map((c) =>
        c.peer.id === id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: uid(), from: "me", text: trimmed, at: Date.now() },
              ],
            }
          : c
      )
    );

    const replyText =
      AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    window.setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.peer.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: uid(), from: "them", text: replyText, at: Date.now() },
                ],
                unread: c.minimized ? c.unread + 1 : c.unread,
              }
            : c
        )
      );
    }, 900 + Math.random() * 900);
  }, []);

  const value = useMemo(
    () => ({ chats, openChat, closeChat, toggleMinimize, sendMessage, markRead }),
    [chats, openChat, closeChat, toggleMinimize, sendMessage, markRead]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
