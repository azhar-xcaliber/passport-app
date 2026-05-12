"use client";

import { ExternalLinkIcon, InfoIcon, PanelLeftIcon, PhoneIcon, SquarePenIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePracticeContext } from "@/hooks/use-practice-context";
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
  const practice = usePracticeContext();

  if (state === "collapsed" && !isMobile && !isEmbed) {
    return null;
  }

  return (
    <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
      {isEmbed ? (
        <>
          <Button
            onClick={() => router.push("/embed")}
            size="icon-sm"
            title="New chat"
            variant="ghost"
          >
            <SquarePenIcon className="size-4" />
          </Button>
          <Button
            className="ml-auto"
            onClick={() => window.open("/", "_blank")}
            size="icon-sm"
            title="Open in new tab"
            variant="ghost"
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
          {practice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <InfoIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex-col items-start gap-1" side="bottom">
                  <span className="font-medium">{practice.name}</span>
                  <a
                    className="flex items-center gap-1 text-background/70"
                    href={`tel:${practice.phone}`}
                  >
                    <PhoneIcon size={10} />
                    {practice.phone}
                  </a>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
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

      {!isEmbed && (
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
      )}
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
