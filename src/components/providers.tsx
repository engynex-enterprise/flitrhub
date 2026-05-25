"use client";

import { ChatProvider } from "@/lib/chat-context";
import { DiscreetProvider } from "@/lib/discreet";
import { SessionProvider } from "@/lib/session";
import { ChatDock } from "@/components/chat-dock";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DiscreetProvider>
        <ChatProvider>
          {children}
          <ChatDock />
        </ChatProvider>
      </DiscreetProvider>
    </SessionProvider>
  );
}
