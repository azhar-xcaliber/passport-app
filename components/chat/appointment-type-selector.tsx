"use client";

import { CalendarIcon, StethoscopeIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type AppointmentTypeSelectorData = {
  patientId: string;
  date: string;
  displayDate: string;
  appointmentTypes: string[];
};

export function AppointmentTypeSelector({
  data,
}: {
  data: AppointmentTypeSelectorData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleTypeSelect = (type: string) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: `I'd like a ${type} appointment` }],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <StethoscopeIcon size={10} />
          Select appointment type
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarIcon size={11} />
          <span className="font-medium text-foreground">{data.displayDate}</span>
        </div>
      </div>

      {/* Type chips */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {data.appointmentTypes.map((type) => (
            <button
              className={[
                "rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors",
                isReadonly
                  ? "cursor-default border-border/30 bg-muted/20 opacity-50 text-muted-foreground"
                  : "cursor-pointer border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              ].join(" ")}
              disabled={isReadonly}
              key={type}
              onClick={() => handleTypeSelect(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
