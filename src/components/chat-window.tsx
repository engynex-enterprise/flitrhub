"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Minus, Send, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  useChat,
  type ChatSession,
} from "@/lib/chat-context";

interface ChatWindowProps {
  session: ChatSession;
}

export function ChatWindow({ session }: ChatWindowProps) {
  const { toggleMinimize, closeChat, sendMessage, markRead } = useChat();
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session.minimized && session.unread > 0) markRead(session.peer.id);
  }, [session.minimized, session.unread, session.peer.id, markRead]);

  useEffect(() => {
    if (session.minimized) return;
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [session.messages, session.minimized]);

  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(session.peer.id, draft);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "flex w-[320px] flex-col overflow-hidden rounded-t-xl border border-b-0 bg-card shadow-2xl",
        session.minimized ? "h-[44px]" : "h-[440px]"
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => toggleMinimize(session.peer.id)}
        className="flex h-11 shrink-0 items-center gap-2 border-b bg-card px-3 text-left transition-colors hover:bg-accent"
      >
        <div className="relative">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.peer.imageUrl} alt="" />
            <AvatarFallback>{session.peer.name[0]}</AvatarFallback>
          </Avatar>
          {session.peer.isOnline && (
            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{session.peer.name}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {session.peer.isOnline ? "Activa ahora" : "Sin conexión"}
          </p>
        </div>
        {session.unread > 0 && session.minimized && (
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
            {session.unread}
          </span>
        )}
        <span className="flex items-center gap-0.5">
          <Link
            href={`/chat?peer=${encodeURIComponent(session.peer.id)}`}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Abrir en centro de chat"
            title="Abrir en centro de chat"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize(session.peer.id);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={session.minimized ? "Restaurar" : "Minimizar"}
          >
            <Minus className="h-3.5 w-3.5" />
          </span>
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              closeChat(session.peer.id);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Cerrar chat"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        </span>
      </button>

      {!session.minimized && (
        <>
          {/* Messages */}
          <div
            ref={messagesRef}
            className="scrollbar-hide flex-1 space-y-2 overflow-y-auto bg-background/40 px-3 py-3"
          >
            {session.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.from === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    m.from === "me"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex shrink-0 items-center gap-1.5 border-t bg-card px-2 py-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-full border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim()}
              aria-label="Enviar"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                draft.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
