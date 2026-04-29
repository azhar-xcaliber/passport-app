"use client";

import { PanelLeftIcon, SquarePenIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import type { VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
  isEmbed,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  isEmbed?: boolean;
}) {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const router = useRouter();

  if (state === "collapsed" && !isMobile && !isEmbed) {
    return null;
  }

  return (
    <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
      {isEmbed ? (
        <Button
          onClick={() => router.push("/embed")}
          size="icon-sm"
          title="New chat"
          variant="ghost"
        >
          <SquarePenIcon className="size-4" />
        </Button>
      ) : (
        <Button
          className="md:hidden"
          onClick={toggleSidebar}
          size="icon-sm"
          variant="ghost"
        >
          <PanelLeftIcon className="size-4" />
        </Button>
      )}

      {/* {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
        />
      )} */}

      <div className="hidden rounded-lg px-4 md:ml-auto md:flex">
        {/* <Link
          href="https://vercel.com/templates/next.js/chatbot"
          rel="noopener noreferrer"
          target="_blank"
        >
          <VercelIcon size={16} />
          Deploy with Vercel
        </Link> */}
        <Image
          alt="Logo"
          className="h-8 w-auto"
          height={32}
          src="/logo.png"
          unoptimized
          width={82}
        />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
