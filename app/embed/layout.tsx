import { Suspense } from "react";
import { Toaster } from "sonner";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActiveChatProvider } from "@/hooks/use-active-chat";
import { ChatContextProvider } from "@/hooks/use-chat-context";

export const metadata = {
  title: "Acme Health Assistant",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <Toaster
        position="top-center"
        theme="system"
        toastOptions={{
          className:
            "!bg-card !text-foreground !border-border/50 !shadow-[var(--shadow-float)]",
        }}
      />
      <SidebarProvider defaultOpen={false}>
        <DataStreamProvider>
          <ChatContextProvider>
            <Suspense fallback={<div className="flex h-dvh bg-sidebar" />}>
              <ActiveChatProvider>{children}</ActiveChatProvider>
            </Suspense>
          </ChatContextProvider>
        </DataStreamProvider>
      </SidebarProvider>
    </div>
  );
}
