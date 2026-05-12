import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { auth } from "@/app/(auth)/auth";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActiveChatProvider } from "@/hooks/use-active-chat";
import { ChatContextProvider } from "@/hooks/use-chat-context";
import { PracticeProvider } from "@/hooks/use-practice-context";
import { getPracticeByOrigin } from "@/lib/ai/mock-data/practices";

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
      <Suspense fallback={<div className="flex-1 bg-sidebar" />}>
        <PracticeShell>{children}</PracticeShell>
      </Suspense>
    </div>
  );
}

async function PracticeShell({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const headerStore = await headers();
  const embedOrigin = headerStore.get("x-embed-origin") ?? "";

  if (!session?.user) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const embedUrl = embedOrigin
      ? `/embed?embed_origin=${encodeURIComponent(embedOrigin)}`
      : "/embed";
    redirect(`${base}/api/auth/guest?redirectUrl=${encodeURIComponent(`${base}${embedUrl}`)}`);
  }

  const practiceConfig = embedOrigin ? getPracticeByOrigin(embedOrigin) : null;

  return (
    <PracticeProvider value={practiceConfig}>
      <SidebarProvider defaultOpen={false}>
        <DataStreamProvider>
          <ChatContextProvider>
            <ActiveChatProvider>{children}</ActiveChatProvider>
          </ChatContextProvider>
        </DataStreamProvider>
      </SidebarProvider>
    </PracticeProvider>
  );
}
