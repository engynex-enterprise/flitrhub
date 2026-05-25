"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  MoreVertical,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  hasSeededExamples,
  useChat,
  type ChatSession,
} from "@/lib/chat-context";

export function ChatCenter() {
  const {
    chats,
    sendMessage,
    markRead,
    closeChat,
    seedExamples,
    hydrated,
  } = useChat();
  const searchParams = useSearchParams();
  const requestedPeerId = searchParams.get("peer");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  // First visit: auto-seed example chats so the page is never empty.
  useEffect(() => {
    if (!hydrated) return;
    if (chats.length === 0 && !hasSeededExamples()) {
      seedExamples();
    }
  }, [hydrated, chats.length, seedExamples]);

  // Initial selection — prefer ?peer=... from query, else first chat.
  useEffect(() => {
    if (selectedId) return;
    if (requestedPeerId && chats.find((c) => c.peer.id === requestedPeerId)) {
      setSelectedId(requestedPeerId);
    } else if (chats.length > 0) {
      setSelectedId(chats[0].peer.id);
    }
  }, [chats, requestedPeerId, selectedId]);

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => c.peer.name.toLowerCase().includes(q));
  }, [chats, search]);

  const selected = useMemo(
    () => chats.find((c) => c.peer.id === selectedId) ?? null,
    [chats, selectedId]
  );

  useEffect(() => {
    if (selected && selected.unread > 0) markRead(selected.peer.id);
  }, [selected, markRead]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selected?.messages]);

  const submit = () => {
    if (!selected || !draft.trim()) return;
    sendMessage(selected.peer.id, draft);
    setDraft("");
  };

  return (
    <div className="flex h-screen min-h-0 flex-col bg-background">
      {/* Top brand bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Inicio
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <MessageSquare className="h-4 w-4 text-primary" />
          Centro de chat
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {chats.length === 0
            ? "Sin conversaciones"
            : `${chats.length} conversación${chats.length === 1 ? "" : "es"}`}
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar — chat list */}
        <aside className="flex w-80 shrink-0 flex-col border-r bg-card/40">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar conversación..."
                className="pl-9"
              />
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-xs text-muted-foreground">
              {chats.length === 0
                ? "Abre el chat de un perfil online para empezar."
                : "Ningún chat coincide con tu búsqueda."}
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-border/40 overflow-y-auto">
              {filteredChats.map((c) => (
                <ChatListItem
                  key={c.peer.id}
                  session={c}
                  selected={c.peer.id === selectedId}
                  onSelect={() => setSelectedId(c.peer.id)}
                />
              ))}
            </ul>
          )}
        </aside>

        {/* Main panel */}
        <section className="flex min-w-0 flex-1 flex-col">
          {selected ? (
            <>
              {/* Conversation header */}
              <div className="flex h-16 shrink-0 items-center gap-3 border-b bg-card/40 px-4">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selected.peer.imageUrl} alt="" />
                    <AvatarFallback>{selected.peer.name[0]}</AvatarFallback>
                  </Avatar>
                  {selected.peer.isOnline && (
                    <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {selected.peer.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected.peer.isOnline ? "Activa ahora" : "Sin conexión"}
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                  <Link href={`/profile/${encodeURIComponent(selected.peer.id)}`} target="_blank">
                    Ver perfil
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" aria-label="Videollamada">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Llamar">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Más"
                  onClick={() => closeChat(selected.peer.id)}
                  title="Cerrar conversación"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div
                ref={messagesRef}
                className="flex-1 space-y-2 overflow-y-auto bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.04),transparent_60%)] px-6 py-6"
              >
                {selected.messages.map((m, i) => {
                  const prev = selected.messages[i - 1];
                  const showAvatar =
                    m.from === "them" && (!prev || prev.from !== "them");
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex items-end gap-2",
                        m.from === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      {m.from === "them" &&
                        (showAvatar ? (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={selected.peer.imageUrl} alt="" />
                            <AvatarFallback>
                              {selected.peer.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-7 shrink-0" />
                        ))}
                      <div
                        className={cn(
                          "max-w-[65%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                          m.from === "me"
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-card text-foreground"
                        )}
                      >
                        {m.text}
                        <div
                          className={cn(
                            "mt-1 text-[10px] opacity-70",
                            m.from === "me" ? "text-right" : "text-left"
                          )}
                        >
                          {formatTime(m.at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className="flex shrink-0 items-center gap-2 border-t bg-card/40 px-4 py-3">
                <Button variant="ghost" size="icon" aria-label="Emoji">
                  <Smile className="h-5 w-5" />
                </Button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  variant="brand"
                  size="icon"
                  onClick={submit}
                  disabled={!draft.trim()}
                  aria-label="Enviar"
                  className="rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <EmptyState onLoadExamples={seedExamples} />
          )}
        </section>
      </div>
    </div>
  );
}

function ChatListItem({
  session,
  selected,
  onSelect,
}: {
  session: ChatSession;
  selected: boolean;
  onSelect: () => void;
}) {
  const last = session.messages[session.messages.length - 1];
  const preview = last
    ? `${last.from === "me" ? "Tú: " : ""}${last.text}`
    : "Sin mensajes";

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
          selected ? "bg-primary/10" : "hover:bg-accent"
        )}
      >
        <div className="relative shrink-0">
          <Avatar className="h-11 w-11">
            <AvatarImage src={session.peer.imageUrl} alt="" />
            <AvatarFallback>{session.peer.name[0]}</AvatarFallback>
          </Avatar>
          {session.peer.isOnline && (
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{session.peer.name}</p>
            {last && (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatTime(last.at)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate text-xs",
                session.unread > 0
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {preview}
            </p>
            {session.unread > 0 && (
              <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {session.unread}
              </span>
            )}
          </div>
        </div>
      </button>
    </li>
  );
}

function EmptyState({ onLoadExamples }: { onLoadExamples: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MessageSquare className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-xl font-bold">Centro de chat</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Aquí podrás continuar todas tus conversaciones con perfiles en línea.
        Abre el chat de un perfil para que aparezca en esta vista.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="brand" onClick={onLoadExamples}>
          Cargar chats de ejemplo
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Explorar perfiles</Link>
        </Button>
      </div>
    </div>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
