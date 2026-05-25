"use client";

import { ChatProvider } from "@/lib/chat-context";
import { SessionProvider } from "@/lib/session";
import { ChatDock } from "@/components/chat-dock";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>
        {children}
        <ChatDock />
      </ChatProvider>
    </SessionProvider>
  );
}
