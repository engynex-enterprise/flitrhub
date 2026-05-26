"use client";

import { ChatProvider } from "@/features/chat/chat-context";
import { DiscreetProvider } from "@/features/discreet/use-discreet";
import { SessionProvider } from "@/features/auth/session";
import { ChatDock } from "@/features/chat/components/chat-dock";

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
