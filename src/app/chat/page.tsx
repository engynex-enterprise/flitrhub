import { Suspense } from "react";

import { ChatCenter } from "@/features/chat";

export const metadata = {
  title: "Centro de chat · flitrhub",
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Cargando...</div>}>
      <ChatCenter />
    </Suspense>
  );
}
