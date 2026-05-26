"use client";

import { usePathname } from "next/navigation";

import { ChatWindow } from "@/features/chat/components/chat-window";
import { useChat } from "@/features/chat/chat-context";

export function ChatDock() {
  const { chats } = useChat();
  const pathname = usePathname();

  // Hide on /chat — the full chat center already shows the conversations.
  if (pathname?.startsWith("/chat") || chats.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 right-4 z-[60] flex items-end gap-3 md:right-6">
      {chats.map((session) => (
        <div key={session.peer.id} className="pointer-events-auto">
          <ChatWindow session={session} />
        </div>
      ))}
    </div>
  );
}
