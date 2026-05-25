"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Send,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DiscreetCover } from "@/components/discreet-cover";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/chat-context";
import type { Post } from "@/lib/mock-posts";

interface StoryViewerProps {
  stories: Post[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const STORY_DURATION_MS = 5000;
const TICK_MS = 50;

export function StoryViewer({
  stories,
  initialIndex,
  open,
  onClose,
}: StoryViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const { openChat, sendMessage } = useChat();
  const inputFocusedRef = useRef(false);

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setProgress(0);
      setPaused(false);
      setDraft("");
    }
  }, [open, initialIndex]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i < stories.length - 1) {
        setProgress(0);
        return i + 1;
      }
      onClose();
      return i;
    });
  }, [stories.length, onClose]);

  const prev = useCallback(() => {
    setIndex((i) => {
      if (i > 0) {
        setProgress(0);
        return i - 1;
      }
      return i;
    });
  }, []);

  // Progress tick
  useEffect(() => {
    if (!open || paused) return;
    const step = (TICK_MS / STORY_DURATION_MS) * 100;
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p + step >= 100) {
          window.setTimeout(next, 0);
          return 0;
        }
        return p + step;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [open, paused, index, next]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (inputFocusedRef.current) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose]);

  if (!open) return null;
  const current = stories[index];
  if (!current) return null;

  const isLiked = !!liked[current.id];

  const submitMessage = () => {
    const text = draft.trim();
    if (!text) return;
    openChat({
      id: current.id,
      name: current.name,
      imageUrl: current.imageUrl,
      isOnline: current.isOnline,
    });
    sendMessage(current.id, text);
    setDraft("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Side nav (desktop) */}
      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        className="absolute left-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30 md:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-6 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Top bar with close (mobile) */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:right-6 md:top-6"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Story frame */}
      <div className="relative aspect-[9/16] h-full max-h-[92vh] w-auto max-w-[420px] overflow-hidden rounded-xl bg-black shadow-2xl">
        {/* Progress bars */}
        <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
          {stories.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="h-full bg-white transition-[width] duration-75 ease-linear"
                style={{
                  width:
                    i < index
                      ? "100%"
                      : i === index
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute inset-x-3 top-7 z-20 flex items-center gap-2 pt-2">
          <Avatar className="h-8 w-8 ring-2 ring-white/30">
            <AvatarImage src={current.imageUrl} alt="" />
            <AvatarFallback>{current.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate text-sm font-semibold text-white">
                {current.name}
              </p>
              {current.verified && (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-sky-400 text-white" />
              )}
            </div>
            <p className="text-[10px] text-white/70">
              {current.isOnline ? "En línea · ahora" : "hace 2 h"} · {current.location}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
            aria-label={paused ? "Reanudar" : "Pausar"}
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Image */}
        <Image
          src={current.imageUrl}
          alt={current.name}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          priority
        />
        <DiscreetCover size="lg" />

        {/* Bottom gradient + tap zones */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 to-transparent" />

        <button
          type="button"
          onClick={prev}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          className="absolute left-0 top-0 z-10 h-full w-1/3"
          aria-label="Anterior"
        />
        <button
          type="button"
          onClick={next}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          className="absolute right-0 top-0 z-10 h-full w-1/3"
          aria-label="Siguiente"
        />

        {/* Bottom action bar */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onFocus={() => {
              inputFocusedRef.current = true;
              setPaused(true);
            }}
            onBlur={() => {
              inputFocusedRef.current = false;
              setPaused(false);
            }}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitMessage();
            }}
            placeholder={`Enviar mensaje a ${current.name.split(" ")[0]}...`}
            className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/60 backdrop-blur focus:border-white/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={() =>
              setLiked((m) => ({ ...m, [current.id]: !m[current.id] }))
            }
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20",
              isLiked && "text-rose-400"
            )}
            aria-label="Me gusta"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-rose-400")} />
          </button>
          {draft.trim() ? (
            <button
              type="button"
              onClick={submitMessage}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link
                href={`/profile/${encodeURIComponent(current.id)}`}
                aria-label="Ver perfil"
                onClick={onClose}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Floating chat CTA (only when online) */}
        {current.isOnline && !draft && (
          <button
            type="button"
            onClick={() => {
              openChat({
                id: current.id,
                name: current.name,
                imageUrl: current.imageUrl,
                isOnline: current.isOnline,
              });
              onClose();
            }}
            className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Abrir chat
          </button>
        )}
      </div>
    </div>
  );
}
