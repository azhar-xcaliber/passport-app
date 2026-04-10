"use client";

import { ClipboardListIcon, MapPinIcon, StethoscopeIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type VisitReason = {
  id: number;
  reason: string;
};

type VisitReasonSelectorData = {
  patientId: string;
  providerName: string;
  facilityName: string;
  visitReasons: VisitReason[];
};

export function VisitReasonSelector({
  data,
}: {
  data: VisitReasonSelectorData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSelect = (reason: VisitReason) => {
    if (isReadonly) {
      return;
    }
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'd like to book for ${reason.reason}`,
        },
      ],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <ClipboardListIcon size={10} />
          Select visit reason
        </div>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
          <StethoscopeIcon size={10} />
          <span className="font-medium text-foreground">{data.providerName}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-muted-foreground/60 text-[11px]">
          <MapPinIcon size={9} />
          {data.facilityName}
        </div>
      </div>

      {/* Reason chips */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {data.visitReasons.map((reason) => (
            <button
              className={[
                "rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
                isReadonly
                  ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                  : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              ].join(" ")}
              disabled={isReadonly}
              key={reason.id}
              onClick={() => handleSelect(reason)}
              type="button"
            >
              {reason.reason}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
