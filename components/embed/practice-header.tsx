"use client";

import { PhoneIcon } from "lucide-react";
import { usePracticeContext } from "@/hooks/use-practice-context";

export function PracticeHeader() {
  const practice = usePracticeContext();
  if (!practice) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-sidebar shrink-0">
      <span className="text-sm font-medium text-foreground truncate">
        {practice.name}
      </span>
      <a
        href={`tel:${practice.phone}`}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
      >
        <PhoneIcon size={12} />
        {practice.phone}
      </a>
    </div>
  );
}
