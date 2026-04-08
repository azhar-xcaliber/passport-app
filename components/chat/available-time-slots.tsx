"use client";

import { CalendarIcon } from "lucide-react";
import { useActiveChat } from "@/hooks/use-active-chat";

type Slot = {
  id: string;
  time: string;
  displayTime: string;
  provider: string;
  providerId: string;
  type: string;
};

type AvailableTimeSlotsData = {
  patientId: string;
  date: string;
  displayDate: string;
  slots: Slot[];
};

export function AvailableTimeSlots({
  data,
}: {
  data: AvailableTimeSlotsData;
}) {
  const { sendMessage, isReadonly } = useActiveChat();

  const handleSlotSelect = (slot: Slot) => {
    if (isReadonly) return;
    sendMessage({
      role: "user",
      parts: [
        {
          type: "text",
          text: `I'll take the ${slot.displayTime} slot with ${slot.provider}`,
        },
      ],
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-(--shadow-float)">
      {/* Header */}
      <div className="border-b border-border/30 bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-muted-foreground/70 text-[11px] font-medium uppercase tracking-wider">
          <CalendarIcon size={10} />
          Available times
        </div>
        <div className="mt-0.5 font-semibold text-foreground text-sm">
          {data.displayDate}
        </div>
      </div>

      {/* Slots */}
      <div className="p-4">
        {data.slots.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-muted-foreground/60 text-xs">
              No slots available — reply in chat to pick another date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {data.slots.map((slot) => (
              <button
                className={[
                  "rounded-xl border px-3 py-2.5 text-left transition-colors",
                  isReadonly
                    ? "cursor-default border-border/30 bg-muted/20 opacity-50"
                    : "cursor-pointer border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5",
                ].join(" ")}
                disabled={isReadonly}
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                type="button"
              >
                <div className="font-semibold text-foreground text-xs">
                  {slot.displayTime}
                </div>
                <div className="mt-0.5 text-muted-foreground/60 text-[10px]">
                  {slot.provider.split(" ").at(-1)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
